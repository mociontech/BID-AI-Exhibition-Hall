# Métricas de las diez experiencias en Cloud Firestore

La sincronización entre tableta y TV continúa en Realtime Database. Las métricas se escriben en **Cloud Firestore** del proyecto `f1-sap`, base `(default)`.

Ya se creó un documento `catalog` en cada una de estas diez colecciones. La tableta intenta completar cualquier catálogo que falte al abrir una experiencia en Netlify:

- `BID_AI_01_AquaData`
- `BID_AI_02_BogotaTraffic`
- `BID_AI_03_SmartBorders`
- `BID_AI_04_Guatiguara`
- `BID_AI_05_ProfeGabi`
- `BID_AI_06_RegLAC`
- `BID_AI_07_MAIIA`
- `BID_AI_08_Teachy`
- `BID_AI_10_CountryIntelligence`
- `BID_AI_11_RISE`

Dentro de la colección correspondiente se crean documentos `visit` al entrar, `click` al pulsar botones o enlaces y `duration` con el tiempo acumulado de la pestaña visible. El tiempo se registra cada 15 segundos y al ocultar o salir. Cada evento tiene `visitId` anónimo y número de estación; Firestore agrega `createTime`. No se guardan textos de botones, valores de formularios ni códigos de sala. La TV no cuenta como una visita adicional.

## Reglas recomendadas

Firestore aceptó la creación de los diez catálogos con las reglas actuales. Para limitar estas escrituras públicas, abre **Firebase Console → Firestore Database → Reglas** y adapta el bloque de [FIRESTORE_ANALYTICS_RULES.txt](FIRESTORE_ANALYTICS_RULES.txt) dentro de `match /databases/{database}/documents {`, conservando las reglas existentes. Una regla general más permisiva puede seguir permitiendo otras escrituras; revísala antes de publicar. Las reglas de Realtime Database de `firebase.rules.fragment.json` no controlan Firestore.

Luego abre `https://bidaiinaction.netlify.app/projects/01-aquadata/index.html?station=1` en la tableta. En Firestore deben aparecer las diez colecciones con `catalog`; la colección AquaData también tendrá un documento `visit`. Pulsa un botón y espera al menos 15 segundos para ver `click` y `duration`.

Los eventos son datos de demostración no autenticados. Las reglas limitan formato y tamaño, pero no pueden asegurar que cada evento provenga de una persona real; los conteos son orientativos.
