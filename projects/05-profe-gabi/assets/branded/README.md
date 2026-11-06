# Branding recibido y conectado

Se incorporaron los 10 PNG originales de `BID AI Exhibition hall.zip`, todos a 1920 × 1080 y sin modificar sus bytes. `manifest.json` conserva sus nombres originales y SHA-256. La imagen de Información coincide con la recibida antes en `Profe Gabi.zip`.

## Correspondencia con el flujo

| Archivo | Uso |
|---|---|
| `tablet-cover-en.png` | Menú e Información en tableta. Ambas tarjetas están activas desde el inicio. |
| `tablet-cases-en.png` | Cuatro casos, con zonas transparentes conectadas a sus identificadores reales. |
| `tablet-cases-wait-en.png` | Escritura de la consulta inicial. |
| `tablet-cases-thinking-en.png` | Pensamiento inicial; también aporta los dibujos de Back y Skip animation que se reutilizan durante otras animaciones. |
| `tablet-follow-en.png` | Dos seguimientos, incluyendo sus estados de espera y selección. |
| `tablet-result-en.png` | Resultado, Back y Play again. |
| `tv-information-en.png` | Información, disponible desde el inicio. |
| `tv-chat-en.png` | Conversación durante las animaciones. |
| `tv-situation-en.png` | Conversación y bienvenida entre decisiones. |
| `tv-result-en.png` | Resultado y conversación final. |

Las imágenes son la base visual; los controles dibujados se activan con botones HTML transparentes. Las coordenadas están en `artwork.js`, dentro de un lienzo lógico de 1920 × 1080. Un ResizeObserver aplica la misma escala a imagen, zonas y textos, con encaje proporcional y sin recortes. Las zonas conservan nombres accesibles, foco de teclado y bloqueo real durante esperas. Los controles existentes de idioma, Home, menú y fullscreen se mantienen sobre el espacio libre del encabezado.

## Textos variables

Los PNG incluyen consultas antiguas de fracciones, el tema fijo “Prepare a lesson” y el marcador “05 Cambiar Cambiar”. Se cubren esas regiones con capas HTML y se muestran los títulos, decisiones, respuestas y aprendizajes del guion vigente. La imagen original permanece intacta en disco. El chat funciona con su historial, escritura y pensamiento actuales; no se reproduce la conversación obsoleta de la imagen.

La portada ubicada dentro de `TABLET/ES` tiene textos en inglés, por lo que se usa en EN. ES conserva la interfaz nativa funcional. Faltan los PNG equivalentes en español; no se presenta contenido inglés como traducción española.

La TV sigue siendo de solo lectura y recibe las elecciones desde la tableta mediante la sincronización compartida. Los archivos no se utilizan como una reproducción táctil de la tableta en TV.
