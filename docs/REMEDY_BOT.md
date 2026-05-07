# Remedy Bot — Documentación Técnica

Bot de automatización completa para gestión de tickets en **BMC Remedy ITSM / ATOM Helix**. Lee, clasifica y resuelve incidencias automáticamente sin necesidad de API oficial — todo via scraping del navegador.

---

## El problema que resuelve

Remedy ITSM no tiene API pública accesible. Todos los campos (Service, Tier 1, Tier 2, CI+, Assigned Group) son dropdowns dependientes entre sí que solo existen en la interfaz web. Clasificar un ticket correctamente requiere conocer cientos de rutas de categorización.

El bot automatiza:
1. Leer el ticket (Work Detail, campos, historial)
2. Clasificarlo contra una base de conocimiento local
3. Generar el texto de respuesta en el idioma correcto
4. Opcionalmente: rellenar los campos y dejar listo para guardar

---

## Stack

| Componente | Tecnología |
|---|---|
| Runtime | Node.js 20+ (ESM modules) |
| Automatización web | Playwright 1.52 |
| Browser | Microsoft Edge (perfil aislado en `profile/`) |
| Base de conocimiento | JSON + Markdown en `knowledge/` |
| Entrenamiento | JSONL con casos reales anonimizados |
| OS | Windows 10/11 |

---

## Arquitectura

```
Operador (Oliver)
    │
    ├── Abre Edge con perfil aislado (login normal en Remedy)
    │
    └── Ejecuta bot via .cmd scripts
            │
            ▼
    src/cli.js (REPL interactivo)
            │
            ├── Playwright lanza/conecta Edge
            │
            ├── Lee DOM de la incidencia actual
            │   └── src/read-current.js
            │
            ├── Clasifica contra base de conocimiento
            │   ├── memory/operator-notes.md    (reglas manuales)
            │   ├── memory/remedy-categories.md (valores exactos dropdowns)
            │   ├── memory/learned-routes.json  (rutas aprendidas)
            │   └── training-cases.jsonl        (casos históricos)
            │
            └── Genera respuesta
                ├── Texto listo para pegar (idioma correcto)
                └── Categorización: Service/T1/T2/CI+/Group/Assignee
```

---

## Perfil de Edge aislado

El bot usa un perfil de Edge completamente separado del del usuario (`profile/`). Esto permite:
- Mantener la sesión de Remedy activa entre ejecuciones (no hay que hacer login cada vez)
- No interferir con el Edge normal del operador
- Guardar cookies y localStorage de Remedy de forma persistente

```powershell
# El bot lanza Edge así:
$edgeArgs = @("--user-data-dir=$profileDir", "--no-first-run", "--disable-extensions")
```

---

## Flujo de lectura de un ticket

```
1. Bot conecta al Edge ya abierto (vía CDP - Chrome DevTools Protocol)
2. Lee el DOM de la página actual de Remedy
3. Extrae campos:
   - Work Detail (descripción del usuario)
   - INC number
   - Priority
   - Assigned Group actual
   - Status
   - Historial de notas
4. Busca palabras clave en la base de conocimiento
5. Devuelve: tipo + categorización + texto sugerido
```

El bot **nunca hace click en Save, Resolve, Close ni Assign** en modo normal. Solo modifica campos del formulario para que el operador revise y guarde manualmente.

---

## Base de Conocimiento

Construida de tres fuentes:

### 1. Confluence (TOT) crawleado
```
knowledge/tot-crawl/EDUB1/    ← páginas de documentación oficiales
knowledge/tot-crawl/EDU/
knowledge/tot-crawl/PSF1/
```
El crawler (`src/crawl-confluence.js`) abre Edge, hace login en Atlassian, y va siguiendo todos los enlaces internos del espacio. Guarda cada página como `.json` + `.md`. Estado persistente en `crawl-state.json` → reanuda donde dejó si se interrumpe.

### 2. Reglas manuales del operador
```
memory/operator-notes.md      ← reglas aprendidas en el trabajo real
memory/remedy-categories.md   ← valores exactos de cada dropdown
memory/decision-checklists.md ← árboles de decisión por tipo
memory/corrections-log.md     ← correcciones recientes (máxima prioridad)
```

### 3. Histórico de tickets
```
knowledge/remedy-history/     ← tickets reales crawleados y anonimizados
training-cases.jsonl          ← dataset de entrenamiento
```
El crawler de historial (`src/crawl-remedy-history.js`) lee el listado de INCs asignadas, abre cada una, extrae los campos clave y los guarda anonimizados (sin nombres, sin PII). Luego `src/learn-from-remedy-history.js` entrena el clasificador.

---

## Auto-Resolve

El modo más potente. Itera la lista de INCs asignadas y actúa automáticamente en las que superen el umbral de confianza.

**Condiciones para actuar (todas deben cumplirse):**
```
✓ Confianza ≥ 90%
✓ Tipo en whitelist (Chromebook, PaperCut, Impressió HW/SW)
  O acción = suggest_pending (falta info del usuario)
✗ No detecta keywords VIP (directora, conseller, SSCC, urgent...)
✗ No tiene priority alta/crítica
```

**Salvaguardas:**
- 🟡 **Dry-run por defecto**: describe qué haría sin tocar nada
- 🔴 **Live con confirmación**: pide `s/N/q` en cada INC antes de actuar
- 🛑 **Kill switch**: archivo `.STOP` en disco → para todo inmediatamente; 2 errores seguidos → para automáticamente
- 📊 **Límite por sesión**: `--max=5` por defecto, configurable
- 📝 **Log completo**: `runs/auto-resolve-<timestamp>/summary.json`

---

## Scripts disponibles

```powershell
.\run-ask.cmd              # REPL: pega descripción → recibe categorización
.\run-read.cmd             # Lee ticket abierto en Edge
.\run-auto-resolve.cmd     # Auto-resolve dry-run (describe sin actuar)
.\run-auto-resolve-live.cmd # Auto-resolve real con confirmación
.\run-crawl.cmd            # Crawlea documentación de Confluence
.\run-remedy-crawl-history.cmd # Crawlea histórico de tickets
.\run-remedy-learn.cmd     # Reentrena el clasificador
.\run-stats.cmd            # Estado del bot (tickets procesados, etc.)
.\run-scrub.cmd            # Detecta PII en logs
.\run-scrub.cmd --fix      # Anonimiza PII en sitio
```

---

## Actualización diaria automática

Windows Task Scheduler ejecuta `run-tot-b1-daily.cmd` a las 07:30. El proceso:
1. Rastrea el espacio EDUB1 de Confluence (solo páginas modificadas desde el último run)
2. Reconstruye `knowledge-index.json`
3. Regenera `learned-routes.json` desde el TOT actualizado
4. Genera informe en `reports/tot-b1-daily-*.md`

Así la base de conocimiento se mantiene sincronizada con la documentación oficial sin intervención manual.

---

## Seguridad y privacidad

- **Sin PII en memoria**: los tickets crawleados se anonimizan antes de guardarse
- **Sin credenciales hardcodeadas**: todo via variables de entorno o perfil del browser
- **Sin modificaciones automáticas**: el bot nunca hace Save sin confirmación explícita
- **Kill switch**: un archivo `.STOP` en disco para todo al instante
- El perfil de Edge está en `profile/` — no se sube a ningún repositorio
