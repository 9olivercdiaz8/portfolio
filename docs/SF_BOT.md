# S&F Bot — Documentación Técnica

Bot de automatización completa para el juego Shakes & Fidget. Gestiona arena, quests, herrería, mascotas, fortaleza, subterráneo y más de 20 eventos del juego. Más de 5.000 líneas de Python con modelos matemáticos propios verificados contra el código fuente del juego.

---

## Stack

| Componente | Tecnología |
|---|---|
| Runtime | Python 3 (async, threading) |
| API del juego | HTTP requests (sin SDK oficial) |
| Simulador de combate | Monte Carlo (200 simulaciones/enemigo) |
| Deployment | systemd en Raspberry Pi 5 |
| Monitorización | sf-monitor-bot (Telegram alerts) |

---

## Arquitectura

```
sf_bot.py (main loop)
    │
    ├── sf_client.py      → HTTP requests a la API del juego
    ├── sf_gamestate.py   → estado del personaje (stats, equipo, recursos)
    ├── sf_combat.py      → simulador Monte Carlo de combate
    ├── sf_items.py       → gestión de equipo y objetos
    ├── sf_report.py      → informes y logging
    └── sf_updater.py     → auto-actualización del bot

bot_state_1.json / bot_state_2.json  → estado persistente por cuenta
config.json                          → configuración (umbrales, estrategia)
metrics.json                         → métricas de rendimiento
```

Dos instancias en paralelo (sfbot + sfbot2) para gestionar dos cuentas simultáneamente.

---

## Simulador de Combate Monte Carlo

El componente más crítico. Para decidir a quién atacar en arena, el bot no usa heurísticas simples — ejecuta **200 simulaciones de combate** por enemigo.

```python
def simulate_combat(attacker, defender, n=200):
    wins = 0
    for _ in range(n):
        result = run_single_combat(attacker, defender)
        if result == 'win':
            wins += 1
    return wins / n  # probabilidad de victoria
```

Cada simulación replica el motor de combate del juego:
- **Equipamiento completo**: armas, armaduras, runas (fuego/frío/rayo daño+resist), encantamientos, escudo
- **12 clases** de personaje con mecánicas propias
- **Ventaja de clase**: Mago vs DH/Necro, Scout vs tanques...
- **Críticos**: el Gladiator Trainer añade +0.11% crit damage por nivel (dataminado del código fuente)
- **Iniciativa**: ShadowOfTheCowboy y otros modificadores
- **Fix de escudo Paladín**: comportamiento verificado contra sf-api (Rust source)

---

## Arena — Scoring Compuesto

Para seleccionar el objetivo óptimo en arena, el bot calcula un score compuesto:

```python
score = (album_items * 30) + (win_probability * 50) + honor_bonus + class_bonus
```

- **album_items**: cuántos objetos de su equipo no tenemos en el álbum → ganamos colección
- **win_probability**: resultado del simulador Monte Carlo (0.0-1.0)
- **honor_bonus**: honorpoints que da derrotarlo
- **class_bonus**: bonus extra si la clase del enemigo nos da ventaja

**Criterios de selección:**
- Inspecciona 25 enemigos del listado
- Escanea 20 páginas del Hall of Fame
- Umbral mínimo de victoria: 55%
- Filtra enemigos con nivel > 2.5x el nuestro
- Detección de VIPs (guilds aliados, ignorar)

---

## Distribución de Stats — Algoritmo de Eficiencia Marginal

Basado en la estrategia óptima de la comunidad (3:2:1 ratio Main:CON:LUCK), pero calculado matemáticamente por eficiencia marginal en lugar de reglas fijas.

El algoritmo calcula el beneficio de añadir 1 punto a cada stat y distribuye donde la ganancia es mayor, teniendo en cuenta los pesos específicos de cada clase:

| Clase | CON weight | LUCK weight |
|---|---|---|
| Paladín | 2.2 | 1.0 |
| Guerrero/Tank | 2.0 | 1.0 |
| Clases medias | 1.8 | 1.0 |
| Clases glass cannon | 1.4 | 1.2 |

---

## Fortaleza — Motor de Build basado en ROI

No hay números mágicos. Cada edificio se prioriza por ratio beneficio/coste:

```python
def building_priority(building):
    benefit = calculate_benefit(building)  # producción, stats, caps
    cost = calculate_cost(building)        # madera, piedra, tiempo
    return benefit / cost
```

Los datos de coste/beneficio vienen de sfporadnik.pl + learningsf (verificados 2026). Las prioridades emergen solas de las comparaciones — si el Gem Mine sube de ROI, se construye antes que Workers, automáticamente.

**Conocimiento incorporado:**
- Gem Mine: única fuente de gemas (los ataques dan madera/piedra, nunca gemas)
- Academy: débil hasta nivel 100, fuerte mid-game
- Smithy: upgrades solo de soldados (no defensas — meta "no-defense")
- HoK: pausa natural al llegar a L13 (el coste sube drásticamente)

---

## Subterráneo (Underworld)

Prioridades matemáticamente determinadas:

1. **Keeper** primero (unidad más fuerte del subterráneo)
2. **GladiatorTrainer** tercera prioridad: +11% crit damage/nivel, dataminado del código fuente Rust de sf-api
3. Resto de unidades por ratio coste/beneficio

---

## Sistema de Mascotas

Feeding basado en **Valor Esperado (EV)**:

```python
ev = milestone_bonus + exploration_enabler + (stat_factor * attr_weight)
```

- `milestone_bonus`: si esta mascota está cerca de un milestone que desbloquea exploración
- `exploration_enabler`: si necesitamos esta mascota para explorar una zona
- `stat_factor * attr_weight`: valor del stat que da vs cuánto necesitamos ese stat

Para elegir zona de exploración: estimación de poder del boss vs nuestro poder de combate (del simulador Monte Carlo), con ventaja elemental PvP.

---

## Otros sistemas automatizados

| Sistema | Qué hace |
|---|---|
| **Herrería (Blacksmith)** | Auto-upgrade de epics con atributo+socket, batch adaptativo según recursos |
| **Bruja (Witch)** | Auto-enchant de todos los slots, compra items para caldero, elabora pociones |
| **Idle Game** | Upgrades prioritarios (StrayingMonsters+Toilet=90% ingresos), auto-sacrificio |
| **Torre/Dungeons/Hellevator** | Totalmente automatizados |
| **Expediciones** | Objetivo 40 heroísmo (+35% XP bonus). Gestión de cadenas de tareas |
| **Guild battles** | Automatizado |
| **20+ eventos** | Cada evento del juego tiene su handler propio |

---

## Estrategia de Gemas

Orden de prioridad verificado contra la comunidad:
```
socket → upgrade
weapon > armor > hat > gloves/boots > belt > accessories
ALL / LEGENDARY: nunca extraer
```

---

## Resiliencia y Monitorización

- **Session resilience**: si la sesión expira, reloguea automáticamente
- **sf-monitor-bot**: bot de Telegram separado que alerta si sf_bot se cae o tiene errores
- **Métricas**: `metrics.json` con stats de rendimiento por sesión
- **Multi-cuenta**: `bot_state_1.json` / `bot_state_2.json` completamente separados
- **Auto-update**: `sf_updater.py` detecta nuevas versiones del bot y se actualiza
