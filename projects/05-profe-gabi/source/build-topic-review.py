"""Generate the 2026-11-14 local script review from the exact runtime JSON."""
from pathlib import Path
from html import escape
import json
import zipfile

root = Path(__file__).resolve().parent.parent
out = root / 'review/2026-11-14'
out.mkdir(parents=True, exist_ok=True)
data = {lang: json.loads((root / f'source/conversations.{lang}.json').read_text(encoding='utf-8')) for lang in ['es', 'en']}
blocks = []

def add(kind, text):
    blocks.append((kind, text))

add('h1', 'Profe Gabi — Revisión de temas y guiones')
add('p', '14 de noviembre de 2026 · Borrador local para aprobación. Sin publicación en GitHub ni Netlify.')
add('p', 'Interfaz en inglés; preguntas y respuestas de la conversación simulada en español. La infografía, la animación, el mensaje inferior y Home se conservan.')
add('h2', 'Cambios solicitados')
add('p', '01 Prepare for a class. 02 Create activities and quizzes. 03 Community Guidelines. 04 Professional growth and wellbeing.')
add('p', 'La categoría 3 inicia directamente el caso de foco y convivencia M07 y termina al leer su respuesta: no tiene seguimiento. La categoría 4 presenta primero Professional growth y Wellbeing; no envía un mensaje hasta elegir. Cada opción tiene una sola conversación y un cierre.')
add('p', 'Las categorías 1 y 2 conservan su conversación inicial y dos opciones de seguimiento. Hay siete recorridos finales y nueve intercambios únicos; los mensajes largos conservan Continue para leer sus partes sin recortes.')
add('p', 'Ortografía EN corregida: Community Guidelines; quiz (verbo), quizzes (plural); mid-term exams. En la categoría 2, los seguimientos son When to quiz my class y Prepare mid-term exams.')
add('h2', 'Procedencia y revisión editorial')
add('p', 'Se conserva la conversación real de convivencia M07, el desarrollo profesional M10 y bienestar M08. El caso de evaluación en colegios particulares M09 ya no forma parte del flujo. When to quiz my class cambia únicamente el título: conserva la pregunta y respuesta originales M05 sobre iniciar una unidad y aplicar una evaluación sumativa el mismo día. El examen de Biología es una adaptación editorial solicitada por el usuario, no un mensaje literal adicional del equipo; mantiene cuatro criterios y cuatro niveles de logro con enfoque de Biología en lugar de Música.')
for i, topic in enumerate(data['en']):
    add('h2', f'{i+1:02} — {topic["title"]}')
    add('p', 'Entrada: elegir una subcategoría antes de escribir.' if topic['entry'] == 'choose' else 'Entrada: la conversación comienza al tocar la tarjeta.')
    for j, option in enumerate(topic['options']):
        if topic['entry'] == 'choose':
            add('h3', option['label'])
        es_option = data['es'][i]['options'][j]
        pairs = [(option, es_option)] + list(zip(option['follow'], es_option['follow']))
        for k, (en_pair, es_pair) in enumerate(pairs):
            add('h3', ('Inicio — ' if k == 0 else 'Seguimiento — ') + en_pair['label'])
            add('p', 'DOCENTE: ' + es_pair['user'])
            for n, part in enumerate(es_pair['gabiParts']):
                add('p', f'PROFE GABI · Parte {n+1}/{len(es_pair["gabiParts"])}: ' + part)
            add('p', 'Procedencia: ' + ', '.join(es_pair['provenance']['sourceIds']) + '. ' + es_pair['provenance']['responseTreatment'])
            if 'take' in en_pair:
                add('p', 'Cierre EN: ' + en_pair['take'])

name = 'Profe_Gabi_Guiones_2026-11-14'
html = '<!doctype html><html lang="es"><meta charset="utf-8"><title>Profe Gabi — Revisión de guiones</title><style>body{font:17px/1.5 Arial,sans-serif;max-width:1000px;margin:48px auto;padding:0 24px;color:#151515}h1,h2{color:#005cff}h2{border-top:1px solid #d0e0ff;padding-top:20px}p{white-space:pre-wrap}@media print{h2,h3{break-after:avoid}body{margin:0}}</style>'
html += ''.join(f'<{kind}>{escape(text)}</{kind}>' for kind, text in blocks) + '</html>'
(out / (name + '.html')).write_text(html, encoding='utf-8')
(out / (name + '.md')).write_text('\n\n'.join(('#' * int(kind[1]) + ' ' if kind.startswith('h') else '') + text for kind, text in blocks) + '\n', encoding='utf-8')

paragraphs = []
for kind, text in blocks:
    style = {'h1': 'Title', 'h2': 'Heading1', 'h3': 'Heading2'}.get(kind, 'Normal')
    runs = '<w:br/>'.join('<w:t xml:space="preserve">' + escape(line) + '</w:t>' for line in text.split('\n'))
    paragraphs.append(f'<w:p><w:pPr><w:pStyle w:val="{style}"/></w:pPr><w:r>{runs}</w:r></w:p>')
document = '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + ''.join(paragraphs) + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>'
styles = '<?xml version="1.0" encoding="UTF-8"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
for key, size, bold in [('Normal', 22, False), ('Title', 40, True), ('Heading1', 32, True), ('Heading2', 26, True)]:
    styles += f'<w:style w:type="paragraph" w:styleId="{key}"><w:name w:val="{key}"/><w:pPr><w:spacing w:after="180"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="{size}"/>{"<w:b/>" if bold else ""}</w:rPr></w:style>'
styles += '</w:styles>'
with zipfile.ZipFile(out / (name + '.docx'), 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>')
    z.writestr('_rels/.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
    z.writestr('word/_rels/document.xml.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>')
    z.writestr('word/document.xml', document)
    z.writestr('word/styles.xml', styles)
print('Generated editable DOCX, HTML and Markdown review from the current script.')
