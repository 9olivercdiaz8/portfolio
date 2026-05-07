# Portfolio — Documentación Técnica

Web personal en [olivercdiaz.com](https://olivercdiaz.com). Servida directamente desde la Raspberry Pi via Cloudflare Tunnel — sin hosting externo, sin GitHub Pages, control total.

---

## Stack

| Componente | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript vanilla |
| Servidor | Express (Node.js), puerto 3334 |
| Deployment | systemd en Raspberry Pi 5 |
| CDN/Proxy | Cloudflare Tunnel (piapi) |
| Fuentes | Google Fonts (Inter + JetBrains Mono) |

Sin frameworks de frontend. Sin build step. Sin bundler. El archivo que editas es el que sirves.

---

## Estructura de archivos

```
services/portfolio/
├── server.js          ← Express server
└── public/
    ├── index.html     ← toda la web
    ├── style.css      ← estilos
    └── script.js      ← interacciones + fetch live status
```

---

## Servidor Express

```javascript
// HTML: nunca cacheado (siempre la versión más nueva)
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile('public/index.html');
});

// Assets (CSS/JS): cache de 24h (cambia raramente)
app.use(express.static('public', {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));
```

El HTML nunca se cachea → cualquier cambio en el portfolio es inmediato para el usuario.

---

## Routing via Cloudflare Tunnel

```yaml
# /etc/cloudflared/config.yml
ingress:
  - hostname: olivercdiaz.com
    service: http://localhost:3334
  - hostname: www.olivercdiaz.com
    service: http://localhost:3334
```

El DNS de `olivercdiaz.com` apunta a `<tunnel-id>.cfargotunnel.com` (CNAME) — Cloudflare recibe el tráfico HTTPS en sus edges, lo manda por el tunnel encriptado hasta la Pi, y la Pi responde. **El puerto 3334 nunca está expuesto a internet**.

---

## Estado en vivo del Homelab

El portfolio hace un fetch a `status.olivercdiaz.com/api/status` para mostrar el estado real de los servicios en la sección Homelab:

```javascript
async function fetchStatus() {
  const r = await fetch('https://status.olivercdiaz.com/api/status', {
    signal: AbortSignal.timeout(7000)
  });
  const services = await r.json();
  // renderiza el estado en tiempo real
}
```

Si el fetch falla (timeout, red), muestra un estado estático de fallback — la web nunca se rompe.

CORS está habilitado en el status-page server específicamente para este dominio.

---

## Animaciones

Scroll reveal con `IntersectionObserver` — sin librerías externas:

```javascript
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
```

El delay escalonado (`i * 70ms`) hace que los elementos entren en cascada en lugar de todos a la vez.

---

## Diseño

- Fondo `#07070a` (casi negro con tinte azul)
- Acento principal `#7c6af0` (violeta/indigo)
- Tipografía: Inter 900 para titulares, JetBrains Mono para código/labels
- Hero: nombre con efecto "outline" (`-webkit-text-stroke`) en "C. Díaz"
- Terminal animada en el hero con datos reales de la Pi
- Grid CSS para todas las secciones, responsive sin media queries en lo posible
- Mobile-first: hamburger menu, columna única en proyectos/about
