# Cierre de turno y ranking

La tableta controla «Continuar» desde el resumen. El TV presenta dos QR y el ranking; la tableta conserva navegación, estado de guardado y reintento. Ambos idiomas están incluidos.

Destinos: repositorio `https://github.com/EL-BID/PredictToDo` (enlazado desde la ficha oficial del BID) y ficha `https://knowledge.iadb.org/en/open-knowledge/code-development/open-source-solution/predicttodo`. Las tarjetas se titulan «Code4Dev» y «Blog», según lo solicitado; los destinos QR conservan las URLs anteriores. Los QR se generan localmente con qrcode-generator 1.4.4, licencia MIT en vendor.

Firebase Cloud Firestore: proyecto `f1-sap`, colección `bidPredictToDoRanking`. `_config` guarda metadatos, enlaces, máximo 400 y criterio de desempate. Se creó y se verificó lectura/escritura; el resultado temporal de verificación se eliminó. No se modificaron otras colecciones ni reglas globales. La sincronización existente entre tableta y TV sigue usando su transporte actual.

Cada documento de participante usa el UUID de la sesión y contiene `displayName`, `roleId`, `score`, `casesPlayed`, `durationMs`, `rankKey`, `projectId` y `updatedAt` (hora del servidor). Reintentar actualiza el mismo documento. Una nueva partida genera otro UUID. El nombre vacío se muestra como Visitor.

Se suman 0–100 puntos por caso, como máximo 400. Repetir un caso reemplaza su puntuación; no la acumula. Se permiten resultados parciales (1–4 casos). El resumen personal conserva su denominador por casos jugados y el ranking compara puntos absolutos sobre 400.

El tiempo empieza al entrar al mapa por primera vez y se pausa al abrir el resumen. Volver al mapa reanuda el reloj; leer el resumen o los QR no suma tiempo. Se mide con `performance.now()` y se limita a 24 horas por turno. `rankKey = (400 - score) * 86400001 + durationMs`, ascendente: siempre prioriza puntos y después menor tiempo, sin índice compuesto. La consulta muestra los primeros cinco y excluye `_config`, que no tiene `rankKey`.

Se guarda al continuar y se informa si falla. El TV actualiza el ranking cada cinco segundos mientras esa pantalla esté visible. No se añaden participantes ficticios cuando la colección está vacía.

Pruebas: `node --test tests/predicttodo-ranking.test.js`; prueba de navegador de final → Continuar → QR/ranking, ambos idiomas, TV sin controles activos y tableta horizontal.
