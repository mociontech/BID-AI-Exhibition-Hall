# PROMPT MAESTRO PARA CODEX
## Proyecto: 03_Costa Rica Smart Borders / VUCE 3.0

Quiero que rediseñes e implementes una experiencia interactiva HTML/CSS/JS para la estación **03_Costa Rica Smart Borders / VUCE 3.0** del **AI Exhibition Hall**.

## Objetivo general
Crear una experiencia **más intuitiva, visual, didáctica y atractiva** para una persona que no sabe nada de IA ni del sistema VUCE 3.0. La experiencia debe sentirse como una **simulación / panel de control educativo**, no como una presentación técnica ni una trivia pesada.

El usuario debe aprender, jugando e interactuando, lo siguiente:
1. Que en frontera llegan muchas cargas/camiones y no se puede inspeccionar todo.
2. Que una decisión completamente manual usa menos información y depende del visitante.
3. Que la **IA automática** prioriza camiones usando patrones detectados en los datos.
4. Que el **Híbrido automático VUCE 3.0** combina tres mecanismos:
   - **Reglas**
   - **IA**
   - **Muestra de control** (una pequeña selección adicional)
5. Que la inspección confirma hallazgos, pero la IA apoya la priorización.

---

## Qué conservar del funcionamiento
Tomar como base la lógica y/o el flujo del archivo original `simulador_vuce_animado.html` y del prototipo funcional más reciente `03_CR_VUCE_Torre_Control_V5_index.html`, pero **rediseñando la interfaz** para que sea mucho más clara.

La dinámica debe quedar así:

### 1. Manual — Tú decides
- El usuario toca / selecciona manualmente los camiones que quiere enviar a inspección.
- Debe existir un límite de cupos de inspección.
- Debe verse claramente que aquí **el visitante toma la decisión**.

### 2. IA automática
- El sistema analiza automáticamente los camiones del mismo turno.
- Debe verse una animación o transición de análisis.
- Aquí **no decide el usuario**; decide el sistema en función de patrones.
- Debe mostrar brevemente por qué un camión fue priorizado.

### 3. Híbrido automático VUCE 3.0
- El sistema selecciona automáticamente usando tres capas educativas:
  1. Reglas
  2. IA
  3. Muestra de control
- Estas capas deben presentarse paso a paso y con mucha claridad visual.
- Debe sentirse como la experiencia protagonista.

### 4. Resultados comparativos
- Comparar los mismos camiones en tres métodos:
  - Manual
  - IA automática
  - Híbrido automático VUCE 3.0
- La comparación debe ser simple de entender: nada de gráficas complejas o de puntos difíciles de leer.
- Lo ideal es comparar con **los camiones mismos** y mostrar:
  - cuáles fueron inspeccionados
  - cuáles dieron hallazgo
  - cuáles no dieron hallazgo
- El visitante debe entender rápido qué hizo cada método.

---

## Tono UX/UI
Piensa como **diseñador gráfico + experto en UX/UI educativo**.
La experiencia debe sentirse:
- amigable
- limpia
- moderna
- muy visual
- entendible en pocos segundos
- con jerarquías claras
- con buen copy educativo
- con widgets y tarjetas fáciles de escanear

No quiero una interfaz demasiado técnica.
No quiero una trivia compleja ni grandes bloques de texto.
No quiero gráficas abstractas difíciles de interpretar.

Sí quiero:
- tarjetas claras
- camiones visuales
- íconos
- pasos numerados
- indicadores de capacidad
- chips de riesgo / hallazgos
- cajas educativas tipo “qué aprendiste”, “cómo funciona”, “siguiente paso”, etc.
- paneles visuales que expliquen lo que está pasando

---

## Sistema visual / marca
Usar el **manual de marca del BID** incluido en el paquete.
Pautas principales:
- Tipografía tipo **Inter** o equivalente cercana
- Azul principal BID: **#005CFF**
- Estilo limpio, fondos claros, buena legibilidad
- Mantener estética del **AI Exhibition Hall**
- No usar el degradado naranja-azul
- Usar iconografía clara y consistente

---

## Qué usar como inspiración visual
Dentro del paquete encontrarás referencias visuales de dirección de arte y UI.
**No copies exactamente una sola pantalla**; úsalas como inspiración para construir un sistema visual coherente.

Úsalas para inspirarte en:
- estilo de camiones por tipo de carga
- tarjetas de métodos de decisión
- widgets de capacidad / progreso / estados
- tarjetas educativas
- navegación / tabs / botones
- mini slides o widgets explicativos

---

## Contenido / microcopy
El copy debe ayudar a aprender, no sonar técnico.
Ejemplos de enfoque:
- “Tú decides qué revisar”
- “La IA analiza patrones y prioriza”
- “El híbrido combina reglas, IA y una muestra de control”
- “Inspeccionar confirma si hubo hallazgo”
- “No se trata de inspeccionar más, sino de priorizar mejor”

Agregar pequeños bloques de aprendizaje como:
- Qué está pasando
- Qué decidió el sistema
- Qué aprendiste
- Qué hace cada capa

---

## Idiomas
La interfaz debe ser bilingüe:
- Español
- Inglés

Debe existir un switch ES / EN funcional.
Todo el contenido visible debe cambiar de idioma.

---

## Responsive / dispositivo
Prioridad de diseño: **tableta horizontal**.
También debe verse correctamente en desktop y adaptarse de forma razonable a móvil.

---

## Estructura recomendada de pantallas o secciones
1. **Pantalla / bloque de introducción**
   - título del simulador
   - breve explicación
   - call to action

2. **Panel principal del turno**
   - escenario seleccionado
   - cupos de inspección
   - calidad de información / condiciones del turno (si aplica)
   - lista o grilla de camiones
   - explicación breve del paso actual

3. **Modo Manual**
   - usuario selecciona camiones
   - feedback visual de cupos ocupados

4. **Modo IA automática**
   - análisis automático
   - explicación de patrones

5. **Modo Híbrido automático VUCE 3.0**
   - animación por capas
   - reglas → IA → muestra de control
   - explicación simple de cada capa

6. **Resultados**
   - comparación Manual vs IA automática vs Híbrido automático
   - visualmente simple
   - con resumen de aprendizaje

---

## Requisitos técnicos
- HTML, CSS y JS puros (sin dependencias pesadas)
- código ordenado y fácil de modificar
- separar estilos y scripts de forma clara si conviene
- mantener funcionamiento offline si es posible
- usar datos simulados / sintéticos
- dejar comentarios para entender la lógica

---

## Archivos incluidos en este paquete
- manual de marca BID
- simulador original
- prototipo funcional actual V5
- referencias visuales / UI kits / tableros visuales
- referencias bilingües ES/EN

---

## Entregable esperado
Quiero una nueva versión del simulador que:
- mantenga la lógica educativa del proyecto
- se entienda mejor visualmente
- tenga mejor UX/UI
- sea más clara para personas no expertas
- use el lenguaje y la estética adecuados del BID y AI Exhibition Hall

Si necesitas reutilizar la lógica del archivo original, hazlo.
Si necesitas reorganizar el layout por completo, hazlo.
Lo importante es que la experiencia final sea **más clara, más didáctica y más atractiva**.