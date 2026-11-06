# RegLAC — revisión visual con el manual BID

> Actualización 2026-11-06: el minijuego se retiró por solicitud del cliente. La experiencia vigente tiene inicio, información y un espacio reservado para el video institucional, sin desbloqueo ni cronómetros. Se conservan marca, navegación y sincronización ES/EN. Las composiciones de juego descritas abajo y los frames Figma anteriores son referencias históricas; no describen el flujo actual.

Referencia: `C:/Users/mateo/Downloads/Manual de marca BID.pdf`, documento de 170 páginas. Se revisaron visualmente las secciones pertinentes porque el PDF contiene páginas rasterizadas sin texto extraíble. El manual se utiliza como referencia de marca; el alcance funcional y las restricciones del proyecto proceden del encargo del usuario.

## Criterios aplicados

- **Color, páginas 37 y 41:** azul principal `#005CFF`. Blanco como superficie de lectura y acción destacada en azul sólido.
- **Paleta secundaria, páginas 49–54:** tonos `#CFE1FF`, `#89B4FF` y `#EBEDF7` para fondos, estados, selección y separadores. El azul oscuro de los títulos se conserva por las reglas anteriores de la exposición.
- **Tipografía, páginas 62–68:** Inter local, jerarquía clara entre título, explicación y navegación. Cifras tabulares para cronómetros; tamaños mayores en TV.
- **Iconografía, páginas 94–100:** trazos consistentes, geometría sencilla, esquinas controladas y espacio negativo. Iconos SVG editables, sin imágenes de botones.
- **Retícula, páginas 107–112:** márgenes y alineaciones compartidos entre encabezado, contenido y pie. En TV, el margen de 4.5% del ancho equivale aproximadamente al 8% del lado corto indicado en el manual para formato horizontal. En tableta se adapta al espacio necesario para controles táctiles.
- **Marca, páginas 12 y 33:** el logo conserva proporciones, fondo blanco y separación respecto al nombre de la exposición. Se mantiene el archivo original del logo BID disponible en el repositorio; no se recrea ni recolorea a partir de una captura del manual.
- **Prioridad del encargo anterior:** no se utiliza el degradado naranja–azul del manual. Se conservan identidad AI in Action, bilingüismo, dos dispositivos, desbloqueo de 10 segundos, cronómetros ascendentes y flujo completo del minijuego.

## Composición por dispositivo

**Inicio:** título protagonista, ilustración vectorial de seis documentos con lupa, dos accesos claros y estado deshabilitado dentro de la tarjeta Minijuego. El CTA aparece después de Información sin desplazar al visitante a otra sección.

**Información en TV:** infografía reconstruida con HTML, cinco columnas y un cierre sobre validación humana. Las capturas originales permanecen como referencias y ya no se muestran como la interfaz informativa.

**Minijuego en TV:** documentos completos sobre una superficie oscura, lectura amplia de requisitos, cronómetro independiente visualmente y selecciones sincronizadas. Los hallazgos se distinguen por contorno y frases resaltadas, además de la conexión entre B y D.

**Minijuego en tableta:** seis selectores en dos columnas y un panel lateral con instrucciones, contador y botón. El texto completo se lee en la TV, como indica la tableta. Esta composición mantiene la función de cada dispositivo.

**Resultados:** comparación con tiempos reales, tarjetas contrastadas, descripción del tipo de revisión y resultados de selección. Se explica que la animación forma parte del tiempo de interacción de la demostración.

## Archivos de esta revisión

- Modificados: `experience.js`, `module.css`, `verify.cjs`, `README.md`.
- Creados: `assets/regulatory-analysis.svg`, `visual-audit.cjs`, este documento y capturas en `verification/redesign/`.
- Se conserva la lógica de `state.js`, `module.js` y la sincronización compartida existente.

La auditoría visual ejecuta las 13 vistas/estados en ES y EN a 1024×768, 1180×820 y 1920×1080: **78 combinaciones**. Comprueba desbordamiento del documento y de paneles/tarjetas. Las capturas de resultados de la auditoría reutilizan los tiempos de la última prueba de integración; no se introducen tiempos fijos en el producto.

La validación visual automática y en Chrome no sustituye la prueba en iPad/Safari y TV físicos de la exposición.
