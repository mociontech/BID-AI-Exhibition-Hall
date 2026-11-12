# 03 — Costa Rica Smart Borders / VUCE 3.0

Módulo individual del AI Exhibition Hall (tableta = mando, TV = visual sincronizado).

- `index.html`: envoltorio de navegación del proyecto.
- `module.js`: controlador de la tableta (portada con key visuals; Información y Minijuego se eligen libremente, sin espera; la TV muestra el aviso «press Interactive experience» mientras está la ficha).
- `module.css`: estilos de integración (zonas táctiles sobre la portada, iframe del juego).
- `game/`: **minijuego** (HTML, CSS y JS propios, sin dependencias, bilingüe ES/EN, manual de marca BID).
  - `game/index.html` · `game/game.css` · `game/game.js`
- `public/`: key visuals aprobados de la portada (tableta) y de la ficha (TV).
- `Codex_Paquete_CR_Smart_Borders_VUCE/`: material de referencia; el prototipo V5 sigue disponible
  como respaldo abriendo la página del proyecto con `?station=X&legacy=1`.

## Artes aprobadas (nov 2026)

- Portada de la tableta en inglés: `public/cover-en-1920x1080.png` (tarjetas 01 Information · 02 Interactive experience). Las zonas táctiles están en `module.css` (`.crb-hit--info` y `.crb-hit--game`). El selector ES/EN se dibuja con CSS sobre la franja azul.
- Ficha de Información en la TV en inglés: `public/info-en-1920x1080.png`. El aviso «The mini-game is now available» se muestra sobre el panel azul izquierdo para no tapar las cifras.
- Las versiones en español conservan las artes anteriores hasta recibir las nuevas (`COSTA_RICA_ART.es` en `shared/display.js` y `art.es` en `module.js`).

## Ajustes de simplificación (9 nov 2026)

- Barras de tableta y TV idénticas (franja azul, logo blanco, 4 fases, Volver · ES/EN · Inicio; en la TV son solo visuales). Botón «Volver» del juego: la tableta vuelve a la portada del proyecto (mensaje cr-back a module.js).
- Sin emojis: set de iconos de línea fina (ICONS en game.js y tv.js). Sin rótulo «Ejemplo simulado».
- Revisión manual: título «Busca irregularidades», lectura institución → documentos → semáforo en columna derecha; la franja inferior muestra aviso, respuesta y «el camión avanza».
- Paso 3 de la IA = «Sistema híbrido» (reglas + aprendizaje automático + azar). Popups «¿Cómo se juega?», «El reto en Peñas Blancas» y «¿Cómo lo hace VUCE 3.0?» reducidos a lo esencial.
- TV: carretera a 66 vh con la foto completa (anclada abajo), tablero compacto sin repetir el camión.

## Dinámica del minijuego (`game/`): un camión, una frontera

1. **Llega un camión** — un solo camión (`CR-104` alimentos envasados, `CR-117` frutas o `CR-126` lácteos,
   rota por turno) debe pasar por 5 instituciones: **Aduana**, **Policía**, **Ministerio de Salud**,
   **Sanidad Animal** y **Sanidad Vegetal** (`ENTITIES`, en ese orden). En la TV se ve la carretera con las
   5 casetas (techo azul, ventana con el icono, nombre y semáforo) y la frontera.
2. **Tú revisas: 5 paradas** — el camión se detiene en cada institución. En la tableta aparecen la
   regla de esa institución y sus 3 documentos; el visitante pone el **semáforo de riesgo** (verde ·
   dejar pasar, amarillo · falta un documento, rojo · algo no coincide). Tras cada decisión se muestra el
   semáforo correcto, el camión avanza a la siguiente parada en la TV y en la tableta, y el cronómetro
   (pausado mientras hay un popup) sigue. Al salir de la 5.ª parada el camión cruza: "5 paradas · 5
   filas · 5 revisiones", tu tiempo, aciertos y un **tiempo simulado en frontera ≈ 1 h 40 min**.
3. **La IA revisa: 1 parada** — el mismo camión, en **5 pasos que el visitante dispara uno a uno**
   desde la tableta (lee la tarjeta del paso, toca «Ver en la pantalla» y la animación ocurre en la pantalla
   grande): 1 las 3 cajas se unen en una sola ventanilla (VUCE 3.0) · 2 el camión para una sola vez ·
   3 la IA aplica las 3 reglas una tras otra (cada institución recibe su luz) · 4 **cada institución decide**
   (botón «Cada institución decide la decisión final»: Aduanas, Sanidad y Salud se van marcando con ✓ una por
   una, sin repetir el semáforo) · 5 cruza con un solo semáforo (el más exigente de los tres). Nada avanza solo. Tras cada decisión manual también hay que tocar
   «Siguiente parada» para que el camión avance. Desde el paso 2 hay un botón «Repetir paso N» que vuelve un
   paso atrás y repite su animación en la TV (la unión de las 3 cajas dura ~11 s para que dé tiempo a verla).
4. **Comparación** — en la **tableta** solo un letrero grande «Mira la pantalla: ahí están los resultados
   comparativos, revisión humana vs VUCE 3.0» y los botones «¿Y en la vida real?», «Jugar otro turno» y «Volver
   al inicio» (sin cabecera ni cifras: todo se ve en la TV). En la **TV**, sin cabecera: el **gráfico de
   barras verticales "Revisión humana vs VUCE 3.0"** (negro / azul: paradas, tiempo, en frontera, aciertos),
   *Lo que te llevas de VUCE 3.0* en 3 tarjetas (una sola ventanilla · 3 reglas a la vez · un solo semáforo) y el
   cierre "La IA une las revisiones y señala pistas. La persona decide." Sin botones.

La tableta es deliberadamente simple: sin columna lateral; cada pantalla muestra solo lo necesario para
decidir (institución, documentos, semáforo) o avanzar (tarjeta del paso + botón). Al elegir un color, un
destello de pantalla completa de ese color aparece en la tableta y en la TV; en la etapa de la IA el
destello se repite con cada regla que aplica (paso 3), en azul con cada institución que confirma (paso 4), y al llegar a la comparación (color del semáforo final). En la TV la frontera es una
caseta de peaje con barrera que se levanta cuando el camión cruza.
Las paradas (`ENTITIES`), las cargas (`CARGOS`) y los escenarios por turno (verde / falta un documento /
inconsistencia, con al menos una pista por turno) son **simulados y educativos**. Los **tiempos "en
frontera" son ilustrativos** (`SIM={stop:20,ai:5}` minutos en `game.js`): cámbialos ahí si el equipo del
proyecto entrega cifras documentadas. No se usan datos reales de la VUCE.

### Popups interactivos con datos del proyecto (`COPY.*.pop` en `game.js`)

Los camiones y documentos siguen siendo simulados, pero el juego se ancla al proyecto real con cuatro
popups bilingües (etiqueta "Dato del proyecto · VUCE 3.0"), con tarjetas que el visitante toca:

| Popup | Dónde aparece | Interacción |
|---|---|---|
| **¿Cómo se juega?** | Automático al entrar a "Tú revisas" (el cronómetro arranca al cerrarlo) y botón ⓘ junto al título | Explica las 3 paradas y los tres colores del semáforo con los que decide el visitante. |
| **Así era antes en Peñas Blancas** | Chips de la intro (📍 Peñas Blancas · 🚛 650 camiones al día · 🏛️ 5 instituciones) y automático al terminar la ronda manual si aún no se vio | Toca las 5 instituciones: cada una "abre" el camión y un contador muestra cuántas veces se abría el mismo camión. |
| **¿Cómo lo hace VUCE 3.0?** | Automático al entrar a "La IA revisa" (la lectura empieza al cerrarlo) y botón ⓘ junto al título | Tres tarjetas: reglas de cada institución, aprendizaje automático (330.000 registros históricos) y selección aleatoria. |
| **El semáforo de riesgo** | Botón "¿Qué significa el semáforo?" cuando la IA termina y en la pantalla de comparación | Toca rojo / amarillo / verde. El veredicto de la IA ya se muestra como semáforo. |
| **¿Y en la vida real?** | Botón en la pantalla de comparación | Antes vs. ahora, 330.000 registros, 360.000 trámites en un año y la siguiente etapa (riesgo antes de llegar a la frontera). |

En «¿Cómo lo hace VUCE 3.0?» las 3 fichas (reglas, aprendizaje automático, selección aleatoria) salen
abiertas de entrada, para que el sistema híbrido se entienda aunque la persona toque el botón sin explorar.
Los popups viven dentro del iframe de la tableta; la TV no los refleja (a propósito: tapaban la escena). Se cierran con ✕, con el botón
principal o tocando el fondo, y se reinician con "Jugar otro turno" o "Inicio".

## Marca

Inter · IDB Blue #005CFF · tintes Blue -1..-4 · grises Black -1..-4 · semánticos rojo #FC5D5D,
amarillo #FFCB52, verde #9BDE54 · texto alineado a la izquierda · sin degradado en texto ni datos.

## Sincronización tableta → TV

La tableta y la TV están conectadas durante todo el minijuego. El juego (`game/game.js`, función
`tvPacket`) envía por `postMessage` un resumen al controlador (`module.js`), que lo publica en el
estado de la estación (`packet.game`, versión `v:2`). El servidor lo valida con `cleanCostaRica` y la
TV lo pinta con `tv.js` (`window.CRB_TV`), con estilos `.crtv-*` en `module.css`.

Lo que muestra la TV, en grande y sin botones:

- **Etapa** (stepper 1-4).
- **Escena fotorrealista**: fondo generado con IA (`public/tv-border.jpg`, peaje de 5 columnas con letreros en
  blanco, caseta fronteriza, selva y montañas de Costa Rica) y camión generado con IA recortado por croma
  (`public/tv-truck.png`). Sobre la foto van capas HTML: las tarjetas de las 5 instituciones sobre los letreros
  (posiciones medidas en `PILLARS` de `tv.js`), el letrero «FRONTERA · Costa Rica» con la bandera, una barrera
  propia que se levanta al cruzar y el rótulo con el ID y la carga sobre el furgón. Las imágenes se generaron en el
  archivo de Figma «VUCE 3.0 · escena TV (imágenes generadas)». La versión anterior era: peaje con techo y columnas
  bajo las 5 casetas (la regla de cada institución solo se lee en la tableta), letrero «FRONTERA · Costa Rica»
  con la bandera, caseta y barrera, y un tráiler con el ID y la carga pintados en el furgón. Carretera con
  la frontera y el camión, que avanza con transición CSS a la posición `pos` del paquete (0 salida ·
  1-5 paradas · 6 cruzó; `tv.js` reparte las casetas entre el 10 % y el 64 % del ancho según
  `stops.length`). En la etapa de la IA las 5 cajas se deslizan y se **unen en una sola ventanilla
  VUCE 3.0** con las 5 reglas dentro; el camión para solo ahí y luego cruza.
- **Tablero**, a propósito limpio: camión y parada actual; una sola tarjeta de estado ("decidiendo el
  semáforo de…", "el camión avanza…", semáforo tras cada decisión, "la IA aplica las 5 reglas a la vez",
  "cada institución confirma la decisión final" con las 5 instituciones marcándose con ✓); tras cada
  decisión manual, el recordatorio «Toca "Siguiente parada" en la tableta» como píldora aparte, abajo y
  sin iconos; y solo el **cronómetro** a la derecha (sin tarjeta de explicación ni tiempo simulado).
- Al final: gráfico de barras **Revisión humana vs VUCE 3.0** + **Lo que te llevas de VUCE 3.0** en 3 tarjetas + semáforo final (la tableta solo muestra las cifras y un letrero «Mira la pantalla»).

La tableta NO muestra el camión: solo la interacción (documentos, semáforo, lista de los 5 pasos de la IA
y un aviso "Mira la pantalla"; el copy nunca dice "TV"). Toda la animación vive en la TV, a propósito lenta (unión de cajas 11 s, viaje
5,2 s, cada regla 2,6 s, cada confirmación 1,7 s; constantes `MERGE_MS`, `TRAVEL_MS`, `SCAN_MS`, `CONFIRM_MS`,
`FEEDBACK_MS` en `game.js`) y con una tarjeta "Paso N · …" que explica qué hace VUCE 3.0 en cada momento
(`COPY.*.explain`). El paquete lleva solo textos ya traducidos, semáforos, posición del camión y tiempos:
**nunca los documentos ni las preguntas**, que viven en la tableta. Fuera del juego `game` vuelve a
`null` y la TV muestra la ficha de Costa Rica. `#es`/`#en` cambian el idioma en ambas pantallas y
`[data-act="home"]` regresa a `/index.html?station=X`.

## Portada HTML (12 nov 2026)

- La portada de la tableta y la de la TV ahora son HTML real, no una imagen, siguiendo `prueba1.png`. El marcado vive en `cover.js` (`window.CRB_COVER`) y lo usan `module.js` (tableta, interactiva) y `shared/display.js` (TV, solo visual).
- La foto de la tarjeta «About the project» (`public/cover-truck.jpg`) se recortó de `prueba1.png`; conviene reemplazarla por el original en alta resolución cuando esté disponible.
- La barra conserva ES/EN y «Start/Inicio»; «Back/Volver» aparece solo después de elegir la información. La infografía de la TV no cambia.

## Infografía animada (12 nov 2026, local)

- «Sobre el proyecto» en la TV ya no es una imagen: `cover.js` (`window.CRB_SHEET`) reconstruye en HTML la nueva `Infografia.png` y la anima por elementos (panel azul, títulos, tarjetas con icono, banda de impacto y cifras), con la misma secuencia que la infografía de AquaData basada en la referencia «Iniciativa 2.2_animada_PRO».
- El PNG queda como respaldo en inglés: `public/info-en-2026-11.png`.
- El texto en español es traducción propia del PNG en inglés y está pendiente de aprobación. Para que quepa se acortó: «Riesgo evaluado por separado», «5 entidades» y «para entrenar la IA».
