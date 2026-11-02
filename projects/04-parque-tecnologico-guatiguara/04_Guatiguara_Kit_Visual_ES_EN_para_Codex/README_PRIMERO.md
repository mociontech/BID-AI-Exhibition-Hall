# 04 · Parque Tecnológico Guatiguará — Kit visual ES/EN para Codex

## Comienza por aquí

1. **Descomprime esta carpeta dentro del repositorio de la experiencia 04.** No reemplaces el proyecto existente con el HTML de demostración.
2. Abre `04_GUIAS_Y_PROMPTS/PROMPT_PARA_CODEX.md` y pega su contenido en Codex. Adjunta o señala esta carpeta como referencia.
3. Codex debe inspeccionar primero el proyecto existente: menú, botón **Información**, infografía, CTA de TV, botón **Minijuego**, rutas y sistema actual de sincronización.
4. Integrar SOLO el minijuego, respetando la sección informativa y el selector ES/EN. Comparar visualmente con los 10 PNG de `01_REFERENCIAS`.
5. Los PNG son **mockups de referencia**, no piezas de interfaz interactiva ni logos oficiales. Reconstruye los elementos con HTML/CSS/SVG reutilizables, nunca insertes una captura como pantalla completa.

## Contenido del ZIP

- `01_REFERENCIAS/ES/`: 5 imágenes de referencia (bienvenida, reto, siete laboratorios, apoyos, resultado).
- `01_REFERENCIAS/EN/`: sus 5 equivalentes en inglés.
- `02_CODIGO_BASE/minijuego_original_aprobado.html`: prototipo interactivo anterior, utilizable como lógica de referencia.
- `03_ASSETS_EDITABLES/iconos_svg/`: iconos originales vectoriales monocromáticos y escalables (`currentColor`).
- `03_ASSETS_EDITABLES/brand-tokens.css`: tokens de paleta y UI.
- `03_ASSETS_EDITABLES/copies_es_en.json`: propuestas de texto ES/EN, editables.
- `04_GUIAS_Y_PROMPTS/PROMPT_PARA_CODEX.md`: instrucciones completas de integración.
- `04_GUIAS_Y_PROMPTS/MAPA_DE_PANTALLAS.md`: ruta de imágenes y diferencias de contenido.
- `04_GUIAS_Y_PROMPTS/CRITERIOS_Y_CHECKLIST.md`: validación funcional/visual y puntos de aprobación.
- `05_MANUAL_BID/Manual_de_marca_BID.pdf`: documento del usuario, referencia para contrastar la identidad.
- `GALERIA_REFERENCIAS.html`: vista de las diez imágenes sin herramientas adicionales.

## Precauciones fundamentales

**El diseño de los mockups es ilustrativo.** El logo mostrado en imágenes generadas puede diferir del archivo oficial. Codex deberá utilizar el logo aprobado que ya tenga el repositorio y aplicar el manual del BID, sin trazar ni copiar el logo de las imágenes.

**Los siete laboratorios aún requieren validación de denominación oficial.** El HTML base y algunos mockups usan etiquetas distintas. NO mezclar ambos conjuntos ni deducir equivalencias; usar los datos actuales del proyecto como fuente y dejar el catálogo editable hasta recibir confirmación.

**El minijuego no es IA en vivo.** No mostrar predicciones, inversiones ni resultados garantizados. Los casos son ficticios.

**Sin degradado naranja a azul**, también en fondos, botones, ilustraciones y elementos nuevos. Tipografía Inter; no se incluyen archivos de fuentes.
