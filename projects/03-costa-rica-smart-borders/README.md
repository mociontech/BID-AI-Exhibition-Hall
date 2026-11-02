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
2. **Tú revisas** — el visitante compara los documentos de cada camión y decide "Dejar pasar" o
   "Inspeccionar". Un cronómetro mide su tiempo. Tras cada decisión se muestra la respuesta correcta.
3. **La IA revisa** — los mismos camiones y documentos; la IA los lee automáticamente, marca en rojo
   la fila que no coincide y propone la decisión. El cronómetro mide su tiempo.
4. **Comparación** — tiempo, aciertos y documentos leídos de cada uno, camión por camión.
   Cierre: "La IA lee rápido y señala pistas. La persona decide."

Cada pantalla incluye las cajas "¿Qué está pasando?", "¿Qué decidió el sistema?" y "¿Qué aprendiste?".
Los casos (`CASES` en `game.js`) son **simulados y educativos**; no se usan cifras reales de la VUCE.

## Marca

Inter · IDB Blue #005CFF · tintes Blue -1..-4 · grises Black -1..-4 · semánticos rojo #FC5D5D,
amarillo #FFCB52, verde #9BDE54 · texto alineado a la izquierda · sin degradado en texto ni datos.

## Sincronización

Durante el juego la tableta envía `mode:'game'` sin carga de juego (`game:null`), por lo que la TV
conserva la ficha informativa de Costa Rica y nunca refleja decisiones del visitante.
Dentro del juego, `#es`/`#en` cambian el idioma (y lo propagan a la TV) y el botón `[data-act="home"]`
regresa a `/index.html?station=X`.
