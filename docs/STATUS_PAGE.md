# Status Page — Documentación Técnica

Monitor de estado en tiempo real para todos mis servicios. Actualización live via WebSocket sin necesidad de recargar la página.

**Live:** [status.olivercdiaz.com](https://status.olivercdiaz.com)

---

## Stack

| Componente | Tecnología |
|---|---|
| Runtime | Node.js, Express |
| Real-time | WebSocket (ws library) |
| Deployment | systemd en Raspberry Pi 5, Cloudflare Tunnel |
| Frontend | HTML + CSS + JS vanilla (sin frameworks) |

---

## Arquitectura

```
Browser
  │
  ├── WebSocket connection → recibe updates en tiempo real
  └── REST fallback → GET /api/status (si WS no conecta en 5s)

Express Server (:3333)
  │
  ├── checkAll() — ejecutado al arrancar y cada 30s
  │     ├── HTTP GET a cada URL monitorizada
  │     ├── Mide response time
  │     ├── Actualiza history[] (últimas 90 comprobaciones)
  │     ├── Calcula uptime %
  │     └── broadcast() → envía JSON a todos los clientes WS conectados
  │
  ├── wss.on('connection') → envía estado actual inmediatamente al nuevo cliente
  ├── GET /api/status → REST fallback con el mismo JSON
  └── express.static → sirve el frontend
```

---

## Ciclo de comprobación

Cada **30 segundos**, el servidor hace un GET a cada servicio:

```javascript
async function check(service) {
  const start = Date.now();
  try {
    const r = await axios.get(service.url, {
      timeout: 8000,
      validateStatus: s => s < 500  // 4xx cuenta como "up" (el servidor responde)
    });
    return { status: 'operational', responseTime: Date.now() - start, statusCode: r.status };
  } catch (e) {
    return { status: 'down', responseTime: null, error: e.code || e.message };
  }
}
```

`validateStatus: s => s < 500` → un 401 (no autorizado) o 404 cuenta como "operational" porque el servidor está respondiendo. Solo 5xx o timeout → "down".

---

## Historial de Uptime

Cada comprobación se añade al historial del servicio:

```javascript
h.checks.push({ t: Date.now(), up: isUp ? 1 : 0, rt: responseTime });
if (h.checks.length > MAX_HISTORY) h.checks = h.checks.slice(-MAX_HISTORY); // últimas 90
h.uptime = (checks.filter(c => c.up).length / checks.length * 100).toFixed(2);
```

El historial se persiste en `history.json` → sobrevive reinicios del servidor. El frontend muestra los últimos 30 checks como una barra de segmentos verde/rojo.

---

## WebSocket — Flujo de datos

```
Cliente conecta WebSocket
    ↓
Servidor envía estado actual inmediatamente (sin esperar al siguiente check)
    ↓
Cliente renderiza
    ↓
Cada 30s: servidor hace checks → broadcast a TODOS los clientes conectados
    ↓
Cliente actualiza UI sin recargar

Si WS desconecta:
    ↓
Cliente intenta reconectar (backoff: 1s → 2s → 4s ... → 30s máx)
    ↓
Badge "LIVE" / "RECONNECTING" en el footer
```

---

## Servicios monitorizados

| ID | Nombre | URL monitorizadas |
|---|---|---|
| `let` | LET Prep | `https://let.olivercdiaz.com/api/health` |
| `portfolio` | Portfolio | `https://olivercdiaz.com` |
| `pihole` | Pi-hole DNS | `http://localhost:80/api/auth` |

La URL de monitorización puede ser diferente a la URL de display. Por ejemplo, LET Prep se monitoriza via `/api/health` (responde `{"ok":true}`) pero se muestra como `let.olivercdiaz.com`.

---

## Frontend — Diseño

- HTML + CSS + JavaScript **sin frameworks** (< 15KB total)
- Tema oscuro fijo (`#0a0a0a` background)
- i18n automático según `navigator.language`: Español, Catalán, English
- Responsive: en móvil los `service-header` pasan a columna
- Uptime bar: 30 segmentos, hover hace `scaleY(1.3)` para ver el detalle
- Response time coloreado: verde < 500ms, amarillo < 2000ms, rojo > 2000ms

---

## CORS

El servidor añade headers CORS para que `olivercdiaz.com` pueda hacer fetch al API de estado y mostrar los servicios en vivo en el portfolio:

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://olivercdiaz.com');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});
```
