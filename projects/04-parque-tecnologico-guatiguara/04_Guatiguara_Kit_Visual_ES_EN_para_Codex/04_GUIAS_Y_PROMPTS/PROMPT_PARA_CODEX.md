# PROMPT PARA CODEX — 04 · Parque Tecnológico Guatiguará

## Contexto y misión

Trabajo dentro de un repositorio existente de la exhibición del BID. Quiero integrar en el **proyecto 04 · Parque Tecnológico Guatiguará** el rediseño visual bilingüe de su minijuego **«Activa la innovación / Activate innovation»**.

Adjunté una carpeta `04_Guatiguara_Kit_Visual_ES_EN_para_Codex` que incluye 10 mockups ES/EN, 24 iconos SVG editables, tokens CSS, textos ES/EN, un HTML de demostración y el manual BID. Antes de tocar archivos, inspecciona el proyecto real e identifica su stack, navegación, rutas para TV y tableta, lógica de sesión y sincronización, recursos de marca, idioma, pantallas existentes y pruebas.

**Importante: NO crees una app aparte ni sobrescribas la experiencia actual. Conserva el botón «Información / Information», la infografía existente y sus controles; modifica SOLAMENTE el flujo que se abre desde el botón «Minijuego / Minigame».** Si el CTA informativo o de inicio se maneja en TV, conserva su lógica: al comenzar minijuego debe retirarse según el comportamiento actual, y al volver al menú debe restaurarse.

## Referencias visuales exactas

Usa los archivos de `01_REFERENCIAS/ES` y `01_REFERENCIAS/EN` como guía para reconstruir componentes reales:

| Fase | Español | English |
| --- | --- | --- |
| Inicio de minijuego | `ES/01_Bienvenida_ES.png` | `EN/01_Welcome_EN.png` |
| Selección de reto | `ES/02_Elegir_Reto_ES.png` | `EN/02_Choose_Challenge_EN.png` |
| Selección de laboratorio | `ES/03_Siete_Laboratorios_ES.png` | `EN/03_Seven_Labs_EN.png` |
| Selección de apoyos | `ES/04_Activar_Apoyos_ES.png` | `EN/04_Activate_Supports_EN.png` |
| Resultado | `ES/05_Resultado_ES.png` | `EN/05_Result_EN.png` |

Estos 10 PNG contienen TV y tableta **en una misma imagen para explicar la composición**. En producción, crea vistas diferenciadas: la TV proyecta contenido y la tableta controla. NO uses estas capturas como fondos, botones o interfaz entera. Se deben recrear tarjetas, ilustraciones SVG, tipografía, textos y selección como elementos semánticos, editables, traducibles y responsivos. La pantalla de TV no necesita recibir clics; los botones mostrados en ella en los mockups son una referencia visual de CTA, pero la interacción efectiva ocurre desde la tableta, según el proyecto existente.

## Marca BID — obligatorio

1. Lee `05_MANUAL_BID/Manual_de_marca_BID.pdf`, especialmente logotipo y usos (pp. 8–12, 33), paleta (pp. 37, 41, 48–51), Inter (pp. 62–68), iconografía (pp. 91–102) y retícula (pp. 104–112).
2. Tipografía principal **Inter**; usa la tipografía ya cargada por el repositorio. Si falta, consulta la forma aprobada de incorporar Inter, sin adjuntar o inventar fuentes. 
3. Paleta de implementación principal: azul BID `#005CFF`, secundario `#2E79FF`, azul claro `#CFE1FF`, negro `#141414`, blanco `#FFFFFF`; ajustar contra la versión de marca vigente del repositorio.
4. **PROHIBIDO el degradado naranja→azul.** Preferir superficies planas y variaciones de azul coherentes con el manual. Evitar degradados llamativos, saturación excesiva, sombras pesadas y adornos decorativos de más.
5. Iconos elegantes, escalables, de peso de trazo consistente. Usar los SVG de `03_ASSETS_EDITABLES/iconos_svg` como punto de partida; son recursos genéricos **no oficiales** creados para el minijuego, no los confundas con el símbolo del BID. Puedes convertirlos en componentes siguiendo las convenciones del repositorio.
6. NO recortes ni reconstruyas el logotipo a partir de las imágenes. Usa el archivo de logotipo institucional **oficial y ya aprobado en el repositorio** y preserva área de seguridad, proporciones y contraste. Las marcas de las imágenes son mockups, no archivo maestro.
7. Mantén el nombre **actual** de la exhibición que figure en la aplicación; los textos “AI Exhibition Hall” de los mockups pueden ser históricos, NO deben reemplazar el nombre vigente del proyecto.

## Flujo del minijuego que hay que desarrollar

**Estado principal previo:** menú con `Información` y `Minijuego`; TV con su modo de espera/CTA existente.

**Información:** mantiene el módulo informativo e infografía existentes, sin convertirlos en ronda del minijuego.

**Minijuego → bienvenida:** texto conciso “Activa la innovación”; diagrama Idea → Laboratorio → Talento → Colaboración; botón `Comenzar misión` en la tableta.

**Paso 1: reto:** cuatro opciones ilustradas; selección en tableta cambia el resaltado de la tarjeta correspondiente en TV; `Continuar` solo con selección. Conservar los retos y relatos que estén implementados/validados, sin inventar hechos.

**Paso 2: siete laboratorios:** una retícula visible de siete tarjetas en TV, y siete opciones utilizables en tableta, con icono, nombre, descripción breve y estado seleccionado. NO reducir a tres ni esconder laboratorios. Resalta el laboratorio elegido y refleja el estado inmediatamente en TV. Mantén un mapa editable por reto; no conviertas la recomendación pedagógica en consejo tecnológico real o predicción de IA.

**Paso 3: apoyos:** cuatro tarjetas de apoyo, selección de **exactamente dos** (si el repositorio valida otra regla, conserva la regla previa y documenta la decisión). Feedback claro, selección reversible y actualización inmediata en TV. Las categorías pueden expresarse como talento/formación, prototipado/validación, articulación con aliados y acompañamiento técnico.

**Resultado:** diagrama dinámico Reto → Laboratorio → Apoyos → Oportunidad, con los nombres elegidos realmente por el visitante. Cierre pedagógico: en Guatiguará una idea puede fortalecerse al conectar tecnología, talento y colaboración. Botones para volver a jugar y regresar al menú principal; restaurar el modo informativo/CTA al salir.

**Inactividad:** respetar timeout, transición de pantallas, recuperación y reset de la experiencia ya existente; no crear temporizadores duplicados.

## Arquitectura y sincronización

- Integra la lógica en el stack y los componentes existentes, sin iframe ni una segunda aplicación independiente salvo justificación.
- Reutiliza la infraestructura ACTUAL de sincronización tableta→TV (WebSocket, pubsub, BroadcastChannel u otra, según se encuentre). No presupongas que `BroadcastChannel` sincroniza dos dispositivos distintos.
- Estado único por sesión (modo, idioma, etapa, reto, laboratorio, apoyos, resultado); soportar selección, corrección de selecciones, retroceso, reconexión, recarga y retorno.
- Sincroniza selecciones y cambios de idioma en ambas vistas sin romper el modo Información.
- Datos (`missions`, `labs`, `supports`, mappings) separados de presentación; los textos en i18n ES/EN sin traducciones mezcladas ni saltos de diseño.
- Si el proyecto ya tiene configuraciones editables, úsalas; `03_ASSETS_EDITABLES/copies_es_en.json` es solo propuesta de copies de UX, no fuente de verdades técnicas.
- Prioriza HTML/CSS/SVG reales. Imágenes generadas sirven como guía de proporciones y jerarquía; los iconos SVG son assets usables, escalables y editables.

## Advertencias editoriales cruciales

1. Los nombres de los siete laboratorios de los mockups (AgroTech, HealthTech, Software & UX, IA & Analítica, IoT & Sensores, Prototipado digital, Ciberseguridad) **NO coinciden plenamente** con los del HTML base (AgroTech, HealthTech, Inteligencia artificial, Big Data, Ciberseguridad, Experiencia de usuario, Desarrollo de software). NO los mezcles ni reemplaces silenciosamente. Ambas listas son ejemplos provisionales. Prioriza contenidos del repositorio o los aprobados por el BID/cliente y deja los siete datos parametrizados con estados de validación editorial.
2. Los casos empresariales del minijuego son simulaciones educativas, no proyectos ejecutados o resultados verificados. La “oportunidad” del resultado es potencial, nunca una promesa de impacto.
3. **No alterar ni borrar** infografías, métricas, textos aprobados o rutas de otros proyectos.
4. Alinea el diseño final con la marca vigente del repositorio y con el documento adjunto; interpreta las referencias gráficas como bocetos de alto nivel, no como archivos oficiales de marca.

## Entregables y control de calidad

- Implementación dentro del proyecto real, no otro demo aislado.
- Capturas del resultado: TV 1920×1080 y tamaño real de la tableta (horizontal/vertical según hardware), para los cinco estados, ES y EN.
- Pruebas funcionales: Información sin cambios; menú; minijuego; cuatro retos; siete laboratorios; apoyos; resultado; reinicio; regreso; inactividad; selector ES/EN; reconexión TV/tableta.
- Validar que el texto no se corte, que no haya scroll horizontal en la TV y que las tarjetas sean táctiles accesibles en tableta.
- Dejar reporte de archivos modificados, decisiones, pruebas y pendientes de contenido aprobable.

**No declares que la integración está terminada si solo puedes ejecutar el HTML offline o si la TV y tableta físicas no están sincronizadas.** Documenta bloqueos reales.
