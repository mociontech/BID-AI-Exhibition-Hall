"""Build editable review documents from the exact JSON used by the experience.
Run: python projects/05-profe-gabi/source/build-review.py
Uses only Python's standard library; never publishes or changes runtime data.
"""
from pathlib import Path
import json
import zipfile
import html
from xml.sax.saxutils import escape

base = Path(__file__).resolve().parent.parent
out = base / 'review' / '2026-11-09'
out.mkdir(parents=True, exist_ok=True)
data = {lang: json.loads((base / f'source/conversations.{lang}.json').read_text(encoding='utf-8')) for lang in ['es', 'en']}
original = json.loads((base / 'source/real-messages-2026-11-09.json').read_text(encoding='utf-8'))
blocks = []
def add(style, text):
    for line in text.split('\n'):
        if line.strip(): blocks.append((style, line))

add('Title', 'Profe Gabi — Guiones para revisión')
add('Subtitle', 'Borrador local · 9 de noviembre de 2026 · Pendiente de aprobación')
add('Heading1', 'Qué cambia y qué se conserva')
add('Normal', 'Se incorporan las diez consultas reales del archivo PROFE GABI textos.docx. Se conservan cuatro tarjetas, una consulta inicial, una decisión entre dos seguimientos y un cierre: ocho desenlaces. La interfaz del evento queda fija en inglés; únicamente los mensajes del docente y Profe Gabi se muestran en español. Los textos se agrupan en una o dos entregas para aprovechar el espacio sin recortar la consulta ni la respuesta y sin quitar contenido. La actividad de cinco minutos pasa de tres partes a una. La tableta muestra Continue y la TV una parte a la vez; no hay avance automático mientras el visitante lee. Las decisiones se habilitan al terminar la respuesta inicial y el resultado aparece al terminar la respuesta final. Information e Interactive experience siguen activos desde el inicio. Se mantienen Home, Back, menú y reinicio, sin redirecciones. El chat usa letra de 22 px en el diseño HD de 1920 × 1080.')
add('Strong', 'Disclaimer único visible en el chat')
add('Normal', 'English translation of adapted, anonymised real cases. Profe Gabi can make mistakes; the teacher decides.')
add('Normal', 'El disclaimer se conserva literalmente por solicitud del equipo, aunque el contenido visible de la conversación se deja en español. No se muestra una segunda línea de fuentes en el producto; la trazabilidad se conserva en este documento.')
add('Normal', 'Este documento se genera a partir de los mismos JSON que usa la versión local: etiquetas y resultados EN, mensajes ES. No se han publicado estos guiones en GitHub ni Netlify. Los textos de transición, tarjetas y aprendizajes son propuestas editoriales pendientes de aprobación. Las traducciones de las consultas en el JSON EN se conservan como referencia, pero no se presentan en la conversación.')
add('Normal', 'La sinopsis, el audio, las cifras 2026 y los planes 2027 del archivo recibido se conservan como contexto y no actualizan la infografía del piloto en esta tarea. Las indicaciones del documento sobre impresión o audio son material de referencia, no nuevas instrucciones de implementación.')
add('Heading1', 'Cómo leer la procedencia')
add('Normal', 'Literal: se conserva el texto recibido. Extracto literal: se seleccionan párrafos sin cambiar sus palabras, con saltos de línea normalizados. Adaptación: se resume o reorganiza una respuesta. Continuación editorial: mensaje nuevo para conectar la decisión cerrada; no se presenta como una nueva consulta real. EN: traducción editorial de la versión ES, no una transcripción real en inglés.')
add('Normal', 'Las preguntas abiertas que quedan en algunos extractos originales no habilitan entrada libre: el visitante siempre elige entre los dos seguimientos previstos. Las referencias oficiales se muestran como texto; no hay botones para salir de la experiencia.')
add('Heading1', 'Correspondencia con las diez consultas recibidas')
for msg in original['messages']:
    locations = []
    for i, t in enumerate(data['es']):
        for name, p in [('inicio', t['options'][0])] + [(f'seguimiento {j+1}', p) for j, p in enumerate(t['options'][0]['follow'])]:
            if msg['id'] in p['provenance']['sourceIds']: locations.append(f'ruta {i+1}, {name}')
    add('Normal', f"{msg['id']} — {msg['user']} → {'; '.join(locations)}.")
add('Heading1', 'Puntos de aprobación')
for line in [
    'Aprobar la agrupación de las diez consultas en cuatro rutas. La antigua tarjeta de inclusión se sustituye por actividades y evaluación porque el nuevo documento no aporta un caso específico de TEA.',
    'Validar las abreviaciones y la traducción EN. Confirmar que las dos opciones de seguimiento siguen sonando como una conversación con Profe Gabi.',
    'M02: se omite el ítem «¿Cuál NO es función vital?» del original; validar sus opciones antes de usarlo completo. M04: validar la referencia OA antes de restituir su numeración.',
    'M03: se conserva la secuencia pedagógica y se omite el procedimiento de montaje y calentamiento. M06: validar descriptores distintos para flauta y metalófono; se omite «embocadura» de la versión abreviada.',
    'M09: confirmar con el equipo las afirmaciones sobre evaluación y colegios particulares pagados. El borrador evita fijar reglas de elegibilidad y remite a la confirmación oficial, sin enlace navegable.',
    'M07 y M08: aprobar el paso de carga de correcciones a rutinas de foco del curso. No se presenta como atención clínica ni se atribuyen nuevas respuestas reales al equipo.',
    'La adaptación para exhibición no certifica la vigencia de requisitos, convocatorias ni normativa. Los originales se reproducen para revisión editorial, no como instrucciones oficiales actuales.'
]: add('Normal', '☐ '+line)

for lang, label in [('en', 'Guion implementado — Interfaz EN y conversación ES')]:
    add('Heading1', label)
    for i,t in enumerate(data[lang]):
        add('Heading2', f"{i+1:02} · {t['title']}")
        add('Meta', t['sub']+' · '+t['lead'])
        p=data['es'][i]['options'][0]
        add('Heading3', 'Consulta inicial / Initial exchange')
        add('Meta', 'Fuente: '+', '.join(p['provenance']['sourceIds'])+' | Docente: '+p['provenance']['userTreatment']+' | Profe Gabi: '+p['provenance']['responseTreatment'])
        add('Strong', 'DOCENTE / TEACHER')
        add('Normal', p['user'])
        add('Strong', 'PROFE GABI')
        for n,part in enumerate(p.get('gabiParts',[p['gabi']])):
            add('Meta', f"Parte {n+1} de {len(p.get('gabiParts',[p['gabi']]))} · El visitante pulsa Continuar después de leer")
            add('Normal', part)
        for j,f in enumerate(p['follow']):
            add('Heading3', f"Decisión / Choice {chr(65+j)} — {t['options'][0]['follow'][j]['label']}")
            add('Meta', 'Fuente: '+', '.join(f['provenance']['sourceIds'])+' | Docente: '+f['provenance']['userTreatment']+' | Profe Gabi: '+f['provenance']['responseTreatment'])
            add('Strong', 'DOCENTE / TEACHER')
            add('Normal', f['user'])
            add('Strong', 'PROFE GABI')
            for n,part in enumerate(f.get('gabiParts',[f['gabi']])):
                add('Meta', f"Parte {n+1} de {len(f.get('gabiParts',[f['gabi']]))} · El visitante pulsa Continuar después de leer")
                add('Normal', part)
            add('Strong', 'APRENDIZAJE FINAL / FINAL TAKEAWAY — Texto editorial')
            add('Normal', t['options'][0]['follow'][j]['take'])
        add('Meta', 'Nota para revisión: '+t['reviewNotes'])
        add('Normal', 'Revisión de esta ruta: ☐ Aprobar ☐ Ajustar | Comentarios: _______________________________________')

add('Heading1', 'Anexo — Mensajes originales recibidos, sin abreviar')
add('Normal', 'Estos mensajes se reproducen íntegros como referencia, con párrafos normalizados. Las URL son texto. No todos sus detalles se trasladan a la experiencia. Las respuestas originales pueden contener aspectos que requieren revisión; los ajustes propuestos están indicados en cada ruta.')
for m in original['messages']:
    add('Heading2', m['id'])
    add('Strong', 'CONSULTA ORIGINAL')
    add('Normal', m['user'])
    add('Strong', 'RESPUESTA ORIGINAL')
    add('Normal', m['gabi'])
add('Meta', 'Archivo fuente: '+original['sourceFile']+' | SHA-256: '+original['sourceSha256'])
add('Meta', 'Fuentes de ejecución: source/conversations.es.json y source/conversations.en.json. Reconstrucción: node source/build-data.cjs; python source/build-review.py (desde la carpeta del proyecto).')

# Editable Word document: native paragraphs/styles, not screenshots.
W='http://schemas.openxmlformats.org/wordprocessingml/2006/main'
paragraphs=[]
for style,text in blocks:
    paragraphs.append(f'<w:p><w:pPr><w:pStyle w:val="{style}"/></w:pPr><w:r><w:t xml:space="preserve">{escape(text)}</w:t></w:r></w:p>')
body=''.join(paragraphs)+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr>'
document=f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="{W}"><w:body>{body}</w:body></w:document>'
styles=[('Normal',22,'222222',False),('Title',44,'005CFF',True),('Subtitle',24,'526174',False),('Heading1',32,'005CFF',True),('Heading2',28,'08274E',True),('Heading3',24,'08274E',True),('Meta',18,'526174',False),('Strong',22,'08274E',True)]
stylexml=''.join(f'<w:style w:type="paragraph" w:styleId="{sid}"><w:name w:val="{sid}"/><w:pPr><w:spacing w:after="140"/>{"<w:keepNext/>" if sid.startswith("Heading") else ""}</w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="{size}"/><w:color w:val="{color}"/>{"<w:b/>" if bold else ""}</w:rPr></w:style>' for sid,size,color,bold in styles)
files={
 '[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>',
 '_rels/.rels':'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
 'word/document.xml':document,
 'word/styles.xml':f'<?xml version="1.0" encoding="UTF-8"?><w:styles xmlns:w="{W}">{stylexml}</w:styles>',
 'word/_rels/document.xml.rels':'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'}
stem='Profe_Gabi_Guiones_revision_2026-11-09'
with zipfile.ZipFile(out/(stem+'.docx'),'w',zipfile.ZIP_DEFLATED) as z:
    for name,content in files.items():z.writestr(name,content)
tags={'Title':'h1','Subtitle':'p','Heading1':'h2','Heading2':'h3','Heading3':'h4','Strong':'p','Meta':'p','Normal':'p'}
content=''.join(f'<{tags[s]} class="{s}">{html.escape(t)}</{tags[s]}>' for s,t in blocks)
(out/(stem+'.html')).write_text('<!doctype html><html lang="es"><meta charset="utf-8"><title>Profe Gabi · Revisión del guion</title><style>body{font:17px/1.55 Arial,sans-serif;color:#182a40;max-width:1000px;margin:40px auto;padding:0 24px}h1,h2{color:#005cff}h2{border-top:2px solid #d0e0ff;padding-top:24px}h3{margin-top:36px}.Meta,.Subtitle{color:#526174;font-size:14px}.Strong{font-weight:bold;margin-bottom:0}p{margin:8px 0}.Normal{white-space:pre-wrap}@media print{h2{break-before:page}h2,h3,h4,.Strong{break-after:avoid}body{font-size:11pt;margin:0}.Meta{font-size:9pt}}</style><body>'+content+'</body></html>',encoding='utf-8')
print('Generated editable DOCX and printable HTML:',out)
