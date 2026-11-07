# PredictToDo · Centro de control

La tableta conserva los cuatro casos, roles, acciones, puntajes y la navegación libre. La guía tiene tres pasos: **elige un caso → prueba una acción → mira el resultado**. Los cuatro casos se muestran juntos; no es necesario completar los cuatro. Desde el primer resultado se puede repetir, cambiar de caso, terminar o regresar al menú.

La tableta controla la experiencia. El TV comparte mapa, hora, caso, acción, indicadores y resultados. También sigue el centro y zoom al ampliar o arrastrar el mapa, y refleja la apertura y cierre de los avisos viales. El mapa se conserva entre cambios de estado. Las actualizaciones que solo cambian cámara o aviso no reconstruyen ni separan del DOM el lienzo WebGL del TV. La TV usa MapLibre sin interacción: durante el juego no muestra selectores de casos ni tarjetas de acciones. Su panel presenta el caso activo, la medida seleccionada, los indicadores de la vía y un insight. Las elecciones se hacen solo en la tableta.

`view-state.js` valida los campos opcionales `mapView` y `mapPopup` en cliente y servidor. La cámara incluye centro, zoom, tamaño del lienzo de origen e identificador del caso; el aviso solo acepta corredores de ese caso y coordenadas finitas, sin HTML. Los eventos de cámara se publican cada 80 ms durante el movimiento y al finalizar. El TV aplica la vista sin enviar eventos de vuelta. Al cambiar de caso se limpian cámara y aviso para encuadrar la nueva zona. Al desaparecer todos los puntos críticos se cierra un aviso de atasco abierto. El transporte HTTP/Firebase existente sigue aislando las estaciones.


Los espacios disponibles contienen un insight contextual con fondo azul oscuro, acento turquesa y un icono de red que cambia por pantalla, rol, caso y acción. En la decisión explica qué permite cada herramienta; en el resultado utiliza la lección del caso. Los textos se basan en el contenido educativo ya disponible y no cambian puntajes ni efectos. El aviso inferior de la TV tiene forma de cápsula, extremos semicirculares, icono circular, borde blanco y sombra azul. Ocupa su propio espacio fuera del mapa y del panel.

La entrada de la tableta mantiene cuatro títulos breves y el botón «Elegir mi rol». Solo la entrada del TV desarrolla las cuatro instrucciones: explorar las vías y la hora, elegir un caso y una medida, obtener puntos y consultar resultados. El texto permite terminar después de un caso o repetir; no exige completar los cuatro. La TV conserva el insight y el aviso en cápsula, sin botones de avance simulados en esta pantalla. Revisión visual ES/EN a 1920×1080 y 1280×720, en `artifacts/predicttodo-tv-instructions/`.

La exploración horaria sigue siempre visible: reloj grande, gráfica diaria, marcadores de eventos y reproducción lenta, normal o rápida. Al usar un caso se restablece su hora (16:40, 17:15, 19:55 o 22:15). Después de una decisión, «Ver resultados» permite consultar el resumen y volver al mapa.

Explorar incluye la ficha de una vía y el ranking de congestión. Se pueden tocar las calles originales o elegirlas en la lista: dos corredores para Ciudad de Cali, cuatro para El Campín y tres para Calle 100. La selección se sincroniza mediante `selectedCorridor`, validado por caso en `server.js`. Los puntos críticos son círculos sin números con avisos táctiles. En TV se compacta la exploración según la altura disponible: la vía seleccionada y su ficha permanecen visibles; el ranking adicional se omite a 720 px de alto para dar espacio al insight.

Los indicadores siguen siendo una simulación educativa. No se ejecuta un modelo de IA operativo ni se reciben pronósticos o tráfico en vivo. La sincronización HTTP/Firebase y el aislamiento entre estaciones se conservan.

## Infografía de Información

La imagen activa es `assets/PredicToDo_Infographic_1920x1080.png`, suministrada por el usuario, a 1920×1080. `../../shared/bogota-traffic.js` apunta a ese archivo tanto para ES como para EN. El PNG proporcionado contiene texto en inglés; no se modifica su contenido ni se genera una traducción gráfica. Controles, CTA y explicaciones siguen siendo bilingües. Se conserva la precarga existente, `object-fit: contain` y el CTA fuera de la imagen. El nuevo archivo ya incluye su marca y no recibe otro logotipo superpuesto.

## Referencias de diseño

- [Pulso vial Bogotá](https://exquisite-swan-4f6a1a.netlify.app/): separación Explorar/Decidir, reloj y decisiones con efectos visibles.
- `DigitalMornings 4.pptx`, diapositivas 6–9: relación entre red vial, tiempo, congestión y velocidad. Diapositiva 11: mapa oscuro y centro de control.
- La presentación se usa como contexto visual y funcional, sin importar su video ni reproducir sus datos operativos.

## Geometría real y datos simulados

El mapa principal utiliza las calles originales de las teselas vectoriales de OpenFreeMap/OpenMapTiles, basadas en OpenStreetMap. `native-map.js` cambia **solo el color de las capas viales del mapa base**. No agrega rutas, polilíneas duplicadas, bordes de navegación ni banderas de destino. La congestión simulada se extiende por la malla real de calles cercanas al evento, con variación según clase vial y distancia. Los corredores principales conservan su valor específico; los demás colores representan el contexto ilustrativo de la zona. Las calles externas conservan el color base. La geometría y los nombres son reales; los valores de tráfico son simulados. `map-style.json` conserva trazos finos y ferrocarril tenue.

La franja horaria de la tableta ocupa menos de 160 px en las resoluciones revisadas y el mapa gana altura. El TV muestra un reloj sobre el mapa, sin duplicar el reproductor ni la barra de tiempo. El TV replica el lienzo de origen a escala, conservando la misma zona geográfica aunque sus dimensiones sean distintas. Se actualiza la escala al redimensionar cualquiera de las pantallas y se reactiva el repintado al recuperar el foco.


`streets.geojson` contiene además 3.643 geometrías viales extraídas el 5 de noviembre de 2026 de la API pública de OpenStreetMap. Conserva los identificadores y las coordenadas de las vías. Se utiliza para colocar los puntos críticos y como mapa local de respaldo.

Fuentes, en formato `oeste,sur,este,norte`:

- `https://api.openstreetmap.org/api/0.6/map?bbox=-74.17,4.62,-74.15,4.66`
- `https://api.openstreetmap.org/api/0.6/map?bbox=-74.088,4.635,-74.072,4.658`
- `https://api.openstreetmap.org/api/0.6/map?bbox=-74.107,4.643,-74.093,4.666`
- `https://api.openstreetmap.org/api/0.6/map?bbox=-74.065,4.68,-74.04,4.695`

Los escenarios utilizan la Av. Ciudad de Cali (Avenida Carrera 86), la NQS (Avenida Carrera 30), las calles 53 y 63, la Av. 68 y la Calle 100 con sus corredores cercanos. La selección utiliza los nombres documentados por OSM. Los dos eventos de El Campín comparten red vial y tienen condiciones simuladas distintas.

Los porcentajes, velocidades, puntos críticos y efectos proceden de `GAME_DATA.json`. Son una simulación educativa; no se consultan predicciones reales de PredictToDo ni tráfico en vivo. Los puntos críticos se colocan sobre las vías del evento y se separan visualmente para evitar que dos marcadores se oculten entre sí.

## Visualización y licencia

MapLibre GL JS 5.6.2 y su CSS se distribuyen localmente en `vendor/`. `map-style.json` adapta el estilo oscuro de OpenFreeMap a tonos azul grisáceo. El servicio de teselas y los nombres detallados requieren Internet. Si las teselas no cargan, MapLibre usa las calles OSM guardadas localmente como su mapa base; la tableta sigue permitiendo zoom y desplazamiento. Mientras carga, o si WebGL no está disponible, se muestra un SVG local de las mismas geometrías. Al cambiar de caso se conserva ese respaldo hasta que las calles de la nueva zona estén dibujadas.

- Estilo de origen: <https://tiles.openfreemap.org/styles/dark>
- Documentación: <https://openfreemap.org/quick_start/>
- Motor: <https://maplibre.org/maplibre-gl-js/docs/>
- Los avisos de licencia del motor y del estilo se conservan en `vendor/`.

Datos: © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). La atribución de OpenFreeMap/OpenMapTiles/OSM se conserva en el mapa. No se necesita una clave de Google Maps. La reproducción del día usa pasos de una hora compatibles con el estado existente; no representa la resolución operativa del modelo real. Esta integración no utiliza las teselas privadas ni las predicciones operativas mostradas en la presentación.

## Archivos de esta revisión

- `control-center.js` / `control-center.css`: guía de tres pasos, explicación de la IA en TV y mapa exclusivo de la tableta.
- `exploration.js`: corredores por caso, fichas, comparación ilustrativa, ranking y gráficas. `module.js` gestiona la selección y las velocidades de reproducción.
- `pulse-vial.js`, `insights.js` / `insights.css`: entrada abreviada, resultados personales en tableta y cierre educativo de la TV.
- `native-map.js`, `map-style.json`: calles originales con trazos más finos y ferrocarril tenue; el respaldo local utiliza también trazos finos.
- `module.js`: publica cámara/avisos sin reconstruir el mapa local; conserva la hora del caso al entrar a decidir.
- `view-state.js` y `../../server.js`: validación de los campos de cámara y avisos.
- `../../tests/predicttodo-view-state.test.js`: cámaras, coordenadas finitas, avisos de corredores válidos y aislamiento por caso.
- `index.html` y `../../display.html`: cargan el mapa y actualizan las versiones de los recursos.
- `../../shared/bogota-traffic.js` y `assets/PredicToDo_Infographic_1920x1080.png`: nueva imagen de información.
- `../../tests/predicttodo-control.test.js`: navegación libre, confirmación, explicación de IA sin iniciar un mapa en la TV y pintura nativa sin alterar geometría.
- `../../tests/smoke.test.js`: referencia y resolución de la nueva infografía.

## Comprobación local

40/40 pruebas generales aprobadas. La revisión de navegador incluye zoom con botón y arrastre real por eventos de puntero, cámara compartida, avisos sincronizados, cambio de los cuatro casos y limpieza del aviso al cambiar de zona. Revisión en navegador de sincronización del mapa/caso/acción/indicadores, conservación de la instancia del mapa, controles de TV desactivados, insights contextuales y aviso en cápsula. Tableta y TV revisadas en ES/EN, a 1920×1080 y 1280×720. Los estados de las estaciones 1, 2 y 3 se conservan durante la prueba en la estación 9. Capturas en `artifacts/predicttodo-live-map/`.


Sin push ni despliegue a Netlify.

Revisión actual en `http://localhost:4176`: la revisión automática rechazó reiniciar el servidor anterior en 4173, por lo que se abrió otro puerto sin interrumpir sus estaciones. La prueba de navegador comprueba también la selección por un toque real sobre una vía vectorial, los avisos sin números, el espejo de rol/nombre y la sincronización de la vía seleccionada.


## Corrección del 7 de noviembre

Los insights aparecen exclusivamente en la TV. La tableta no genera esas tarjetas en ninguna fase (inicio, rol, exploración, decisión, resultado ni resumen); conserva sus controles, indicadores y navegación. La TV mantiene el diseño y contenido de los insights existentes.

La ficha lateral de la vía seleccionada (congestión, velocidad, comparación a 30 minutos y gráfica) también se muestra únicamente en el TV. En la tableta se conserva el ranking de vías como control de selección y enfoque, sin duplicar esa ficha ni el encabezado «Explorar».

En 4176 se revisó el espejo del mapa con tableta a 1024×768, 1280×720 y 1920×1080 frente a TV a 1920×1080. La prueba compara los límites geográficos completos y comprueba que zoom/desplazamiento no separan el lienzo WebGL del DOM. Las cuatro vías de El Campín (NQS, calles 53/63 y Av. 68) se probaron individualmente: cada botón del ranking centra su propia geometría real y abre una ficha sincronizada. Los corredores principales se colorean incluso cuando parte de su recorrido queda fuera del radio del evento.

La TV recupera el título original «Pulso vial Bogotá» y los títulos/descripciones de `GAME_DATA.json`. El CTA mantiene una sola superficie azul, sin borde exterior ni sombra gruesa. Se revisaron las pantallas ES/EN a 1280×720 y 1920×1080. Evidencia en `artifacts/predicttodo-corridor-focus/`.
