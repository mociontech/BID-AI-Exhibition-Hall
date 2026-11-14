# Métricas de las diez experiencias

Este sitio ya usa **Firebase Realtime Database**. Allí los proyectos son nodos, no documentos de Firestore. Las diez rutas son `aiExhibitionHall/analytics/projects/01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `10` y `11`. Cada nodo aparece al recibir su primera visita.

En cada ruta, `events` contiene registros anónimos:

- `visit`: entrada a la página del proyecto en la tableta.
- `click`: botón o enlace pulsado, identificado por atributo o estructura de la interfaz. No se guarda el texto del botón.
- `duration`: segundos acumulados con la pestaña visible. Se envía cada 15 segundos y al ocultar o cerrar la página.

Todos llevan `visitId`, `ts` y `station`. Los clics llevan `action`; las muestras de tiempo llevan `durationMs`. La TV no registra visitas ni clics. La navegación local tampoco envía datos a Firebase.

## Activación

En Firebase Console → Realtime Database → Reglas, copia el bloque actualizado `aiExhibitionHall` de [firebase.rules.fragment.json](firebase.rules.fragment.json) dentro de `rules` y publícalo. Conserva los demás bloques de reglas de la base. Sin publicar las reglas nuevas, Firebase rechazará los eventos. La configuración web de Firebase no da permisos de administración para modificar reglas.

La lectura pública de estas métricas está desactivada. Los eventos se pueden ver en Firebase Console con una cuenta autorizada. Las escrituras permiten añadir registros y validan tipo, proyecto, marca de tiempo y tamaño. Como la tableta no se autentica, los conteos son orientativos: un tercero podría enviar eventos ficticios a la ruta pública. No uses estas métricas para decisiones que requieran auditoría.

## Obtener el resumen

En Firebase Console → Realtime Database → Datos, exporta a JSON el nodo `aiExhibitionHall/analytics/projects` o toda la base. Después ejecuta:

```powershell
node scripts/analytics-report.cjs C:\ruta\exportacion.json
```

El reporte muestra entradas, clics, minutos activos, promedio de segundos por entrada y clics por acción para los diez proyectos. Para cada visita se usa la mayor muestra de tiempo, así que ocultar la página y cerrarla no suma el mismo tiempo dos veces. Una visita terminada antes de la primera muestra puede registrar cero segundos. Las imágenes y los contenidos dentro de iframes de otro origen quedan fuera del registro de clics.
