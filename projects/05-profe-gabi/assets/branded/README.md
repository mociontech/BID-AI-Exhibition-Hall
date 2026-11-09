# Branding del evento — interfaz EN y conversación ES

Fuente actual: `BID AI Exhibition hall (1).zip`. Sus nueve PNG se copiaron sin modificar sus bytes, todos a 1920 × 1080. `manifest.json` identifica cada entrada original y su SHA-256. La pantalla de Información EN se conserva de la entrega anterior porque no viene en este ZIP.

| Archivo local | Uso |
|---|---|
| `tablet-cover-en.png` | Portada, con Información y experiencia interactiva activas. |
| `tablet-cases-en.png` | Cuatro tarjetas con las etiquetas EN del guion actual. |
| `tablet-cases-wait-en.png` | Escritura inicial de una consulta. |
| `tablet-cases-thinking-en.png` | Estado de pensamiento inicial y controles Back/Skip. |
| `tablet-follow-en.png` | Decisiones y lectura manual con Continue. |
| `tablet-result-en.png` | Resultado de la tableta. |
| `tv-chat-en.png` | Conversación durante la animación. |
| `tv-situation-en.png` | Conversación y bienvenida entre decisiones. |
| `tv-result-en.png` | Nuevo cierre, procedente de `TV/Mini-game — EN-2.png`. |
| `tv-information-en.png` | Infografía EN aprobada anteriormente, conservada. |

La portada está en `TABLET/ES` dentro del ZIP, pero su contenido es inglés. El marcador «Cambiar Cambiar» se cubre con texto real del proyecto. El resto de regiones con temas o diálogos anteriores se cubre con HTML para reflejar el guion actual. Las fotografías y fondos conservan los originales.

La interfaz queda fija en inglés; las consultas y respuestas de WhatsApp se obtienen siempre de `source/conversations.es.json`. Las etiquetas, instrucciones, progreso y resultados se obtienen de EN. Las respuestas se mantienen por partes con avance manual, sin cambiar las consultas reales ni añadir decisiones.

Los botones dibujados se activan con zonas HTML transparentes proporcionales. Continue, Home, Back, menú y fullscreen son controles funcionales. La TV permanece de solo lectura y recibe el estado de la tableta mediante la sincronización compartida.

La conversación dibujada en los PNG se reemplaza íntegramente por el chat HTML en español. Su fuente es de 22 px lógicos en HD. El único disclaimer visible es exactamente: `English translation of adapted, anonymised real cases. Profe Gabi can make mistakes; the teacher decides.` No hay una línea adicional de fuentes en el chat. La procedencia de los mensajes se conserva en los datos y documentos de revisión.
