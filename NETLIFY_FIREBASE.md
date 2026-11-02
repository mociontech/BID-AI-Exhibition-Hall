# Tableta + TV en Netlify con Firebase

El sitio usa `/api/state` en localhost y Firebase Realtime Database cuando se abre en un dominio público. No hacen falta variables de entorno para esta demostración: la URL de la base está en `shared/sync.js`.

## Configurar Firebase

En Firebase Console → Realtime Database → Reglas, añade el contenido de `firebase.rules.fragment.json` **dentro** del objeto `rules` existente, antes de `$other`. Conserva intactos `messages`, `live_reactions`, `bidMapaSessions`, `events` y `enrutaTrivia`. Publica las reglas. El fragmento no es un archivo de reglas completo por sí solo.

Esta ruta de demostración permite lecturas y escrituras públicas para las estaciones 1, 2, 3, 5 y 6. Cualquier persona con el enlace puede cambiar la pantalla; úsala solo para pruebas públicas, no para datos sensibles ni una instalación sin control de acceso.

## Desplegar y probar

Conecta el repositorio en Netlify. El archivo `netlify.toml` fija la carpeta de publicación en la raíz. Activa Deploy Previews si vas a probar el pull request antes de fusionarlo. En el mismo despliegue abre:

- Tableta: `https://TU-SITIO.netlify.app/?station=1`
- TV: `https://TU-SITIO.netlify.app/display.html?station=1`

La pareja debe usar el mismo número de estación. Para probar dos parejas independientes usa `station=2` o `station=3` en ambos enlaces. Si la TV no cambia, revisa en DevTools la respuesta de `https://f1-sap-default-rtdb.firebaseio.com/aiExhibitionHall/stations/1.json`: `401` indica que faltan las reglas.

Cuando el despliegue esté listo, toca un proyecto en la tableta y comprueba que la TV cambie. La configuración de Google Maps sigue dependiendo de `/api/maps-config`, que Netlify no sirve con esta publicación estática; el mapa de Bogotá conserva su alternativa sin clave.

## RegLAC (estación 6)

Abre /index.html?station=6 y /display.html?station=6 en dos dispositivos. Las reglas deben incluir la estación 6; el fragmento conserva las estaciones anteriores. RegLAC calibra sus cronómetros con la fecha HTTP del mismo dominio de Netlify, ya que Firebase no expone Date mediante CORS. El servidor local sigue proporcionando serverNow. La calibración pública se reutiliza durante 60 segundos.
