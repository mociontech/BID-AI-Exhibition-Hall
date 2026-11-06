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

## Dinámica del minijuego (`game/`): un camión, una frontera

1. **Llega un camión** — un solo camión (`CR-104` alimentos envasados, `CR-117` frutas o `CR-126` lácteos,
   rota por turno) debe pasar por 3 instituciones: **Aduanas**, **Sanidad animal y vegetal** y
   **Ministerio de Salud**. En la TV se ve la carretera con las 3 paradas y la frontera.
2. **Tú revisas: 3 paradas** — el camión se detiene en cada institución. En la tableta aparecen la
   regla de esa institución y sus 3 documentos; el visitante pone el **semáforo de riesgo** (verde ·
   dejar pasar, amarillo · falta un documento, rojo · algo no coincide). Tras cada decisión se muestra el
   semáforo correcto, el camión avanza a la siguiente parada en la TV y en la tableta, y el cronómetro
   (pausado mientras hay un popup) sigue. Al salir de la 3.ª parada el camión cruza: "3 paradas · 3
   filas · 3 revisiones", tu tiempo, aciertos y un **tiempo simulado en frontera ≈ 1 h**.
3. **La IA revisa: 1 parada** — el mismo camión, en **5 pasos que el visitante dispara uno a uno**
   desde la tableta (lee la tarjeta del paso, toca «Ver en la TV» y la animación ocurre en la pantalla
   grande): 1 las 3 cajas se unen en una sola ventanilla (VUCE 3.0) · 2 el camión para una sola vez ·
   3 la IA aplica las 3 reglas una tras otra (cada institución recibe su luz) · 4 un solo semáforo (el más
   exigente de los tres) · 5 cruza. Nada avanza solo. Tras cada decisión manual también hay que tocar
   «Siguiente parada» para que el camión avance. Desde el paso 2 hay un botón «Repetir paso N» que vuelve un
   paso atrás y repite su animación en la TV (la unión de las 3 cajas dura ~11 s para que dé tiempo a verla).
4. **Comparación** — en la **tableta** solo los resultados de la simulación: paradas (3 vs 1), tiempo
   simulado en frontera, tiempo real y aciertos y un gráfico de barras verticales Tú vs IA (negro / azul), con los botones «¿Qué significa
   el semáforo?» y «¿Y en la vida real?». En la **TV**, solo lo esencial: título con el semáforo final del camión (único elemento de color),
   *Lo que te llevas de VUCE 3.0* en 3 tarjetas grandes (una sola ventanilla · 3 reglas a la vez · un solo
   semáforo) y el cierre "La IA une las revisiones y señala pistas. La persona decide." Sin cifras ni botones:
   la comparación con números queda en la tableta.

La tableta es deliberadamente simple: sin columna lateral; cada pantalla muestra solo lo necesario para
decidir (institución, documentos, semáforo) o avanzar (tarjeta del paso + botón). Al elegir un color, un
destello de pantalla completa de ese color aparece en la tableta y en la TV; en la etapa de la IA el
destello se repite con cada regla que aplica (paso 3) y con el semáforo único (paso 4), y al llegar a la comparación (color del semáforo final). En la TV la frontera es una
caseta de peaje con barrera que se levanta cuando el camión cruza.
Las paradas (`ENTITIES`), las cargas (`CARGOS`) y los escenarios por turno (verde / falta un documento /
inconsistencia, con al menos una pista por turno) son **simulados y educativos**. Los **tiempos "en
frontera" son ilustrativos** (`SIM={stop:20,ai:5}` minutos en `game.js`): cámbialos ahí si el equipo del
proyecto entrega cifras documentadas. No se usan datos reales de la VUCE.

### Popups interactivos con datos del proyecto (`COPY.*.pop` en `game.js`)

Los camiones y documentos siguen siendo simulados, pero el juego se ancla al proyecto real con cuatro
popups bilingües (etiqueta "Dato del proyecto · VUCE 3.0"), con tarjetas que el visitante toca:

| Popup | Dónde aparece | Interacción |
|---|---|---|
| **¿Cómo se juega?** | Automático al entrar a "Tú revisas" (el cronómetro arranca al cerrarlo) y botón ⓘ junto al título | Explica las 3 paradas y los tres colores del semáforo con los que decide el visitante. |
| **Así era antes en Peñas Blancas** | Chips de la intro (📍 Peñas Blancas · 🚛 650 camiones al día · 🏛️ 5 instituciones) y automático al terminar la ronda manual si aún no se vio | Toca las 5 instituciones: cada una "abre" el camión y un contador muestra cuántas veces se abría el mismo camión. |
| **¿Cómo lo hace VUCE 3.0?** | Automático al entrar a "La IA revisa" (la lectura empieza al cerrarlo) y botón ⓘ junto al título | Tres tarjetas: reglas de cada institución, aprendizaje automático (330.000 registros históricos) y selección aleatoria. |
| **El semáforo de riesgo** | Botón "¿Qué significa el semáforo?" cuando la IA termina y en la pantalla de comparación | Toca rojo / amarillo / verde. El veredicto de la IA ya se muestra como semáforo. |
| **¿Y en la vida real?** | Botón en la pantalla de comparación | Antes vs. ahora, 330.000 registros, 360.000 trámites en un año y la siguiente etapa (riesgo antes de llegar a la frontera). |

Los popups viven dentro del iframe de la tableta; la TV no los refleja (a propósito: tapaban la escena). Se cierran con ✕, con el botón
principal o tocando el fondo, y se reinician con "Jugar otro turno" o "Inicio".

## Marca

Inter · IDB Blue #005CFF · tintes Blue -1..-4 · grises Black -1..-4 · semánticos rojo #FC5D5D,
amarillo #FFCB52, verde #9BDE54 · texto alineado a la izquierda · sin degradado en texto ni datos.

## Sincronización tableta → TV

La tableta y la TV están conectadas durante todo el minijuego. El juego (`game/game.js`, función
`tvPacket`) envía por `postMessage` un resumen al controlador (`module.js`), que lo publica en el
estado de la estación (`packet.game`, versión `v:2`). El servidor lo valida con `cleanCostaRica` y la
TV lo pinta con `tv.js` (`window.CRB_TV`), con estilos `.crtv-*` en `module.css`.

Lo que muestra la TV, en grande y sin botones:

- **Etapa** (stepper 1-4) y la indicación de qué tocar en la tableta.
- **Escena animada**: carretera con las 3 instituciones (cajas con su regla y su semáforo), la
  frontera y el camión, que avanza con transición CSS a la posición `pos` del paquete (0 salida ·
  1-3 paradas · 4 cruzó). En la etapa de la IA las 3 cajas se deslizan y se **unen en una sola
  ventanilla VUCE 3.0** con las 3 reglas dentro; el camión para solo ahí y luego cruza.
- **Tablero**: camión y parada actual, estado ("decidiendo el semáforo de…", "el camión avanza…",
  semáforo y explicación tras cada decisión, "la IA aplica las 3 reglas a la vez", veredicto con el
  detalle por institución), cronómetro en vivo (extrapolado entre envíos) y **tiempo simulado en
  frontera**.
- Al final: **Lo que te llevas de VUCE 3.0** en 3 tarjetas + semáforo final (la comparación Tú vs IA queda en la tableta).

La tableta NO muestra el camión: solo la interacción (documentos, semáforo, lista de los 5 pasos de la IA
y un aviso "Mira la TV"). Toda la animación vive en la TV, a propósito lenta (unión de cajas 6 s, viaje
3,4 s, cada regla 2,6 s, veredicto 5 s; constantes `MERGE_MS`, `TRAVEL_MS`, `SCAN_MS`, `VERDICT_MS`,
`FEEDBACK_MS` en `game.js`) y con una tarjeta "Paso N · …" que explica qué hace VUCE 3.0 en cada momento
(`COPY.*.explain`). El paquete lleva solo textos ya traducidos, semáforos, posición del camión y tiempos:
**nunca los documentos ni las preguntas**, que viven en la tableta. Fuera del juego `game` vuelve a
`null` y la TV muestra la ficha de Costa Rica. `#es`/`#en` cambian el idioma en ambas pantallas y
`[data-act="home"]` regresa a `/index.html?station=X`.
