# AI Exhibition Hall — Recursos gráficos para Codex

Este paquete contiene imágenes derivadas de la referencia visual compartida y una nueva base gráfica conceptual.

## Carpeta backgrounds
- `fondo_exhibicion_1672x941.png` / `fondo_exhibicion_1920x1080.jpg`: fondo limpio generado, sin tarjetas ni botones. Pon los textos, las tarjetas y los botones como HTML/CSS sobre el fondo. Incluye un logotipo aproximado de referencia; reemplazar por archivo oficial del BID antes de producción.

## Carpeta reference
- `pantalla_completa_sin_marco_original.png`: recorte directo de la pantalla interna de la imagen de referencia, sin el marco físico.
- `pantalla_completa_sin_marco_1920x1080.jpg`: misma vista ajustada a 1920×1080. Incluye texto y tarjetas incrustados, por lo que solo es adecuada como referencia visual o pantalla estática, no como UI editable.

## Carpeta cards/full
Once tarjetas separadas, exactamente recortadas de la imagen de referencia. Incluyen textos/flechas incrustados. Úsalas para comparar diseño, no para botones finales.

## Carpeta cards/photos
Once miniaturas fotográficas tomadas de las áreas visibles de la imagen de referencia, retocadas solo con escala y ajuste de color. **Son recortes de baja resolución original ampliados para maquetar**; no son fotografías originales de cada proyecto y pueden tener distorsiones / detalles propios de la imagen conceptual. Sustituir por fotografías oficiales/autorizadas para producción.

## Carpeta example
- `index.html`: muestra cómo ensamblar un menú horizontal con las 11 tarjetas en HTML.
- `styles.css`: grilla, degradado sobre fotografías y botones editables.
- `projects.json`: catálogo en orden alfabético con paths y nombres.

Para probar: abrir `example/index.html` en Chrome o levantar servidor local desde el directorio raíz, p.ej. `python -m http.server 8000`, abrir `http://localhost:8000/example/`.

## Criterio de producción
No usar el PNG del menú completo como elemento interactivo. Cada botón, nombre de proyecto y acción (Home/Back) debe ser HTML/CSS/JS, con un hit-area táctil real. Este paquete es ilustrativo y no confirma autorizaciones sobre fotografías/marca.
