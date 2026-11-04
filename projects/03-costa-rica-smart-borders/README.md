# 03 — Costa Rica Smart Borders / VUCE 3.0

Módulo individual del AI Exhibition Hall (tableta = mando, TV = visual sincronizado).

- `index.html`: envoltorio de navegación del proyecto.
- `module.js`: controlador de la tableta (portada con key visuals, Información → CTA a los 10 s → Minijuego).
- `module.css`: estilos de integración (zonas táctiles sobre la portada, iframe del juego).
- `game/`: **minijuego** (HTML, CSS y JS propios, sin dependencias, bilingüe ES/EN, manual de marca BID).
  - `game/index.html` · `game/game.css` · `game/game.js`
- `public/`: key visuals aprobados de la portada (tableta) y de la ficha (TV).
- `Codex_Paquete_CR_Smart_Borders_VUCE/`: material de referencia; el prototipo V5 sigue disponible
  como respaldo abriendo la página del proyecto con `?station=X&legacy=1`.

## Dinámica del minijuego (`game/`)

1. **Llegan camiones** — 5 camiones; cada uno entrega 2 o 3 documentos (factura, manifiesto, declaración).
2. **Tú revisas** — el visitante compara los documentos de cada camión y le pone el **semáforo de riesgo**,
   como hace la VUCE 3.0: verde (todo coincide · dejar pasar), amarillo (falta un documento · revisar
   documentos) o rojo (algo no coincide · inspección conjunta). Un cronómetro mide su tiempo y se pausa
   mientras hay un popup abierto. Tras cada decisión se muestra el semáforo correcto y por qué.
3. **La IA revisa** — los mismos camiones y documentos; la IA los lee automáticamente, marca en rojo
   la fila que no coincide y asigna el semáforo. El cronómetro mide su tiempo.
4. **Comparación** — tiempo, aciertos y documentos leídos de cada uno, camión por camión, más una
   franja "Datos de VUCE 3.0" (650 camiones/día, 5 instituciones, 330.000 registros, 360.000 trámites,
   3 mecanismos) cuyas fichas abren el popup correspondiente.
   Cierre: "La IA lee rápido y señala pistas. La persona decide."

Cada pantalla incluye las cajas "¿Qué está pasando?", "¿Qué decidió el sistema?" y "¿Qué aprendiste?".
Los casos (`CASES` en `game.js`) son **simulados y educativos**; no se usan cifras reales de la VUCE.

### Popups interactivos con datos del proyecto (`COPY.*.pop` en `game.js`)

Los camiones y documentos siguen siendo simulados, pero el juego se ancla al proyecto real con cuatro
popups bilingües (etiqueta "Dato del proyecto · VUCE 3.0"), con tarjetas que el visitante toca:

| Popup | Dónde aparece | Interacción |
|---|---|---|
| **¿Cómo se juega?** | Automático al entrar a "Tú revisas" (el cronómetro arranca al cerrarlo) y botón ⓘ junto al título | Explica los tres colores del semáforo con los que decide el visitante. |
| **Así era antes en Peñas Blancas** | Chips de la intro (📍 Peñas Blancas · 🚛 650 camiones al día · 🏛️ 5 instituciones) y automático al terminar la ronda manual si aún no se vio | Toca las 5 instituciones: cada una "abre" el camión y un contador muestra cuántas veces se abría el mismo camión. |
| **¿Cómo lo hace VUCE 3.0?** | Automático al entrar a "La IA revisa" (la lectura empieza al cerrarlo) y botón ⓘ junto al título | Tres tarjetas: reglas de cada institución, aprendizaje automático (330.000 registros históricos) y selección aleatoria. |
| **El semáforo de riesgo** | Botón "¿Qué significa el semáforo?" cuando la IA termina y en la pantalla de comparación | Toca rojo / amarillo / verde. El veredicto de la IA ya se muestra como semáforo. |
| **¿Y en la vida real?** | Botón en la pantalla de comparación | Antes vs. ahora, 330.000 registros, 360.000 trámites en un año y la siguiente etapa (riesgo antes de llegar a la frontera). |

Los popups viven dentro del iframe de la tableta; la TV no los refleja. Se cierran con ✕, con el botón
principal o tocando el fondo, y se reinician con "Jugar otro turno" o "Inicio".

## Marca

Inter · IDB Blue #005CFF · tintes Blue -1..-4 · grises Black -1..-4 · semánticos rojo #FC5D5D,
amarillo #FFCB52, verde #9BDE54 · texto alineado a la izquierda · sin degradado en texto ni datos.

## Sincronización tableta → TV

La tableta y la TV están conectadas durante todo el minijuego. El juego (`game/game.js`, función
`tvPacket`) envía por `postMessage` un resumen al controlador (`module.js`), que lo publica en el
estado de la estación (`packet.game`, versión `v:1`). El servidor lo valida con `cleanCostaRica` y la
TV lo pinta con `tv.js` (`window.CRB_TV`), con estilos `.crtv-*` en `module.css`.

Lo que muestra la TV, en grande y sin botones:

- **Etapa** (stepper 1-4) y la indicación de qué tocar en la tableta.
- **Intro**: los 5 camiones llegando a la carretera.
- **Tú revisas / La IA revisa**: camión en turno, cronómetro en vivo (la TV lo extrapola entre
  envíos, 1 por segundo), estado ("está leyendo…", escaneo con barra de progreso, semáforo y
  explicación tras cada decisión) y la fila de 5 camiones con su semáforo ya revelado.
- **Popups**: cuando el visitante abre un dato del proyecto, la TV muestra su título y resumen.
- **Comparación**: Tú vs IA (tiempo, aciertos), "La persona decide" y el semáforo de cada uno por camión.

El paquete lleva solo textos ya traducidos, semáforos, tiempos y nombres de camión: **nunca los
documentos ni las preguntas**, que viven en la tableta. Fuera del juego `game` vuelve a `null` y la TV
muestra la ficha de Costa Rica. `#es`/`#en` cambian el idioma en ambas pantallas y `[data-act="home"]`
regresa a `/index.html?station=X`.
