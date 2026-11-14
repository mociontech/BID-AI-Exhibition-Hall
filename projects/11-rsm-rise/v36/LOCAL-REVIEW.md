# Revisión local de diseño RISE (revisión 6)

Referencia: Figma `6WCZLX7n6GHksVOfP9TKZz`, página `08_RISE` (nodo `440:7`).
Esta revisión queda únicamente en local: no se publicó, no se hizo push ni despliegue.

## Qué cambia

Presentación, más tres cambios pedidos el 2026-11-14 (ver abajo). `styles.css`, `app.js`, `i18n.js`, `timing.js`, `state.js` y las pruebas no se tocaron.

- `figma-review.css` — reescrito por completo (las reglas de la revisión 2 se eliminaron). Cada medida sale de un frame
  de Figma de 1920×1080: en la TV `cqw = px de Figma / 19,2`; en la tableta `px = px de Figma × 552/1080`
  (la composición mide 552 px de alto y `station.js` la escala de manera uniforme).
- `figma-accent.js` — nuevo. Figma pinta en azul una parte de varios títulos de la TV y fuerza un salto de línea en el
  aviso. El fuente v36 genera esos títulos como un único nodo de texto, así que este adaptador envuelve la segunda parte
  en `<em>` antes de cada pasada de traducción. No usa gradientes ni depende del ancho o alto del texto; el contenido es
  idéntico en inglés y español (cabeza + cola = frase original) y cada parte pasa por la tabla de traducción del fuente.
- `station.js` — los botones «Next» de la tableta (lectura y paso del tiempo) dicen «Next step» / «Siguiente paso», y el aviso de la TV dice «Tap «Next step» on the tablet», igual que ya ocurría en el análisis de riesgo.
- `client-copy.js` — nuevo. Cambios de texto pedidos por el cliente en los comentarios de Figma (ver abajo). Edita los
  datos de las propuestas y sustituye nodos de texto antes de cada traducción; los fuentes v36 siguen idénticos.
- `screen.html` — carga `figma-review.css?v=5`, `station.js?v=36-next-step-3`, `figma-accent.js?v=2` y `client-copy.js`; la petición existente a Google Fonts incluye los
  pesos de Inter que usa Figma (500, 700 y 800 además de 300, 400, 600 y 900).

Cambios pedidos el 2026-11-14:

- TV, 8.200: se mantiene la animación original; el muro queda visible y atenuado detrás de la cifra, como en v36.
- «Next» pasa a «Next step» en todos los botones de la tableta.
- Encabezado de la tableta: solo Home; el selector EN/ES queda oculto por CSS (sigue en el DOM).

Comentarios del cliente en Figma (Lina Botero, 2026-11-14), aplicados en `client-copy.js`:

- Tableta, reto (958:780): «Hundreds of pages per operation»; «Can risk teams read everything?»; «Operations grow in
  number, size and complexity.».
- TV, reto (955:10461): «As operations grow in number, size and complexity, can risk teams read everything without
  losing consistency?» (el comentario escribe «loosing»; se dejó «losing»); «of documents per operation: …»;
  «…that are difficult to sort through».
- TV, propuestas (944:5261): «proposals have just landed.» pasa a negro; solo «Choose one to review.» queda en azul.
- Propuestas (958:1127, 944:5526): Country A/B/C pasan a Peru, Colombia y Mexico en todas las pantallas; la tercera
  propuesta se titula «Fiber-optic infrastructure expansion» (ocupa dos líneas en las tarjetas).
- Tableta, etapa 4 (958:1188, 971:1256): título «Run simulation» en negro y «Manual vs. RISE» en azul, en dos líneas;
  el botón circular baja de 454 a 408 px de Figma para dejar aire.
- TV, lectura (944:5392, 944:5634): el primer paso de «How RISE works» dice «Read» en lugar de «Ingest».
- Sin cambio de código: «Por favor veamos los otros dos escenarios» (944:6157) pide ver las otras dos propuestas;
  ya existen en la aplicación. El botón circular y el aviso de la TV siguen diciendo «Run manual and RISE» porque no
  se comentaron.

Menú principal e infografía (2026-11-14), fuera de `v36/`:

- `../experience.js`, `../module.js`, `../module.css`, `../game.js`, `../Public/` — menú principal PNG en tableta y TV,
  infografía «About the project» animada por recortes y píldoras de la TV, con el patrón de las estaciones 04 y 06.
  Detalle en `../README.md`.
- `station.js` — el primer Back del v36 avisa al contenedor con `rise:menu` y vuelve al menú de RISE (antes iba a los
  proyectos).
- `../index.html`, `../../../display.html` — versiones `?v=20261114-menu-1` de los archivos de RISE.

Para volver al aspecto v36 basta retirar de `screen.html` las líneas de `figma-review.css` y `figma-accent.js`.

## Abrir

Desde la raíz de este worktree, en PowerShell:

```powershell
$env:PORT='4201'
npm run dev
```

- Tableta: http://localhost:4201/projects/11-rsm-rise/index.html?station=11&room=47474747474747474747474747474747
- TV: http://localhost:4201/display.html?station=11&room=47474747474747474747474747474747

## Capturas

En `artifacts/figma-compare/` (ignorado por Git):

- `lado-a-lado/` — Figma, implementación y diferencia de píxeles de cada estado, a 1920×1080.
- `capturas-1920x1080/` — implementación sola, TV y tableta.
- `tableta-1024x768/`, `tableta-1180x820/`, `tableta-1366x768/` — tableta en resoluciones reales.
- `es/` — mismos estados en español.

## Pruebas (servidor en 4201, `BASE_URL=http://127.0.0.1:4201`)

Las pruebas se actualizaron para el menú principal, el encabezado sin EN/ES y la atenuación de Figma:

- `tests/state.mjs`: 3/3.
- `tests/back.mjs`: pasa. El Back inicial ahora vuelve al menú de RISE y su Home a los proyectos.
- `tests/flow.mjs`: pasa. Entra por «Interactive experience», cambia de idioma por evento (EN/ES está oculto) y comprueba
  la atenuación de las tarjetas no elegidas en el icono (`.di`), porque Figma deja el texto a plena opacidad.
- `tests/responsive.mjs`: 10/10. Ya no exige área pulsable para `[data-lang]`.
- `tests/session.mjs`: adaptada al menú, sin ejecutar: depende de Firestore real y su aserción final ya fallaba por
  respuestas 409 de la analítica compartida, ajenas a RISE.
- `tests/visual.mjs`: compara con el v36 original píxel a píxel; no aplica mientras esté activo el ajuste a Figma.
- Menú e infografía: recorrido completo en tableta y TV (menú, About the project, Back, Interactive experience, Back
  inicial, recarga, Home) sin errores de página.
- Pruebas generales `tests/smoke.test.js`, `home-navigation` y `firebase-sync`: 24/24.

## Diferencias que se mantienen a propósito

Contenido que Figma muestra distinto y que se conserva como está en la aplicación:

- Subtítulo del encabezado: Figma «IDB Group Projects Across the Region»; aplicación «RISE · Risk Intelligence and
  Strategy Engine».
- Encabezado de la TV: Figma no dibuja las píldoras de etapa (Problem … Remember).
- Tableta, reto (958:780): Figma solo muestra Back; se conserva «Start experience».
- Tableta, riesgo (971:1296): Figma dice «Accept to advance the project.»; se conserva «Continue to the next step.».
  La TV dice «Tap «Next step» on the tablet» donde Figma dice «Tap «Accept»».
- Tableta, propuestas: Figma omite el «·» entre empresa y país.
- Iconos: Figma usa otros dibujos para banco, metro, fibra y oficial de riesgo; se conservan los del fuente.
- Tableta, riesgo: Figma dibuja el anillo completo; el fuente dibuja el arco del porcentaje real.

Decisiones tomadas siguiendo Figma al pie de la letra, por si se prefiere otra cosa:

- TV, 8.200 (944:5188): la cifra queda 57 px a la derecha del centro, como en el frame. Figma no muestra el muro
  detrás; se conserva por petición.
- Estados atenuados (pasos «How RISE works», filas vacías de la lectura, tarjetas e insights no elegidos, línea de
  tiempo antes de Play): Figma atenúa la caja pero no el texto.
- Kicker de la tableta: Figma lo escribe en mayúsculas en seis frames y en minúsculas en cuatro (Welcome, Stage 2,
  Stage 3, Stage 4 · RISE reads). Se reproduce cada pantalla como está en su frame.
- Tableta: el botón circular y la tarjeta de riesgo van centrados en la pantalla; las demás tarjetas, en la columna de
  contenido, que en Figma queda 19 px a la izquierda del centro.

Diferencias pendientes:

- TV, solución (944:5312): en ese frame el pie y la píldora están 12,6 px más arriba que en los otros trece. Se dejó
  la posición común.
- TV, avisos negros: cuando el texto empieza en negrita, Figma deja un hueco de 12–24 px tras la negrita. Se dejó el
  espacio normal, por lo que el aviso mide hasta 15 px menos de ancho.
- TV, pie: Figma pega «Simplified simulation» a «of how…» sin espacio. Se dejó el espacio.
- Tableta: los botones de Figma varían entre frames (87,8 u 90,3 px de alto, peso 600 o 700, separación 22,6–35,3).
  Se replicó la separación de cada pantalla y el tamaño del aviso inicial; el peso es 600 en todas.
- Quedan desplazamientos de 1–2 px en algunos textos por diferencias de rasterizado entre Figma y Chromium.
