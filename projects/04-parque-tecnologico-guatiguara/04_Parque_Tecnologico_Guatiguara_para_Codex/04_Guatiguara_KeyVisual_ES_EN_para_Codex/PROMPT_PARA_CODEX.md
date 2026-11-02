# CODEX · Proyecto 04 · Aplicar KEY VISUAL bilingüe al minijuego «Activa la innovación»

**Trabaja dentro del repositorio existente del proyecto `04_Parque Tecnológico Guatiguará`. No crees una aplicación nueva ni sustituyas el proyecto principal.** Este paquete trae referencias visuales e iconos editables para que el minijuego existente se vea como los mockups aprobados y mantenga las funciones ya programadas.

## 0. Primero inspecciona el proyecto existente

Localiza rutas y componentes de TV, tableta, la sincronización tablet→TV, la selección ES/EN, el botón **Información**, el botón **Minijuego**, la infografía que se muestra al entrar a Información, el CTA/espera en TV y el mecanismo de reinicio. Verifica también si ya existe un logo aprobado del **IDB Group / BID** y una carga global de Inter.

**No toques ni elimines la sección informativa, sus recursos o la infografía del proyecto.** El desarrollo siguiente se aplica **solo a la experiencia «Minijuego»**. El usuario regresa al menú inicial con «Información» y «Minijuego» al salir del juego. Las imágenes mockup muestran el botón «Información» en la pantalla de bienvenida como referencia del menú, no como una segunda sección dentro del juego.

## 1. Copiar exactamente el directorio public/ del paquete

Copiar `public/proyecto-04/` a `<repositorio>/public/proyecto-04/`. Si el proyecto usa otra carpeta de assets estáticos, adaptar los imports sin alterar nombres de los archivos.

**PNG completos (uno por pantalla, independientes):**

| Pantalla | Español | Inglés |
|---|---|---|
| Bienvenida | `/proyecto-04/key-visual/es/01-bienvenida.png` | `/proyecto-04/key-visual/en/01-bienvenida.png` |
| Elegir reto | `/proyecto-04/key-visual/es/02-elegir-reto.png` | `/proyecto-04/key-visual/en/02-elegir-reto.png` |
| Siete laboratorios | `/proyecto-04/key-visual/es/03-siete-laboratorios.png` | `/proyecto-04/key-visual/en/03-siete-laboratorios.png` |
| Activar apoyos | `/proyecto-04/key-visual/es/04-activar-apoyos.png` | `/proyecto-04/key-visual/en/04-activar-apoyos.png` |
| Resultado | `/proyecto-04/key-visual/es/05-resultado.png` | `/proyecto-04/key-visual/en/05-resultado.png` |

Cada PNG es **1920×1080** y muestra a la izquierda la TV y a la derecha la tableta. Son la **referencia obligatoria de key visual, composición, iconos, colores, tipografía y jerarquía**. Además se entregan iconos e ilustraciones SVG en `public/proyecto-04/iconos/` e `ilustraciones/`, que **sí son recursos gráficos de producción reutilizables**.
Los archivos `referencia-tv/` y `referencia-tablet/` son **recortes independientes** de la parte correspondiente de cada mockup, para que puedas comparar por dispositivo sin recortar manualmente; son también referencias, no fondos interactivos.

## 2. Implementación visual obligatoria

**No pegues los mockups PNG como fondo de la TV ni como botones/capturas en la tableta.** Eso destruiría la interacción, la legibilidad y la adaptación responsive. *Úsalos como referencia exacta y reconstruye las pantallas en HTML/CSS/SVG editables*, aprovechando los recursos de `public/proyecto-04/`. Las imágenes estáticas completas pueden mostrarse solamente en una vista de referencia/QA, si te resulta útil al comparar resultados, no en el modo kiosco de producción.

Que la estética final se reconozca inmediatamente como los PNG entregados:

- **Inter** para todos los textos; títulos grandes de peso 700–800, copy breve y legible, alineación coherente.
- **Colores sólidos BID:** `#005CFF` azul principal, `#2E79FF` azul secundario, `#CFE1FF` azul suave, `#141414` texto oscuro y `#FFFFFF` blanco. No usar el degradado naranja→azul; no poner degradados en botones, íconos o fondos del juego.
- TV: fondo blanco, gran titular negro, acento/ceja azul, zona gráfica azul en esquina superior derecha con la ilustración conceptual del parque `ilustraciones/parque-tecnologico.svg` (encuadrada/cortada en un contenedor o máscara CSS), tarjetas claras y un footer azul institucional. Debe poder verse a 1920×1080 sin scroll ni truncamientos.
- Tableta: cabecera azul, tarjetas de selección grandes con borde fino, icono lineal, selección marcada con check azul y botón principal azul; mantener botones táctiles cómodos incluso con 7 opciones.
- Tarjetas con bordes suaves, sombras discretas, separación generosa, **íconos lineales consistentes** de `iconos/*.svg`.
- Cuando se selecciona una tarjeta en tableta, animar suavemente su selección en TV (borde azul, check y cambio de estado). Animar nodos del flujo de forma corta sin entorpecer lectura.
- Evitar un logo generado por IA: los mockups muestran un logotipo ilustrativo. **Utiliza exclusivamente el logo oficial ya aprobado dentro del repositorio**. Nunca recortes del PNG el logo simulado para presentarlo como logo institucional.

## 3. Estados funcionales del minijuego

1. **Bienvenida:** texto “Activa la innovación / Activate innovation”, flujo visual Idea→Laboratorio→Talento→Colaboración; botón “Comenzar misión / Start mission”. Se entra desde el botón actual Minijuego.
2. **Reto:** cuatro tarjetas (agroindustria, salud, herramienta digital, nuevo producto) con los SVG de `iconos/`. El usuario selecciona en tableta y TV muestra la selección al instante.
3. **Laboratorios:** mostrar **los siete simultáneamente en la TV** y una lista usable de siete en tableta. No reducirlos a tres. Siete categorías del ejemplo: AgroTech, HealthTech, Software & UX, IA & Analítica, IoT & Sensores, Prototipado digital y Ciberseguridad. **Son nombres provisionales no validados**; centralizarlos en un archivo editable.
4. **Apoyos:** tarjetas de Talento y formación, Prototipado y validación, Articulación con aliados, Acompañamiento técnico; permitir seleccionar **exactamente dos** apoyos antes de continuar. Reflejar ambos en la TV en vivo.
5. **Resultado:** presentar Reto→Laboratorio→Apoyos→Oportunidad, usar textos según selección y cerrar con “Así se activa la innovación / This is how innovation is activated”. El resultado es **pedagógico, no una predicción técnica ni un logro demostrado**. Permitir “Volver a jugar / Play again” y volver al menú principal.

Usa el HTML `FUENTE_MiniJuego_Aprobado.html` como **referencia funcional** para el juego, pero adapta a los componentes, rutas y canales existentes. **No metas un iframe** salvo que justifiques su necesidad y compruebes la sincronización real.

## 4. Doble dispositivo, i18n y acceso

- Mantener los enlaces de TV y tableta **ya existentes**, sin inventar rutas nuevas que rompan el controlador actual. La TV es visualización; la tableta es el controlador.
- Conservar el mecanismo de sincronización del repositorio y su gestión de sesiones / reconexión / timeout. No duplicar sockets, listeners o timers. Al entrar a Minijuego ocultar el CTA que corresponda; al salir restaurar el CTA y menú existentes.
- Mantener el selector ES/EN que tenga la aplicación: textos, botones, estados, descripciones y resultados deben traducirse de forma coherente. Copys de partida en `contenido-bilingue-04.json`. No cambiar idioma usando dos imágenes que parecen pulsables; la UI final debe ser real.
- Evitar contenidos ajenos al tema del parque o indicios de IA en vivo. Reto y oportunidades son ejemplos hipotéticos.

## 5. Recursos reutilizables y ubicaciones

- Referencias (diseño): `/proyecto-04/key-visual/{es|en}/...png`.
- Iconos finales (usar en el juego): `/proyecto-04/iconos/agroindustria.svg`, `salud.svg`, `herramienta-digital.svg`, `nuevo-producto.svg`, `ia-analitica.svg`, `iot-sensores.svg`, `ciberseguridad.svg`, `formacion.svg`, `aliados.svg`, `acompanamiento.svg`, `laboratorio.svg`, `oportunidad.svg`, etc.
- Ilustración principal (uso real): `/proyecto-04/ilustraciones/parque-tecnologico.svg`.
- Forma de acento (uso opcional): `/proyecto-04/ilustraciones/acento-esquina.svg`.
- Tokens visuales opcionales: `/proyecto-04/tokens-04.css` (integrar en el tema existente sin duplicaciones).

## 6. Pruebas obligatorias de Codex

- Verificar en resolución TV 1920×1080 todas las 5 pantallas comparando con los 5 PNG ES y 5 PNG EN.
- Verificar experiencia táctil en la tableta real: 4 opciones de reto, 7 de laboratorio, 4 apoyos y dos seleccionados.
- Verificar los 4 retos por separado (no solo AgroTech). Estados iniciales, cambio de selección, atrás, reinicio, timeout, reconexión y menú.
- Verificar **Información** y su infografía actual no se alteraron.
- Verificar cambios de ES↔EN sin reiniciar el juego cuando el controlador ya lo permite.
- Verificar que el diseño no usa el degradado naranja a azul y que **no hay pantallas hechas como una sola imagen estática**.
- Entregar listado de archivos modificados, capturas comparativas y pendientes de validación institucional de los siete laboratorios.

**Resultado esperado:** el minijuego conserva su funcionamiento, pero usa exactamente el nuevo lenguaje gráfico de los diez PNG y los SVG editables del paquete. El área de Información, CTA y la experiencia TV+tableta existente siguen intactos.
