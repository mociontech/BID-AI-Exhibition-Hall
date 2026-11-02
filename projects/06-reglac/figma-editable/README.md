# 06_RegLAC — Editable

Entrega completada en [Figma](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=143-954).

14 frames de 1920 × 1080, en ES y EN, construidos con capas nativas. Composición sencilla basada en el RegLAC implementado. La identidad visible conserva AI in Action, como indica el proyecto actual.

- [Tablet / Main Screen — ES](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-28)
- [Tablet / Main Screen — EN](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-142)
- [Tablet / Information state — ES](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-256)
- [Tablet / Information state — EN](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-376)
- [Tablet / Mini-game state — ES](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-496)
- [Tablet / Mini-game state — EN](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-604)
- [TV / Main Screen — ES](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-712)
- [TV / Main Screen — EN](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-826)
- [TV / Information — ES](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-940)
- [TV / Information — EN](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-1009)
- [TV / Mini-game — ES](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-1078)
- [TV / Mini-game — EN](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-1186)
- [TV / Results or Final message — ES](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-1294)
- [TV / Results or Final message — EN](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=146-1347)

## Componentes

13 familias: idioma ES/EN, Home, Volver, Siguiente, flecha circular, progreso, CTA principal, CTA secundario, tarjeta de contenido, tarjeta de documento, tarjeta informativa, encabezado y pie. Incluye 31 componentes/variantes y una ilustración vectorial de seis documentos.

Las tarjetas y controles emplean Auto Layout y propiedades de texto. Los estados incluyen activo, deshabilitado, bloqueado y seleccionado. La tableta muestra selectores y confirmación; la TV muestra los requisitos completos. El minijuego se representa en la confirmación de ronda 2 para mantener la entrega acotada a los frames solicitados. Los valores de tiempo provienen de la prueba real guardada en verification/report.json y no son métricas de rendimiento de RegLAC.

## Verificación

final-audit.json confirma 14 frames de tamaño correcto, 452 capas de texto editables en Inter, Auto Layout, instancias y vectores. El único bitmap es el logo BID original de 172 × 58. No existen imágenes de pantalla completa ni texto fuera de los límites. Se revisó visualmente la composición y se corrigieron el título y la altura automática del texto. Las 11 páginas originales conservan sus nombres e identificadores; las mutaciones se limitaron a la página nueva y sus recursos con prefijo 06.

Se intentó una referencia temporal con generate_figma_design, pero la revisión automática bloqueó el lanzamiento de Chrome. No se utilizó dicha captura. Se reutilizó el logo que ya existía en Figma y se importó el SVG del repositorio como vectores. El HTML temporal se eliminó.

## Pendiente de contenido

Ninguno para los 14 estados solicitados. No se añadieron fotografías ni cifras de impacto inventadas. El logo mantiene su formato original de imagen; el resto del contenido visual se compone de texto, formas y vectores editables.

## Archivos locales

- frame-links.json: los 14 enlaces directos.
- state.json: archivo, sesión y página.
- foundations.json y composition.json: identificadores devueltos por Figma.
- final-audit.json: verificación final.
- content.json: textos, documentos e ilustración extraídos de la implementación.
- Los scripts documentan la construcción inicial y requieren los ajustes de composición registrados durante la revisión; no ejecutarlos de nuevo sobre la entrega sin consultar los IDs existentes.

