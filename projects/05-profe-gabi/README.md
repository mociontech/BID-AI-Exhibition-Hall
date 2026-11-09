# 05 — Profe Gabi

Experiencia de exhibición: la tableta controla la interacción y la TV muestra la información o la conversación. La interfaz del evento está en inglés; las consultas y respuestas de WhatsApp se muestran siempre en español.

## Comportamiento

- Information e Interactive experience están disponibles desde el inicio, sin espera ni desbloqueo.
- Information conserva el menú de la tableta y muestra la infografía EN en la TV.
- Cuatro rutas: preparar una clase; crear actividades y evaluar; desarrollo profesional; bienestar. Hay una consulta inicial y una decisión entre dos seguimientos: ocho desenlaces.
- Los diez mensajes recibidos del equipo se incorporan como extractos o adaptaciones identificados en los datos. Se conservan las consultas originales y dos transiciones editoriales; no hay IA en vivo ni entrada libre.
- El chat usa 22 px lógicos en el diseño HD. La agrupación aprovecha el espacio sin cortar la consulta ni la respuesta y sin eliminar texto. Cada respuesta requiere una o dos entregas; la actividad de cinco minutos cabe en una.
- Continue mantiene el ritmo de lectura en la tableta. Entre entregas hay una breve animación de escritura; las decisiones y el resultado aparecen al terminar de leer cada respuesta completa.
- Recargar conserva la parte actual. Home, Back y Play again cancelan los temporizadores y restablecen el paso correspondiente. La reconexión vuelve a enviar el estado más reciente.
- Los resultados, las instrucciones y las etiquetas permanecen en inglés. El idioma del chat no depende del idioma guardado por una sesión anterior.

El disclaimer es únicamente:

> English translation of adapted, anonymised real cases. Profe Gabi can make mistakes; the teacher decides.

No se muestra una segunda línea de fuentes en el chat. La trazabilidad permanece en los JSON y en el documento de revisión. El disclaimer conserva literalmente el texto solicitado, aunque la conversación visible está en español.

## Pantallas y branding

Se integran los nueve PNG de `BID AI Exhibition hall (1).zip`, sin recomprimirlos. `tv-information-en.png` se conserva de la entrega aprobada anterior. El [inventario](assets/branded/README.md) y el [manifiesto](assets/branded/manifest.json) registran usos, archivos originales y hashes.

Las imágenes son fondos y recursos visuales. Las zonas transparentes, Continue, Home, Back, menú y fullscreen son controles HTML reales. Los títulos de las situaciones y los mensajes actuales se superponen como texto. El título de TV se distribuye en tres líneas: Virtual / assistant / Profe Gabi. La tarjeta de bienvenida mantiene el avatar y las cuatro opciones dentro del borde, con margen inferior.

## Ejecutar y abrir

Desde la raíz: `npm start`.

- Tableta: http://localhost:4173/projects/05-profe-gabi/index.html?station=5
- TV: http://localhost:4173/display.html?station=5
- Tableta Netlify: https://bidaiinaction.netlify.app/projects/05-profe-gabi/index.html?station=5
- TV Netlify: https://bidaiinaction.netlify.app/display.html?station=5

Ambos dispositivos deben usar el mismo `station` y, cuando corresponda, el mismo `room`. En local se usa el servidor compartido; en Netlify se conserva el transporte Firebase existente. No se modifican los otros proyectos, su orden ni sus idiomas.

## Guiones y estado

- `source/conversations.es.json`: consultas, respuestas y `gabiParts` del chat.
- `source/conversations.en.json`: etiquetas y resultados EN; traducciones de referencia que no se muestran en el chat.
- `source/real-messages-2026-11-09.json`: diez mensajes originales y hash del documento recibido.
- `source/context-2026-11-09.md`: procedencia y decisiones editoriales.
- `source/build-data.cjs`: valida y compila `conversations.js`.
- `source/pack-replies.cjs`: herramienta editorial que mide el espacio real de TV a 22 px y agrupa ideas contiguas. No es una dependencia de ejecución.
- `state.js`: versión 5, con índice de lectura y validación compartida. Las sesiones de versiones anteriores vuelven al menú para no reinterpretar sus elecciones.
- `module.js`, `experience.js`, `artwork.js` y sus CSS: controlador, conversación y composición de los recursos aprobados.

Las cifras de la infografía conservan su contexto del piloto. El nuevo documento aporta los mensajes del guion y no sustituye esas cifras por datos de otra etapa del proyecto.

## Revisión y validación

[Word editable](review/2026-11-09/Profe_Gabi_Guiones_revision_2026-11-09.docx) · [PDF](review/2026-11-09/Profe_Gabi_Guiones_revision_2026-11-09.pdf) · [Documento web](review/2026-11-09/Profe_Gabi_Guiones_revision_2026-11-09.html).

El documento conserva los originales, los extractos y las adaptaciones. Se reconstruye desde los mismos JSON con `python projects/05-profe-gabi/source/build-review.py`. El PDF es una impresión de la versión web.

Con Chrome y Playwright disponibles fuera del repositorio:

```powershell
$env:NODE_PATH = Join-Path $env:TEMP 'profe-gabi-tools/node_modules'
node projects/05-profe-gabi/verify.cjs
node --test tests/smoke.test.js tests/firebase-sync.test.js
```

Puede indicarse otro servidor mediante `TEST_URL`. La integración recorre los ocho desenlaces y sus 23 entregas, verificando idioma, texto íntegro, disclaimer, ausencia de recortes, avance manual, recarga, fullscreen, reconexión, Home/Back/reinicio y aislamiento. Los informes están en `review/2026-11-09/`.

La prueba usa contextos independientes y tamaños de navegador emulados; no sustituye una revisión con el hardware físico del evento.
