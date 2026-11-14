# 06 — RegLAC

Actualizado el 2026-11-13: menú principal PNG del cliente (`menuprincipalREGLAG`) en la tableta y el TV,
infografía animada en «About the project» y video `RegLac_SUB_ENV2` en «Video». El TV muestra una píldora
de guía en el menú y otra en la infografía. Mismo funcionamiento que Guatiguará (04).
Respetar mayúsculas de `Public/` y `Video/` (las rutas de Netlify distinguen mayúsculas).

- Tableta: `/projects/06-reglac/index.html?station=6`.
- TV: `/display.html?station=6`.

## Recursos (noviembre 2026)

- `Public/reglac-menu-en.png` (1920 × 1080): menú principal de la tableta y del TV.
- `Public/reglac-infografia-en.png` (1920 × 1080): infografía «About project» (copia de `infografiaREGLAC.png`).
- `Public/reglac-infografia-base.png`: la misma infografía con el contenido borrado (panel azul,
  marcos de las tarjetas y barra de impacto vacíos). Se genera borrando las cajas de `SHEET` en
  `experience.js`; si cambia la infografía hay que regenerarla y volver a medir esas cajas.
- `Video/RegLac_SUB_ENV2_web.mp4`: video del TV (H.264 1080p, AAC 160 kbps, faststart, 28 MB),
  comprimido desde `RegLac_SUB_ENV2.mp4` (98,5 MB, no se versiona: GitHub limita a 100 MB).

## Funcionamiento

- `module.js`: zonas táctiles sobre el PNG del menú. «About the project» → infografía en el TV;
  «Video» → video en el TV; «Home» → lista de proyectos. Mientras el TV muestra la infografía o el video
  aparece la píldora «Back» junto a «Home», que devuelve el TV al menú. La tableta no cambia de arte.
- El menú se dibuja en dos bandas del mismo PNG (barra azul arriba, cuerpo centrado) para que se vea
  equilibrado en tabletas 4:3 y 16:10; a 16:9 es el PNG píxel a píxel.
- Píldoras del TV: «Select an option on the tablet» bajo las tarjetas del menú y «When you are ready,
  tap “Video” on the tablet» (con flecha animada) cuando la infografía termina de armarse.
- `experience.js`: rutas de los recursos y render del TV (`REGLAC.renderInto`, llamado desde
  `shared/display.js`). La infografía se arma pieza por pieza con recortes del PNG (panel azul, logo,
  título, reto, solución, cifras de impacto) con la misma coreografía que la referencia animada del BID
  «Iniciativa 2.2_animada_PRO» (igual que VUCE 3.0 y Teachy). Dura unos 6 s; al final se superpone el
  PNG completo. La composición sin esa capa es idéntica píxel a píxel al PNG. No se reinicia si el TV
  recibe de nuevo el mismo estado.
- El video se reproduce a pantalla completa y en bucle; si el navegador del TV bloquea el audio sin
  gesto del usuario, sigue silenciado. «Back» lo detiene y vuelve al menú.
- Estados guardados antiguos: `game`/`results` abren el video; `info`/`cta` abren la infografía.
- Solo inglés: los recursos nuevos no tienen versión en español.

## Verificación

Con el servidor local en marcha y Playwright disponible por `NODE_PATH`:

```powershell
$env:BASE_URL='http://127.0.0.1:4173'; node projects/06-reglac/verify.cjs
```

Recorre menú → infografía → Back → video → recarga → Back → Home en la estación 6 y guarda
capturas en `verification/menu-2026-11/`.

`state.js`/`state.test.cjs`, `assets/`, `figma-editable/` y las auditorías antiguas se conservan como
referencia histórica del minijuego retirado; `state.js` mantiene la compatibilidad del servidor.

## Links

- Tablet: https://bidaiinaction.netlify.app/projects/06-reglac/index.html?station=6
- TV: https://bidaiinaction.netlify.app/display.html?station=6
