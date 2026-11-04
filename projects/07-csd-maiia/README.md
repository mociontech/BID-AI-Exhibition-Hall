# 07 — MAIIA · Demo para exhibición BID

Experiencia HTML/CSS/JS bilingüe, con tableta táctil y TV pasiva. Conserva la carpeta y el registro originales `07-csd-maiia`. En local no requiere servicios externos; en Netlify reutiliza la sincronización de Firebase ya configurada en el repositorio. Los mapas y la animación se ejecutan con recursos locales, sin un modelo IA externo.

La tableta muestra el mapa al dibujar, marcar y seleccionar, junto con una indicación breve, contador y herramientas en una barra inferior. Conserva el mapa al revisar cada nivel y durante el análisis, y presenta una bienvenida breve. Al finalizar muestra el mapa con todas las zonas correctas de la demo, los contornos de las selecciones con MAIIA y los marcadores originales sin ayuda; las selecciones incorrectas tienen contorno rosa discontinuo. Incluye leyenda ES/EN y botones para reiniciar o volver al menú. La TV muestra las explicaciones completas, la animación de análisis y la comparación de puntuaciones. El mapa inicial no tiene un recuadro azul superpuesto.

## Prueba local

Desde la raíz que contiene `package.json` y `server.js`, ejecutar `npm start`.

- Tableta: http://localhost:4173/index.html?station=7
- TV: http://localhost:4173/display.html?station=7
- Home: http://localhost:4173/index.html?station=7&projects=1
- Ruta conservada: `projects/07-csd-maiia/index.html?station=7`.

Para dispositivos distintos, sustituir localhost por la IP LAN que imprime el servidor, con el mismo puerto y station=7 en ambos. Deben estar en la misma red y tener acceso al servidor. Usar una sola tableta controladora por estación. La TV puede abrirse después de iniciar el juego.

1. Pulsar Información: la tableta conserva el menú; la TV presenta una única infografía.
2. Información y Minijuego están disponibles desde el inicio. No hay espera ni requisito de consultar primero la información.
3. Entrar al minijuego y pulsar Comenzar.
4. Dibujar el contorno directamente con el dedo, lápiz táctil o mouse, sin soltar durante el gesto. Al levantar el dedo o soltar el mouse, la zona se cierra automáticamente. Se pueden dibujar varias zonas. Deshacer elimina la última zona y Borrar limpia todas. El botón Cerrar zona ya no es necesario. Un toque o un trazo demasiado pequeño no crea una zona; un gesto cancelado se descarta.
5. Revisar la coincidencia y continuar. En el mapa lejano, colocar hasta cinco marcadores; tocar un marcador lo elimina. Al revisar la fase sin IA, ambas pantallas muestran solo los marcadores del visitante y el resultado general, sin revelar las zonas correctas. Las vistas previas tampoco anticipan las respuestas del mapa difícil.
6. Revisar el resultado sin IA y continuar a la pantalla «Activa MAIIA». El escaneo no comienza hasta pulsar Activar MAIIA en la tableta. Ambas pantallas muestran entonces que MAIIA está activa y escaneando. Tras cuatro segundos de análisis simulado, seleccionar/deseleccionar las sugerencias y revisar.
7. Comparar resultados. Volver a jugar limpia la partida y conserva el idioma. Volver al menú mantiene ambas opciones disponibles. Home abre el menú general.

Home usa un enlace nativo al menú general y conserva la estación y el código de sala. No espera a que terminen los envíos pendientes. Volver al menú está disponible durante el juego y al consultar Información. Los reintentos de sincronización continúan en segundo plano, sin un aviso superpuesto sobre la experiencia.

La duración orientativa es 60 segundos, sin corte forzoso. ES/EN está disponible durante todo el recorrido. Como alternativa accesible, el mapa admite flechas + Enter para colocar puntos con teclado y Espacio para cerrar la zona; Tab + Enter/Espacio selecciona candidatos o elimina marcadores. Pantalla completa usa la API nativa del navegador.

## Inventario de recursos

| Recurso | Estado y uso |
| --- | --- |
| ZIP MAIIA | Diez mockups conceptuales y LEEME.txt, extraídos en references/maiia/. Solo son referencias de diseño. |
| Manual de marca BID | Revisado visualmente: azul #005CFF (p.37), Inter (p.62), iconografía de línea (pp.94–103). Sin degradado naranja/azul. Contacto y páginas revisadas en references/maiia/. |
| Inter variable | Copia del recurso local de RegLAC en assets/fonts/Inter.ttf; no requiere Google Fonts. |
| Logo BID | Copia del archivo existente projects/06-reglac/assets/bid-logo.png. Pendiente validación final de marca y versión por el cliente. |
| Mapa satelital simulado | Reutiliza assets/img/predicttodo/PredictToDo_Mapa_Satelital_Simulado.png. Ilustración existente de demo, no mapa validado de MAIIA. |
| Mapa cercano | Recorte SVG de la imagen anterior, configurado en JSON. No contiene controles incorporados en la imagen. |
| Mapa difícil | Exactamente la misma imagen, recorte y referencias en las fases sin/con ayuda. |
| Polígonos | Dos cercanos y cinco lejanos, inventados para la demo; no clasifican asentamientos reales. |
| Candidatos IA | Cinco asociados a las referencias y dos falsos positivos, declarados en JSON. |
| Iconos y análisis | SVG/CSS locales y funcionales; no se ejecuta un modelo IA. |
| Material faltante | Imágenes autorizadas, polígonos etiquetados/validados, candidatos aprobados y revisión final de contenidos y marca. No se aportaron estadísticas de precisión reales. |

La advertencia bilingüe de simulación aparece en todas las pantallas. Los porcentajes describen la interacción con estos datos demostrativos, nunca la precisión operativa de MAIIA.

## Datos y puntuación

`data/demo-maps.json` contiene imagen, recortes, polígonos normalizados, identificadores, candidatos, límites y tiempos. Para sustituirlos por datos autorizados, cambiar el archivo manteniendo su esquema y reiniciar el servidor. Un candidato referencia un ID existente o incluye un polígono propio con referenceId: null.

- Coordenadas [x,y] entre 0 y 1 respecto al mapa visible. crop es [x,y,ancho,alto] respecto a la imagen completa. Imagen y capas comparten SVG; se invierte su matriz al tocar el mapa.
- El trazo libre se representa localmente sin reemplazar el SVG durante el gesto, conservando la captura del puntero. La TV recibe avances a un máximo de 10 actualizaciones por segundo. Se simplifica el contorno a un máximo de 40 vértices para conservar el contrato de sincronización y puntuación existente. La salida del borde se limita al mapa; cancelar el gesto, abandonar la página o perder el foco descarta el trazo pendiente.
- Nivel fácil: intersección sobre unión aproximada por malla de 256 × 144 celdas. Se compara la unión de los polígonos, evitando contar dos veces las superposiciones. Los trazados autointersectados usan la regla par/impar.
- Nivel difícil: cada zona correcta suma como máximo un acierto. Un marcador fuera de referencia o repetido cuenta como error. Con ayuda, un candidato falso cuenta como error.
- Ambas fases difíciles usan puntuación = máx. (0, aciertos − errores) / 5 × 100, redondeada. La fórmula aparece en resultados. Aciertos y errores se muestran por separado. Seleccionar todas las sugerencias da 5 aciertos, 2 errores y 60 puntos, evitando premiarlo con 100.
- Los mensajes comparan las puntuaciones y contemplan mejora, empate y descenso. No se fuerza una mejora.

## Archivos

| Archivo | Función |
| --- | --- |
| index.html | Carga recursos específicos y reutiliza shared/project-page.js. |
| module.js | Controlador, navegación, eventos táctiles/teclado, publicación y plazos. |
| experience.js | Vistas HTML/SVG y textos ES/EN. TV sin controles activos. |
| module.css | Diseño aislado con prefijo mai-, responsive y movimiento reducido. |
| state.js | Estado, geometría, puntuación y sanitización para navegador/servidor. |
| data/demo-maps.json | Datos reemplazables de demostración. |
| assets/ | Inter y copia del logo existente. |
| verify.cjs, visual-audit.cjs | Pruebas funcionales y de composición. |
| verify-hosting.cjs | Recorrido de hosting público con respuestas Firebase aisladas, sin alterar sesiones reales. |
| verification/ | Informes JSON y capturas de evidencia. |

Cambios compartidos mínimos:

- shared/home.js: acceso directo a estación 7, con projects=1 para Home.
- shared/sync.js: reconoce estación 7 y corrige su reloj con la hora del servidor.
- server.js: agrega estado independiente y valida/recalcula datos de MAIIA.
- display.html: carga el módulo y CSS.
- shared/display.js: delega la representación de MAIIA.

No se cambia el orden ni la numeración de shared/projects.js, ni los archivos de los proyectos 01–06. Se reutilizan cola de escrituras, caché, consulta y polling compartidos. La tableta es la única que inicia y avanza analysisAt; unlockAt permanece en cero por compatibilidad con sesiones anteriores; la TV no contiene temporizadores de avance. Recargar recupera la sesión del servidor. Reiniciar el proceso del servidor comienza otra sesión (estado en memoria).

## Verificación

Playwright con Microsoft Edge headless, tacto emulado, contextos separados de tableta/TV y reloj de TV adelantado cinco minutos. Auditoría de 180 combinaciones: tabletas 800 × 600, 1024 × 768, 1180 × 820 y 1920 × 1200; vistas verticales/ventanas lado a lado de 768 × 1024, 764 × 830 y 955 × 1038; TV 1280 × 720 y 1920 × 1080. Comprueba altura real del mapa y separación de herramientas. El recorrido funcional dibuja mediante gestos táctiles y mouse, comprueba la vista previa en TV durante el movimiento, cierre automático, cancelación, límites del mapa, Deshacer/Borrar y alternativa de teclado. También dibuja en 764 × 830 y comprueba la alineación tras redimensionar. Estas pruebas no sustituyen la aceptación en el hardware físico de exposición.

Los scripts requieren Playwright instalado fuera del proyecto; no agregan dependencias de ejecución. Ejemplo PowerShell:

```powershell
$env:NODE_PATH='C:\ruta\qa\node_modules'
$env:TEST_URL='http://localhost:4173'
$env:BROWSER_CHANNEL='msedge'
node projects/07-csd-maiia/verify.cjs
node projects/07-csd-maiia/visual-audit.cjs
node projects/07-csd-maiia/verify-hosting.cjs
node projects/07-csd-maiia/verify-navigation.cjs
node --test tests/*.test.js
```

verification/report.json documenta recorrido real, validaciones, sincronización, puntuación, restauración, reinicios, idiomas, fullscreen y aislamiento de estaciones. verification/visual-audit.json registra desbordamientos y solapamientos. verification/hosting-report.json verifica el transporte público Firebase, incluido un reloj de TV adelantado cinco minutos. También pasan las 13 pruebas del repositorio, que incluyen las comprobaciones de Firebase.
