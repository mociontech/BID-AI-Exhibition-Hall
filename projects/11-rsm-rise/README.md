# 11 — RSM RISE

Experiencia bilingüe de tableta y TV para AI in Action. El diseño actual se conserva y el minijuego recupera la mecánica del HTML entregado por el usuario, `RSM RISE Prototipo (2).html`, idéntico al archivo `(1)`.

## Mecánica del prototipo restaurada

La introducción conserva el menú del proyecto, la información animada y el desbloqueo de 10 segundos. Dentro del minijuego se sigue este recorrido:

1. **Elegir una propuesta:** línea de crédito para pymes (186 páginas), metro urbano (412) o planta solar (268). Los tres casos y los datos en inglés proceden del prototipo.
2. **Ejecutar RISE:** comparación simultánea entre lectura manual y lectura con RISE. La animación dura 4,8 segundos; la lectura manual alcanza aproximadamente un tercio de las páginas. Se extraen resumen, modelo de negocio, riesgos, mitigantes, vacíos y clasificación. El indicador `~3×` se presenta como comparación ilustrativa de tiempos simulados.
3. **Decidir sobre la clasificación:** «¿Por qué?» muestra el razonamiento y tres evidencias con sus páginas. «Aceptar» y «Ajustar» registran la elección del participante sobre la clasificación. Ambas opciones permiten continuar, como en el prototipo; no se trata de una pregunta con respuesta correcta ni de aprobar/rechazar una inversión. Ajustar registra la intención de ajuste, igual que el HTML de referencia; no hay un editor de modelos ni un expediente real.
4. **Supervisar años después:** línea de tiempo de años 0–4, alerta RISE del año 2 frente a revisión anual del año 3, hallazgo específico del caso y tres operaciones similares en la memoria. El participante elige monitorear, hablar con el cliente o escalar a Activos Especiales. Las tres acciones están disponibles, sin calificarlas como correctas o incorrectas.
5. **Cerrar el ciclo:** resumen de propuesta, decisión de clasificación y acción de supervisión. Un mosaico nuevo, el documento ilustrativo #8.201, se suma al muro de memoria institucional. Cierre: «La IA lee. Los expertos deciden. La institución recuerda».

Se eliminó el cuestionario de Proyecto Aurora. Las cifras de páginas, las evidencias, las confianzas 95/88/91%, las alertas, el muro de 8.200 documentos y las lecciones son ilustraciones del caso ficticio del prototipo. La confianza representa una clasificación simulada, no una probabilidad de impago ni un resultado real del modelo. No se añaden afirmaciones de métricas verificadas o de estado de producción.

## Arquitectura y archivos

Se conserva `mountController`, el shell de proyecto, `AI_SYNC`, el receptor compartido y la identidad existente de IDB Group. Los controles son HTML real; la memoria se dibuja en canvas, y los iconos son SVG. No se ejecuta el prototipo en un iframe ni se introduce otra aplicación o sistema de sincronización.

- `index.html`: carga componentes con versiones de recursos.
- `module.js`: menú, idioma, temporizador de información, controles y navegación.
- `game.js`: tres casos del prototipo, traducciones, transiciones y renderizado del juego en tableta/TV.
- `state.js`: estado versión 2 y validación compartida con el servidor.
- `experience.js`: componentes y narrativa informativa, conservando el diseño revisado.
- `module.css`: estilos encapsulados de información y juego.
- `verification/check.cjs`: recorrido completo por las tres propuestas en las dos pantallas.
- `verification/hosted-check.cjs`: el mismo recorrido usando transporte Firebase simulado.

Cambios puntuales compartidos: `display.html` carga los componentes del proyecto 11; `shared/display.js` deriva su renderizado y cancela animaciones al cambiar de proyecto; `shared/sync.js` extiende el ajuste de reloj a RSM RISE; `server.js` valida su estado. Las carpetas 01–10, el registro de proyectos, el Home y las salas no se modifican.

## Sincronización y recuperación

El estado del juego conserva caso seleccionado, etapa, evidencias consultadas, decisión de clasificación, acción de supervisión y marcas temporales. Tableta y TV calculan la lectura y la línea de tiempo desde los mismos instantes (`readStartedAt`, `supStartedAt`), sin enviar escrituras por cada frame. Una pantalla abierta tarde o recargada recupera la animación en su punto actual.

Cambiar de idioma conserva el avance. Volver atrás conserva el caso; elegir otra propuesta reinicia lectura y decisiones. Volver a empezar reinicia el minijuego desde la selección de propuesta. Volver al menú regresa a RSM RISE y conserva el desbloqueo obtenido. Home limpia el estado y abre todos los proyectos manteniendo `station` y `room`.

El estado anterior de Aurora se descarta por su versión incompatible. El servidor local debe reiniciarse después de cambiar su esquema, ya que Node carga el validador con caché.

## Revisión local y publicación

Iniciar desde esta carpeta raíz:

```powershell
$env:PORT='4181'
node server.js
```

- Tableta: `http://localhost:4181/projects/11-rsm-rise/index.html?station=8&room=0123456789abcdef0123456789abcdef`
- TV: `http://localhost:4181/display.html?station=8&room=0123456789abcdef0123456789abcdef`
- Revisión con ambas pantallas: `http://localhost:4181/artifacts/rsm-rise-preview.html` (herramienta local ignorada por Git).

La estación identifica la pareja de dispositivos, no el número del proyecto. Funciona también en las demás estaciones admitidas, incluida la 11. La misma sala debe usarse en las dos pantallas. En localhost se usa la API Node; en hosting público se conserva Firebase con salas privadas. No se realiza push ni publicación durante esta revisión local.

## Pruebas y límites

```powershell
node --test tests/*.test.js
$env:PLAYWRIGHT_MODULE='C:/Users/mateo/Downloads/BID/node_modules/playwright'
node projects/11-rsm-rise/verification/check.cjs
node projects/11-rsm-rise/verification/hosted-check.cjs
```

Playwright puede resolverse desde el entorno si se omite `PLAYWRIGHT_MODULE`. Los tests usan Edge/Chromium, el puerto 4181 por defecto y una sala de prueba; no se agregan dependencias de producción. Los reportes y capturas están en `verification/`.

Se verifican los tres casos, ambas decisiones de clasificación, las tres acciones de supervisión, evidencias, lectura, memoria, recargas, idioma, atrás, cambio de caso, reinicio, menú, Home y aislamiento entre salas. Se comprueban resoluciones 1024×768, 1180×820, 1366×768 y TV 1920×1080. La prueba pública sirve los archivos locales bajo un hostname público simulado y un transporte Firebase en memoria: no lee ni escribe la sala de producción.

Quedan pendientes la revisión del usuario, la prueba en hardware físico, la validación editorial/de marca y, si se autoriza, publicar y comprobar el sitio público. La duración depende de la lectura y de las decisiones del visitante; no se fuerza un avance automático. El servidor local mantiene sus sesiones en memoria y las limpia al reiniciar.
