# 08 — Teachy

Única carpeta de la experiencia Teachy (respetar mayúsculas de `Public/` y `Video/`).

- Tableta: `/projects/08-teachy/index.html?station=9`.
- TV: `/display.html?station=9`.
- La estación 9 es el canal de sincronización permitido en Firebase; el proyecto sigue siendo el 08.

## Recursos (noviembre 2026)

- `Public/teachy-portada-en.png` (1672 × 941): menú principal de la tableta y portada del TV.
- `Public/teachy-infografia-en.png` (1920 × 1080): infografía «About project».
- `Public/teachy-infografia-base.png`: la misma infografía con el contenido borrado (panel azul,
  marcos de las tarjetas y barra de impacto vacíos). Se genera a partir de la anterior; si cambia
  la infografía, hay que regenerarla y revisar las coordenadas de `SHEET` en `experience.js`.
- `Video/Teachy_Musica_v2_web.mp4`: video del TV (H.264 1080p ~5 Mbps, AAC 160 kbps, faststart,
  68 MB), comprimido desde `Teachy_Musica_v2.mp4` (210 MB, no se versiona: GitHub limita a 100 MB).
- Los cuatro PNG ES/EN anteriores siguen en `Public/` como referencia; ya no se usan.

## Funcionamiento

- `module.js`: zonas táctiles sobre el PNG de la tableta. «About project» → infografía en el TV;
  «Video» → video en el TV; «Start» → menú general; la etiqueta «Station 08 · Teachy» activa la
  pantalla completa. Mientras el TV muestra la infografía o el video aparece la píldora «Back»
  junto a «Start», que devuelve el TV a la portada. La tableta no cambia de arte.
- `experience.js`: rutas de los recursos y render del TV. La infografía se arma pieza por pieza con
  recortes del PNG (panel azul, logo, título, reto, solución, cifras de impacto) con la misma
  coreografía que la referencia animada del BID «Iniciativa 2.2_animada_PRO» (igual que VUCE 3.0).
  Dura unos 6 s; al final se superpone el PNG completo, así que el cuadro final es idéntico al
  original. No se reinicia si el TV recibe de nuevo el mismo estado.
- El video se reproduce a pantalla completa y en bucle; si el navegador del TV bloquea el audio sin
  gesto del usuario, sigue silenciado. «Back» lo detiene y vuelve a la portada.
- Solo inglés: los recursos nuevos no tienen versión en español.
