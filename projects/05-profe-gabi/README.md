# 05 — Profe Gabi

Experiencia bilingüe de exhibición integrada en el shell existente: tableta para decidir, TV para información y conversación. Sin IA en vivo, entradas de texto libre, datos personales ni dependencias de ejecución añadidas.

## Ejecutar y abrir

Desde la raíz del repositorio: `npm start`.

- Tableta / menú general: http://localhost:4173/index.html?station=5 → Profe Gabi.
- Tableta / proyecto directo: http://localhost:4173/projects/05-profe-gabi/index.html?station=5.
- TV: http://localhost:4173/display.html?station=5.

En dos equipos físicos, abrir las rutas con la IP LAN del equipo que ejecuta `server.js`, en la misma red y con el mismo `station=5`. El servidor imprime las direcciones LAN al arrancar. El puerto predeterminado es 4173. Se requiere acceso al servidor para la sincronización entre equipos; no basta con abrir archivos desde disco.

## Material recibido e inventario

El contenido del prompt del usuario define las instrucciones y las cifras. Las imágenes se utilizan como referencias de composición; el HTML anterior aporta los guiones, no una aplicación que se incrusta mediante iframe.

El ZIP `WhatsApp Unknown 2026-11-02 at 1.18.50 PM.zip` contiene cinco imágenes, copiadas con nombres estables en `assets/references/`:

| Archivo | Contenido | Idioma |
| --- | --- | --- |
| `reference-01.jpg` | Menú principal; docente con portátil y fotografía de aula de la tarjeta Información | ES |
| `reference-02.jpg` | Infografía | EN |
| `reference-03.jpg` | Infografía | ES |
| `reference-04.jpg` | Conversación guiada | ES |
| `reference-05.jpg` | Cierre | ES, aunque el selector dibujado marca EN |

`assets/references/manifest.json` conserva los nombres originales. La fotografía protagonista y la fotografía de Información se muestran mediante encuadres SVG que exponen sólo zonas visuales de `reference-01.jpg`. No se utilizan las capturas completas como interfaz. El teléfono del menú es HTML/CSS, sin mensajes incrustados ni texto en otro idioma. Logos, textos, métricas, tarjetas, flechas, botones, estados y chat son elementos reales.

Otros recursos:

- `assets/bid-logo.png`: copia del recurso BID existente del proyecto 04; su carpeta original no se modificó.
- `assets/fonts/Inter.ttf` y `OFL.txt`: tipografía Inter de la distribución oficial `google/fonts/ofl/inter`, incluida localmente con su licencia para funcionar sin servicios de fuentes externos.
- Recursos heredados del menú general: `assets/cards/05.webp`, `assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/05_profe_gabi.jpg` y `cards/full/05_profe_gabi_tarjeta.png`; no se modificaron.

No hay un archivo separado de menú EN dentro del ZIP, ni una referencia independiente de selección de temas. No faltan recursos para ejecutar el recorrido: ambas vistas se construyen con componentes bilingües. Para mejorar la resolución de los encuadres en futuras entregas pueden sustituirse las fotografías por originales independientes.

Se omitieron los textos accidentales sobre Codex de la referencia de conversación y el indicador 55 % del cierre, que no forma parte del contenido obligatorio proporcionado. La satisfacción del 85,3 % se limita expresamente a las 136 personas que respondieron la encuesta y no se presenta como impacto causal.

## Recorrido

1. La tableta abre el menú con Información y Minijuego. Minijuego comienza gris y deshabilitado, sin superposiciones. La TV muestra una invitación, no tarjetas táctiles.
2. Información mantiene la tableta en su menú con controles sencillos y muestra una infografía HTML/CSS en TV. Incluye qué es, por qué importa, flujo de tres pasos, explicación sencilla de RAG, tres áreas de apoyo, cuatro cifras del piloto y el papel del criterio docente.
3. Tras 10 segundos aparece el CTA dentro del menú y se habilita Minijuego. La espera sobrevive a cambios de idioma y recargas. Volver al menú después del desbloqueo conserva el acceso para esa visita.
4. Minijuego sustituye la infografía: la tableta muestra tres temas y la TV una introducción. Al seleccionar un tema, la TV simula el primer intercambio; después la tableta presenta sus tres situaciones.
5. Al elegir situación, el mensaje se escribe literalmente en el campo del chat a 55 ms por carácter, con pausas mayores para signos de puntuación y 480 ms antes de enviarse. Luego aparece el pensamiento de Profe Gabi durante 1,7–3 segundos, y después la respuesta. Se desbloquean dos seguimientos.
6. Al elegir un seguimiento, se repite la animación y se muestra el cierre con tres aprendizajes, la reflexión específica del desenlace y la conversación completa en un área con desplazamiento interno.
7. Reiniciar / Volver a jugar y Elegir otro tema limpian el recorrido y regresan a los temas. Menú principal regresa a Profe Gabi. Inicio regresa al menú general, conserva la estación y limpia la experiencia del visitante.
8. Volver y Omitir animación funcionan durante la escritura o el pensamiento. Las opciones permanecen deshabilitadas durante las animaciones para impedir solicitudes duplicadas. Cambiar idioma reconstruye todo el historial en el idioma seleccionado; si había escritura activa, reinicia ese intercambio sin mezclar idiomas.

Los mensajes son ejemplos de exhibición preprogramados del HTML recibido, no respuestas reales ni verificadas del asistente. Esa distinción aparece en el chat. No se ejecuta el código de interfaz del prototipo original.

## Archivos y arquitectura

- `index.html`: carga los recursos del proyecto y mantiene `shared/project-page.js` como shell.
- `module.js`: contrato `ProjectModule.mountController`, transiciones, idioma, navegación, fullscreen, temporizadores y reenvío tras pérdida de conexión.
- `experience.js`: componentes distintos para tableta y TV, infografía, chat y línea de tiempo de las animaciones.
- `module.css`: estilos bajo el prefijo `gabi-`, iconografía SVG, Inter local, estados hover/pressed/focus y adaptación a movimiento reducido.
- `state.js`: esquema de estado versionado y validador común de navegador y servidor.
- `conversations.js`: datos de los tres temas, nueve situaciones y 18 desenlaces en ES/EN, separados de los componentes.
- `source/conversations.es.json`: guiones extraídos sin alterar sus textos del HTML `profe_gabi_AI_in_Action.html`.
- `source/conversations.en.json`: traducción al inglés de los mismos guiones.
- `source/build-data.cjs`: regenerar `conversations.js` después de editar los JSON, ejecutando `node projects/05-profe-gabi/source/build-data.cjs`.
- `source/prototype-script.js`: copia del script recibido para trazabilidad; no se carga en el sitio.
- `verify.cjs` y `verification/`: prueba de integración, informe y capturas.

La sincronización conserva el HTTP polling del servidor compartido. No se usa BroadcastChannel como sustituto de la comunicación entre dispositivos. Sólo se transmiten identificadores de elecciones y marcas temporales, no mensajes libres. Ambos equipos derivan el chat de los mismos datos, idioma y tiempos. Se corrige la diferencia de reloj usando la hora del servidor en estación 5.

Los cambios compartidos se limitan a la integración de 05: `display.html` carga sus recursos; la rama 05 de `shared/display.js` usa su receptor; `server.js` valida su nuevo estado e incluye hora del servidor al consultar estación 5; `shared/sync.js` expone estado de conexión, hora corregida y caché para esa estación. Las estaciones 1–3 conservan su contrato HTTP. No se modificaron carpetas 01–04, el registro de proyectos ni el menú general.

Los fallos de red muestran un estado de reconexión. La TV conserva el último estado disponible y la tableta reenvía automáticamente su estado más reciente cuando vuelve la conexión, aunque el visitante no pulse de nuevo. Las recargas con acceso al servidor recuperan las elecciones y la animación en curso. La carga inicial del sitio requiere acceso al servidor; no se instaló un service worker para navegar completamente sin red.

## Pruebas

Con el servidor activo y Playwright disponible:

```powershell
# Instalar herramientas fuera del proyecto, una sola vez:
npm install --prefix "$env:TEMP/profe-gabi-tools" playwright --no-audit --no-fund
$env:NODE_PATH = Join-Path $env:TEMP 'profe-gabi-tools/node_modules'
node projects/05-profe-gabi/verify.cjs
```

La prueba utiliza Chrome instalado localmente. Se puede indicar otro servidor con `TEST_URL`.

Comprueba 36 recorridos: los 18 desenlaces de cada idioma. Abre tableta y TV en contextos independientes de navegador, verifica escritura, envío, pensamiento, omisión, bloqueo de opciones, cambio de idioma durante animación, recargas de ambos equipos, reinicio, regreso, Home con temporizador pendiente, reconexión y reenvío sin duplicar mensajes. Simula un reloj de TV adelantado cinco minutos. Comprueba también rechazo de estado inválido, aislamiento de estaciones y entradas/receptores de 01–04 mediante pruebas de humo.

Dimensiones de tableta: 1180×820, 1024×768, 1280×800, 1366×768 y 960×600. TV: 1920×1080. Incluye comprobaciones de ausencia de desbordamiento de página, foco visible y objetivos táctiles de al menos 44 px en el menú. Los mensajes largos se desplazan dentro del chat.

El resultado de la última ejecución está en `verification/report.json`, con capturas ES/EN en la misma carpeta. Las dimensiones y la entrada táctil se emulan en Chrome: no se ha probado hardware físico de tableta/TV ni la red Wi-Fi del recinto.

## Diseño editable en Figma

Las 14 pantallas ES/EN y sus componentes están en [05_ProfeGabi — Editable](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=63-2). Los enlaces individuales y la auditoría de capas nativas se conservan en [`figma-editable/`](figma-editable/README.md).
