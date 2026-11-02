# Contrato de integración y referencia de archivos

## Punto de partida

La experiencia visual que se aprobó está en `minijuego/index.html` y las capturas de `referencias-visuales/`. Usar el HTML para construir componentes, y los PNG únicamente para contrastar visualmente.

## Datos y máquina de estados del HTML

En el bloque `<script>`:

- `labs`: 7 tarjetas ilustradas, con `id`, `name`, `short`, `detail`, `art`.
- `missions`: 4 retos ilustrados con `id`, `name`, `short`, `recommended`, `hero`, `opportunity`.
- `supports`: 4 apoyos, de los que se eligen 2.
- `state.step`: de 0 (bienvenida del minijuego) a 4 (resultado).
- `state.mission`, `state.lab`, `state.supports`: elección del visitante.
- `graphic(kind)`, `ecosystemSvg()`, `supportSvg()`: visuales SVG generados por la página, sin archivos de imagen externos.
- `render()`: actualiza ambos paneles.
- `transition(action,id)`: procesa las decisiones.

**Nota:** el juego es una sección que debe abrirse DESDE EL BOTÓN «Minijuego» de la experiencia existente. `state.step=0` NO debe reemplazar al menú global «Información / Minijuego».

## Propuesta de estado global (adaptar al existente)

```js
// ESQUEMA DE REFERENCIA; NO reemplazar el estado del proyecto si ya existe.
const experience = {
  mode: 'menu', // 'menu' | 'info' | 'game'
  game: {
    step: 0,
    mission: null,
    lab: null,
    supports: []
  }
};
```

Los botones globales deben cambiar `experience.mode`, **no** sólo la ruta de la tableta. El televisor y la tableta derivan la pantalla del mismo estado de la sesión.

## Flujo de sesión

| Acción desde tableta | Contenido en TV | Contenido en tableta |
|---|---|---|
| Entrada | CTA / espera existente | Menú Información / Minijuego existente |
| Información | Infografía actual aprobada | Controles informativos actuales |
| Minijuego | Bienvenida / escena de activación | Comenzar misión |
| Seleccionar reto | Cuatro retos y selección | Cuatro botones ilustrados |
| Seleccionar laboratorio | Siete tarjetas y selección | Siete tarjetas táctiles |
| Seleccionar apoyos | Conexiones activadas | Opciones y contador 0 a 2 |
| Resultado | Ruta de innovación | Resumen y «Jugar de nuevo» |
| Salir | Restaurar TV inicial | Menú principal con ambos botones |

## Separación de dispositivos

El prototipo soporta `?view=both`, `?view=tv` y `?view=tablet`. En el HTML original, la sincronización es sólo para páginas del **mismo origen** mediante `BroadcastChannel`/`localStorage`. **No funciona por sí sola entre computadores/tabletas independientes**. Codex debe conectar el estado al transporte actual del proyecto si está disponible. Evitar fiarse de abrir dos URLs en dispositivos distintos sin backend.

## Qué NO hacer

- No borrar ni simplificar el botón Información o su infografía existente.
- No reemplazar el menú global con el inicio del juego.
- No dibujar los siete laboratorios a partir de una imagen estática.
- No reducir los siete laboratorios a tres opciones.
- No añadir preguntas tipo trivia largas.
- No afirmar que los nombres provisionales son laboratorios oficialmente confirmados.
- No introducir degradados naranja-azul.
- No modificar otros proyectos del AI Exhibition Hall.

## Referencias de diseño

1. `01_inicio_tv_tableta.png`: pantalla de introducción en la vista conjunta.
2. `02_seleccion_siete_laboratorios.png`: rejilla de siete tarjetas en TV + selección en tableta.
3. `03_tableta_laboratorios.png`: tarjetas táctiles de selección de laboratorio.
4. `04_resultado.png`: resultado pedagógico y ruta.
5. `05_tv_individual.png`: formato TV aislado.
6. `06_tableta_individual.png`: formato tableta aislado.
7. `07_vista_movil.png`: comprobación de comportamiento responsivo.

Todos son PNG reales de la página de referencia, y las ilustraciones de juego ya están integradas como SVG en `minijuego/index.html`.
