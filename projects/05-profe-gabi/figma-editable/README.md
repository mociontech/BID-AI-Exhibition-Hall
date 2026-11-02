# Pantallas editables entregadas — Profe Gabi

Estado: creadas y verificadas en Figma.

Página: [05_ProfeGabi — Editable](https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id=63-2).

Se entregaron 14 frames de 1920 × 1080 en español e inglés, sin modificar las páginas de otros proyectos. Los enlaces directos están en `frame-links.json`.

## Componentes y editabilidad

Biblioteca nativa: 15 familias con 65 variantes. Incluye selector ES/EN, Home, Volver, Siguiente, flechas circulares, progreso, tarjetas de menú e información, decisiones, CTA principal y secundario, encabezado, pie, mensajes de chat y métricas. Incluye además iconos vectoriales y fondo de puntos reutilizables.

La auditoría confirmó 420 capas de texto nativas con Inter, Auto Layout, instancias y vectores. Los únicos rellenos de imagen son el logo BID y dos fotografías recortadas de las referencias aprobadas. No se utilizaron capturas completas como interfaz final. Las cifras y etiquetas son editables. El 85,3 % conserva el denominador de 136 encuestados y la aclaración sobre impacto causal.

El menú representa el minijuego bloqueado; Información muestra el CTA habilitado tras 10 segundos. El chat y las decisiones son editables. La TV conserva su papel de pantalla de visualización. Se usa el progreso y el aprendizaje final definidos por el proyecto, sin inventar puntajes.

## Pendiente de contenido

Ninguno para estos 14 estados en ES/EN. Mejora opcional: fotografías originales independientes de mayor resolución; se utilizaron encuadres fotográficos de las referencias aprobadas.

## Registro local

- `frame-links.json`: enlaces directos a los 14 frames.
- `final-audit.json` y `style-audit.json`: evidencia estructural y de estilos.
- Se incluyen las capturas finales de revisión. Los registros temporales de sesión, conexiones de navegador y scripts de construcción con referencias consumidas se conservan únicamente en la preparación local y se omiten del repositorio.
- `preview.html?frame=0` hasta `frame=13` conserva la preparación local. No sustituye la entrega nativa en Figma.
- `build.cjs` regenera la preparación local y puede sobrescribir sus metadatos. Los resultados reales de entrega se conservan en las auditorías y enlaces.
