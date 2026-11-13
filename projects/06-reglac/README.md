# 06 — RegLAC

Actualizado el 2026-11-13: portada PNG del cliente en la tableta, infografía animada en «About project»
y video `RegLac_SUB_EN` en la segunda tarjeta. Mismo funcionamiento que Teachy (08).
Respetar mayúsculas de `Public/` y `Video/` (las rutas de Netlify distinguen mayúsculas).

- Tableta: `/projects/06-reglac/index.html?station=6`.
- TV: `/display.html?station=6`.

## Recursos (noviembre 2026)

- `Public/reglac-portada-en.png` (1672 × 941): menú principal de la tableta y portada del TV.
- `Public/reglac-infografia-en.png` (1920 × 1080): infografía «About project» (copia de `infografiaREGLAC.png`).
- `Public/reglac-infografia-base.png`: la misma infografía con el contenido borrado (panel azul,
  marcos de las tarjetas y barra de impacto vacíos). Se genera borrando las cajas de `SHEET` en
  `experience.js`; si cambia la infografía hay que regenerarla y volver a medir esas cajas.
- `Video/RegLac_SUB_EN_web.mp4`: video del TV (H.264 1080p, AAC 160 kbps, faststart, 27,5 MB),
  comprimido desde `RegLac_SUB_EN.mp4` (95 MB, no se versiona: GitHub limita a 100 MB).

## Funcionamiento

- `module.js`: zonas táctiles sobre el PNG de la tableta. «About project» → infografía en el TV;
  «Interactive experience» → video en el TV; «Start» → lista de proyectos; la etiqueta
  «Station 06 · RegLAC» activa la pantalla completa. Mientras el TV muestra la infografía o el video
  aparece la píldora «Back» junto a «Start», que devuelve el TV a la portada. La tableta no cambia de arte.
- `experience.js`: rutas de los recursos y render del TV (`REGLAC.renderInto`, llamado desde
  `shared/display.js`). La infografía se arma pieza por pieza con recortes del PNG (panel azul, logo,
  título, reto, solución, cifras de impacto) con la misma coreografía que la referencia animada del BID
  «Iniciativa 2.2_animada_PRO» (igual que VUCE 3.0 y Teachy). Dura unos 6 s; al final se superpone el
  PNG completo. La composición sin esa capa es idéntica píxel a píxel al PNG. No se reinicia si el TV
  recibe de nuevo el mismo estado.
- El video se reproduce a pantalla completa y en bucle; si el navegador del TV bloquea el audio sin
  gesto del usuario, sigue silenciado. «Back» lo detiene y vuelve a la portada.
- Estados guardados antiguos: `game`/`results` abren el video; `info`/`cta` abren la infografía.
- Solo inglés: los recursos nuevos no tienen versión en español.

## Verificación

Con el servidor local en marcha y Playwright disponible por `NODE_PATH`:

```powershell
$env:BASE_URL='http://127.0.0.1:4173'; node projects/06-reglac/verify.cjs
```

Recorre portada → infografía → Back → video → recarga → Back → Start en la estación 6 y guarda
capturas en `verification/portada-2026-11/`.

`state.js`/`state.test.cjs`, `assets/`, `figma-editable/` y las auditorías antiguas se conservan como
referencia histórica del minijuego retirado; `state.js` mantiene la compatibilidad del servidor.

## Links

- Tablet: https://bidaiinaction.netlify.app/projects/06-reglac/index.html?station=6
- TV: https://bidaiinaction.netlify.app/display.html?station=6
