# LET Prep — Documentación Técnica

App de estudio para el Licensure Examination for Teachers (LEPT) de Filipinas. PWA full-stack con sistema de repetición espaciada, exámenes mock, biblioteca de documentos y fichas de estudio por tema.

**Live:** [let.olivercdiaz.com](https://let.olivercdiaz.com)

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router 7, TailwindCSS |
| Backend | Hono (Node.js), puerto 8089 |
| Auth | JWT en cookies HTTPOnly, bcrypt, token versioning |
| PWA | Workbox, service worker, offline-first |
| Deployment | PM2 en Raspberry Pi 5, Cloudflare Tunnel |
| State | localStorage (cliente) + JSON files en disco (servidor) |

---

## Arquitectura

```
Browser
  ├── Service Worker (Workbox)         ← caché offline de assets
  ├── localStorage (letprep.progress.v1) ← progreso rápido en cliente
  └── fetch /api/*                     ← sync con servidor

Hono Server (:8089)
  ├── /api/login, /api/logout, /api/me ← auth JWT
  ├── /api/progress (GET/PUT/DELETE)   ← sync progreso
  ├── /api/primers                     ← fichas de estudio
  ├── /content/*                       ← PDFs y docs (auth required)
  └── /* → dist/index.html             ← SPA fallback

Disco (state/)
  ├── progress-erica.json              ← progreso de usuario
  ├── progress-admin.json
  ├── primers.json                     ← 119 fichas de estudio
  ├── auth.log                         ← audit log de logins
  └── healthcheck.log                  ← health cada 5min
```

---

## Autenticación

- Usuarios hardcodeados en variables de entorno (`LET_HASH_ERICA`, `LET_HASH_ADMIN`)
- Password hasheada con bcrypt (cost 10)
- JWT firmado con `JWT_SECRET`, TTL 30 días, almacenado en cookie HTTPOnly + SameSite=Strict
- **Token versioning**: cada usuario tiene un `version` en `state/token-versions.json`. Al hacer logout o reset, se incrementa → todos los tokens anteriores quedan inválidos automáticamente
- Rate limiting de login: máximo 8 intentos por IP en 5 minutos (in-memory Map)
- Audit log: cada intento de login se registra en `state/auth.log` con timestamp, IP, usuario y resultado

---

## Sincronización de Progreso

El progreso vive en dos sitios a la vez:

```
localStorage (fast reads) ←──── bootstrapSync() al login ────→ servidor (persistencia)
        │                                                              │
        └── saveProgress() debounced 1.5s ───── PUT /api/progress ───┘
```

1. Al login, `bootstrapSync()` descarga el progreso del servidor y lo guarda en localStorage
2. Cada vez que el usuario responde o guarda algo, `saveProgress()` actualiza localStorage inmediatamente
3. Un debounce de 1.5s acumula cambios y hace un PUT al servidor
4. El servidor usa **ETag** basado en SHA-1 del JSON → `304 Not Modified` si no cambió nada
5. Las escrituras en disco son atómicas: escribe a `.tmp` y hace rename → nunca hay archivo corrupto

**Estructura del progreso:**
```typescript
{
  srs: Record<string, SrsEntry>       // estado SRS por pregunta
  mistakes: Mistake[]                  // errores con contexto
  topicStats: Record<string, TopicStat> // aciertos por área
  itemStats: Record<string, ItemStat>  // intentos por pregunta
  studyDates: string[]                 // fechas de estudio (YYYY-MM-DD)
  totalAnswered: number
  totalCorrect: number
  notes: Note[]                        // notas personales markdown
  vocabulary: SavedWord[]              // palabras guardadas con definición
  highlights: Highlight[]              // citas de PDFs con link de vuelta
}
```

---

## Motor SRS (Spaced Repetition System)

Implementación propia de SM-2 en TypeScript puro (sin DOM, 100% testable).

```typescript
// Cada tarjeta tiene:
{
  due: number       // timestamp de cuándo toca revisarla
  interval: number  // días hasta siguiente revisión
  ease: number      // factor de facilidad (1.3 - 3.0, default 2.3)
  reviews: number   // total de revisiones
  lapses: number    // veces que ha fallado tras haber aprendido
}
```

**Algoritmo al responder:**

| Respuesta | Intervalo siguiente | Ease |
|---|---|---|
| `again` (fallo) | 0 (reaprender hoy) | ease - 0.2 (mín 1.3) |
| `hard` | interval × 1 | ease - 0.1 |
| `good` | interval × ease | sin cambio |
| `easy` | interval × 3.4 | ease + 0.15 |

- Primera revisión `good`: 2 días
- Primera revisión `easy`: 4 días
- En modo SRS: primero las tarjetas vencidas (due ≤ hoy), luego rellena con nuevas hasta alcanzar el tamaño de sesión

---

## Banco de Preguntas

Dos niveles de calidad ("tier"):

- **Gold**: preguntas curadas manualmente, verificadas contra el programa oficial del LEPT. Almacenadas en `src/data/curated/*.json`
- **Silver**: extraídas de PDFs de reviewers con Claude API, menos verificadas. En `src/data/extracted/*.json`

Cada pregunta:
```typescript
{
  id: string
  area: 'General Education' | 'Professional Education' | 'English Specialization'
  topic: string          // tema específico (ej. "Communication models")
  prompt: string         // enunciado
  choices: string[]      // 4 opciones
  answer: number         // índice de la correcta (0-3)
  rationale: string      // explicación de la respuesta
  tier: 'gold' | 'silver'
  origin?: string        // fuente
}
```

**Total actual:** 640 preguntas curadas + banco de extraídas.

Los archivos JSON se bundlan en el JavaScript con `import.meta.glob` de Vite en build time — no hay fetch de preguntas en runtime, todo está en el bundle.

---

## Modos de Práctica

```
SessionConfig {
  mode: 'srs' | 'random' | 'mistakes'
  size: 5-50
  area?: 'General Education' | 'Professional Education' | 'English Specialization'
  tier?: 'gold' | 'silver' | 'all'
  topic?: string   // filtra por tema exacto (fuzzy match bidireccional)
}
```

- **SRS**: prioriza tarjetas vencidas hoy, rellena con nuevas
- **Random**: selección aleatoria del pool filtrado (shuffle Fisher-Yates)
- **Mistakes**: solo preguntas que han fallado y no están resueltas

El filtro por `topic` usa matching bidireccional case-insensitive: si `q.topic.includes(topic)` OR `topic.includes(q.topic)` → coincide. Fallback a área si el topic no tiene preguntas.

---

## Fichas de Estudio (Primers)

119 fichas organizadas por área y dominio del LEPT. Se sirven dinámicamente desde `state/primers.json` — **no están bundladas** en el JS, se cargan bajo demanda via `GET /api/primers`.

Ventaja: se pueden actualizar sin rebuild. Un cron semanal ejecuta `scripts/update-primers.mjs` que detecta temas del banco de preguntas sin ficha y genera nuevas. El servidor sirve el JSON con ETag → el navegador solo descarga si cambió algo.

Cada primer:
```json
{
  "id": "gened-purp-models",
  "area": "General Education",
  "domain": "Purposive Communication",
  "title": "Communication models",
  "body": "texto en markdown...",
  "generatedAt": "2026-04-29T10:44:09.804Z"
}
```

---

## PWA y Offline

- Service worker generado por `vite-plugin-pwa` con Workbox
- **Pre-cache**: todos los assets hashed del build (CSS, JS, iconos)
- **Runtime cache**: nada — las peticiones API siempre van a red
- El cliente detecta versión nueva via polling a `/version.json` (timestamp del build). Si hay versión nueva, recarga silenciosamente en el próximo cambio de ruta

---

## Automatizaciones (Cron en Pi)

| Cuándo | Qué |
|---|---|
| Cada 5 min | Healthcheck HTTP → `state/healthcheck.log` |
| Cada hora (:07) | Convierte Office a PDF con LibreOffice |
| Diario 4:15 | Backup de `state/` |
| Domingos 4:00 | Genera primers nuevos para temas sin cubrir |

---

## Seguridad

- HTTPOnly cookies (no accesibles desde JS)
- SameSite=Strict (no CSRF)
- HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff
- CSP estricta (solo self + fonts de Google)
- Validación de path traversal en `/content/*` (symlink-safe)
- Login rate limiting in-memory por IP
- Token versioning para invalidación masiva instantánea
