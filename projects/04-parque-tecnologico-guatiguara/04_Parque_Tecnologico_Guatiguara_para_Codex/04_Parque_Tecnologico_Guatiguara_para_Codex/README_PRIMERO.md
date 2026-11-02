# 04 · Parque Tecnológico Guatiguará — paquete para Codex

## Qué incluye

- **`minijuego/index.html`**: prototipo interactivo aprobado visualmente por el usuario. Es un HTML autocontenido con CSS, JavaScript, ilustraciones SVG y el logo monocromático incrustados. Funciona abriéndolo en Chrome o Edge. Inter se solicita a Google Fonts; si está sin conexión utilizará la fuente de reserva.
- **`referencias-visuales/`**: siete capturas del mismo prototipo. Son REFERENCIAS de diseño para Codex, **no assets que el HTML necesite cargar**. Incluyen inicio, los siete laboratorios, tableta, TV, resultado y móvil.
- **`recursos/idb_logo_white.png`**: copia de trabajo del logo monocromático usado en el prototipo. El HTML ya lo lleva incrustado; usar solamente versiones de logo y combinaciones autorizadas del manual de marca.
- **`PROMPT_PARA_CODEX.md`**: instrucción para Codex para integrar el minijuego en el proyecto existente sin sobrescribir el botón Información ni el resto de la exhibición.
- **`INTEGRACION_Y_CRITERIOS.md`**: contrato funcional esperado, criterios de aceptación y advertencias sobre sincronización y contenidos.

## Cómo probar el minijuego ahora

1. Abre `minijuego/index.html` en el navegador.
2. En la vista «Ambas» utiliza la tableta derecha para avanzar; la TV de la izquierda responde.
3. Pulsa «Comenzar misión», selecciona uno de los cuatro retos, explora las siete tarjetas de laboratorio, escoge un laboratorio, activa **dos apoyos** y consulta el resultado.
4. Las vistas individuales se seleccionan en el encabezado o añadiendo `?view=tv` y `?view=tablet` a la dirección URL.

## Lo que debe hacer Codex

**No reemplazar la aplicación actual por este HTML.** Incorporar su flujo de juego a la aplicación existente, conservando el botón y la pantalla de **Información**, los enlaces de TV/tableta, el CTA previo del televisor, el bilingüismo si ya existe, el estilo del BID y el sistema de sincronización de dispositivos que ya esté montado.

Codex debe primero inspeccionar el repositorio y sus componentes, después integrar o adaptar `minijuego/index.html`. Los archivos en `referencias-visuales/` sirven para mantener la apariencia, NO para mostrarlos como fondo del minijuego.

## Contenido que necesita validación

El juego incluye siete **categorías provisionales**: AgroTech, HealthTech, Inteligencia artificial, Big Data, Ciberseguridad, Experiencia de usuario y Desarrollo de software. **No se presenta esta lista como denominación oficial confirmada de los siete laboratorios de la cooperación técnica.** Verificar nombres oficiales, descripciones y correspondencia con los retos antes de publicación. Los retos y resultados son pedagógicos e hipotéticos, no casos reales ni promesas de impacto.

## Sincronización

El HTML autónomo emite estado por `BroadcastChannel` y `localStorage`, útil para pestañas del mismo navegador/origen. Esto **NO garantiza sincronización entre una tableta y un TV físicos diferentes**. En la aplicación real Codex debe reutilizar el backend/canal existente (WebSocket, Socket.IO u otro) y evitar estados duplicados.

## Colores y tipografía

Usa azul BID `#005CFF`, `#2E79FF`, azul claro `#CFE1FF`, negro `#141414`, blanco, y tipografía Inter. **No usar degradado naranja→azul**. El degradado multicolor que pudiera figurar en el manual de marca no forma parte de este diseño.

## Nota de alcance

No se proporcionó en esta conversación un repositorio de código de la instalación; por lo tanto, esta entrega es un **paquete listo para entregar a Codex**, no una integración ya realizada sobre el proyecto de producción.
