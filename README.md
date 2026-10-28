# AI Exhibition Hall — Menú principal interactivo (v0.1)

Starter para programar en **Codex**, basado en la pantalla de tableta horizontal aprobada para el BID. Incluye el menú de **11 proyectos en orden alfabético**, estructura separada por carpetas y las bases para **3 estaciones tablet–pantalla independientes**.

## Ejecutar

Se necesita **Node.js 18 o superior**. No se descargan librerías; no hay dependencias externas.

```bash
node server.js
```

También funciona con `npm start` o `npm run dev` (no hace falta `npm install`).

Abrir en un navegador:

- **Tableta estación 1:** http://localhost:4173/?station=1
- **Pantalla estación 1:** http://localhost:4173/display.html?station=1
- **Tableta estación 2:** http://localhost:4173/?station=2
- **Pantalla estación 2:** http://localhost:4173/display.html?station=2
- **Tableta estación 3:** http://localhost:4173/?station=3
- **Pantalla estación 3:** http://localhost:4173/display.html?station=3

En el ordenador de demostración, abre la tableta y la pantalla en pestañas o monitores diferentes. En dispositivos distintos conectados a la misma red local, **reemplaza `localhost` por la IP local del ordenador que ejecuta Node.js** (aparece en el terminal). Configura el firewall del ordenador para permitir el puerto 4173 solo en la red privada/autorizada.

### Uso sin servidor

Se puede abrir `index.html` desde un navegador para visualizar el menú y navegar entre carpetas. **La sincronización entre tableta y pantalla necesita ejecutar `node server.js`**.

## Qué funciona actualmente

- Inicio horizontal en inglés, inspirado en el mockup entregado.
- 11 tarjetas táctiles con fondo ilustrativo, títulos y numeración real.
- Ruta propia y carpeta editable para cada proyecto.
- Navegación `Home` y `Back to Projects` dentro de las pantallas de proyecto.
- La primera vista de un proyecto ofrece **Project Overview** e **Interactive Mini-Game**.
- La vista de Project Overview tiene seis apartados **solo como estructura**, todavía sin textos finales.
- Un placeholder honesto dentro de Interactive Mini-Game; **los 11 juegos siguen pendientes de programar**.
- Receptor visual básico (`display.html`) que refleja qué proyecto o sección fue seleccionado.
- Sincronización independiente de estaciones 1, 2 y 3 por red local mediante un servidor Node básico.

## Estructura

```text
AI_Exhibition_Hall_Codex_Starter/
├── index.html                    # Menú principal en la tableta
├── display.html                  # Receptor temporal de la pantalla grande
├── server.js                     # Servidor LAN + estado por estación
├── package.json
├── shared/
│   ├── styles.css                # Diseño base
│   ├── projects.js               # Registro de los 11 proyectos
│   ├── brand.js                  # Header, iconos y footer
│   ├── home.js                   # Menú principal y navegación
│   ├── project-page.js           # Plantilla compartida de proyecto
│   ├── display.js                # Receptor de contenido
│   └── sync.js                   # API de sincronización
├── assets/
│   ├── cards/                    # 11 fondos visuales derivados del mockup de referencia
│   └── brand/                    # Cabecera de referencia
└── projects/
    ├── 01-aquadata/
    │   ├── index.html
    │   ├── module.js             # Aquí se programará esta experiencia
    │   └── README.md
    ├── 02-bogota-traffic-prediction/
    ├── 03-costa-rica-smart-borders/
    ├── 04-parque-tecnologico-guatiguara/
    ├── 05-profe-gabi/
    ├── 06-reglac/
    ├── 07-csd-maiia/
    ├── 08-siemplea/
    ├── 09-teachy/
    ├── 10-vpc-country-intelligence/
    └── 11-rsm-rise/
```

## Programar un proyecto, sin afectar a los demás

1. Selecciona una carpeta en `/projects/XX-nombre/`.
2. Edita su archivo `module.js`. Las secciones del overview tienen IDs `what`, `solution`, `ai`, `results`, `users`, `before-after`.
3. Implementa el contenido real dentro de `mountMiniGame(container)` con contenido validado por el cliente.
4. Para informar a la pantalla grande de una acción: `AI_SYNC.send({ view: 'game', projectId: '01', section: 'step-1' })`. El receptor compartido puede ampliarse en `shared/display.js` para renderizar los resultados específicos.
5. Verifica el funcionamiento en las estaciones 1–3 antes de producir el evento.

## Alcance y cautelas

- Esta entrega se concentra en **el menú principal y la estructura de navegación**, no en las 11 experiencias finales.
- El receptor de pantalla grande es un **placeholder funcional** que se sustituirá por vistas complementarias diseñadas por proyecto.
- La sincronización es un prototipo para red **local confiable**; antes del evento hacen falta pruebas de estabilidad, reconexión, permisos, bloqueo del navegador, apagado de pantallas y modo kiosco.
- La idea de proyecto 06 `RegLAC` usa el nombre vigente de la tabla del cliente. MAIIA y Country Intelligence continúan sujetos a validación narrativa, y RSM RISE a aprobación del equipo responsable.
- Los fondos de las tarjetas se derivaron de la **imagen de referencia compartida**. Deben sustituirse por fotografías y marca autorizadas para la versión final.
- El símbolo junto a la palabra `BID` en la cabecera es una **aproximación gráfica para el prototipo**, no un logotipo oficial aprobado.
- **Duración por experiencia:** en las propuestas anteriores se trabajó con hasta 60 segundos; requiere confirmación final del cliente.

## Próximo paso recomendado en Codex

> Vamos a desarrollar el proyecto 01 AquaData sin modificar las otras 10 carpetas. Implementa su recorrido de Project Overview y la dinámica interactiva validada. Mantén la tableta como mando, la pantalla grande como visualización, la navegación global y la sincronización por estación. No inventes cifras ni resultados.
