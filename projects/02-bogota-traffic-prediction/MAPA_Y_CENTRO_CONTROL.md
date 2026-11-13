# PredictToDo · Centro de control

La tableta conserva los cuatro casos, roles, acciones, puntajes y la navegación libre. La guía tiene tres pasos: **elige un caso → prueba una acción → mira el resultado**. Los cuatro casos se muestran juntos; no es necesario completar los cuatro. Desde el primer resultado se puede repetir, cambiar de caso, terminar o regresar al menú.

La tableta controla la experiencia. El TV comparte mapa, hora, caso, acción, indicadores y resultados. También sigue el centro y zoom al ampliar o arrastrar el mapa, y refleja la apertura y cierre de los avisos viales. El mapa se conserva entre cambios de estado. Las actualizaciones que solo cambian cámara o aviso no reconstruyen ni separan del DOM el lienzo WebGL del TV. La TV usa MapLibre sin interacción: durante el juego no muestra selectores de casos ni tarjetas de acciones. Su panel presenta el caso activo, la medida seleccionada, los indicadores de la vía y un insight. Las elecciones se hacen solo en la tableta.

`view-state.js` valida los campos opcionales `mapView` y `mapPopup` en cliente y servidor. La cámara incluye centro, zoom, tamaño del lienzo de origen e identificador del caso; el aviso solo acepta corredores de ese caso y coordenadas finitas, sin HTML. Los eventos de cámara se publican cada 80 ms durante el movimiento y al finalizar. El TV aplica la vista sin enviar eventos de vuelta. Al cambiar de caso se limpian cámara y aviso para encuadrar la nueva zona. Al desaparecer todos los puntos críticos se cierra un aviso de atasco abierto. El transporte HTTP/Firebase existente sigue aislando las estaciones.


Los espacios disponibles contienen un insight contextual con fondo azul oscuro, acento turquesa y un icono de red que cambia por pantalla, rol, caso y acción. En la decisión explica qué permite cada herramienta; en el resultado utiliza la lección del caso. Los textos se basan en el contenido educativo ya disponible y no cambian puntajes ni efectos. El aviso inferior de la TV tiene forma de cápsula, extremos semicirculares, icono circular, borde blanco y sombra azul. Ocupa su propio espacio fuera del mapa y del panel.

La entrada de la tableta mantiene cuatro títulos breves y el botón «Elegir mi rol». Solo la entrada del TV desarrolla las cuatro instrucciones: explorar las vías y la hora, elegir un caso y una medida, obtener puntos y consultar resultados. El texto permite terminar después de un caso o repetir; no exige completar los cuatro. La TV conserva el insight y el aviso en cápsula, sin botones de avance simulados en esta pantalla. Revisión visual ES/EN a 1920×1080 y 1280×720, en `artifacts/predicttodo-tv-instructions/`.

La exploración horaria sigue siempre visible: reloj grande, gráfica diaria, marcadores de eventos y reproducción lenta, normal o rápida. Al usar un caso se restablece su hora (16:40, 17:15, 19:55 o 22:15). Después de una decisión, «Ver resultados» permite consultar el resumen y volver al mapa.

Explorar incluye la ficha de una vía y el ranking de congestión. Se pueden tocar las calles originales o elegirlas en la lista: dos corredores para Ciudad de Cali, cuatro para El Campín y tres para Calle 100. La selección se sincroniza mediante `selectedCorridor`, validado por caso en `server.js`. Los puntos críticos son círculos sin números con avisos táctiles. En TV se compacta la exploración según la altura disponible: la vía seleccionada y su ficha permanecen visibles; el ranking adicional se omite a 720 px de alto para dar espacio al insight.

Los indicadores siguen siendo una simulación educativa. No se ejecuta un modelo de IA operativo ni se reciben pronósticos o tráfico en vivo. La sincronización HTTP/Firebase y el aislamiento entre estaciones se conservan.

## Reparto tableta / TV (9 de noviembre)

La tableta controla; la TV cuenta la historia. Diagnóstico aplicado: los datos
verificados del proyecto (12 h, 15 min, 139.000+ tramos, 20 TB, 153 h/año,
3 de cada 4, transferencia a la Secretaría) solo se veían en el diálogo
«Sobre PredictToDo» de la tableta; la TV calcaba la grilla de roles y el campo
de nombre; el cierre mostraba botones deshabilitados; bajo el mapa la TV decía
«Toca un punto rojo…»; y el resultado no comparaba las medidas.

- `insights.js` conserva `facts` como única fuente y expone `story(block, idioma)`
  con los bloques `stats` (12 h · 15 min · 139.000+ · 20 TB) e `impact`. El diálogo
  de datos de la tableta se eliminó (`attachFacts`); la tableta queda solo con controles.
- `icons.js` (nuevo): íconos de silueta minimalista (trazo único, 24×24, `currentColor`)
  para casos, acciones, roles y pasos. `GAME_DATA.json` conserva sus emojis como
  identificadores; en pantalla nunca se muestran (las pruebas lo verifican).
- TV · Inicio (`pulse-vial.js`): guía mínima en cuatro tarjetas (ícono, título y una
  frase corta) bajo el título, sin datos ni insight. Las cifras fuertes del proyecto se
  reservan para el cierre. Sin píldoras «Menú»/«Volver».
- TV · Rol: una sola columna centrada de arriba abajo (título, rol elegido, cuatro fichas, dato clave horizontal). Rol seleccionado en grande (ícono, nombre, cargo, nombre escrito como chip),
  los cuatro roles como fichas compactas (`data-role-mirror`) y un único insight con la
  mirada del rol. Sin campo de texto.
- Insights en color de marca: tarjeta azul `#005cff` con texto blanco e ícono en círculo
  blanco; dentro del héroe azul de resultados pasa a blanco. Se retiraron el degradado
  oscuro y el acento turquesa.
- Panel a la izquierda y mapa a la derecha en tableta y TV (`render()` y las reglas
  `.cc-layout`): lo primero que se lee es el panel; el mapa ocupa la columna ancha.
- TV · Explorar/Decidir/Resultado (`control-center.js`): sin «Indicadores del caso» ni
  franja «Cómo funciona» (ya están en la tableta); esa altura la toma el mapa. El antes →
  después se muestra compacto dentro de «Medida seleccionada» (`cc-tv-delta`). En
  Resultado la ficha de vía se sustituye por «Cómo puntuaba cada medida en este caso»
  (puntajes de `GAME_DATA.json` con el bono del rol, medida elegida resaltada).
- Espejo nítido: la TV ya no escala con CSS el lienzo del tamaño de la tableta (eso
  desenfocaba y dejaba franjas). Renderiza a su propia resolución y reproduce el encuadre
  con la cámara: mismo centro y `zoom + log2(min(anchoTV/anchoTableta, altoTV/altoTableta))`
  (`mirrorZoom` en `native-map.js`). El eje limitante coincide con la tableta y el otro
  muestra un poco más de ciudad; el mapa llena todo el marco. `validate.cjs` comprueba
  centro igual, encuadre de la tableta contenido, eje limitante igual y sin `transform`.
  La columna del mapa en la TV pasa a `minmax(340px,1fr) minmax(0,2.6fr)`.
- Panel de la TV al mínimo (`displayContext`): kicker de una palabra, caso, y según la fase:
  Explorar → ficha «Vía» con *Ahora* / *En 30 min* y la gráfica; Decidir → «Medida elegida»
  con congestión y puntos críticos antes → después; Resultado → medida, puntaje, comparación
  de medidas. Sin párrafo del caso, sin velocidad ni notas al pie (el aviso «tráfico simulado»
  queda en el pie de pantalla).
- Menos saturación (10 de noviembre): en el mapa solo las clases viales principales toman
  color de tráfico (las calles menores conservan el gris base, `trafficPaint`); los nombres
  de POI se limitan a estadios y aeropuertos y los barrios aparecen desde zoom 15
  (`map-style.json`). La tableta pierde la píldora «Bogotá, Colombia», la línea «Toca un
  punto rojo…», el subtítulo de la barra horaria y la curva de la gráfica (quedan los
  marcadores de casos); el aviso del mapa pierde la nota «no es tráfico en vivo».
- Reloj continuo (10 de noviembre): la hora avanza en cuartos (`step="0.25"`, la resolución de
  15 min de PredictToDo). `server.js` acepta números finitos 0–23 y los redondea al cuarto
  (antes exigía enteros; el servidor local se reinició con `artifacts/predicttodo-stage-split/
  restart-server.cjs`, que guarda y restaura las 11 estaciones). `state()` interpola entre
  horas enteras, así las horas enteras conservan sus valores y los cuartos no saltan.
  `clock(hour,item)` formatea «15:15» y respeta la hora publicada del caso («16:40»).
  La reproducción del día corre cada 100 ms por la ruta ligera (`applyHour` → `update()`),
  publica cada cuarto y la TV usa una ruta rápida (`renderInto`, solo cambió la hora) que
  refresca reloj, tinte, cifras del panel y pintura sin reconstruir el mapa.
- Día y noche: `night(hour)` fija `--cc-night` en el marco; una capa `.cc-map-sky` dentro del
  lienzo (bajo avisos y marcadores) oscurece suavemente sin tocar los colores del tráfico; sol
  o luna junto a cada reloj (`skyMark`). La barra horaria se rediseñó: una fila de controles,
  marcadores de casos sobre una franja amanecer→noche y deslizador continuo.
- Barra horaria ordenada: título · velocidad (segmentado) · «Reproducir el día» · reloj con
  sol/luna; los casos son puntos (`.cc-case-dot`, el actual en azul) sobre la franja. El área de
  la gráfica se corrigió (arrancaba con un segundo `M` y se rellenaba en diagonal). En Decidir,
  la tarjeta de medida de la TV y las tarjetas de acción de la tableta crecen para llenar la
  columna; en Resultado lo hacen la comparación (TV) y el puntaje (tableta).
- Copies tomados del prototipo del cliente (`index (1).html`): las acciones y sus descripciones
  salen directamente de `GAME_DATA.json` («Ajustar semáforo», «Habilitar carril reversible»,
  «Enviar agentes de tránsito», «No hacer nada»); Decidir titula «¿Qué medida considerarías?»;
  Resultado titula «¡Buena elección!» (≥85) o «Decisión con oportunidades», con la
  «Comparación de alternativas» y el botón «Probar otra opción». En la tableta los botones
  exploratorios («Probar otra opción», «Cambiar de caso») van primero y «Ver resultados» al final
  como secundario. En la TV, Resultado se reduce a medida + puntaje, comparación y lección (sin
  el antes → después, que queda en Decidir).
- Avisos del mapa con etiquetas: «Vía seleccionada / Punto crítico», nombre, y tres filas
  Congestión · Velocidad · En 30 min.
- Ficha de vía en la TV (Explorar): se estira hasta el insight, con gráfica grande, punto
  pulsante en la hora actual y marcas 06/12/18/23.
- Insight en negro `#141414` con ícono de bombillo (`bulb`), kicker «DATO CLAVE»; títulos y
  líneas reescritos por caso y por medida (ES/EN).
- Insights en una sola frase corta por caso y por medida (`control-center.js`,
  `insight()`); la lección del Resultado se mantiene completa.
- `module.js`: `?idle=<minutos>` ajusta la inactividad y `?idle=0` la desactiva mientras
  se revisa; por defecto 4 minutos.
- La gráfica de la vía en la TV se anima con suavidad: un trazo discontinuo recorre la
  curva del día (`.cc-chart-flow`, 3,2 s) y la marca de la hora pulsa; se desactiva con
  `prefers-reduced-motion`. En la tableta la gráfica permanece estática.
- Tableta · guía de entrada (`control-center.js` → `guide()`, estilo del popup de Smart
  Borders): al pulsar «Empezar turno» aparece una vez por visitante «Cómo usar el panel»
  con tres pasos de una línea (Elige un caso · Explora · Decide) y la nota «Lo que hagas aquí
  se ve en la pantalla grande». Es UI local de la tableta: no viaja en el estado ni llega a la
  TV. El cronómetro del ranking arranca al cerrarla. Se cierra con «Empezar», la X o tocando
  fuera. Se eliminó el CSS muerto del antiguo layout «teaching» de la TV, que chocaba con ella.
- Tableta · panel simplificado: sin cajas de instrucción en Explorar y Resultado, tarjetas
  de caso sin «Disponible» ni flecha, guía de barras en una línea, botón «Tomar una
  decisión» a todo el ancho. Indicadores, mapa, barra horaria y ayudas táctiles se conservan.
- TV · Cierre: resultados del visitante + casos jugados + bloque azul «PredictToDo en
  Bogotá» con las cuatro cifras (12 h, 15 min, 139.000+ tramos, 20 TB) e insight. Sin
  botones; el aviso inferior indica «Continuar» en la tableta.
- Tableta (`module.js`): inactividad de 4 minutos sin toque/teclado en modo juego o
  información → vuelve a la portada y la TV la sigue. Cualquier cambio de estado,
  incluida la reproducción del día, reinicia el temporizador.

No cambian GAME_DATA, puntajes, mapa, cámara, avisos, ranking ni QR. Capturas ES/EN a
1920×1080 y TV a 1280×720 en `artifacts/predicttodo-stage-split/` (`phases.cjs`
recorre todas las fases en la estación 9 y restaura su estado). Trabajo local, sin push.

## TV del juego según Figma 774:52199 (12 de noviembre)

El frame «Frame 4» de *BID-AI-Exhibition-hall* ajusta el marco de la TV en Explorar/Decidir/Resultado.
Se aplica a las tres fases de la TV (`.cc-app.cc-observer`, bloque final de `control-center.css`); la tableta no cambia.

- Barra superior de 126 px, igual a las demás pantallas de la TV (logo 216×44, divisor de 2 px, título 25,5 px,
  subtítulo 22,7 px). Se conserva el indicador ES/EN a la derecha.
- Sin el título «Pulso vial Bogotá» de la página: el panel (491) y el mapa (1319) empiezan 54 px bajo la barra.
- Pasos sobre fondo `#cfe1ff`: hecho en gris `#95979c` con su número (sin ✓), actual en `#005cff`, siguiente en blanco.
- Panel blanco con borde de 2 px `#cfe1ff`. El kicker («EXPLORANDO»…) va sobre el título del caso, alineado con él;
  ícono de 58 px en mosaico `#cfe1ff`; título 30 px. Se quitó la línea «lugar · hora» (la hora ya está en el reloj del mapa).
  El nombre del lugar no se parte entre líneas (`.cc-nowrap`).
- Insight negro sin el anillo decorativo: kicker `#9ec1ff`, título 22 px, texto 15 px `#cfe1ff`.
- Leyenda en `#141414` y, en la misma fila a la derecha, la nota «Vías reales · Tráfico y resultados simulados…»
  (`.cc-map-note`). Se retiró la nota inferior izquierda.
- Se conserva el aviso «Controla desde la tableta»: en Figma está dentro del grupo del mapa con su máscara y queda
  recortado, pero su espacio (y 948–1020) sigue reservado.
- A 720–800 px de alto la barra pasa a 96 px y el panel se compacta; revisado sin desbordes a 1920×1080, 1280×720,
  1280×800 y 1024×768, ES/EN.

## Rebrand completo según Figma 177:22367 (12 de noviembre)

La página «05_PredictToDo» del archivo de Figma trae tableta y TV para toda la experiencia (en inglés; el español
sigue la misma composición). Se aplicó pantalla por pantalla adaptando el código existente; los bloques nuevos están al
final de `control-center.css`, `rebrand.css` y `completion.css`, con el nodo de Figma como referencia en el comentario.

- Barra superior: 126 px en todas las pantallas. La TV solo lleva la marca (sin chip de rol, hora, puntaje ni idioma).
  La tableta conserva el selector ES/EN y un único botón «Menú» con ícono de casa; «Volver» pasa al pie de cada panel.
- Títulos a dos tonos (`<span>` azul): «Bogotá **Traffic Pulse**», «Who will manage **the city today?**»,
  «Your **name**», «How to **use the panel**», «Case **indicators**», «Your shift **is recorded**»,
  «From experience **to action**», «Learn **more**» y sus equivalentes en español.
- Portada (`visual.js`, nodo 662:4545): deja de ser un PNG con zonas táctiles y pasa a HTML nativo: kicker
  «Bogotá Traffic Prediction», título «Predict**ToDo**», subtítulo y dos tarjetas con borde `#cfe1ff` («About the
  project» con la foto `predicttodoImages/portada-about.png` y «Interactive experience» con el contorno de Colombia
  `predicttodoImages/colombia-pin.svg`, ambos exportados de Figma). La TV muestra la misma portada sin controles.
- Tableta · Inicio (`pulse-vial.js`): sin subtítulo ni tarjetas; dos botones grandes «Back to menu» / «Choose my role →»
  y la nota «The instructions are on the screen». Las cuatro tarjetas de pasos quedan solo en la TV.
- Tableta · Rol: bloque de 1260 px, tarjetas de 2 px `#cfe1ff` (seleccionada en azul, sin relleno), íconos sin círculo,
  «Your **name**», botones Back (250) y Start shift (320). TV · Rol: kicker y título alineados a la izquierda.
- Tableta · Explorar/Decidir/Resultado (`control-center.js`): sin el título «Your control panel»; pasos sobre `#cfe1ff`;
  tarjetas de caso compactas (62 px) y ranking con filas bordeadas (seleccionadas en `#cfe1ff`); «2. Compare congestion
  across roads»; pie del panel con «Back» + «Make a decision» (o «Confirm action»). La columna del mapa es una sola
  tarjeta: cabecera «Case **indicators** · Without your action» con las tres cifras en línea y el mapa debajo
  (`.cc-map-card`); la leyenda lleva la nota a la derecha; la barra «3. Explore traffic throughout the day» es blanca
  (segmentado Slow/Normal/Fast, «Play the day», reloj con sol/luna). Decidir: tarjetas de acción con ícono en círculo
  `#edf4ff`, seleccionada en `#cfe1ff`; botón deshabilitado `#c7dbff`. Resultado: «Good choice!» + 100/100 centrados,
  «Try another option» y «Change case» en contorno, «View results →» primario a todo el ancho.
- TV: aviso inferior en cápsula de una línea (ícono de pantalla + texto, sin kicker ni flecha). Decidir: tarjeta
  «Chosen response» blanca con borde, cifras 40 px y el valor «después» en verde `#9bde54` cuando mejora. Resultado:
  título «Compare what the **different actions could do**» (ES: «Compara qué lograría **cada medida**»), tarjeta «Your response» blanca con barras azules; se
  conserva el insight (no está en Figma, pero es la lección del caso).
- Cierre: la tableta muestra «Your shift **is recorded**», una tarjeta con «100 / 400 points», tiempo y estado, y
  tres botones (Back to map · Play again · Back to menu →); la TV abre con el bloque azul «PredictToDo in Bogotá»,
  «Learn **more**» sobre los dos QR y el ranking a la derecha, sin kicker, subtítulo ni nota inferior.
- Guía de la tableta: título a dos tonos, X sobre círculo `#cfe1ff`, pie en `#cfe1ff`.
- Antes → después (tableta «Case indicators» y TV «Chosen response»): los dos valores tienen el mismo tamaño y su
  unidad a la misma proporción (0,5 em); el «antes» va en azul de marca y la flecha en gris. Solo el valor «después»
  cambia de color con la paleta semántica del manual BID: verde `#9BDE54` si mejora y rojo `#FC5D5D` si empeora;
  igual queda en azul. Mejora = menos congestión, más velocidad, menos puntos críticos (`trend()` en `control-center.js`,
  la misma regla para tableta y TV).
- No cambian GAME_DATA, puntajes, mapa, cámara, avisos, ranking, QR, sincronización ni temporizador de inactividad.
  Pruebas actualizadas: `predicttodo-control.test.js` (incluye una prueba que recorre todos los casos y medidas y
  comprueba el color del valor «después» en tableta y TV) (botón de resultados primario, título de Resultado en TV) y
  `smoke.test.js` (recursos de la portada nativa).

## Tercera pasada Figma (12 de noviembre)

- **Íconos originales de Figma** (`icons.js`, bloque `figma`): casos (auto, balón, salida, luna), acciones (semáforo,
  flechas, cono, ojo tachado), figuras de los roles de la tableta (mujer: Valentina y Camila; hombre: Santiago y Andrés),
  pasos de la TV de Inicio, la flecha antes → después (`#5C97FF`) y la pantalla del aviso. Se exportaron del archivo,
  se quitaron las máscaras e IDs y se recolorean con `currentColor`. La TV de Rol conserva sus marcas de trazo.
- **TV Inicio** (06-tv-inicio): bloque alineado a la izquierda de 1631 px, subtítulo en negro, títulos de tarjeta en
  azul, números 01–04 arriba a la derecha y cápsula de 62 px con el ícono de pantalla.
- **Tableta**: tarjetas de caso sin círculo (ícono a 19 px, texto a 61 px); tarjetas de rol con la figura 32×50;
  indicadores a 39 px con unidad de 19 px y título «Case indicators» de 24 px; columnas según su contenido.
- **TV Explorar/Decidir** (Frames 1 y 5): 88 px bajo la barra, ficha de vía blanca con franja del color de la vía,
  38 px entre título y tarjeta, 35 px hasta el insight; en Decidir, etiquetas `#5C97FF`, cifras de 38 px con la
  unidad a tamaño completo y la flecha de Figma.
- **TV Resultado** (Frame 6): sin insight; la tarjeta de comparación conserva el tamaño de las otras fases.
- **Sin pantalla de resumen**: «Ver resultados» lleva directo al ranking + QR y guarda el resultado
  (`module.js`, `finish-session`). `finalScreen` sigue en `pulse-vial.js` solo por compatibilidad con estados guardados.
- **TV Cierre** (Frame 7 v2): un solo QR (GitHub · Code4Dev) en tarjeta horizontal bajo «Learn more», bloque azul con
  las cuatro cifras y ranking a la derecha; puntos sin «/400» en las filas y fila del visitante como en Figma.

## Menú principal en PNG, barra con solo Home y solo inglés (13 de noviembre)

Reemplaza lo descrito arriba sobre la portada nativa, el selector ES/EN y el botón «Menú».

- Portada de la tableta (`visual.js`): es el arte entregado `menuprincipal2.png` (1920×1080, inglés), guardado como
  `predicttodoImages/menu-principal-en.png`, con zonas táctiles sobre «About the project», «Interactive experience» y
  la píldora Home. Mientras la TV muestra la infografía aparece «Back» junto a Home (misma píldora). El PNG traía
  «Bogotá Traffic ediction»: solo esa línea se volvió a dibujar con Inter (`assets/fonts/Inter.ttf`, 41,3 px, corte de
  texto) para que diga «Bogotá Traffic Prediction»; el resto del archivo es idéntico píxel a píxel al entregado.
- Portada de la TV: `predicttodoImages/menu-principal-tv.png`, el mismo arte sin la píldora Home (la TV no tiene controles).
- El arte se dibuja en dos bandas de la misma imagen (`.ptd-menu-band` en `rebrand.css`): la barra (126 px) queda arriba
  y el cuerpo (954 px) se centra en el espacio restante, así 16:10 y 4:3 no dejan una franja blanca solo abajo. A
  1920×1080 la pantalla coincide con el PNG sin un píxel de diferencia.
- Barra de todas las pantallas del juego (`pulse-vial.js`, `control-center.js`, bloque final de `control-center.css`):
  logo, divisor y títulos a 47 px como en el arte, títulos en Inter incluida en el proyecto (`PTDInter`, solo en la barra)
  y una única píldora «Home» de 132×50 con borde blanco de 1 px y la casa de trazo fino del arte. Home lleva al inicio de
  la exhibición igual que en la portada (antes «Menú» volvía a la portada del proyecto; «Back to menu» sigue en la
  entrada y en el cierre). La barra de la TV no cambia.
- Solo inglés: no hay selector ES/EN en la tableta ni indicador en la TV; `module.js` publica siempre `language: 'en'`.
  Los textos en español siguen en los módulos por si se vuelven a necesitar.

## Infografía de Información

Desde el 13 de noviembre la imagen activa es `assets/PredictToDo_Infographic_2026-11_1920x1080.png` (entregada como `infografiapredictodo.png`, 1920×1080, solo en inglés). `../../shared/bogota-traffic.js` la expone como `INFO_SHEET.image` y la usa para ES y EN; no se traduce ni se modifica su contenido. Controles y CTA siguen siendo bilingües.

**Animación** (como la referencia del BID «Iniciativa 2.2_animada_PRO», misma coreografía que las estaciones 03 y 08): la TV arma la hoja pieza por pieza en `insights.js` (`information` → `sheet`). Cada pieza es un recorte del PNG colocado sobre `assets/PredictToDo_Infographic_2026-11_base.png`, que es la misma hoja con el contenido borrado (panel azul, marcos de las tarjetas y barra de impacto vacíos), así que el cuadro final es el PNG; a los 6,7 s el PNG completo aparece encima para eliminar cualquier costura. Orden: barrido del panel azul (0,15 s) → logo → título, subtítulo y «VPS · INE» → tarjeta del reto y de la solución (encabezado, ícono con anillo, texto) → «Impact to date» y la barra → cada cifra con su divisor → QR y datos de GitHub → píldora «Experiencia interactiva» (6,9 s) en la franja blanca bajo la barra. Las cajas de recorte están en píxeles del PNG; si la imagen cambia, `information` vuelve a la imagen fija. En pantallas que no son 16:9 el panel azul se extiende hasta el borde en lugar de dejar franjas blancas. Con «reducir movimiento» se ve la hoja final sin animar.

## Referencias de diseño

- [Pulso vial Bogotá](https://exquisite-swan-4f6a1a.netlify.app/): separación Explorar/Decidir, reloj y decisiones con efectos visibles.
- `DigitalMornings 4.pptx`, diapositivas 6–9: relación entre red vial, tiempo, congestión y velocidad. Diapositiva 11: mapa oscuro y centro de control.
- La presentación se usa como contexto visual y funcional, sin importar su video ni reproducir sus datos operativos.

## Geometría real y datos simulados

### Prueba local del 8 de noviembre

La base anterior ya utilizaba calles reales de OSM; lo simulado es el tráfico.
Esta revisión guarda 384 teselas vectoriales reales del área urbana de Bogotá
y su contexto (niveles 8–14), junto con fuentes y sprites, en `assets/bogota-map/`.
`native-map.js` utiliza esos archivos locales para la cobertura guardada y
conserva el proveedor original al desplazarse fuera de ella. Así se mantiene
el mapa completo de calles, manzanas, edificios, parques y nombres, incluso
si la red no permite cargar OpenFreeMap. Se conservan las atribuciones OSM.

La vista inicial encuadra el perímetro urbano oficial de **Bogotá D.C., Colombia**.
`geography.geojson` incorpora las 20 localidades y el suelo urbano publicados
por la Secretaría Distrital de Planeación en Catastro Bogotá / IDECA, en
EPSG:4326 y con atribución CC BY 4.0. El contorno y los nombres se muestran
sobre la cartografía; se atenúa el contexto exterior en la vista general.
Al elegir un caso se enfoca su zona, sin cambiar las coordenadas de las calles.
El nuevo control «Ver Bogotá» de la tableta regresa a la vista general;
la TV sigue esa cámara sin controles propios. La validación de cámara permite
8,5–19 para mostrar la ciudad completa también en tabletas pequeñas.
Los casos se verifican dentro del suelo urbano oficial; Ciudad de Cali
se encuentra en Kennedy y El Campín en Teusaquillo.

El estilo conserva el fondo oscuro, mejora el contraste de los nombres y
añade escala métrica. Las vías principales se muestran también al alejar
hasta el nivel 10. Los nombres reconocibles de los corredores se presentan
sobre la geometría original. Los lugares del mapa proceden de sus teselas,
sin generar ubicaciones. No se modifican escenarios, roles, acciones,
indicadores, puntajes, ranking, QR ni el reparto tableta/TV.

Al volver a elegir el caso activo, se vuelve a publicar su encuadre: antes
se borraba `mapView` y el TV podía encuadrar por su cuenta. Se comprueban
zoom, desplazamiento, selección de vías y avisos con el proveedor bloqueado.
El generador y los avisos de licencia se documentan en
`assets/bogota-map/README.md`. Esta revisión permanece local, sin push.

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
- `../../shared/bogota-traffic.js` y `assets/PredictToDo_Infographic_Challenge_Solution_1920x1080.png`: nueva imagen de información.
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

El Back decorativo incluido en el PNG se cubre en la vista de información; la navegación permanece en la tableta. Las flechas de las indicaciones de la TV apuntan hacia abajo y se desplazan sutilmente 3 px en ciclos de 2,4 s, con animación desactivada al solicitar movimiento reducido.

La portada usa una barra superior nativa, con la misma marca, estación, selector ES/EN y botón Home/Inicio de la referencia de AquaData. Home aparece solo arriba. Al ver Información, Volver también se sitúa en la barra. El encabezado incrustado en el PNG se recorta y las zonas táctiles se ajustan al cuerpo 1920×954 restante. El TV refleja la marca, estación e idioma sin controles activos.
