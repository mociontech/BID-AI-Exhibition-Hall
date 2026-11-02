# 06 — RegLAC · AI in Action

Experiencia bilingüe integrada en la arquitectura existente. La tableta controla la partida y la TV recibe estados mediante `AI_SYNC` y el servidor HTTP compartido.

## Abrir

Ejecuta `npm start` desde la raíz del repositorio y abre:

- Tableta: `http://localhost:4173/index.html?station=6`.
- TV: `http://localhost:4173/display.html?station=6`.
- Menú general: `http://localhost:4173/index.html?station=6&projects=1`.

En dispositivos físicos, sustituye localhost por la IP LAN del equipo servidor. Ambos dispositivos deben acceder al mismo servidor y usar el mismo número de estación. RegLAC también funciona al seleccionarlo desde el menú de las estaciones existentes. Las estaciones 1, 2, 3 y 5 conservan sus estados independientes.

## Flujo

Información conserva la pantalla principal de la tableta y muestra la infografía ES/EN en TV. A los 10 segundos, la tableta habilita la tarjeta Minijuego y muestra un CTA sin interrumpir la infografía.

Detective de Normas: introducción → ronda manual → respuesta y explicación → transición → activación de RegLAC → organizar (2 s), escanear (2 s), identificar (2 s) → confirmación humana → explicación → comparación final.

Selección máxima de dos documentos, deselección permitida, comprobación habilitada únicamente con dos seleccionados. Respuestas incorrectas revelan la pareja correcta y permiten continuar. No hay cuenta regresiva, penalización ni límite de tiempo.

Los cronómetros utilizan marcas de tiempo corregidas contra el reloj del servidor. La tableta controla los cambios de fase; la TV nunca avanza estados por sí sola. Los tiempos finales son reales de la sesión. La segunda ronda incluye los seis segundos de animación y se identifica como tiempo de interacción de la demostración, no procesamiento real de IA.

Cambiar idioma conserva los tiempos y las selecciones. Recargar recupera el último estado publicado. Reiniciar borra selecciones, tiempos, resultados y resaltados. Volver al menú cancela temporizadores; Home abre el menú general. Se incluyen pantalla completa, foco visible, controles táctiles, reducción de movimiento y reintentos de sincronización.

## Archivos del módulo

- `index.html`: entrada compatible con `shared/project-page.js`.
- `module.js`: controlador, navegación, temporizadores y publicación de estados.
- `experience.js`: textos ES/EN, documentos originales adaptados, ilustración SVG/CSS y vistas distintas para tableta y TV.
- `module.css`: estilos aislados mediante prefijo `rl-`, fuente Inter local y animaciones.
- `state.js`: esquema y transiciones compartidos por navegador y servidor.
- `state.test.cjs`: pruebas de selección, progresión, validación, cronómetros y reinicio.
- `verify.cjs`: prueba de integración Playwright con contextos separados para tableta y TV.
- `verification/`: capturas y reporte de verificación.
- `visual-audit.cjs`: auditoría de las 78 combinaciones de vista, idioma y tamaño.
- `DESIGN.md`: criterios aplicados del manual de marca BID y detalle del rediseño.

Cambios mínimos compartidos: `server.js` y `shared/sync.js` admiten estación 6, validación de estado RegLAC y reloj del servidor; `display.html` carga los recursos del módulo; `shared/display.js` despacha RegLAC al renderizador específico; `shared/home.js` dirige la entrada de estación 6 a RegLAC y conserva acceso explícito al menú general. No se cambió el registro ni archivos de los proyectos 01–05.

## Recursos y correspondencia

Las nueve referencias se localizaron en Descargas como `Imagen de ChatGPT 2 nov 2026, 15_33_51-1.png` a `15_33_58-9.png`, y se copiaron a `assets/references/` en este orden:

1. `home-es.png`: pantalla principal ES.
2. `home-en.png`: pantalla principal EN.
3. `information-es.png`: referencia original de infografía ES.
4. `information-en.png`: referencia original de infografía EN.
5. `intro.png`: referencia de introducción.
6. `manual.png`: referencia de ronda manual.
7. `analysis.png`: referencia de animación.
8. `confirmation.png`: referencia de confirmación.
9. `results.png`: referencia de resultado.

`detective-original.html` conserva el HTML adjunto como referencia, sin incrustarlo ni ejecutarlo. Se reutilizaron sus doce documentos y sus parejas A/C y B/D. Las ilustraciones interactivas, documentos, botones y cronómetros son HTML/CSS/SVG reales. No se recortaron capturas para simular botones. El logo BID y la fuente Inter/OFL se copiaron de los recursos locales existentes del proyecto 05 para hacer al módulo autocontenido. No había ilustraciones de documentos separadas: se construyeron con SVG.

Las instrucciones de implementación proceden de los dos textos adjuntos; el segundo determina el desbloqueo de 10 segundos. El HTML anterior y las capturas se tratan como referencias de contenido y comportamiento.

## Pruebas

Desde la raíz:

```powershell
node --test tests/smoke.test.js projects/06-reglac/state.test.cjs
```

Para la prueba de navegador, instala Playwright fuera del repositorio o usa una instalación disponible, configura `NODE_PATH` a su carpeta `node_modules`, inicia el servidor y ejecuta:

```powershell
$env:TEST_URL='http://localhost:4173'
node projects/06-reglac/verify.cjs
```

Se usa Chrome instalado con `channel: 'chrome'`; no se agregan dependencias de producción. El reporte y las capturas quedan en `verification/`. Verifica 1180×820, 1024×768 táctil y TV 1920×1080, cambio ES/EN, desbloqueo real, selección y errores, animación, tiempos con reloj de TV adelantado cinco minutos, persistencia al recargar, reinicio, cancelación y navegación. La unidad de cronómetro comprueba una ronda superior a tres minutos sin finalización automática.

Pendiente de validación en hardware: iPad/Safari físico, TV y latencia de la red Wi-Fi de la exposición. Esta verificación no sustituye la revisión técnica/editorial de los hallazgos simulados.

## Revisión visual según el manual BID

La infografía de TV se construye ahora con HTML traducido y los mismos contenidos; las imágenes originales quedan como referencias. El nuevo sistema utiliza azul #005CFF, Inter, márgenes compartidos, una ilustración SVG propia de seis documentos y controles específicos para tableta. La TV muestra requisitos completos y la tableta presenta selectores con un panel de acción. Se mantiene el flujo funcional y la sincronización existentes. Consulta DESIGN.md y verification/redesign/visual-report.json.

## Publicación GitHub / Netlify

La rama de integración es project/06-reglac. Se conserva el transporte Firebase añadido en main: /api/state en desarrollo y Realtime Database en Netlify. El administrador publicó las reglas para las diez estaciones visibles (1–7, 9–11); el fragmento versionado y la lista admitida por la aplicación utilizan esos mismos identificadores. Actualizar el repositorio no publica automáticamente cambios futuros de reglas de Firebase. Para RegLAC, el reloj público se calibra con una petición HEAD al mismo dominio de Netlify y se reutiliza durante un minuto, sin depender de una cabecera Date bloqueada por CORS.

Verificación adicional: node --test tests/*.test.js projects/06-reglac/state.test.cjs projects/06-reglac/sync.test.cjs.
