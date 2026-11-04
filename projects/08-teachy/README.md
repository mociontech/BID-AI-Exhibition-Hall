# 08 — Teachy

Única carpeta de la experiencia Teachy. Los cuatro PNG originales están en `Public/`
y el video en `Video/muestra-estacion-teachy-BID.mp4` (respetar mayúsculas).

- Tableta: `/projects/08-teachy/index.html?station=9`.
- TV: `/display.html?station=9`.
- La estación 9 es el canal de sincronización permitido en Firebase; el proyecto sigue siendo el 08.
- `experience.js`: correspondencia entre los PNG de inicio e infografía ES/EN.
- `module.js`: controles táctiles, navegación y envío por `AI_SYNC`.
- `module.css`: proporciones del arte y TV a pantalla completa.

Información cambia solamente la TV; la tableta conserva el PNG de inicio.
ES/EN cambia el arte de la tableta y la infografía activa en la TV.
La flecha de regreso muestra el inicio de Teachy en la TV.
Home regresa al menú general. La etiqueta Estación 08 activa pantalla completa.
Video reproduce en la TV `Video/muestra-estacion-teachy-BID.mp4` a pantalla completa,
en bucle, mientras la tableta conserva su PNG de inicio. Si el navegador de la TV
bloquea el audio sin gesto del usuario, el video continúa silenciado. La flecha de
regreso lo detiene y vuelve al inicio; el cambio ES/EN no reinicia el video.

Los originales miden 1672 × 941: la TV los escala proporcionalmente al área
disponible, incluida una pantalla 1920 × 1080, sin deformarlos.
