# 11 — RSM RISE · v36 original integrado

La versión activa usa **RISE_Prototipo_v36.html** tal como fue entregado: diseño, CSS, copy EN/ES, cifras, casos, controles, escenas y animaciones. No carga estilos ni ajustes de las revisiones anteriores. El original está archivado byte por byte en `v36/original.html`.

## Abrir localmente

Desde la raíz del repositorio:

```powershell
$env:PORT='4191'
npm run dev
```

- Tablet y TV juntas: http://localhost:4191/projects/11-rsm-rise/preview.html?station=11&v=36
- Tablet: http://localhost:4191/projects/11-rsm-rise/index.html?station=11&v=36
- TV: http://localhost:4191/display.html?station=11&v=36
- Original v36: http://localhost:4191/projects/11-rsm-rise/v36/original.html
- Prototipo v36 con CSS/JS separados: http://localhost:4191/projects/11-rsm-rise/v36/index.html

En dispositivos de la misma red, sustituir `localhost` por la IP del ordenador y usar la misma estación y sala (`room`). No se ha publicado ni escrito en salas remotas. Recargar las pestañas de versiones anteriores para cargar v36.

## Comportamiento del archivo entregado

`intro → problem → ficha → deal → read → decide → time → sup → loop`

- **Apertura:** aviso de simulación → Continue → animación original del muro, de 8 segundos → Start experience. Se conservan Skip animation y Skip intro. Al terminar la animación no se avanza automáticamente al problema.
- **Propuestas:** SME credit line, Urban metro line y Fiber broadband network, con 186, 412 y 268 páginas.
- **Lectura:** Run manual and RISE inicia la comparación de 4,8 segundos. Next lleva al análisis de seis riesgos y Accept continúa.
- **Paso del tiempo:** Play inicia la animación; Next pasa a supervisión cuando el visitante lo pulsa.
- **Supervisión:** Read the reports inicia la lectura. Después se muestran los tres insights originales; se selecciona uno para añadirlo al análisis y pulsar See your review. Se respeta este control del v36 sin sustituirlo por la revisión anterior.
- **Cierre:** resumen del insight considerado y documento #8,201. Start again reinicia el v36.

Se conserva EN como idioma inicial y ES para revisión. Los avisos normales expiran a los 8,3 segundos; `.keep` permanece hasta cambiar de escena. Se mantienen los 45 segundos de inactividad del fuente.

La TV muestra el panel original 16:9 con unidades `cqw`. La tablet muestra el panel original 736×552 en píxeles, ampliado proporcionalmente a su viewport y conservando 4:3. No se cambia el tamaño relativo de textos, botones ni imágenes. La vista conjunta usa resoluciones internas de 1024×768 y 1920×1080. En ventanas de otra proporción se conserva el encuadre del dispositivo.

El único ajuste de navegación es que el botón Home existente devuelve a los proyectos de la exhibición, conservando estación y sala. No se agregan botones ni barras. En el original y su copia independiente Home conserva el reinicio del prototipo.

## Archivos y sincronización

- `v36/original.html`: archivo recibido intacto; guardado primero en el commit `7f4aab2`.
- `v36/styles.css`, `app.js`, `i18n.js`: extracción literal. Sólo se retira la envoltura IIFE para compartir el ámbito entre scripts clásicos aislados. Reconstruirla produce exactamente el JavaScript original.
- `v36/index.html`: markup original con enlaces a los archivos extraídos.
- `v36/screen.html`, `device.css`: exposición de un único panel. El CSS adicional sólo coloca y escala el dispositivo completo.
- `v36/timing.js`: algoritmo original del muro, con reloj anclado a la sesión para recuperar el tiempo transcurrido al recargar o abrir la TV tarde.
- `v36/station.js`: enlace con el transporte existente sin cambiar plantilla ni copy; recupera lectura de documentos, lectura de informes y fase de Play.
- `state.js`: esquema 36, flags originales `ip`, `tp`, `sr` y marcas temporales. Descarta versiones anteriores.
- `module.js`, `game.js`, `experience.js`: montaje en el shell existente.

`AI_SYNC` sigue siendo el único transporte. Se publican controles y cambios de fase; no se escribe por frame. La TV es pasiva. Salas y estaciones permanecen separadas. Al cambiar el esquema hay que reiniciar Node para recargar su validador; las sesiones locales están en memoria.

`rise-prototype/` conserva el v34 y las revisiones previas como archivo; no forma parte del diseño activo.

## Verificación actual

Con el servidor local ejecutándose:

```powershell
node projects/11-rsm-rise/v36/tests/visual.mjs
node projects/11-rsm-rise/verification/check.cjs
node --test projects/11-rsm-rise/v36/tests/state.mjs
```

Playwright usa la instalación del entorno (`PLAYWRIGHT_MODULE` permite indicar otra ruta); no se añade como dependencia de producción. `BASE_URL` cambia el servidor de pruebas.

La comparación visual realiza **152 pares** del original frente a las vistas integradas: EN/ES, todas las escenas y los tres casos. Se coloca el panel de referencia en el origen sin modificar su contenido ni estilos, se comprueban los mismos tamaños y se finalizan las animaciones CSS para capturar el estado estable. Se permite hasta 0,01% de variación por antialias; CSS y sentencias de código deben ser exactos.

El recorrido real usa la API local y comprueba Continue, final de animación sin avance automático, recargas, Play/Next manual, Read the reports, los tres insights, cierre, idioma, reinicio, Home, aislamiento de sala y ausencia de escrituras desde la TV. Verifica tablet a 1024×768, 1180×820 y 1366×768, y TV a 1920×1080. Falla ante errores de JavaScript, HTTP o claves en `window.__i18nMiss`.

Capturas y reportes: `v36/artifacts/`, ignorado por Git. Las pruebas sustituyen Google Fonts por CSS vacío para comprobar la fuente de respaldo. En uso normal se conserva la URL original de Inter. Sin frameworks, bundlers, nuevos CDN ni analítica.

## Back solicitado para v36

Se agrega Back / Atr?s con el bot?n original en la introducci?n, el desaf?o y el cierre. Las dem?s escenas conservan su Back nativo. Desde el aviso inicial vuelve a Proyectos; durante o despu?s de la animaci?n vuelve al aviso; desde el desaf?o vuelve al final de la introducci?n; desde el cierre vuelve al insight conservando la selecci?n. La TV sigue los cambios sin emitir controles. El HTML original, su CSS, copy y animaci?n permanecen intactos.

`node projects/11-rsm-rise/v36/tests/back.mjs` verifica las diez transiciones en EN/ES, el reinicio manual de la animaci?n y el regreso a Proyectos con ambas pantallas. La comparaci?n visual oculta exclusivamente el nuevo bot?n para comparar el resto con el original.

Hosted verification: `node projects/11-rsm-rise/verification/hosted-check.cjs` checks the deployed screens with Firebase intercepted in Playwright, without changing exhibition sessions.
