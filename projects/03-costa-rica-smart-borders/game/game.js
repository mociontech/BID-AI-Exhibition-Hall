/* Costa Rica Smart Borders / VUCE 3.0 — minijuego educativo (un camión, una frontera).
   HTML/CSS/JS puros, sin dependencias. Datos 100 % simulados.

   Dinámica:
     intro   → Llega UN camión con su carga. Debe pasar por 3 instituciones.
     manual  → El camión se detiene en 3 paradas (Aduanas · Sanidad animal y vegetal ·
               Ministerio de Salud). En cada parada TÚ lees los 3 documentos de esa
               institución y pones el semáforo (verde / amarillo / rojo). Un cronómetro
               mide tu tiempo. En la pantalla el camión avanza parada por parada.
     ai      → El MISMO camión. VUCE 3.0 une las 3 instituciones en UNA sola ventanilla:
               la IA aplica las 3 reglas en una sola revisión y pone un solo semáforo.
               El camión para una vez y cruza. En la pantalla se ve cómo las 3 cajas se unen.
     results → Comparación: paradas, tiempo, aciertos y tiempo simulado en frontera.

   Integración con la tableta (module.js del proyecto 03):
     #es / #en cambian el idioma; [data-act="home"] vuelve al Home global.
   Espejo en la pantalla: tvPacket() → postMessage → module.js → estado de la estación → tv.js. */
'use strict';
(()=>{
const app=document.getElementById('app');

/* Tiempo simulado "en frontera" (minutos). Son valores ilustrativos para la exposición:
   cámbialos aquí si el equipo del proyecto entrega cifras documentadas. */
const SIM={stop:20,ai:5};

/* Instituciones (paradas). Cada una revisa sus 3 documentos con su propia regla.
   red: inconsistencia posible · yellow: documento que puede faltar. */
const ENTITIES=[
 {key:'aduana',icon:'🏛️',docs:['factura','declaracion','manifiesto'],fields:['producto','cantidad','peso','placa'],red:{field:'cantidad',doc:'declaracion',value:b=>String(parseInt(b.cantidad,10)-30)},yellow:'manifiesto'},
 {key:'policia',icon:'👮',docs:['licencia','circulacion','manifiesto'],fields:['conductor','placa','cantidad'],red:{field:'placa',doc:'circulacion',value:b=>b.placa.slice(0,-1)+(b.placa.endsWith('0')?'7':'0')},yellow:'licencia'},
 {key:'salud',icon:'🏥',docs:['registro','libreventa','factura'],fields:['producto','registro','cantidad','lote'],red:{field:'registro',doc:'libreventa',value:b=>b.registro.slice(0,-2)+'00'},yellow:'registro'},
 {key:'animal',icon:'🐄',docs:['certzoo','permiso','factura'],fields:['producto','origen','cantidad','lote'],red:{field:'origen',doc:'certzoo',value:b=>b.origen==='Nicaragua'?'Honduras':'Nicaragua'},yellow:'permiso'},
 {key:'vegetal',icon:'🌱',docs:['fito','permisofito','factura'],fields:['producto','origen','lote','peso'],red:{field:'lote',doc:'fito',value:b=>b.lote.slice(0,-2)+'51'},yellow:'permisofito'}
];
const N=ENTITIES.length; // paradas manuales; el camión cruza en pos N+1
const CARGOS={
 alimentos:{icon:'🥫',id:104,base:{cantidad:'240',peso:'4.800',origen:'Costa Rica',placa:'SJO-2210',lote:'L-2409',registro:'RS-18.442',conductor:'M. Rojas'}},
 frutas:{icon:'🍌',id:117,base:{cantidad:'900',peso:'9.000',origen:'Costa Rica',placa:'LIM-0453',lote:'L-0917',registro:'RS-20.118',conductor:'A. Vargas'}},
 lacteos:{icon:'🧀',id:126,base:{cantidad:'320',peso:'2.560',origen:'Panamá',placa:'PTY-7731',lote:'L-3301',registro:'RS-17.905',conductor:'L. Mora'}}
};
const CARGO_ORDER=['alimentos','frutas','lacteos'];
/* Posición del camión (0 salida · 1-3 paradas · 4 cruzó): la pantalla (tv.js) la convierte en % de la carretera. */
/* Ritmo lento a propósito: cada paso se ve y se explica en la pantalla. */
const MERGE_MS=11000,TRAVEL_MS=5200,SCAN_MS=2600,CONFIRM_MS=1700;
const AI_STEPS=['merging','toVuce','scanning','verdict','toBorder'];
/* Apariencia de «papel» de cada documento (simulado): emisor, icono del sello y prefijo del número. */
const PAPER={
 factura:{es:'Exportadora del Pacífico S.A.',en:'Exportadora del Pacífico S.A.',icon:'🧾',code:'FAC'},
 declaracion:{es:'Dirección General de Aduanas · DUA',en:'Customs Directorate · DUA',icon:'🛃',code:'DUA'},
 manifiesto:{es:'Transportes Centroamérica · Guía de carga',en:'Transportes Centroamérica · Freight bill',icon:'📦',code:'MAN'},
 certificado:{es:'SENASA · Certificado',en:'SENASA · Certificate',icon:'🩺',code:'CSA'},
 permiso:{es:'SENASA · Importaciones',en:'SENASA · Imports',icon:'📑',code:'PIM'},
 registro:{es:'Ministerio de Salud · Registro',en:'Ministry of Health · Registry',icon:'🏥',code:'RSA'},
 libreventa:{es:'Ministerio de Salud · Regulación',en:'Ministry of Health · Regulation',icon:'📜',code:'CLV'},
 licencia:{es:'COSEVI · Licencias de conducir',en:'COSEVI · Driver licensing',icon:'🪪',code:'LIC'},
 circulacion:{es:'Registro Nacional · Vehículos',en:'National Registry · Vehicles',icon:'🚚',code:'TCV'},
 certzoo:{es:'SENASA · Salud animal',en:'SENASA · Animal health',icon:'🐄',code:'CZO'},
 fito:{es:'Servicio Fitosanitario del Estado',en:'State Phytosanitary Service',icon:'🌿',code:'CFS'},
 permisofito:{es:'SFE · Permisos',en:'SFE · Permits',icon:'🌱',code:'PFS'}
};
function paperNo(doc){const pp=PAPER[doc]||{code:'DOC'};return pp.code+'-2026-'+String(cargoOf().id).padStart(5,'0');}
function paperDate(){const d=new Date();const z=n=>String(n).padStart(2,'0');return z(d.getDate())+'/'+z(d.getMonth()+1)+'/'+d.getFullYear();}

/* ---------- Copys bilingües ---------- */
const COPY={
 es:{
  brand:'AI in Action',station:'Estación 03 · Costa Rica Smart Borders',home:'Inicio',
  simulated:'Ejemplo simulado · educativo',
  steps:['Llega un camión','Tú revisas: 5 paradas','La IA revisa: 1 parada','Comparación'],
  what:'¿Qué está pasando?',decided:'¿Qué decidió el sistema?',learned:'¿Qué aprendiste?',
  fields:{producto:'Producto',cantidad:'Cantidad',peso:'Peso',origen:'Origen',placa:'Placa',lote:'Lote',registro:'N.º de registro',conductor:'Conductor'},
  docs:{factura:'Factura comercial',manifiesto:'Manifiesto de carga',declaracion:'Declaración aduanera',certificado:'Certificado sanitario',permiso:'Permiso de importación',registro:'Registro sanitario',libreventa:'Certificado de libre venta',licencia:'Licencia del conductor',circulacion:'Tarjeta de circulación',certzoo:'Certificado zoosanitario',fito:'Certificado fitosanitario',permisofito:'Permiso fitosanitario'},
  cargo:{alimentos:'Alimentos envasados',frutas:'Frutas frescas',lacteos:'Lácteos'},
  units:{cantidad:'cajas',peso:'kg'},
  entities:{aduana:{name:'Aduana',short:'Aduana',rule:'Cantidad, peso y placa deben coincidir en los 3 documentos.'},policia:{name:'Policía',short:'Policía',rule:'Conductor y placa deben coincidir con la licencia y la tarjeta de circulación.'},salud:{name:'Ministerio de Salud',short:'Salud',rule:'El registro sanitario debe coincidir con el producto y la cantidad.'},animal:{name:'Sanidad Animal',short:'S. Animal',rule:'Producto y origen deben coincidir con el certificado zoosanitario.'},vegetal:{name:'Sanidad Vegetal',short:'S. Vegetal',rule:'Lote y peso deben coincidir con el certificado fitosanitario.'}},
  border:'Frontera',start:'Salida',vuce:'VUCE 3.0 · una sola ventanilla',
  // Intro
  introTitle:'Un camión llega a la frontera.',
  introBig:'Debe pasar por 5 instituciones.',
  introBody:'En <b>Peñas Blancas</b> cada institución revisa sus propios documentos: <b>Aduana</b>, <b>Policía</b>, <b>Ministerio de Salud</b>, <b>Sanidad Animal</b> y <b>Sanidad Vegetal</b>. Primero lo revisas tú, parada por parada. Luego la IA de la VUCE 3.0 lo hace en una sola.',
  introHow:[['👀','Tú revisas','5 paradas. En cada una lees 3 documentos y pones el semáforo.'],['🤖','La IA revisa','Las 5 instituciones se unen en una sola parada.'],['⏱️','Comparamos','Paradas, tiempo y aciertos.']],
  introWhat:'Hoy llega el camión <b>{id}</b> con <b>{cargo}</b>. Mira la pantalla: el camión avanza con cada decisión tuya.',
  introLearn:'Tres filas, tres revisiones, el mismo camión. Así era antes.',
  introCta:'Empezar la revisión',
  // Manual
  manualTitle:'Tú revisas, parada por parada',
  manualBody:'Parada {i} de 5: <b>{entity}</b>. Lee sus 3 documentos y pon el semáforo.',
  stopOf:'Parada {i} de 5',
  yourTime:'Tu tiempo',aiTime:'Tiempo de la IA',simLabel:'En la frontera · simulado',
  lights:{green:{name:'Verde',action:'Dejar pasar',when:'Todo coincide'},yellow:{name:'Amarillo',action:'Revisar documentos',when:'Falta un documento'},red:{name:'Rojo',action:'Inspección conjunta',when:'Algo no coincide'}},
  semaforo:'Semáforo {name}',itWas:'Era semáforo {name}.',
  manualWhat:'Aquí decides tú. Cada institución revisa por separado: lee las filas, compara los 3 documentos y pon el semáforo.',
  manualDecided:'Todavía nadie te ayuda. El camión espera en cada fila y el cronómetro corre.',
  manualLearn:'Un detalle pequeño, como una cifra o una letra, puede esconder un problema.',
  missingDoc:'Falta un documento',paper:{date:'Fecha',sign:'Firma y sello',stamp:'ORIGINAL',no:'N.º',section:'Datos declarados'},
  fbRight:'¡Correcto!',fbWrong:'Ups, no era así.',
  why:{green:'Los documentos de {entity} coinciden: el camión sigue a la siguiente parada.',yellow:'Faltaba un documento ({doc}): se pide antes de decidir.',red:'Había una diferencia en {field}: {entity} pide una inspección.'},
  moving:'El camión avanza a la siguiente parada…',
  crossed:'¡Cruzó la frontera!',
  crossedManual:'5 paradas · 5 filas · 5 revisiones por separado.',
  crossedTime:'Tu tiempo: <strong>{t} s</strong> · Aciertos: <strong>{h} / 5</strong>',
  crossedSim:'En la frontera real esto toma horas. Tiempo simulado: <strong>≈ {m}</strong>.',
  manualDone:'¡Terminaste! Ahora la IA revisará el mismo camión en una sola parada.',
  manualCta:'Ver cómo lo hace la IA',
  // IA
  aiTitle:'La IA revisa en una sola parada',
  aiBody:'El <b>mismo camión</b> y los <b>mismos documentos</b>. VUCE 3.0 une las 5 instituciones en una sola revisión.',
  merging:'Las 5 instituciones se unen en una sola ventanilla…',
  aiScanning:'Revisando {entity}…',aiComparing:'Aplicando las 5 reglas a la vez…',
  aiWhat:'La IA aplica las reglas de las 5 instituciones al mismo tiempo y pone un solo semáforo al camión.',
  aiWhy:{green:'Las 5 reglas se cumplen. Propone dejar pasar.',yellow:'Falta un documento ({doc}). Propone revisar documentos, sin abrir el camión.',red:'Encontró una diferencia en {field}. Propone una sola inspección conjunta.'},
  aiLine:{green:'{entity}: todo coincide.',yellow:'{entity}: falta {doc}.',red:'{entity}: diferencia en {field}.'},
  aiLearn:'La IA <b>no abre el camión</b>. Lee rápido, une las 5 revisiones en una y señala las pistas. Cada institución conserva la última palabra.',
  crossedAi:'1 parada · 1 revisión conjunta · 5 reglas aplicadas.',
  crossedAiTime:'Tiempo de la IA: <strong>{t} s</strong> · Semáforo: <strong>{light}</strong>',
  crossedAiSim:'Tiempo simulado en la frontera: <strong>≈ {m}</strong>.',
  aiDone:'La IA terminó. El camión ya cruzó.',
  aiCta:'Comparar resultados',
  // Resultados
  resTitle:'El mismo camión, dos formas de cruzar',
  resBody:'Así le fue al camión {id} con {cargo}.',
  you:'Tú',ai:'IA · VUCE 3.0',
  time:'Tiempo',hits:'Aciertos',stops:'Paradas',simTime:'En frontera · simulado',
  seconds:'segundos',faster:'La IA fue {x} veces más rápida y paró 1 vez en lugar de 5.',sameTime:'Tardaron casi lo mismo, pero la IA paró 1 vez en lugar de 5.',
  perStop:'Parada por parada',
  right:'Acertó',wrong:'Falló',
  resDecided:'La IA aplicó las 5 reglas en {t} segundos con una sola parada. Tú hiciste 5 paradas en {m} segundos.',
  resLearnTitle:'La IA une las revisiones y señala pistas.',resLearnBig:'La persona decide.',
  resLearn:'No se trata de inspeccionar más. Se trata de priorizar mejor, revisar una sola vez y ganar tiempo para lo importante.',
  resSimulated:'Resultados simulados con fines educativos. Los tiempos «en frontera» son ilustrativos, no datos reales de Costa Rica ni de la VUCE.',
  again:'Jugar otro turno',toHome:'Volver al inicio',
  truckAria:'Camión {id}, {cargo}',
  tv:{intro:'Toca «Empezar la revisión» en la tableta.',deciding:'Decidiendo el semáforo de {entity} en la tableta…',feedback:'Toca «Siguiente parada» en la tableta.',moving:'El camión avanza a la siguiente parada…',crossedManual:'Toca «Ver cómo lo hace la IA» en la tableta.',waiting:'Lee el paso 1 en la tableta y toca «Ver en la pantalla».',nextStep:'Lee el paso {n} en la tableta y toca «Ver en la pantalla».',merging:'Las 5 instituciones se unen en una sola ventanilla',toVuce:'El camión llega a la ventanilla única…',scanning:'La IA aplica las 5 reglas a la vez',verdict:'Cada institución confirma la decisión final',toBorder:'Semáforo listo: el camión cruza…',crossedAi:'Toca «Comparar resultados» en la tableta.',results:'Toca «Jugar otro turno» o «Inicio» en la tableta.',reading:'Se está leyendo en la tableta'},
  watchTv:'Mira la pantalla',watchTvIntro:'El camión aparece en la pantalla grande. Aquí decides tú; allá se ve cómo avanza.',
  explain:{deciding:['Parada {i} de 5','{entity} revisa con sus propias reglas, por separado. El camión espera en esta fila.'],feedback:['Semáforo de {entity}','Cada institución pone su propio semáforo. Faltan {left} paradas.'],moving:['Otra fila','El camión avanza a la siguiente institución y vuelve a esperar.'],crossedManual:['Así era antes','Tres filas, tres revisiones, el mismo camión abierto varias veces.'],waiting:['VUCE 3.0','Ventanilla Única de Comercio Exterior: una sola puerta para todas las instituciones.'],merging:['Paso 1 · Una sola ventanilla','VUCE 3.0 recibe los documentos de las 5 instituciones en un solo lugar.'],toVuce:['Paso 2 · Una sola parada','El camión ya no hace 5 filas: se detiene una sola vez.'],scanning:['Paso 3 · Cinco reglas a la vez','Reglas de cada institución + aprendizaje automático (330.000 registros) + selección aleatoria.'],verdict:['Paso 4 · Cada institución decide','La IA propone un semáforo, pero no decide sola: las 5 instituciones conservan la última palabra y confirman la decisión final una por una.'],toBorder:['Paso 5 · Cruza','Un solo semáforo para las 5 instituciones. Sin abrir el camión varias veces: una decisión para todas.'],crossedAi:['Resultado','El mismo camión cruzó con una sola parada.']},
  aiSteps:['Una sola ventanilla','Una sola parada','Cinco reglas a la vez','Cada institución decide','Cruza la frontera'],
  replay:'Repetir paso {n}',stepOf:'Paso {i} de 5',confirmCta:'Cada institución decide la decisión final',confirms:'{entity} confirma la decisión final',confirmWait:'{entity} decide…',resOnScreenTitle:'Mira la pantalla',resOnScreen:'Ahí están los resultados comparativos: revisión humana vs VUCE 3.0.',chartTitle:'Revisión humana vs VUCE 3.0',seeTv:'Ver en la pantalla',watchingTv:'Mira la pantalla…',stepDone:'Listo',nextStop:'Siguiente parada',crossNow:'Cruzar la frontera',
  aiIntro:'Tú controlas la revisión de la IA: lee cada paso, toca el botón y mira lo que pasa en la pantalla.',
  solTitle:'Solución del reto',solBody:'Esto era lo que había que ver en cada institución.',solFinal:'Semáforo final del camión',solYou:'Tu semáforo',
  resChallenge:['El reto','En Peñas Blancas cruzan unos 650 camiones al día. Cada uno pasaba por 5 instituciones: 5 filas, 5 revisiones separadas y el mismo camión abierto varias veces.'],
  resHow:'Cómo lo resolvió la IA',resInsightsTitle:'Lo que te llevas de VUCE 3.0',
  insights:[['1','Una sola ventanilla','Las 5 instituciones reciben los documentos en un mismo lugar.'],['5','Reglas a la vez','Reglas de cada institución + aprendizaje automático con 330.000 registros + selección aleatoria.'],['1','Un solo semáforo','Verde sigue, amarillo revisa papeles, rojo una inspección conjunta. El camión se abre una sola vez.']],
  seeTvResults:'En la pantalla: lo que te llevas de VUCE 3.0.',whyLight:'¿Qué significa el semáforo?',realLife:'¿Y en la vida real?',factsTitle:'Datos de VUCE 3.0 · toca para saber más',
  facts:[['650','camiones al día en Peñas Blancas','place'],['5','instituciones, 1 sola inspección conjunta','real'],['330.000','registros históricos entrenaron la IA','how'],['360.000','trámites en un año','real'],['3','mecanismos: reglas, IA y azar','how']],
  chips:[['📍','Peñas Blancas, Costa Rica'],['🚛','650 camiones al día'],['🏛️','5 instituciones']],
  pop:{
   eyebrow:'Dato del proyecto · VUCE 3.0',close:'Cerrar',
   play:{title:'¿Cómo se juega?',lead:'El camión se detiene en <b>5 instituciones</b>. En cada parada lee sus 3 documentos y ponle el <b>semáforo</b>, como hace la VUCE 3.0. Mira la pantalla: el camión avanza con cada decisión.',
    foot:'El cronómetro arranca cuando cierres esta ventana.',cta:'Empezar'},
   place:{title:'El reto en Peñas Blancas',
    lead:'Peñas Blancas es la frontera entre Costa Rica y Nicaragua. Cada día cruzan unas <b>650 unidades de transporte</b> con mercancías, y cada una debía pasar por <b>5 instituciones</b> que revisaban por separado, con sus propias reglas.',
    stats:[['650','camiones al día'],['5','instituciones revisaban por separado'],['1','frontera: Peñas Blancas']],
    tapTitle:'Toca cada institución: así se revisaba el mismo camión, una fila tras otra.',
    inst:[['🏛️','Aduana'],['👮','Policía'],['🏥','Ministerio de Salud'],['🐄','Sanidad Animal'],['🌱','Sanidad Vegetal']],
    closed:'Cerrado',opened:'Abierto',
    count:'El mismo camión se abrió <b>{n}</b> de 5 veces',
    done:'Reglas fijas y sin una herramienta compartida: controles poco focalizados, el mismo camión abierto varias veces y demoras para el comercio legítimo.',
    solTitle:'Lo que hace VUCE 3.0',
    solText:'Una sola ventanilla recibe los documentos de todas las instituciones. La inteligencia artificial aplica las reglas de cada una, compara con 330.000 operaciones anteriores y suma revisiones al azar. El resultado es <b>un solo semáforo</b> para el camión: verde sigue, amarillo revisa papeles, rojo una sola inspección conjunta.',
    next:'Lo que sigue: toca «Ver cómo lo hace la IA». En la tableta lees cada paso y en la pantalla ves qué pasa con el camión.',
    cta:'Entendido'},
   how:{title:'¿Cómo lo hace VUCE 3.0?',
    lead:'El Módulo de Gestión de Riesgos de la Ventanilla Única de Comercio Exterior combina <b>tres mecanismos</b> en un sistema híbrido. Así funciona cada uno:',
    items:[['📏','Reglas','Cada institución define qué documentos y datos exige. Si falta algo o un dato no coincide, la regla lo marca al instante.'],['🧠','Aprendizaje automático','Un modelo entrenado con más de 330.000 registros históricos de operaciones reales aprende qué combinaciones de producto, origen y ruta suelen traer problemas, y señala las que se parecen.'],['🎲','Selección aleatoria','Un porcentaje de camiones se revisa al azar aunque todo esté en orden. Así nadie puede predecir cuándo le tocará revisión.']],
    foot:'Los tres se combinan en un solo semáforo: verde sigue, amarillo revisa papeles, rojo una inspección conjunta.',
    cta:'Ver a la IA en acción'},
   light:{title:'El semáforo de riesgo',
    lead:'La IA clasifica cada operación con un color. Toca cada luz.',
    items:[['red','Rojo','Riesgo alto. Las instituciones coordinan desde el inicio una sola inspección conjunta.'],['yellow','Amarillo','Riesgo medio. Se revisa la documentación antes de decidir.'],['green','Verde','Riesgo bajo. La mercancía sigue su camino.']],
    foot:'Cada institución conserva sus criterios y la última palabra sobre el control.',
    cta:'Entendido'},
   real:{title:'¿Y en la vida real?',
    lead:'La primera etapa, la evaluación de riesgo en el puesto fronterizo, <b>ya está en producción</b> con apoyo del BID.',
    before:'Antes',after:'Ahora',
    beforeItems:['5 revisiones por separado','Reglas fijas, sin herramienta compartida','El mismo camión abierto varias veces'],
    afterItems:['1 semáforo de riesgo para todas','Reglas + IA + selección aleatoria','1 sola inspección conjunta'],
    stats:[['330.000','registros históricos entrenaron los modelos'],['360.000','trámites en un año (sanidad vegetal, animal y salud)']],
    next:'Siguiente etapa: analizar el riesgo <b>antes</b> de que la mercancía llegue a la frontera.',
    cta:'Cerrar'}
  }
 },
 en:{
  brand:'AI in Action',station:'Station 03 · Costa Rica Smart Borders',home:'Home',
  simulated:'Simulated · educational example',
  steps:['A truck arrives','You check: 5 stops','AI checks: 1 stop','Comparison'],
  what:'What is happening?',decided:'What did the system decide?',learned:'What did you learn?',
  fields:{producto:'Product',cantidad:'Quantity',peso:'Weight',origen:'Origin',placa:'Plate',lote:'Batch',registro:'Registration no.',conductor:'Driver'},
  docs:{factura:'Commercial invoice',manifiesto:'Cargo manifest',declaracion:'Customs declaration',certificado:'Sanitary certificate',permiso:'Import permit',registro:'Health registration',libreventa:'Free sale certificate',licencia:'Driver’s licence',circulacion:'Vehicle registration card',certzoo:'Zoosanitary certificate',fito:'Phytosanitary certificate',permisofito:'Phytosanitary permit'},
  cargo:{alimentos:'Packaged food',frutas:'Fresh fruit',lacteos:'Dairy products'},
  units:{cantidad:'boxes',peso:'kg'},
  entities:{aduana:{name:'Customs',short:'Customs',rule:'Quantity, weight and plate must match across the 3 documents.'},policia:{name:'Police',short:'Police',rule:'Driver and plate must match the licence and the registration card.'},salud:{name:'Ministry of Health',short:'Health',rule:'The sanitary registration must match the product and the quantity.'},animal:{name:'Animal Health',short:'Animal',rule:'Product and origin must match the zoosanitary certificate.'},vegetal:{name:'Plant Health',short:'Plant',rule:'Batch and weight must match the phytosanitary certificate.'}},
  border:'Border',start:'Start',vuce:'VUCE 3.0 · one single window',
  introTitle:'A truck arrives at the border.',
  introBig:'It must clear 5 agencies.',
  introBody:'At <b>Peñas Blancas</b> each agency checks its own documents: <b>Customs</b>, <b>Police</b>, <b>Ministry of Health</b>, <b>Animal Health</b> and <b>Plant Health</b>. First you check it, stop by stop. Then the VUCE 3.0 AI does it in a single stop.',
  introHow:[['👀','You check','5 stops. At each one you read 3 documents and set the light.'],['🤖','AI checks','The 5 agencies merge into a single stop.'],['⏱️','We compare','Stops, time and correct answers.']],
  introWhat:'Today truck <b>{id}</b> arrives with <b>{cargo}</b>. Watch the screen: the truck moves with every decision you make.',
  introLearn:'Three queues, three checks, the same truck. That is how it used to be.',
  introCta:'Start checking',
  manualTitle:'You check, stop by stop',
  manualBody:'Stop {i} of 5: <b>{entity}</b>. Read its 3 documents and set the light.',
  stopOf:'Stop {i} of 5',
  yourTime:'Your time',aiTime:'AI time',simLabel:'At the border · simulated',
  lights:{green:{name:'Green',action:'Let it pass',when:'Everything matches'},yellow:{name:'Yellow',action:'Review documents',when:'A document is missing'},red:{name:'Red',action:'Joint inspection',when:'Something is off'}},
  semaforo:'{name} light',itWas:'It was a {name} light.',
  manualWhat:'You decide here. Each agency checks separately: read the rows, compare the 3 documents and set the light.',
  manualDecided:'Nobody is helping you yet. The truck waits in every queue and the clock is running.',
  manualLearn:'A small detail, like a digit or a letter, can hide a problem.',
  missingDoc:'Missing document',paper:{date:'Date',sign:'Signature and stamp',stamp:'ORIGINAL',no:'No.',section:'Declared data'},
  fbRight:'Correct!',fbWrong:'Oops, not quite.',
  why:{green:'The {entity} documents match: the truck moves to the next stop.',yellow:'A document was missing ({doc}): it is requested before deciding.',red:'There was a difference in {field}: {entity} asks for an inspection.'},
  moving:'The truck moves to the next stop…',
  crossed:'It crossed the border!',
  crossedManual:'5 stops · 5 queues · 5 separate checks.',
  crossedTime:'Your time: <strong>{t} s</strong> · Correct: <strong>{h} / 5</strong>',
  crossedSim:'At a real border this takes hours. Simulated time: <strong>≈ {m}</strong>.',
  manualDone:'Done! Now the AI will check the same truck in a single stop.',
  manualCta:'See how the AI does it',
  aiTitle:'AI checks in a single stop',
  aiBody:'The <b>same truck</b> and the <b>same documents</b>. VUCE 3.0 merges the 5 agencies into one single check.',
  merging:'The 5 agencies merge into one single window…',
  aiScanning:'Checking {entity}…',aiComparing:'Applying the 5 rules at once…',
  aiWhat:'The AI applies the rules of the 5 agencies at the same time and gives the truck a single traffic light.',
  aiWhy:{green:'All 5 rules are met. It suggests letting it pass.',yellow:'A document is missing ({doc}). It suggests reviewing documents, without opening the truck.',red:'It found a difference in {field}. It suggests one single joint inspection.'},
  aiLine:{green:'{entity}: everything matches.',yellow:'{entity}: {doc} is missing.',red:'{entity}: difference in {field}.'},
  aiLearn:'The AI <b>does not open the truck</b>. It reads fast, merges the 5 checks into one and points out clues. Each agency keeps the final say.',
  crossedAi:'1 stop · 1 joint check · 5 rules applied.',
  crossedAiTime:'AI time: <strong>{t} s</strong> · Light: <strong>{light}</strong>',
  crossedAiSim:'Simulated time at the border: <strong>≈ {m}</strong>.',
  aiDone:'The AI is done. The truck has crossed.',
  aiCta:'Compare results',
  resTitle:'Same truck, two ways to cross',
  resBody:'This is how truck {id} with {cargo} did.',
  you:'You',ai:'AI · VUCE 3.0',
  time:'Time',hits:'Correct',stops:'Stops',simTime:'At the border · simulated',
  seconds:'seconds',faster:'The AI was {x} times faster and stopped once instead of 5 times.',sameTime:'They took about the same time, but the AI stopped once instead of 5 times.',
  perStop:'Stop by stop',
  right:'Correct',wrong:'Missed',
  resDecided:'The AI applied the 5 rules in {t} seconds with a single stop. You made 5 stops in {m} seconds.',
  resLearnTitle:'AI merges the checks and points out clues.',resLearnBig:'The person decides.',
  resLearn:'It is not about inspecting more. It is about prioritizing better, checking once and saving time for what matters.',
  resSimulated:'Simulated results for educational purposes. “At the border” times are illustrative, not real data from Costa Rica or VUCE.',
  again:'Play another round',toHome:'Back to start',
  truckAria:'Truck {id}, {cargo}',
  tv:{intro:'Tap “Start checking” on the tablet.',deciding:'Deciding the {entity} light on the tablet…',feedback:'Tap “Next stop” on the tablet.',moving:'The truck moves to the next stop…',crossedManual:'Tap “See how the AI does it” on the tablet.',waiting:'Read step 1 on the tablet and tap “Watch on the screen”.',nextStep:'Read step {n} on the tablet and tap “Watch on the screen”.',merging:'The 5 agencies merge into one single window',toVuce:'The truck reaches the single window…',scanning:'The AI applies the 5 rules at once',verdict:'Each institution confirms the final decision',toBorder:'Light ready: the truck crosses…',crossedAi:'Tap “Compare results” on the tablet.',results:'Tap “Play another round” or “Home” on the tablet.',reading:'Being read on the tablet'},
  watchTv:'Watch the screen',watchTvIntro:'The truck appears on the big screen. You decide here; over there you see it move.',
  explain:{deciding:['Stop {i} of 5','{entity} checks with its own rules, separately. The truck waits in this queue.'],feedback:['{entity} light','Each agency sets its own light. {left} stops to go.'],moving:['Another queue','The truck moves to the next agency and waits again.'],crossedManual:['How it used to be','Three queues, three checks, the same truck opened several times.'],waiting:['VUCE 3.0','Foreign Trade Single Window: one door for every agency.'],merging:['Step 1 · One single window','VUCE 3.0 receives the documents of the 5 agencies in one place.'],toVuce:['Step 2 · One single stop','No more 5 queues: the truck stops only once.'],scanning:['Step 3 · Five rules at once','Each agency\'s rules + machine learning (330,000 records) + random selection.'],verdict:['Step 4 · Each institution decides','The AI suggests a light but does not decide alone: all 5 agencies keep the final say and confirm the final decision one by one.'],toBorder:['Step 5 · It crosses','One single light for the 5 agencies. Without opening the truck several times: one decision for all.'],crossedAi:['Result','The same truck crossed with a single stop.']},
  aiSteps:['One single window','One single stop','Five rules at once','Each institution decides','Crosses the border'],
  replay:'Replay step {n}',stepOf:'Step {i} of 5',confirmCta:'Each institution decides the final decision',confirms:'{entity} confirms the final decision',confirmWait:'{entity} is deciding…',resOnScreenTitle:'Look at the screen',resOnScreen:'There you will find the comparative results: human review vs VUCE 3.0.',chartTitle:'Human review vs VUCE 3.0',seeTv:'Watch on the screen',watchingTv:'Watch the screen…',stepDone:'Done',nextStop:'Next stop',crossNow:'Cross the border',
  aiIntro:'You control the AI check: read each step, tap the button and watch what happens on the screen.',
  solTitle:'Challenge solution',solBody:'This is what had to be spotted at each agency.',solFinal:'Final light for the truck',solYou:'Your light',
  resChallenge:['The challenge','About 650 trucks cross Peñas Blancas every day. Each one went through 5 agencies: 5 queues, 5 separate checks and the same truck opened several times.'],
  resHow:'How the AI solved it',resInsightsTitle:'What to take away from VUCE 3.0',
  insights:[['1','One single window','The 5 agencies receive the documents in one place.'],['5','Rules at once','Each agency\'s rules + machine learning with 330,000 records + random selection.'],['1','One single light','Green moves on, yellow reviews paperwork, red one joint inspection. The truck is opened only once.']],
  seeTvResults:'On the screen: what to take away from VUCE 3.0.',whyLight:'What does the traffic light mean?',realLife:'And in real life?',factsTitle:'VUCE 3.0 facts · tap to learn more',
  facts:[['650','trucks a day at Peñas Blancas','place'],['5','agencies, 1 single joint inspection','real'],['330,000','historical records trained the AI','how'],['360,000','procedures in one year','real'],['3','mechanisms: rules, AI and chance','how']],
  chips:[['📍','Peñas Blancas, Costa Rica'],['🚛','650 trucks a day'],['🏛️','5 agencies']],
  pop:{
   eyebrow:'Project fact · VUCE 3.0',close:'Close',
   play:{title:'How to play?',lead:'The truck stops at <b>5 agencies</b>. At each stop read its 3 documents and set the <b>traffic light</b>, just like VUCE 3.0 does. Watch the screen: the truck moves with every decision.',
    foot:'The clock starts when you close this window.',cta:'Start'},
   place:{title:'The challenge at Peñas Blancas',
    lead:'Peñas Blancas is the border between Costa Rica and Nicaragua. About <b>650 transport units</b> with goods cross it every day, and each one had to go through <b>5 agencies</b> checking separately, each with its own rules.',
    stats:[['650','trucks a day'],['5','agencies checked separately'],['1','border: Peñas Blancas']],
    tapTitle:'Tap each agency: this is how the same truck was checked, one queue after another.',
    inst:[['🏛️','Customs'],['👮','Police'],['🏥','Ministry of Health'],['🐄','Animal Health'],['🌱','Plant Health']],
    closed:'Closed',opened:'Opened',
    count:'The same truck was opened <b>{n}</b> of 5 times',
    done:'Fixed rules and no shared tool: poorly targeted controls, the same truck opened several times and delays for legitimate trade.',
    solTitle:'What VUCE 3.0 does',
    solText:'One single window receives the documents of every agency. Artificial intelligence applies each agency\'s rules, compares with 330,000 previous transactions and adds random checks. The result is <b>one single light</b> for the truck: green moves on, yellow reviews paperwork, red one joint inspection.',
    next:'Next: tap “See how the AI does it”. You read each step on the tablet and watch what happens to the truck on the screen.',
    cta:'Got it'},
   how:{title:'How does VUCE 3.0 do it?',
    lead:'The Risk Management Module of the Foreign Trade Single Window combines <b>three mechanisms</b> into a hybrid system. This is how each one works:',
    items:[['📏','Rules','Each agency defines which documents and data it requires. If something is missing or does not match, the rule flags it instantly.'],['🧠','Machine learning','A model trained on more than 330,000 historical trade records learns which combinations of product, origin and route tend to bring problems, and flags the ones that look alike.'],['🎲','Random selection','A share of trucks is checked at random even when everything is in order, so nobody can predict when a check will come.']],
    foot:'The three combine into one single light: green moves on, yellow reviews paperwork, red one joint inspection.',
    cta:'See the AI in action'},
   light:{title:'The risk traffic light',
    lead:'The AI classifies each transaction with a color. Tap each light.',
    items:[['red','Red','High risk. Agencies coordinate a single joint inspection from the start.'],['yellow','Yellow','Medium risk. Documents are reviewed before deciding.'],['green','Green','Low risk. The goods move on.']],
    foot:'Each agency keeps its own criteria and the final say on controls.',
    cta:'Got it'},
   real:{title:'And in real life?',
    lead:'The first stage, risk assessment at the border crossing, <b>is already in production</b> with IDB support.',
    before:'Before',after:'Now',
    beforeItems:['5 separate checks','Fixed rules, no shared tool','The same truck opened several times'],
    afterItems:['1 risk traffic light for all','Rules + AI + random selection','1 single joint inspection'],
    stats:[['330,000','historical records trained the models'],['360,000','procedures in one year (plant, animal and public health)']],
    next:'Next stage: assess risk <b>before</b> goods reach the border.',
    cta:'Close'}
  }
 }
};

/* ---------- Utilidades ---------- */
const fill=(text,vars)=>text.replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=ms=>{const s=Math.floor(ms/1000),d=Math.floor((ms%1000)/100);return `${s}.${d}`;};
function fmtMin(m){if(m<60)return `${m} min`;const h=Math.floor(m/60),r=m%60;return r?`${h} h ${r} min`:`${h} h`;}
function rng(v){let x=v>>>0;return()=>{x+=0x6D2B79F5;let a=x;a=Math.imul(a^(a>>>15),a|1);a^=a+Math.imul(a^(a>>>7),a|61);return((a^(a>>>14))>>>0)/4294967296;};}
function expected(c){return c.issue?'red':c.missing?'yellow':'green';} // semáforo correcto de cada parada
const RANK={green:0,yellow:1,red:2};
function docValue(c,doc,field){
 if(field==='producto')return null; // se traduce al renderizar
 if(c.issue&&c.issue.doc===doc&&c.issue.field===field)return c.issue.value;
 return c.base[field];
}

/* ---------- Estado ---------- */
const state={lang:'en',screen:'intro',round:1,cargo:'alimentos',stops:[],idx:0,pos:0,moving:false,modal:null,seen:{},resume:false,
 manual:{time:0,start:0,running:false,answers:[],feedback:null,done:false},
 ai:{time:0,start:0,running:false,answers:[],phase:'idle',verdict:null,scanIdx:-1,step:0,busy:false,confirmed:0}};
let timers=[],ticker=null;
const after=(fn,ms)=>timers.push(setTimeout(fn,ms));
const stop=()=>{timers.forEach(clearTimeout);timers=[];if(ticker){clearInterval(ticker);ticker=null;}};
const t=k=>COPY[state.lang][k];
const cargoOf=()=>CARGOS[state.cargo];
const truckId=()=>'CR-'+cargoOf().id;
const mode=()=>state.screen==='ai'?'ai':'manual';
const overall=()=>state.stops.reduce((w,s)=>RANK[expected(s)]>RANK[w]?expected(s):w,'green');

function newRound(){
 stop();
 const r=rng(20261105+state.round*7919);
 state.cargo=CARGO_ORDER[(state.round-1)%CARGO_ORDER.length];
 const base=cargoOf().base;
 const pool=['green','green','green','yellow','red'];
 const stops=ENTITIES.map(e=>{
  const kind=pool[Math.floor(r()*pool.length)];
  const s={key:e.key,icon:e.icon,docs:e.docs,fields:e.fields,base};
  if(kind==='red')s.issue={field:e.red.field,doc:e.red.doc,value:e.red.value(base)};
  else if(kind==='yellow')s.missing=e.yellow;
  return s;
 });
 if(stops.every(s=>expected(s)==='green'))stops[1].missing=ENTITIES[1].yellow; // al menos una parada con pista
 state.stops=stops;state.idx=0;state.pos=0;state.moving=false;state.modal=null;state.seen={};state.resume=false;
 state.manual={time:0,start:0,running:false,answers:[],feedback:null,done:false};
 state.ai={time:0,start:0,running:false,answers:[],phase:'idle',verdict:null,scanIdx:-1,confirmed:0};
}
function startClock(who){state[who].start=performance.now()-state[who].time;state[who].running=true;let n=0;
 if(!ticker)ticker=setInterval(()=>{const el=app.querySelector('[data-clock]');if(el&&state[who].running){state[who].time=performance.now()-state[who].start;el.textContent=fmt(state[who].time)+' s';if(++n%10===0)emit();}},100);
 emit();}
function pauseClock(who){if(state[who].running){state[who].time=performance.now()-state[who].start;state[who].running=false;emit();}}
function simMinutes(){
 if(state.screen==='manual')return Math.min(N,state.manual.answers.length)*SIM.stop;
 if(state.screen==='ai')return state.ai.step>=4?SIM.ai:0;
 return 0;
}

/* ---------- Componentes ---------- */
function truckSvg(color,icon){
 const wheel=cx=>`<g class="wheel"><circle cx="${cx}" cy="70" r="12" fill="#141414"/><circle cx="${cx}" cy="70" r="6" fill="#EBEDF7"/><path d="M${cx} 60v20M${cx-10} 70h20" stroke="#141414" stroke-width="2"/><circle cx="${cx}" cy="70" r="2" fill="#141414"/></g>`;
 return `<svg class="truck-svg" viewBox="0 0 200 90" aria-hidden="true"><ellipse cx="100" cy="82" rx="92" ry="5" fill="rgba(20,20,20,.18)"/><rect x="4" y="10" width="120" height="54" rx="8" fill="#fff" stroke="#C0C2CA" stroke-width="2"/><rect x="4" y="42" width="120" height="8" fill="${color||'#005CFF'}"/><circle cx="42" cy="32" r="16" fill="#CFE1FF"/><text x="42" y="38" text-anchor="middle" font-size="18">${icon||'📦'}</text><rect x="126" y="22" width="58" height="42" rx="9" fill="#005CFF"/><rect x="134" y="27" width="30" height="18" rx="4" fill="#CFE1FF"/><rect x="184" y="44" width="8" height="12" rx="2" fill="#FFCB52"/><rect x="4" y="62" width="184" height="7" rx="3" fill="#141414"/><rect x="124" y="58" width="68" height="7" rx="3" fill="#6A6B6F"/>${wheel(36)}${wheel(98)}${wheel(158)}</svg>`;
}
const lightDot=(c,big)=>`<span class="light ${c?'light--'+c:''} ${big?'light--big':''}"></span>`;
function stopLight(i){
 if(state.screen==='manual'||state.screen==='results'){return state.manual.answers[i]?expected(state.stops[i]):null;}
 if(state.screen==='ai'){return state.ai.answers[i]?expected(state.stops[i]):null;}
 return null;
}
/* Aviso en la tableta: la escena del camión se ve en la pantalla. */
function tvCue(text){return `<div class="tv-cue"><span>📺</span><div><b>${esc(t('watchTv'))}</b><p>${esc(text)}</p></div></div>`;}
function docCard(c,doc,{reveal=false,scan=false}={}){
 const pp=PAPER[doc]||{es:'',en:'',icon:'📄',code:'DOC'},P=t('paper');
 if(c.missing===doc)return `<article class="doc doc--missing ${reveal?'is-flag':''}"><header><span class="doc-icon">📄</span><b>${esc(t('docs')[doc])}</b></header><div class="doc-missing"><span>❔</span><p>${esc(t('missingDoc'))}</p><small>${esc(pp[state.lang])}</small></div></article>`;
 const rows=c.fields.map(f=>{
  const v=f==='producto'?t('cargo')[state.cargo]:docValue(c,doc,f);
  const unit=t('units')[f]?' '+t('units')[f]:'';
  const bad=reveal&&c.issue&&c.issue.field===f;
  const own=bad&&c.issue.doc===doc;
  return `<div class="row ${bad?'row--bad':''} ${own?'row--own':''}" data-field="${f}"><span>${esc(t('fields')[f])}</span><b>${esc(v)}${f==='producto'?'':esc(unit)}</b></div>`;
 }).join('');
 return `<article class="doc doc--paper ${scan?'is-scan':''}"><header><span class="doc-icon">📄</span><b>${esc(t('docs')[doc])}</b></header>
  <div class="paper-head"><span class="paper-seal">${pp.icon}</span><div class="paper-issuer"><small>${esc(pp[state.lang])}</small><b>${esc(t('docs')[doc])}</b></div><div class="paper-no"><small>${esc(P.no)}</small><b>${esc(paperNo(doc))}</b></div></div>
  <div class="paper-meta"><span>${esc(P.date)}: <b>${paperDate()}</b></span><span>${esc(truckId())} · ${esc(t('cargo')[state.cargo])}</span></div>
  <div class="paper-rows"><span class="paper-section">${esc(P.section)}</span>${rows}</div>
  <div class="paper-foot"><i class="paper-barcode" aria-hidden="true"></i><span class="paper-sign">${esc(P.sign)}</span><em class="paper-stamp" aria-hidden="true">${esc(P.stamp)}</em></div></article>`;
}
function entityCard(s,i){
 const E=t('entities')[s.key];
 return `<div class="desk-truck desk-entity"><span class="desk-counter">${esc(fill(t('stopOf'),{i:i+1}))}</span><span class="entity-icon">${s.icon}</span><b>${esc(E.name)}</b><small>${esc(E.rule)}</small></div>`;
}
function stopPanel(s,{reveal=false,scan=false}={}){
 return `<div class="desk">${entityCard(s,state.idx)}<div class="docs">${s.docs.map(d=>docCard(s,d,{reveal,scan})).join('')}</div></div>`;
}
function box(kind,title,body){
 const icon={what:'👀',decided:'🧭',learned:'💡'}[kind];
 return `<section class="box box--${kind}"><h3><span>${icon}</span>${esc(title)}</h3><div class="box-body" data-box="${kind}">${body}</div></section>`;
}
function clock(label){return `<div class="clock"><span>${esc(label)}</span><b data-clock>${fmt(state.screen==='ai'?state.ai.time:state.manual.time)} s</b></div>`;}
function header(){
 const steps=t('steps');const index={intro:0,manual:1,ai:2,results:3}[state.screen];
 return `<header class="top">
  <div class="top-brand"><img class="top-idb-group" src="../public/idb-group-white.svg" width="216" height="44" alt="IDB Group"><span class="top-sep"></span><span><b>${esc(t('brand'))}</b><small>IDB Group Projects Across the Region</small></span></div>
  <ol class="stepper">${steps.map((s,i)=>`<li class="${i<index?'done':i===index?'current':''}"><span>${i+1}</span><em>${esc(s)}</em></li>`).join('')}</ol>
  <div class="top-tools"><div class="langs" aria-label="Language"><button id="es" type="button" aria-pressed="${state.lang==='es'}">ES</button><button id="en" type="button" aria-pressed="${state.lang==='en'}">EN</button></div><button type="button" class="home-btn" data-act="home"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg><span>${esc(t('home'))}</span></button></div>
 </header>`;
}

/* ---------- Popups con datos del proyecto (VUCE 3.0) ---------- */
function modalHtml(){
 const k=state.modal;if(!k)return '';
 const P=t('pop'),p=P[k];let body='';
 if(k==='play'){
  const L=t('lights');
  body=`<div class="taps taps--light">${['green','yellow','red'].map(c=>`<div class="tap tap--card tap--${c} is-on"><span class="light light--${c} light--big"></span><b>${esc(L[c].name)} · ${esc(L[c].action)}</b><p>${esc(L[c].when)}.</p></div>`).join('')}</div>
   <p class="pop-foot">⏱️ ${esc(p.foot)}</p>`;
 }else if(k==='place'){
  body=`<p class="pop-sub">${esc(p.tapTitle)}</p>
   <div class="taps taps--inst">${p.inst.map(([i,l])=>`<button type="button" class="tap" data-tap="inst"><span class="tap-icon">${i}</span><b>${esc(l)}</b><em data-closed="${esc(p.closed)}" data-opened="${esc(p.opened)}"></em></button>`).join('')}</div>
   <p class="pop-count" data-count>${fill(p.count,{n:0})}</p>
   <p class="pop-note" data-note hidden>${esc(p.done)}</p>
   <div class="pop-sol"><b>🤖 ${esc(p.solTitle)}</b><p>${p.solText}</p><p class="pop-next">📺 ${esc(p.next)}</p></div>`;
 }else if(k==='how'){
  body=`<div class="taps taps--how">${p.items.map(([i,a,b])=>`<div class="tap tap--card tap--open"><span class="tap-icon">${i}</span><b>${esc(a)}</b><p>${esc(b)}</p></div>`).join('')}</div>
   <p class="pop-foot"><span class="light light--green"></span><span class="light light--yellow"></span><span class="light light--red"></span>${esc(p.foot)}</p>`;
 }else if(k==='light'){
  body=`<div class="taps taps--light">${p.items.map(([c,a,b])=>`<button type="button" class="tap tap--card tap--${c}" data-tap="light"><span class="light light--${c} light--big"></span><b>${esc(a)}</b><p>${esc(b)}</p></button>`).join('')}</div>
   <p class="pop-foot">🤝 ${esc(p.foot)}</p>`;
 }else if(k==='real'){
  body=`<div class="before-after">
    <div class="ba ba--before"><h4>${esc(p.before)}</h4><ul>${p.beforeItems.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
    <div class="ba-arrow">→</div>
    <div class="ba ba--after"><h4>${esc(p.after)}</h4><ul>${p.afterItems.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
   </div>
   <div class="stats">${p.stats.map(([n,l])=>`<div class="stat-big"><b>${esc(n)}</b><small>${esc(l)}</small></div>`).join('')}</div>
   <p class="pop-foot">🚀 ${p.next}</p>`;
 }
 return `<div class="modal" data-modal role="dialog" aria-modal="true"><div class="modal-card">
  <button type="button" class="modal-x" data-act="close" aria-label="${esc(P.close)}">✕</button>
  <p class="eyebrow eyebrow--bid">${esc(P.eyebrow)}</p>
  <h2>${esc(p.title)}</h2>
  <p class="pop-lead">${p.lead}</p>
  ${body}
  <div class="modal-actions"><button type="button" class="cta" data-act="close">${esc(p.cta)} →</button></div>
 </div></div>`;
}
function openModal(k){
 if(!t('pop')[k])return;
 if(state.screen==='manual'&&state.manual.running){pauseClock('manual');state.resume=true;} // el reloj no corre mientras se lee un popup
 const old=app.querySelector('[data-modal]');if(old)old.remove();
 state.modal=k;state.seen[k]=true;
 app.insertAdjacentHTML('beforeend',modalHtml());bind();emit();
}
function closeModal(){
 const el=app.querySelector('[data-modal]');if(el)el.remove();
 state.modal=null;emit();
 if(state.screen==='manual'&&state.resume){state.resume=false;startClock('manual');}
}
function flash(color){const el=document.createElement('div');el.className='flash flash--'+color;app.appendChild(el);setTimeout(()=>el.remove(),1100);}
function infoBtn(k){return `<button type="button" class="info-btn" data-act="pop:${k}" aria-label="${esc(t('pop')[k].title)}">ⓘ</button>`;}
function factsStrip(){return `<div class="facts"><p class="facts-title">${esc(t('factsTitle'))}</p><div class="facts-grid">${t('facts').map(([n,l,k])=>`<button type="button" class="fact" data-act="pop:${k}"><b>${esc(n)}</b><small>${esc(l)}</small></button>`).join('')}</div></div>`;}

/* ---------- Pantallas ---------- */
function screenIntro(){
 return `<main class="screen screen--intro">
  <section class="intro-hero">
   <p class="eyebrow">${esc(t('simulated'))}</p>
   <h1>${esc(t('introTitle'))}</h1>
   <p class="intro-big">${esc(t('introBig'))}</p>
   <p class="intro-body">${t('introBody')}</p>
   <div class="chips">${t('chips').map(([i,l])=>`<button type="button" class="chip" data-act="pop:place"><span>${i}</span>${esc(l)}<em>ⓘ</em></button>`).join('')}</div>
   <ol class="how">${t('introHow').map(([i,a,b],k)=>`<li><span class="how-num">${k+1}</span><span class="how-icon">${i}</span><span><b>${esc(a)}</b><small>${esc(b)}</small></span></li>`).join('')}</ol>
   <button type="button" class="cta" data-act="start">${esc(t('introCta'))} →</button>
  </section>
  <section class="intro-visual" aria-hidden="true">
   <div class="intro-truck">${truckSvg('#CFE1FF',cargoOf().icon)}<span><b>${esc(truckId())}</b><small>${esc(t('cargo')[state.cargo])}</small></span></div>
   ${tvCue(t('watchTvIntro'))}
  </section>
 </main>`;
}
function crossedCard(){
 const hits=state.manual.answers.filter(a=>a.ok).length;
 if(state.screen==='ai'){const l=overall();return `<div class="done-card done-card--ai"><span class="done-icon">🏁</span><div><b>${esc(t('crossed'))}</b><p>${esc(t('crossedAi'))}</p><p>${fill(t('crossedAiTime'),{t:fmt(state.ai.time),light:esc(t('lights')[l].name)})}</p><p class="done-sim">${fill(t('crossedAiSim'),{m:fmtMin(SIM.ai)})}</p><div class="step-actions"><button type="button" class="cta" data-act="to-results">${esc(t('aiCta'))} →</button><button type="button" class="cta cta--ghost" data-act="replay">↺ ${esc(fill(t('replay'),{n:5}))}</button></div></div></div>`;}
 return `<div class="done-card"><span class="done-icon">🏁</span><div><b>${esc(t('crossed'))}</b><p>${esc(t('crossedManual'))}</p><p>${fill(t('crossedTime'),{t:fmt(state.manual.time),h:hits})}</p><p class="done-sim">${fill(t('crossedSim'),{m:fmtMin(N*SIM.stop)})}</p><button type="button" class="cta" data-act="to-ai">${esc(t('manualCta'))} →</button></div></div>`;
}
function screenManual(){
 const s=state.stops[state.idx];const done=state.manual.done;
 const E=t('entities');
 return `<main class="screen screen--manual">
  <section class="stage">
   <div class="stage-head"><div><p class="eyebrow">${esc(t('simulated'))}</p><h1>${esc(t('manualTitle'))} ${infoBtn('play')}</h1><p class="stage-lead">${done?esc(t('manualDone')):fill(t('manualBody'),{i:state.idx+1,entity:esc(E[s.key].name)})}</p></div>${clock(t('yourTime'))}</div>
   <div data-desk>${done?crossedCard():stopPanel(s)}</div>
   <div class="actions actions--3" data-actions>${done?'':['green','yellow','red'].map(c=>`<button type="button" class="btn btn--${c}" data-act="${c}"><span class="light light--big light--${c}"></span><span><b>${esc(t('lights')[c].name)}</b><small>${esc(t('lights')[c].action)}</small></span></button>`).join('')}</div>
  </section>
 </main>`;
}
/* Panel de la IA en la tableta: el visitante lee cada paso, toca «Ver en la pantalla» y la animación
   ocurre en la pantalla grande. Nada avanza solo. */
function aiPanel(){
 const E=t('entities'),i=state.ai.step,busy=state.ai.busy;
 const steps=`<ol class="ai-steps">${t('aiSteps').map((x,k)=>`<li class="${k<i?'done':k===i?'current':''}"><span>${k+1}</span>${esc(x)}</li>`).join('')}</ol>`;
 if(i>=5)return steps+crossedCard();
 const ex=t('explain')[AI_STEPS[i]];
 const prev=i>0&&!busy?`<p class="step-prev">✓ ${esc(t('stepDone'))}: ${esc(t('aiSteps')[i-1])}</p>`:'';
 const card=`<div class="step-card ${busy?'is-busy':''}"><span class="desk-counter">${esc(fill(t('stepOf'),{i:i+1}))}</span><h2>${esc(t('aiSteps')[i])}</h2><p>${esc(ex[1])}</p>${prev}
  <div class="step-actions">${busy?`<button type="button" class="cta cta--tv" disabled><span class="tv-anim">📺</span>${esc(t('watchingTv'))}</button>`:`<button type="button" class="cta cta--tv" data-act="ai-step">${i===3?'🏛️ '+esc(t('confirmCta')):'📺 '+esc(t('seeTv'))} →</button>`}${i>0&&!busy?`<button type="button" class="cta cta--ghost" data-act="replay">↺ ${esc(fill(t('replay'),{n:i}))}</button>`:''}</div></div>`;
 let vuce='';
 if(i>=2&&(i>2||busy)){
  const rows=state.stops.map((s,k)=>{
   const a=state.ai.answers[k];const l=a?expected(s):null;const cur=state.ai.phase==='scanning'&&busy&&k===state.ai.scanIdx;
   const field=s.issue?t('fields')[s.issue.field]:'',doc=s.missing?t('docs')[s.missing]:'';
   const confirming=state.ai.phase==='verdict'&&busy,ok=k<state.ai.confirmed,next=confirming&&k===state.ai.confirmed;
   const line=ok?fill(t('confirms'),{entity:E[s.key].short}):next?fill(t('confirmWait'),{entity:E[s.key].short}):l?fill(t('aiLine')[l],{entity:E[s.key].short,field,doc}):cur?fill(t('aiScanning'),{entity:E[s.key].short}):E[s.key].rule;
   return `<div class="vrow ${cur||next?'is-reading':''} ${l?'is-done vrow--'+l:''} ${ok?'is-confirmed':''}"><div><b>${esc(E[s.key].name)}</b><small>${esc(line)}${cur||next?'<i class="dots-anim"><i></i><i></i><i></i></i>':''}</small></div>${ok?'<i class="vtick">✓</i>':lightDot(l,true)}</div>`;
  }).join('');
  vuce=`<div class="vuce ${state.ai.phase==='scanning'&&busy?'is-scan':''}"><header><b>${esc(t('vuce'))}</b><small>${esc(t('cargo')[state.cargo])} · ${esc(truckId())}</small></header><div class="vrows">${rows}</div></div>`;
 }
 return `<div class="ai-wait">${steps}<div class="ai-grid ${vuce?'has-vuce':''}">${card}${vuce}</div></div>`;
}
function screenAi(){
 const done=state.ai.step>=5;
 return `<main class="screen screen--ai">
  <section class="stage">
   <div class="stage-head"><div><p class="eyebrow">${esc(t('simulated'))}</p><h1>${esc(t('aiTitle'))} ${infoBtn('how')}</h1><p class="stage-lead">${t('aiBody')} ${esc(t('aiIntro'))}</p></div>${clock(t('aiTime'))}</div>
   <div data-desk>${aiPanel()}</div>
  </section>
 </main>`;
}
function chartRows(){
 const mt=state.manual.time,at=state.ai.time,yh=state.manual.answers.filter(a=>a.ok).length,ah=state.ai.answers.filter(a=>a.ok).length;
 return [{label:t('stops'),you:N,ai:1,youText:String(N),aiText:'1'},{label:t('time'),you:mt,ai:at,youText:fmt(mt)+' s',aiText:fmt(at)+' s'},{label:t('simTime'),you:N*SIM.stop,ai:SIM.ai,youText:'≈ '+fmtMin(N*SIM.stop),aiText:'≈ '+fmtMin(SIM.ai)},{label:t('hits'),you:yh,ai:ah,youText:yh+' / '+N,aiText:ah+' / '+N}];
}
function chartHtml(rows){
 const col=(w,v,m,x)=>`<div class="rc-col rc-col--${w}"><em>${esc(x)}</em><i style="height:${Math.max(6,v/m*100)}%"></i></div>`;
 return `<section class="res-chart"><header><b><i class="rc-key rc-key--you"></i>${esc(t('you'))}</b><b><i class="rc-key rc-key--ai"></i>${esc(t('ai'))}</b></header><div class="rc-groups">${rows.map(r=>{const m=Math.max(r.you,r.ai,1);return `<div class="rc-group"><div class="rc-cols">${col('you',r.you,m,r.youText)}${col('ai',r.ai,m,r.aiText)}</div><small>${esc(r.label)}</small></div>`;}).join('')}</div></section>`;
}
function screenResults(){
 const yourHits=state.manual.answers.filter(a=>a.ok).length,aiHits=state.ai.answers.filter(a=>a.ok).length;
 const mt=state.manual.time,at=state.ai.time;
 const ratio=at>0?mt/at:0;
 const verdict=ratio>=1.5?fill(t('faster'),{x:Math.round(ratio)}):t('sameTime');
 const maxT=Math.max(mt,at,1);
 const E=t('entities');
 const col=(who,time,hits,stops,sim,extra)=>`<section class="who who--${who}"><header><b>${esc(t(who==='you'?'you':'ai'))}</b></header>
   <div class="stat stat--row"><div><small>${esc(t('stops'))}</small><b>${stops}</b></div><div><small>${esc(t('simTime'))}</small><b class="stat-sim">≈ ${esc(fmtMin(sim))}</b></div></div>
   <div class="stat"><small>${esc(t('time'))}</small><b>${fmt(time)}<em> ${esc(t('seconds'))}</em></b><i class="bar"><i style="width:${Math.max(4,time/maxT*100)}%"></i></i></div>
   <div class="stat"><small>${esc(t('hits'))}</small><b>${hits}<em> / ${N}</em></b></div>${extra||''}</section>`;
 return `<main class="screen screen--results">
  <div class="res-only"><section class="res-sign res-sign--big"><span>📺</span><div><b>${esc(t('resOnScreenTitle'))}</b><p>${esc(t('resOnScreen'))}</p></div></section></div>
  <div class="res-bottom res-bottom--simple">
   <p class="res-tv">📺 ${esc(t('seeTvResults'))} ${esc(t('resOnScreen'))}</p>
   <div class="res-actions"><button type="button" class="cta cta--info" data-act="pop:real">🌎 ${esc(t('realLife'))}</button><button type="button" class="cta" data-act="again">${esc(t('again'))}</button><button type="button" class="cta cta--ghost" data-act="home">${esc(t('toHome'))}</button><p class="simulated-note">${esc(t('resSimulated'))}</p></div>
  </div>
 </main>`;
}

/* ---------- Render ---------- */
function render(){
 const screens={intro:screenIntro,manual:screenManual,ai:screenAi,results:screenResults};
 app.innerHTML=header()+screens[state.screen]()+modalHtml();
 app.className='app app--'+state.screen;
 bind();window.scrollTo(0,0);emit();
}
function setBox(kind,html){const el=app.querySelector(`[data-box="${kind}"]`);if(el)el.innerHTML=html;}
function setDesk(html){const el=app.querySelector('[data-desk]');if(el)el.innerHTML=html;}
function decidedList(){const E=t('entities');return `<ol class="decided-list">${state.stops.map(x=>{const c=expected(x);return `<li class="decided--${c}"><span class="light light--${c}"></span><b>${esc(E[x.key].short)}</b> · ${esc(t('lights')[c].action)}</li>`;}).join('')}</ol>`;}

/* ---------- Ronda manual: 3 paradas (el visitante avanza con un toque) ---------- */
function answerManual(choice){
 if(state.manual.feedback||state.manual.done||state.moving)return;
 const s=state.stops[state.idx];const exp=expected(s);const ok=choice===exp;
 pauseClock('manual');
 state.manual.answers.push({key:s.key,choice,ok});
 const E=t('entities')[s.key];
 const field=s.issue?t('fields')[s.issue.field]:'',doc=s.missing?t('docs')[s.missing]:'';
 const msg=(ok?'':fill(t('itWas'),{name:t('lights')[exp].name.toLowerCase()})+' ')+fill(t('why')[exp],{entity:E.name,field,doc});
 state.manual.feedback={ok,msg,light:exp};
 flash(exp);
 setDesk(stopPanel(s,{reveal:true}));
 const last=state.idx>=state.stops.length-1;
 app.querySelector('[data-actions]').innerHTML=`<div class="feedback ${ok?'feedback--ok':'feedback--bad'}"><span class="light light--big light--${exp}"></span><div><b>${esc(ok?t('fbRight'):t('fbWrong'))}</b><span>${esc(msg)}</span></div><button type="button" class="cta cta--next" data-act="next-stop">${esc(last?t('crossNow'):t('nextStop'))} →</button></div>`;
 setBox('decided',`<b>${esc(ok?t('fbRight'):t('fbWrong'))}</b> ${esc(msg)}`);
 bind();emit();
}
function nextStop(){
 if(!state.manual.feedback||state.moving)return;
 state.manual.feedback=null;state.moving=true;state.pos=state.idx+2;
 const a=app.querySelector('[data-actions]');if(a)a.innerHTML=`<div class="feedback feedback--move"><span class="move-icon">📺</span><b>${esc(t('moving'))}</b><span>${esc(t('explain').moving[1])}</span></div>`;
 emit();
 after(()=>{
  state.moving=false;state.idx+=1;
  if(state.idx>=state.stops.length){state.manual.done=true;state.pos=N+1;render();if(!state.seen.place)openModal('place');}
  else{render();startClock('manual');}
 },TRAVEL_MS);
}

/* ---------- Ronda IA: 5 pasos, cada uno arranca con un toque en la tableta ---------- */
/* Volver a ver el paso anterior de la IA: la tableta vuelve un paso y repite la animación en la pantalla. */
function replayStep(){
 if(state.ai.busy||state.ai.step<=0||state.modal)return;
 const i=state.ai.step-1;state.ai.step=i;
 if(i<=2){state.ai.answers=[];state.ai.scanIdx=-1;state.ai.time=0;}if(i<=3){state.ai.verdict=null;state.ai.confirmed=0;}
 if(i<=1)state.pos=0;if(i===4)state.pos=2;
 state.moving=false;state.ai.busy=true;state.ai.phase='replay';render();
 after(()=>{state.ai.busy=false;runStep();},i<=1?900:120); // primero se muestra el estado anterior en la pantalla, luego la animación
}
function runStep(){
 if(state.ai.busy||state.ai.step>=5||state.modal)return;
 const i=state.ai.step,ph=AI_STEPS[i],E=t('entities');
 state.ai.busy=true;state.ai.phase=ph;
 const finish=()=>{state.ai.busy=false;state.ai.step=i+1;if(state.ai.step>=5)state.ai.phase='done';render();};
 if(ph==='merging'){render();after(finish,MERGE_MS);}
 else if(ph==='toVuce'){state.moving=true;state.pos=2;render();after(()=>{state.moving=false;finish();},TRAVEL_MS);}
 else if(ph==='scanning'){
  state.ai.answers=[];state.ai.time=0;render();startClock('ai');
  const scan=k=>{
   if(k>=state.stops.length){pauseClock('ai');state.ai.scanIdx=-1;finish();return;}
   state.ai.scanIdx=k;setDesk(aiPanel());bind();emit();
   after(()=>{state.ai.answers.push({key:state.stops[k].key,choice:expected(state.stops[k]),ok:true});flash(expected(state.stops[k]));setDesk(aiPanel());bind();emit();scan(k+1);},SCAN_MS);
  };
  scan(0);
 }
 else if(ph==='verdict'){
  const l=overall();const s=state.stops.find(x=>expected(x)===l)||state.stops[0];
  const field=s.issue?t('fields')[s.issue.field]:'',doc=s.missing?t('docs')[s.missing]:'';
  const lines=state.stops.map(x=>fill(t('aiLine')[expected(x)],{entity:E[x.key].short,field:x.issue?t('fields')[x.issue.field]:'',doc:x.missing?t('docs')[x.missing]:''}));
  state.ai.verdict={light:l,msg:fill(t('aiWhy')[l],{field,doc}),lines};
  state.ai.confirmed=0;render();setBox('decided',decidedList());
  const confirm=k=>{ // cada institución conserva la última palabra: va confirmando una por una
   if(k>=state.stops.length){after(finish,900);return;}
   after(()=>{state.ai.confirmed=k+1;flash('bid');setDesk(aiPanel());bind();emit();confirm(k+1);},CONFIRM_MS);
  };
  confirm(0);
 }
 else if(ph==='toBorder'){state.moving=true;state.pos=N+1;render();after(()=>{state.moving=false;finish();},TRAVEL_MS);}
}

/* ---------- Espejo para la pantalla ----------
   La tableta (module.js) reenvía este resumen al estado de la estación y la pantalla lo pinta
   con tv.js. Solo lleva textos ya traducidos, posición del camión, semáforos y
   cronómetros: nunca documentos. */
function tvPacket(){
 const L=t('lights'),TV=t('tv'),E=t('entities');
 const screen=state.screen,m=mode(),who=m==='ai'?'ai':'manual';
 const stops=state.stops.map((s,i)=>{const y=state.manual.answers[i],a=state.ai.answers[i];const revealed=screen==='results'||(screen==='manual'&&!!y)||(screen==='ai'&&!!a);
  return {key:s.key,name:E[s.key].name,short:E[s.key].short,icon:s.icon,rule:E[s.key].rule,light:revealed?expected(s):null,you:y?y.choice:null,ok:y?y.ok:null};});
 let phase='deciding',hint='',title='',clockLabel='';
 const cur=state.stops[Math.min(state.idx,N-1)];
 if(screen==='intro'){phase='intro';hint=TV.intro;title=t('introTitle');}
 else if(screen==='manual'){title=t('manualTitle');clockLabel=t('yourTime');
  if(state.manual.done){phase='crossed';hint=TV.crossedManual;}else if(state.moving){phase='moving';hint=TV.moving;}else if(state.manual.feedback){phase='feedback';hint=TV.feedback;}else{hint=fill(TV.deciding,{entity:E[cur.key].name});}}
 else if(screen==='ai'){title=t('aiTitle');clockLabel=t('aiTime');
  const p=state.ai.phase,busy=state.ai.busy,st=state.ai.step;
  if(st>=5){phase='crossed';hint=TV.crossedAi;}
  else if(!busy){phase=st===0?'waiting':'stepDone';hint=st===0?TV.waiting:fill(TV.nextStep,{n:st+1});}
  else if(p==='replay'){phase='waiting';hint=TV.reading;}else if(p==='merging'){phase='merging';hint=TV.merging;}else if(p==='toVuce'){phase='moving';hint=TV.toVuce;}
  else if(p==='scanning'){phase='scanning';hint=TV.scanning;}else if(p==='verdict'){phase='verdict';hint=TV.verdict;}else{phase='moving';hint=TV.toBorder;}}
 else{phase='results';title=t('resTitle');hint=TV.results;}
 const fb=state.manual.feedback,v=state.ai.verdict;
 let results=null;
 if(screen==='results'){
  const mt=state.manual.time,at=state.ai.time,ratio=at>0?mt/at:0;
  const ol=overall();
  results={verdict:ratio>=1.5?fill(t('faster'),{x:Math.round(ratio)}):t('sameTime'),learnTitle:t('resLearnTitle'),learnBig:t('resLearnBig'),learn:t('resLearn'),
   solTitle:t('solTitle'),solBody:t('solBody'),solFinal:t('solFinal'),solYou:t('solYou'),
   solution:state.stops.map((s,i)=>{const l=expected(s);const y=state.manual.answers[i];return {name:E[s.key].name,icon:s.icon,light:l,action:L[l].action,why:fill(t('why')[l],{entity:E[s.key].name,field:s.issue?t('fields')[s.issue.field]:'',doc:s.missing?t('docs')[s.missing]:''}),you:y?y.choice:null,youName:y?L[y.choice].name:'',ok:y?y.ok:false};}),
   final:{light:ol,action:L[ol].action,name:L[ol].name},chart:chartRows(),chartTitle:t('chartTitle'),
   challenge:{title:t('resChallenge')[0],text:t('resChallenge')[1]},how:t('resHow'),insightsTitle:t('resInsightsTitle'),insights:t('insights').map(([big,title,text])=>({big,title,text})),
   stats:{you:{stops:N,time:fmt(mt),hits:state.manual.answers.filter(a=>a.ok).length,sim:'≈ '+fmtMin(3*SIM.stop)},ai:{stops:1,time:fmt(at),hits:state.ai.answers.filter(a=>a.ok).length,sim:'≈ '+fmtMin(SIM.ai)}}};
 }
 const sim=simMinutes();
 const exKey=screen==='manual'?(state.manual.done?'crossedManual':state.moving?'moving':state.manual.feedback?'feedback':'deciding'):screen==='ai'?(state.ai.step>=5?'crossedAi':state.ai.busy?AI_STEPS[state.ai.step]:state.ai.step===0?'waiting':AI_STEPS[state.ai.step-1]):null;
 const exRaw=exKey?t('explain')[exKey]:null;
 const explain=exRaw?{step:fill(exRaw[0],{i:state.idx+1,entity:E[cur.key].name}),text:fill(exRaw[1],{entity:E[cur.key].name,left:Math.max(0,N-1-state.idx)})}:null;
 return {v:2,screen,lang:state.lang,step:{intro:0,manual:1,ai:2,results:3}[screen],steps:t('steps'),simulated:t('simulated'),
  mode:m,truck:{id:truckId(),cargo:t('cargo')[state.cargo],icon:cargoOf().icon},stops,idx:Math.min(state.idx,N-1),pos:state.pos,moving:state.moving,
  merged:m==='ai'&&(state.ai.step>=1||(state.ai.busy&&state.ai.phase!=='replay')),busy:state.ai.busy,aiStep:state.ai.step,scanIdx:state.ai.scanIdx,confirmed:state.ai.confirmed,title,subtitle:screen==='intro'?t('introBig'):'',hint,phase,clockLabel,
  time:Math.round(state[who].time),running:!!state[who].running,sim:{label:t('simLabel'),text:sim?'≈ '+fmtMin(sim):'0 min'},explain,
  feedback:fb?{ok:fb.ok,light:fb.light,title:fb.ok?t('fbRight'):t('fbWrong'),msg:fb.msg}:null,
  verdict:v?{light:v.light,title:fill(t('semaforo'),{name:L[v.light].name.toLowerCase()})+' · '+L[v.light].action,msg:v.msg,lines:v.lines}:null,
  results,labels:{you:t('you'),ai:t('ai'),time:t('time'),hits:t('hits'),stops:t('stops'),simTime:t('simTime'),seconds:t('seconds'),reading:TV.reading,border:t('border'),start:t('start'),vuce:t('vuce')}};
}
let emitPending=false;
function emit(){
 if(window.parent===window)return;
 if(emitPending)return;emitPending=true;
 setTimeout(()=>{emitPending=false;try{window.parent.postMessage({type:'cr-game',game:tvPacket()},'*');}catch{}},0);
}

/* ---------- Navegación ---------- */
function go(screen){
 stop();state.screen=screen;state.moving=false;
 if(screen==='manual'){state.idx=0;state.pos=1;state.manual={time:0,start:0,running:false,answers:[],feedback:null,done:false};render();
  if(state.seen.play)startClock('manual');else{state.resume=true;openModal('play');}return;}
 if(screen==='ai'){state.ai={time:0,start:0,running:false,answers:[],phase:'idle',verdict:null,scanIdx:-1,step:0,busy:false,confirmed:0};state.pos=0;render();
  if(!state.seen.how)openModal('how');return;}
 if(screen==='intro')state.pos=0;
 render();
 if(screen==='results')flash(overall());
}
function bind(){
 app.querySelector('#es').onclick=()=>setLanguage('es');
 app.querySelector('#en').onclick=()=>setLanguage('en');
 app.querySelectorAll('[data-act]').forEach(btn=>btn.onclick=()=>{
  const act=btn.dataset.act;
  if(act==='close')closeModal();
  else if(act.startsWith('pop:'))openModal(act.slice(4));
  else if(act==='start')go('manual');
  else if(act==='green'||act==='yellow'||act==='red')answerManual(act);
  else if(act==='next-stop')nextStop();
  else if(act==='ai-step')runStep();
  else if(act==='replay')replayStep();
  else if(act==='to-ai'&&state.manual.done)go('ai');
  else if(act==='to-results'&&state.ai.step>=5)go('results');
  else if(act==='again'){state.round+=1;newRound();go('intro');}
  else if(act==='home'){/* module.js intercepta este botón en la tableta */state.round+=1;newRound();go('intro');}
 });
 // Popups: cerrar al tocar el fondo y tarjetas interactivas
 const modal=app.querySelector('[data-modal]');if(modal)modal.onclick=e=>{if(e.target===modal)closeModal();};
 app.querySelectorAll('[data-tap]').forEach(b=>b.onclick=()=>{
  b.classList.toggle('is-on');
  if(b.dataset.tap==='inst'){
   const n=app.querySelectorAll('[data-tap="inst"].is-on').length;
   const c=app.querySelector('[data-count]');if(c)c.innerHTML=fill(t('pop').place.count,{n});
   const note=app.querySelector('[data-note]');if(note)note.hidden=n<5;
  }
 });
}
function setLanguage(lang){
 if(!COPY[lang]||lang===state.lang)return;
 state.lang=lang;document.documentElement.lang=lang;
 const wasRunning=state.manual.running;
 render();
 if(state.screen==='manual'&&wasRunning&&!state.modal)startClock('manual');
 if(state.screen==='ai'&&state.ai.verdict)setBox('decided',decidedList());
}
window.CR_GAME={state,go,setLanguage,tvPacket};
newRound();render();
})();
