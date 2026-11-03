# Tableta + TV en Netlify con Firebase

El sitio usa `/api/state` en localhost y Firebase Realtime Database cuando se abre en un dominio público. No hacen falta variables de entorno para esta demostración: la URL de la base está en `shared/sync.js`.

## Configurar Firebase

En Firebase Console → Realtime Database → Reglas, añade el contenido de `firebase.rules.fragment.json` **dentro** del objeto `rules` existente, antes de `$other`. Conserva intactos `messages`, `live_reactions`, `bidMapaSessions`, `events` y `enrutaTrivia`. Publica las reglas. El fragmento no es un archivo de reglas completo por sí solo.

Esta ruta de demostración permite lecturas y escrituras públicas para las estaciones 1, 2, 3, 4, 5, 6, 7, 9, 10 y 11. Cualquier persona con el enlace puede cambiar la pantalla; úsala solo para pruebas públicas, no para datos sensibles ni una instalación sin control de acceso.

## Desplegar y probar

Conecta el repositorio en Netlify. El archivo `netlify.toml` fija la carpeta de publicación en la raíz. Activa Deploy Previews si vas a probar el pull request antes de fusionarlo. En el mismo despliegue abre:

- Tableta: `https://TU-SITIO.netlify.app/?station=1`
- TV: `https://TU-SITIO.netlify.app/display.html?station=1`

La pareja debe usar el mismo número de estación. Para probar dos parejas independientes usa `station=2` o `station=3` en ambos enlaces. Si la TV no cambia, revisa en DevTools la respuesta de `https://f1-sap-default-rtdb.firebaseio.com/aiExhibitionHall/stations/1.json`: `401` indica que faltan las reglas.

Cuando el despliegue esté listo, toca un proyecto en la tableta y comprueba que la TV cambie. La configuración de Google Maps sigue dependiendo de `/api/maps-config`, que Netlify no sirve con esta publicación estática; el mapa de Bogotá conserva su alternativa sin clave.

## RegLAC (estación 6)

Abre /index.html?station=6 y /display.html?station=6 en dos dispositivos. Las reglas deben incluir la estación 6; el fragmento conserva las estaciones anteriores. RegLAC calibra sus cronómetros con la fecha HTTP del mismo dominio de Netlify, ya que Firebase no expone Date mediante CORS. El servidor local sigue proporcionando serverNow. La calibración pública se reutiliza durante 60 segundos.

## MAIIA (estación 7)

Abre `https://bidaiinaction.netlify.app/index.html?station=7` y `https://bidaiinaction.netlify.app/display.html?station=7`. El menú general sigue disponible con `index.html?station=7&projects=1`.

MAIIA conserva Firebase en hosting estático y la API local durante desarrollo. Los plazos de desbloqueo (10 segundos) y análisis simulado (4 segundos) usan la hora compartida del servidor/hosting; solo la tableta avanza el estado. El trazo libre se sincroniza durante el gesto y se cierra al soltar. Los polígonos permanecen dentro del límite del payload existente. No se requieren cambios en las reglas publicadas de Firebase, que ya admiten la estación 7.

## Enlaces de producción de las 10 parejas

La numeración conserva los identificadores del repositorio; el proyecto 08 está oculto. Abre una tableta y su TV con el mismo parámetro station. Cada pareja conserva un estado independiente.

| Proyecto | Tableta | TV |
| --- | --- | --- |
| 01 · AquaData | [Abrir tableta](https://bidaiinaction.netlify.app/projects/01-aquadata/index.html?station=1) | [Abrir TV](https://bidaiinaction.netlify.app/display.html?station=1) |
| 02 · Bogotá Traffic Prediction | [Abrir tableta](https://bidaiinaction.netlify.app/projects/02-bogota-traffic-prediction/index.html?station=2) | [Abrir TV](https://bidaiinaction.netlify.app/display.html?station=2) |
| 03 · Costa Rica Smart Borders | [Abrir tableta](https://bidaiinaction.netlify.app/projects/03-costa-rica-smart-borders/index.html?station=3) | [Abrir TV](https://bidaiinaction.netlify.app/display.html?station=3) |
| 04 · Parque Tecnológico Guatiguará | [Abrir tableta](https://bidaiinaction.netlify.app/projects/04-parque-tecnologico-guatiguara/index.html?station=4) | [Abrir TV](https://bidaiinaction.netlify.app/display.html?station=4) |
| 05 · Profe Gabi | [Abrir tableta](https://bidaiinaction.netlify.app/projects/05-profe-gabi/index.html?station=5) | [Abrir TV](https://bidaiinaction.netlify.app/display.html?station=5) |
| 06 · RegLAC | [Abrir tableta](https://bidaiinaction.netlify.app/projects/06-reglac/index.html?station=6) | [Abrir TV](https://bidaiinaction.netlify.app/display.html?station=6) |
| 07 · CSD: MAIIA | [Abrir tableta](https://bidaiinaction.netlify.app/projects/07-csd-maiia/index.html?station=7) | [Abrir TV](https://bidaiinaction.netlify.app/display.html?station=7) |
| 09 · Teachy | [Abrir tableta](https://bidaiinaction.netlify.app/projects/09-teachy/index.html?station=9) | [Abrir TV](https://bidaiinaction.netlify.app/display.html?station=9) |
| 10 · VPC Country Intelligence | [Abrir tableta](https://bidaiinaction.netlify.app/projects/10-vpc-country-intelligence/index.html?station=10) | [Abrir TV](https://bidaiinaction.netlify.app/display.html?station=10) |
| 11 · RSM RISE | [Abrir tableta](https://bidaiinaction.netlify.app/projects/11-rsm-rise/index.html?station=11) | [Abrir TV](https://bidaiinaction.netlify.app/display.html?station=11) |

Las reglas publicadas por el administrador ya permiten estos diez identificadores. shared/sync.js y el servidor local admiten la misma lista. Habilitar la sincronización no añade contenido a los proyectos que aún tienen módulos de desarrollo pendiente.
