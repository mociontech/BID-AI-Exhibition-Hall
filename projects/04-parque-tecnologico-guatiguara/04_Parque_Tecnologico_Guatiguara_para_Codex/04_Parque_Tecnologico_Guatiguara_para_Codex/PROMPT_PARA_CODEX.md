# PROMPT PARA CODEX — Integración 04 · Parque Tecnológico Guatiguará

Quiero integrar el paquete adjunto `04_Parque_Tecnologico_Guatiguara_para_Codex` en el **proyecto actual de AI Exhibition Hall**. El usuario ya aprobó el aspecto y la dinámica del prototipo situado en `minijuego/index.html`. Los PNG de `referencias-visuales/` muestran exactamente cómo debe quedar.

**Antes de escribir código, inspecciona todo el repositorio del proyecto 04** y ubica las rutas, componentes, controles, eventos, canales de sincronización y archivos que actualmente manejan:

1. el **menú de tableta** con los botones «Información» y «Minijuego»;
2. la **infografía y el modo informativo** que aparece en TV;
3. el **CTA / pantalla de espera en TV** antes de activar el minijuego;
4. la **sincronización** tablet → TV (incluidos enlaces separados, sesiones, reset, reconexión y modo kiosco);
5. la traducción **ES/EN**, si ya está implementada;
6. los lineamientos gráficos del manual del BID y la tipografía Inter.

## Objetivo principal

**Conserva todo lo anterior**, incluyendo el botón «Información» y su funcionalidad actual. **Reemplaza solamente la experiencia del botón «Minijuego»** por la lógica y los gráficos del HTML entregado. No conviertas la infografía en parte de la trivia. No dupliques ni elimines pantallas ya existentes. No sustituyas todo el router/app con el `index.html` de ejemplo.

## Navegación definitiva

- **Estado inicial:** mostrar en la tableta las dos opciones originales «Información» y «Minijuego»; en TV conservar la pantalla de inicio/CTA ya existente en el proyecto.
- **Clic en Información:** mostrar en TV la infografía informativa existente y mantener en la tableta el estado/controles informativos que ya funcionan. No activar el juego.
- **Clic en Minijuego:** ocultar el CTA actual en TV y abrir en la tableta la bienvenida del juego «Activa la innovación». TV pasa a la pantalla de bienvenida correspondiente, o al visual de activación ya definido si el repositorio tiene una secuencia previa, sin perder sincronía.
- **Comenzar misión:** el jugador elige un reto; debe seguirse inmediatamente desde el TV.
- **Elegir reto:** mostrar las cuatro tarjetas con sus imágenes/ilustraciones.
- **Explorar laboratorios:** **mostrar SIEMPRE los siete laboratorios en la TV y los siete en la tableta**. La selección desde la tableta resalta la tarjeta en ambas pantallas y da feedback corto en el TV. Las siete tarjetas NO son una captura; deben ser componentes HTML/SVG accesibles y animables.
- **Activar apoyos:** seleccionar exactamente dos apoyos y reflejar la selección en tiempo real en TV.
- **Resultado:** mostrar la ruta Reto → Laboratorio → Apoyos → Oportunidad, con un texto que explica de forma sencilla qué hace Guatiguará, y ofrecer «Jugar de nuevo».
- **Volver / Inicio:** garantizar navegación hacia el menú principal sin dejar el TV atrapado en el juego. Al salir, restaurar la lógica informativa/CTA original.
- **Inactividad:** aplicar el timeout / reset del proyecto existente, sin crear intervalos paralelos.

## Experiencia de usuario

Conservar la apariencia aprobada, usando como fuente visual los PNG del directorio `referencias-visuales/`. No renderizar las capturas como UI. Usar el HTML como fuente de código: aprovechar sus SVG, datos de cuatro retos, siete tarjetas y cuatro apoyos. Mantener botones táctiles grandes, estados claros, navegación rápida y poco texto. No convertirlo en una trivia larga ni añadir pantallas informativas dentro del juego. Si hay que simplificar, conservar el contenido y las decisiones esenciales.

## Marca BID

- Tipografía principal: Inter.
- Azul `#005CFF`, azul secundario `#2E79FF`, azul claro `#CFE1FF`, negro `#141414`, blanco.
- **No utilizar degradado de naranja a azul en ningún lugar** (fondos, botones, iconos, overlays ni logotipo reinterpretado).
- Respetar espacios y proporciones del logotipo. Si el repositorio ya tiene un logo oficial aprobado, preferir ese archivo sobre el raster del paquete. No deformarlo ni recrearlo con formas CSS.
- Mantener visual limpio, alto contraste, ilustraciones SVG y estética institucional moderna.

## Arquitectura / implementación

- Integra en los componentes/rutas del proyecto actual; usa su stack y convenciones. Si ya es HTML/CSS/JS puro, conserva esa arquitectura; si es React/Vue/etc., convierte el juego en componentes sin incrustar una app completa en un `iframe` salvo que esté justificado y sea compatible con sincronización.
- Separa datos (`labs`, `missions`, `supports`), componentes de TV, controles de tableta y máquina de estados del juego.
- Emite eventos de sesión/tableta por el **mismo mecanismo de comunicación que usa el proyecto**; evita un segundo sistema de sincronización independiente.
- Las vistas independientes de TV y tableta deben reflejar el mismo estado al abrirse, recargarse o reconectarse.
- Si existe internacionalización, añade las claves ES/EN para TODOS los nuevos copies sin romper el selector de idioma.
- No reemplazar lógica informativa, recursos aprobados ni rutas de otras experiencias del Hall.

## Regla de contenido

Las siete etiquetas del HTML son categorías **provisionales**, NO una lista oficial verificada de los laboratorios de CO-T1754. Antes de publicar, contrastar los nombres reales con el material aprobado por el BID/cliente. Mantener nombres, textos, ilustraciones y correspondencia reto → laboratorio en un arreglo editable. No inventar resultados garantizados ni hacer creer que la herramienta está operando IA en vivo. Mostrar aviso breve de casos hipotéticos.

## Entregables de Codex

1. Código integrado y funcional dentro del repositorio existente.
2. Botones **Información / Minijuego** operativos, con rutas y estados separados.
3. Sincronización TV/tableta funcionando en dispositivos de prueba reales, si ya existe infraestructura para ello; si no, documentar claramente el bloqueo y hacer funcionar el modo vista conjunta.
4. Screenshots de verificación por cada pantalla importante en TV/tableta, comparables con `referencias-visuales/`.
5. Resumen de archivos cambiados y tests realizados.
6. Lista explícita de contenidos pendientes de confirmación del cliente (los siete nombres oficiales).

## Checklist obligatorio antes de declarar listo

- [ ] Botón Información conserva el mismo contenido y comportamiento que antes.
- [ ] Botón Minijuego entra en «Activa la innovación» y oculta el CTA previo según corresponde.
- [ ] Cuatro retos seleccionables con imágenes.
- [ ] Siete laboratorios simultáneamente visibles, sin scroll oculto en la TV.
- [ ] Tocar un laboratorio en tableta actualiza la TV.
- [ ] Selección de exactamente dos apoyos, con capacidad de cambiar la selección.
- [ ] Pantalla final correcta para todos los retos.
- [ ] Botón volver, reinicio e inactividad coherentes con el flujo actual.
- [ ] Inter, contraste, paleta azul BID y **sin degradado naranja-azul**.
- [ ] Funciona en pantalla Full HD (1920×1080) y en orientación de tableta instalada.
- [ ] ES/EN se mantiene si existía.
- [ ] No hay cifras, nombres de laboratorios ni supuestos de IA inventados.
