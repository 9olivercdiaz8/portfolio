# Oliver C. Díaz — Projects

Portfolio personal y documentación técnica de todos mis proyectos. Cada uno corre en producción 24/7 en una Raspberry Pi 5 (o en mi equipo Windows para los de trabajo).

## Proyectos

| Proyecto | Stack | Estado |
|---|---|---|
| [LET Prep](docs/LET_PREP.md) | React · TypeScript · Hono · PWA | ✅ Live |
| [Remedy Bot](docs/REMEDY_BOT.md) | Node.js · Playwright · Windows | ✅ Live |
| [PiBot](docs/PIBOT.md) | Python · Telegram API · Linux | ✅ Live |
| [S&F Bot](docs/SF_BOT.md) | Python · Game API · Monte Carlo | ✅ Live |
| [Status Page](docs/STATUS_PAGE.md) | Node.js · WebSocket · Express | ✅ Live |
| [Portfolio](docs/PORTFOLIO.md) | HTML · CSS · JS · Cloudflare Tunnel | ✅ Live |

## Infraestructura

Todo corre en una **Raspberry Pi 5 (8GB, Debian 13)** en casa, expuesto via **Cloudflare Tunnel** sin abrir puertos del router.

```
Internet → Cloudflare Edge → Tunnel (cloudflared) → Pi 5
                                                     ├── let.olivercdiaz.com   (Hono :8089)
                                                     ├── status.olivercdiaz.com (Express :3333)
                                                     ├── olivercdiaz.com       (Express :3334)
                                                     └── ssh.olivercdiaz.com   (SSH :22)
```

**Stack de la Pi:**
- OS: Debian 13 Trixie (64-bit ARM)
- Process manager: PM2 (Node.js) + systemd (Python bots)
- DNS: Pi-hole con 3M+ dominios bloqueados
- VPN: WireGuard (gestión via PiBot)
- Backups: diarios locales + semanal a Google Drive
- Seguridad: fail2ban, iptables, rkhunter semanal
