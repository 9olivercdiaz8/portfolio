# PiBot — Documentación Técnica

Bot de Telegram para gestionar la Raspberry Pi remotamente. Control completo de WireGuard, DNS dinámico, backups y monitorización desde cualquier sitio con el móvil.

---

## Stack

| Componente | Tecnología |
|---|---|
| Runtime | Python 3, async (asyncio) |
| Telegram | python-telegram-bot |
| WireGuard | CLI `wg` + `wg-quick` via subprocess |
| DNS Dinámico | Cloudflare API v4 |
| Backups | Google Drive via rclone |
| Deployment | systemd service en Raspberry Pi 5 |

---

## Arquitectura

```
Telegram Servers
      │ (webhook / long polling)
      ▼
bot.py (asyncio event loop)
      │
      ├── CommandHandler    → /status, /vpn, /backup, /stop
      ├── CallbackQueryHandler → botones inline del menú
      └── MessageHandler    → mensajes de texto
            │
            ├── subprocess → wg, systemctl, df, free...
            ├── Cloudflare API → actualiza vpn.olivercdiaz.com
            ├── rclone → sube backup a Google Drive
            └── monitor_loop() → tarea async en background
```

---

## Seguridad

Solo responde al `ADMIN_USER_ID` hardcodeado en el código. Cualquier otro usuario recibe silencio — ni siquiera un error. El decorador `@admin_only` protege todos los handlers:

```python
def admin_only(func):
    @wraps(func)
    async def wrapper(update: Update, context, *args, **kwargs):
        if update.effective_user.id != ADMIN_USER_ID:
            return  # silencio total
        return await func(update, context, *args, **kwargs)
    return wrapper
```

---

## Gestión de WireGuard

El bot puede añadir, eliminar y listar peers de WireGuard sin tocar manualmente el servidor.

**Añadir un cliente:**
1. Bot genera un par de claves con `wg genkey` / `wg pubkey`
2. Asigna la siguiente IP disponible en `10.77.0.0/24`
3. Añade el peer a `/etc/wireguard/wg0.conf`
4. Ejecuta `wg set wg0 peer <pubkey> allowed-ips <ip>` en caliente (sin reiniciar WireGuard)
5. Genera el archivo `.conf` del cliente con server endpoint, keys y DNS
6. Lo envía por Telegram como documento descargable

Los clientes se registran en `wireguard-clients/clients.json` con nombre, IP y fecha.

---

## DNS Dinámico

El bot monitoriza cambios de IP pública en background:

```python
async def monitor_loop():
    while True:
        current_ip = await get_public_ip()
        if current_ip != last_known_ip:
            await update_cloudflare_dns(current_ip)
            await notify_admin(f"IP cambiada → {current_ip}")
        await asyncio.sleep(120)  # check cada 2 min
```

La actualización de DNS usa la Cloudflare API v4:
- Obtiene el record ID de `vpn.olivercdiaz.com`
- Si existe: PUT para actualizar
- Si hay duplicados: DELETE de todos + POST de uno limpio
- Log en `/var/log/wg-ddns.log`

---

## Backups

El bot puede disparar un backup bajo demanda o se ejecutan automáticamente via cron:

- **Backup local** (diario 4AM): `tar.gz` de configs críticos en `/home/oliver/backups/`
- **Backup offsite** (domingos 5AM): versión ligera enviada a Google Drive via rclone + notificación a Telegram con el tamaño y estado
- **Retención**: últimos 7 backups locales (los más antiguos se eliminan automáticamente)

---

## Informe semanal

Los domingos el bot envía automáticamente un informe en Telegram:

```
📊 Informe semanal Pi

⏱ up 7 days, 3 hours
🌡 Temp: 49.4°C
💾 RAM: 1.0GB/7.9GB
💿 Disco: 19GB/117GB (17%)

🔒 WireGuard peers: 2
🛡 Pi-hole: OK — 3.1M dominios
🚫 Bloqueados hoy: 1,247 (23.4%)
🚨 IPs baneadas (semana): 0
⚙️ Servicios: OK

💾 Backup: 7/7 guardados
✅ Última: 07/05/2026 (87MB)
```

---

## Comandos disponibles

| Comando / Botón | Acción |
|---|---|
| `/status` | Estado general de la Pi (RAM, disco, temp, uptime) |
| `/vpn` | Menú de gestión WireGuard |
| Añadir cliente | Genera config + envía por Telegram |
| Ver peers | Lista peers activos con IP y último handshake |
| Eliminar peer | Revoca acceso en caliente |
| `/backup` | Dispara backup manual + sube a Drive |
| `/stop service` | Para un servicio systemd |
| Informe semanal | Automático cada domingo vía cron |
