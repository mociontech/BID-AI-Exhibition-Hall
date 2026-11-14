# Métricas organizadas en Firestore

La sincronización tableta–TV sigue en Realtime Database. Las métricas se guardan en Cloud Firestore, base `(default)`, proyecto `f1-sap`.

Hay diez colecciones: `BID_AI_01_AquaData`, `BID_AI_02_BogotaTraffic`, `BID_AI_03_SmartBorders`, `BID_AI_04_Guatiguara`, `BID_AI_05_ProfeGabi`, `BID_AI_06_RegLAC`, `BID_AI_07_MAIIA`, `BID_AI_08_Teachy`, `BID_AI_10_CountryIntelligence` y `BID_AI_11_RISE`.

Dentro de cada colección se ven exactamente tres documentos:

```text
BID_AI_01_AquaData
├── visits / entries / 20261114T051620123Z_ab12cd34_0001
├── clicks / entries / 20261114T051628456Z_ab12cd34_0002
└── durations / entries / 20261114T051635789Z_ab12cd34_0003
```

El ID de cada evento comienza con fecha y hora UTC ordenables. El documento incluye `occurredAt` como timestamp de Firestore, `visitId` anónimo y `station`. Los clics agregan `action`; las duraciones, `durationMs`. Para saber cuántas veces entraron, cuenta los documentos de `visits/entries`. El tiempo se registra cada 15 segundos y al ocultar o salir; para una visita se usa la mayor muestra de `durationMs`, sin sumar las muestras repetidas.

Los registros anteriores se migraron y verificaron antes de retirarlos. El respaldo JSON quedó en la carpeta exterior del repositorio como `firestore-analytics-backup-*.json`. El script [migrate-firestore-analytics.mjs](scripts/migrate-firestore-analytics.mjs) permite repetir el proceso si aparecen registros antiguos.

Las reglas propuestas en [FIRESTORE_ANALYTICS_RULES.txt](FIRESTORE_ANALYTICS_RULES.txt) cubren la estructura nueva. Si hay una regla general más permisiva, esa regla también puede autorizar escrituras. La TV y el servidor local no generan estas métricas.
