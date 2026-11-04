/* Costa Rica Smart Borders / VUCE 3.0 — minijuego educativo (versión simple).
   HTML/CSS/JS puros, sin dependencias. Datos 100 % simulados.

   Dinámica:
     intro   → Llegan camiones. Cada uno entrega sus documentos.
     manual  → TÚ lees los documentos de cada camión, buscas inconsistencias y decides
               "Dejar pasar" o "Inspeccionar". Un cronómetro mide tu tiempo.
     ai      → La IA (VUCE 3.0) lee los MISMOS documentos automáticamente, marca las
               diferencias y propone la decisión. El cronómetro mide su tiempo.
     results → Comparación simple: tiempo, aciertos y documentos leídos.

   Integración con la tableta (module.js del proyecto 03):
     #es / #en cambian el idioma; [data-act="home"] vuelve al Home global. */
'use strict';
(()=>{
const app=document.getElementById('app');
const FIELDS=['producto','cantidad','peso','origen','placa'];
const DOCS=['factura','manifiesto','declaracion'];

/* ---------- Copys bilingües ---------- */
const COPY={
 es:{
  brand:'AI in Action',station:'Estación 03 · Costa Rica Smart Borders',home:'Inicio',
  simulated:'Ejemplo simulado · educativo',
  steps:['Llegan camiones','Tú revisas','La IA revisa','Comparación'],
  what:'¿Qué está pasando?',decided:'¿Qué decidió el sistema?',learned:'¿Qué aprendiste?',
  fields:{producto:'Producto',cantidad:'Cantidad',peso:'Peso',origen:'Origen',placa:'Placa'},
  docs:{factura:'Factura',manifiesto:'Manifiesto de carga',declaracion:'Declaración aduanera'},
  cargo:{cafe:'Café',repuestos:'Repuestos',frutas:'Frutas',medicinas:'Medicinas',electronica:'Electrónica',granos:'Granos'},
  units:{cantidad:'cajas',peso:'kg'},
  // Intro
  introTitle:'Llegan camiones a la frontera.',
  introBig:'Cada camión entrega sus documentos.',
  introBody:'Los documentos deben decir <b>lo mismo</b>: producto, cantidad, peso, origen y placa. Si algo no coincide, el camión se inspecciona.',
  introHow:[['👀','Tú revisas','Lees los documentos y decides.'],['🤖','La IA revisa','Lee los mismos documentos en segundos.'],['⏱️','Comparamos','Tiempo y aciertos de los dos.']],
  introWhat:'Hoy llegan <b>{n} camiones</b>. Cada uno trae 2 o 3 documentos.',
  introLearn:'Revisar papeles toma tiempo y es fácil pasar algo por alto.',
  introCta:'Empezar a revisar',
  // Manual
  manualTitle:'Tú revisas',
  manualBody:'Compara los documentos. ¿Dicen lo mismo?',
  truckOf:'Camión {i} de {n}',
  yourTime:'Tu tiempo',aiTime:'Tiempo de la IA',
  lights:{green:{name:'Verde',action:'Dejar pasar',when:'Todo coincide'},yellow:{name:'Amarillo',action:'Revisar documentos',when:'Falta un documento'},red:{name:'Rojo',action:'Inspección conjunta',when:'Algo no coincide'}},
  semaforo:'Semáforo {name}',itWas:'Era semáforo {name}.',
  manualWhat:'Aquí decides tú. Lee cada fila, compara entre documentos y pon el semáforo.',
  manualDecided:'Todavía nadie te ayuda. El cronómetro corre.',
  manualLearn:'Un detalle pequeño, como una cifra o una letra, puede esconder un problema.',
  missingDoc:'Falta un documento',
  fbRight:'¡Correcto!',fbWrong:'Ups, no era así.',
  why:{green:'Los documentos coincidían: el camión sigue su camino.',yellow:'Faltaba un documento: se pide antes de decidir.',red:'Había una diferencia en {field}: una sola inspección conjunta.'},
  manualDone:'¡Terminaste! Ahora la IA revisará los mismos camiones.',
  manualCta:'Ver cómo lo hace la IA',
  // IA
  aiTitle:'La IA revisa',
  aiBody:'Los <b>mismos camiones</b> y los <b>mismos documentos</b>. Ahora lee la computadora.',
  aiReading:'Leyendo documentos…',aiScanning:'Escaneando',aiAnalyzing:'Analizando {field}…',aiComparing:'Comparando documentos…',
  aiWhat:'La IA compara todas las filas de todos los documentos al mismo tiempo y asigna un semáforo a cada camión.',
  aiWhy:{green:'Todo coincide. Propone dejar pasar.',yellow:'Falta un documento. Propone revisar documentos.',red:'Encontró una diferencia en {field}. Propone una inspección conjunta.'},
  aiLearn:'La IA <b>no abre el camión</b>. Lee rápido y señala las pistas. La persona decide.',
  aiDone:'La IA terminó de leer.',
  aiCta:'Comparar resultados',
  // Resultados
  resTitle:'Mismos camiones, dos formas de revisar',
  resBody:'Así le fue a cada uno con los {n} camiones de hoy.',
  you:'Tú',ai:'IA · VUCE 3.0',
  time:'Tiempo',hits:'Aciertos',docsRead:'Documentos leídos',
  seconds:'segundos',faster:'La IA fue {x} veces más rápida.',sameTime:'Tardaron casi lo mismo.',
  perTruck:'Camión por camión',
  right:'Acertó',wrong:'Falló',
  resDecided:'La IA leyó {d} documentos en {t} segundos y marcó las diferencias. Tú tardaste {m} segundos.',
  resLearnTitle:'La IA lee rápido y señala pistas.',resLearnBig:'La persona decide.',
  resLearn:'No se trata de inspeccionar más. Se trata de priorizar mejor y ganar tiempo para lo importante.',
  resSimulated:'Resultados simulados con fines educativos. No son datos reales de Costa Rica ni de la VUCE.',
  again:'Jugar otro turno',toHome:'Volver al inicio',
  truckAria:'Camión {id}, {cargo}',
  tv:{intro:'Toca «Empezar a revisar» en la tableta.',deciding:'Está leyendo los documentos en la tableta…',manualDone:'Toca «Ver cómo lo hace la IA» en la tableta.',waiting:'Leyendo «¿Cómo lo hace VUCE 3.0?» en la tableta…',scanning:'Escaneando documentos',aiDone:'Toca «Comparar resultados» en la tableta.',results:'Toca «Jugar otro turno» o «Inicio» en la tableta.',reading:'Se está leyendo en la tableta'},
  whyLight:'¿Qué significa el semáforo?',realLife:'¿Y en la vida real?',factsTitle:'Datos de VUCE 3.0 · toca para saber más',
  facts:[['650','camiones al día en Peñas Blancas','place'],['5','instituciones, 1 sola inspección conjunta','real'],['330.000','registros históricos entrenaron la IA','how'],['360.000','trámites en un año','real'],['3','mecanismos: reglas, IA y azar','how']],
  chips:[['📍','Peñas Blancas, Costa Rica'],['🚛','650 camiones al día'],['🏛️','5 instituciones']],
  pop:{
   eyebrow:'Dato del proyecto · VUCE 3.0',close:'Cerrar',
   play:{title:'¿Cómo se juega?',lead:'Cada camión entrega sus documentos. Compara las filas y ponle el <b>semáforo</b>, como hace la VUCE 3.0:',
    foot:'El cronómetro arranca cuando cierres esta ventana.',cta:'Empezar'},
   place:{title:'Así era antes en Peñas Blancas',
    lead:'Cada día pasan por este puesto fronterizo de Costa Rica unas <b>650 unidades de transporte</b> con mercancías.',
    stats:[['650','camiones al día'],['5','instituciones revisaban por separado'],['1','frontera: Peñas Blancas']],
    tapTitle:'Toca cada institución. Cada una revisaba el mismo camión con sus propias reglas:',
    inst:[['🐄','Sanidad animal'],['🌱','Sanidad vegetal'],['🏥','Ministerio de Salud'],['🏛️','Otra institución'],['🏛️','Otra institución']],
    closed:'Cerrado',opened:'Abierto',
    count:'El mismo camión se abrió <b>{n}</b> de 5 veces',
    done:'Reglas fijas y sin herramienta compartida: controles poco focalizados, camiones abiertos varias veces y demoras para el comercio legítimo.',
    cta:'Entendido'},
   how:{title:'¿Cómo lo hace VUCE 3.0?',
    lead:'El Módulo de Gestión de Riesgos de la Ventanilla Única de Comercio Exterior combina <b>tres mecanismos</b>. Toca cada uno.',
    items:[['📏','Reglas','Las reglas de cada institución siguen vigentes.'],['🧠','Aprendizaje automático','Modelos entrenados con más de 330.000 registros históricos de comercio. Detectan patrones que una persona no alcanza a ver.'],['🎲','Selección aleatoria','Algunas operaciones se revisan al azar para mantener la vigilancia.']],
    foot:'Resultado: cada operación recibe un semáforo verde, amarillo o rojo.',
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
  steps:['Trucks arrive','You check','AI checks','Comparison'],
  what:'What is happening?',decided:'What did the system decide?',learned:'What did you learn?',
  fields:{producto:'Product',cantidad:'Quantity',peso:'Weight',origen:'Origin',placa:'Plate'},
  docs:{factura:'Invoice',manifiesto:'Cargo manifest',declaracion:'Customs declaration'},
  cargo:{cafe:'Coffee',repuestos:'Spare parts',frutas:'Fruit',medicinas:'Medicines',electronica:'Electronics',granos:'Grain'},
  units:{cantidad:'boxes',peso:'kg'},
  introTitle:'Trucks arrive at the border.',
  introBig:'Each truck hands in its documents.',
  introBody:'The documents must say <b>the same thing</b>: product, quantity, weight, origin and plate. If something does not match, the truck is inspected.',
  introHow:[['👀','You check','You read the documents and decide.'],['🤖','AI checks','It reads the same documents in seconds.'],['⏱️','We compare','Time and correct answers for both.']],
  introWhat:'Today <b>{n} trucks</b> arrive. Each one brings 2 or 3 documents.',
  introLearn:'Checking paperwork takes time and it is easy to miss something.',
  introCta:'Start checking',
  manualTitle:'You check',
  manualBody:'Compare the documents. Do they say the same?',
  truckOf:'Truck {i} of {n}',
  yourTime:'Your time',aiTime:'AI time',
  lights:{green:{name:'Green',action:'Let it pass',when:'Everything matches'},yellow:{name:'Yellow',action:'Review documents',when:'A document is missing'},red:{name:'Red',action:'Joint inspection',when:'Something is off'}},
  semaforo:'{name} light',itWas:'It was a {name} light.',
  manualWhat:'You decide here. Read each row, compare across documents and set the light.',
  manualDecided:'Nobody is helping you yet. The clock is running.',
  manualLearn:'A small detail, like a digit or a letter, can hide a problem.',
  missingDoc:'Missing document',
  fbRight:'Correct!',fbWrong:'Oops, not quite.',
  why:{green:'The documents matched: the truck moves on.',yellow:'A document was missing: it is requested before deciding.',red:'There was a difference in {field}: a single joint inspection.'},
  manualDone:'Done! Now the AI will check the same trucks.',
  manualCta:'See how the AI does it',
  aiTitle:'AI checks',
  aiBody:'The <b>same trucks</b> and the <b>same documents</b>. Now the computer reads.',
  aiReading:'Reading documents…',aiScanning:'Scanning',aiAnalyzing:'Analyzing {field}…',aiComparing:'Comparing documents…',
  aiWhat:'The AI compares every row of every document at once and gives each truck a traffic light.',
  aiWhy:{green:'Everything matches. It suggests letting it pass.',yellow:'A document is missing. It suggests reviewing documents.',red:'It found a difference in {field}. It suggests a joint inspection.'},
  aiLearn:'The AI <b>does not open the truck</b>. It reads fast and points out clues. The person decides.',
  aiDone:'The AI finished reading.',
  aiCta:'Compare results',
  resTitle:'Same trucks, two ways to check',
  resBody:'This is how each one did with today\'s {n} trucks.',
  you:'You',ai:'AI · VUCE 3.0',
  time:'Time',hits:'Correct',docsRead:'Documents read',
  seconds:'seconds',faster:'The AI was {x} times faster.',sameTime:'They took about the same time.',
  perTruck:'Truck by truck',
  right:'Correct',wrong:'Missed',
  resDecided:'The AI read {d} documents in {t} seconds and marked the differences. You took {m} seconds.',
  resLearnTitle:'AI reads fast and points out clues.',resLearnBig:'The person decides.',
  resLearn:'It is not about inspecting more. It is about prioritizing better and saving time for what matters.',
  resSimulated:'Simulated results for educational purposes. Not real data from Costa Rica or VUCE.',
  again:'Play another round',toHome:'Back to start',
  truckAria:'Truck {id}, {cargo}',
  tv:{intro:'Tap “Start checking” on the tablet.',deciding:'Reading the documents on the tablet…',manualDone:'Tap “See how the AI does it” on the tablet.',waiting:'Reading “How does VUCE 3.0 do it?” on the tablet…',scanning:'Scanning documents',aiDone:'Tap “Compare results” on the tablet.',results:'Tap “Play another round” or “Home” on the tablet.',reading:'Being read on the tablet'},
  whyLight:'What does the traffic light mean?',realLife:'And in real life?',factsTitle:'VUCE 3.0 facts · tap to learn more',
  facts:[['650','trucks a day at Peñas Blancas','place'],['5','agencies, 1 single joint inspection','real'],['330,000','historical records trained the AI','how'],['360,000','procedures in one year','real'],['3','mechanisms: rules, AI and chance','how']],
  chips:[['📍','Peñas Blancas, Costa Rica'],['🚛','650 trucks a day'],['🏛️','5 agencies']],
  pop:{
   eyebrow:'Project fact · VUCE 3.0',close:'Close',
   play:{title:'How to play?',lead:'Each truck hands in its documents. Compare the rows and set the <b>traffic light</b>, just like VUCE 3.0 does:',
    foot:'The clock starts when you close this window.',cta:'Start'},
   place:{title:'How it used to be at Peñas Blancas',
    lead:'Every day about <b>650 cargo vehicles</b> pass through this border crossing in Costa Rica.',
    stats:[['650','trucks a day'],['5','agencies checked separately'],['1','border: Peñas Blancas']],
    tapTitle:'Tap each agency. Each one checked the same truck with its own rules:',
    inst:[['🐄','Animal health'],['🌱','Plant health'],['🏥','Ministry of Health'],['🏛️','Another agency'],['🏛️','Another agency']],
    closed:'Closed',opened:'Opened',
    count:'The same truck was opened <b>{n}</b> of 5 times',
    done:'Fixed rules and no shared tool: poorly targeted controls, trucks opened several times and delays for legitimate trade.',
    cta:'Got it'},
   how:{title:'How does VUCE 3.0 do it?',
    lead:'The Risk Management Module of the Foreign Trade Single Window combines <b>three mechanisms</b>. Tap each one.',
    items:[['📏','Rules','Each agency\'s own rules still apply.'],['🧠','Machine learning','Models trained on more than 330,000 historical trade records. They detect patterns a person cannot see.'],['🎲','Random selection','Some transactions are checked at random to keep oversight in place.']],
    foot:'Result: every transaction gets a green, yellow or red light.',
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
const CARGO_ICON={cafe:'☕',repuestos:'🔧',frutas:'🍌',medicinas:'💊',electronica:'💻',granos:'🌾'};

/* ---------- Casos simulados ----------
   base: valores de los documentos. issue: {field, doc, value} = una inconsistencia
   en un documento; missing: documento ausente. Sin issue ni missing → dejar pasar. */
const CASES=[
 {id:101,cargo:'cafe',base:{cantidad:'240',peso:'4.800',origen:'Costa Rica',placa:'SJO-2210'}},
 {id:102,cargo:'repuestos',base:{cantidad:'120',peso:'2.150',origen:'Panamá',placa:'PTY-7731'},issue:{field:'cantidad',doc:'declaracion',value:'210'}},
 {id:103,cargo:'frutas',base:{cantidad:'900',peso:'9.000',origen:'Costa Rica',placa:'LIM-0453'},missing:'declaracion',issue:{field:'peso',doc:'manifiesto',value:'6.000'}},
 {id:104,cargo:'medicinas',base:{cantidad:'60',peso:'480',origen:'México',placa:'MEX-5190'}},
 {id:105,cargo:'electronica',base:{cantidad:'310',peso:'3.720',origen:'Nicaragua',placa:'MGA-8864'},missing:'manifiesto'}
];
const AI_ROW_MS=260, AI_READ_MS=FIELDS.length*AI_ROW_MS+400, AI_SHOW_MS=1500; // duración de la lectura automática por camión

/* ---------- Utilidades ---------- */
const fill=(text,vars)=>text.replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=ms=>{const s=Math.floor(ms/1000),d=Math.floor((ms%1000)/100);return `${s}.${d}`;};
function rng(v){let x=v>>>0;return()=>{x+=0x6D2B79F5;let a=x;a=Math.imul(a^(a>>>15),a|1);a^=a+Math.imul(a^(a>>>7),a|61);return((a^(a>>>14))>>>0)/4294967296;};}
function expected(c){return c.issue?'red':c.missing?'yellow':'green';} // semáforo correcto de cada camión
function docValue(c,doc,field){
 if(field==='producto')return null; // se traduce al renderizar
 if(c.issue&&c.issue.doc===doc&&c.issue.field===field)return c.issue.value;
 return c.base[field];
}

/* ---------- Estado ---------- */
const state={lang:'en',screen:'intro',round:1,cases:[],idx:0,modal:null,seen:{},
 manual:{time:0,start:0,running:false,answers:[],feedback:null},
 ai:{time:0,start:0,running:false,answers:[],phase:'idle'}};
let timers=[],ticker=null;
const after=(fn,ms)=>timers.push(setTimeout(fn,ms));
const stop=()=>{timers.forEach(clearTimeout);timers=[];if(ticker){clearInterval(ticker);ticker=null;}};
const t=k=>COPY[state.lang][k];

function newRound(){
 stop();
 const r=rng(20261102+state.round*7919);
 const order=CASES.map((c,i)=>({c,k:r()})).sort((a,b)=>a.k-b.k).map(x=>x.c);
 state.cases=order;state.idx=0;state.modal=null;state.seen={};
 state.manual={time:0,start:0,running:false,answers:[],feedback:null};
 state.ai={time:0,start:0,running:false,answers:[],phase:'idle'};
}
function startClock(who){state[who].start=performance.now()-state[who].time;state[who].running=true;let n=0;
 if(!ticker)ticker=setInterval(()=>{const el=app.querySelector('[data-clock]');if(el&&state[who].running){state[who].time=performance.now()-state[who].start;el.textContent=fmt(state[who].time)+' s';if(++n%10===0)emit();}},100);
 emit();}
function pauseClock(who){if(state[who].running){state[who].time=performance.now()-state[who].start;state[who].running=false;emit();}}

/* ---------- Componentes ---------- */
function truckSvg(color,icon){
 return `<svg class="truck-svg" viewBox="0 0 150 70" aria-hidden="true"><rect x="4" y="12" width="92" height="40" rx="6" fill="${color}"/><circle cx="34" cy="32" r="15" fill="#fff"/><text x="34" y="38" text-anchor="middle" font-size="17">${icon}</text><path d="M98 24h24l20 16v12H98z" fill="#F7F9FF" stroke="#95979C" stroke-width="2"/><path d="M106 28h12l12 10h-24z" fill="#2E79FF"/><path d="M4 52h138" stroke="#95979C" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="55" r="9" fill="#141414"/><circle cx="30" cy="55" r="3.5" fill="#EBEDF7"/><circle cx="116" cy="55" r="9" fill="#141414"/><circle cx="116" cy="55" r="3.5" fill="#EBEDF7"/></svg>`;
}
function docCard(c,doc,{reveal=false,scan=false}={}){
 if(c.missing===doc)return `<article class="doc doc--missing ${reveal?'is-flag':''}"><header><span class="doc-icon">📄</span><b>${esc(t('docs')[doc])}</b></header><div class="doc-missing"><span>❔</span><p>${esc(t('missingDoc'))}</p></div></article>`;
 const rows=FIELDS.map(f=>{
  const v=f==='producto'?t('cargo')[c.cargo]:docValue(c,doc,f);
  const unit=t('units')[f]?' '+t('units')[f]:'';
  const bad=reveal&&c.issue&&c.issue.field===f; // se resalta la fila en TODOS los documentos para comparar
  const own=bad&&c.issue.doc===doc;
  return `<div class="row ${bad?'row--bad':''} ${own?'row--own':''}" data-field="${f}"><span>${esc(t('fields')[f])}</span><b>${esc(v)}${f==='producto'?'':esc(unit)}</b></div>`;
 }).join('');
 return `<article class="doc ${scan?'is-scan':''}"><header><span class="doc-icon">📄</span><b>${esc(t('docs')[doc])}</b></header>${rows}</article>`;
}
function truckPanel(c,{reveal=false,scan=false}={}){
 const n=state.cases.length;
 return `<div class="desk">
  <div class="desk-truck"><span class="desk-counter">${esc(fill(t('truckOf'),{i:state.idx+1,n}))}</span>${truckSvg('#CFE1FF',CARGO_ICON[c.cargo])}<b>CR-${c.id}</b><small>${esc(t('cargo')[c.cargo])}</small></div>
  <div class="docs">${DOCS.map(d=>docCard(c,d,{reveal,scan})).join('')}</div>
  ${scan?`<div class="ai-scan"><span class="ai-scan-bot">🤖</span><div class="ai-scan-text"><b data-scan-label>${esc(t('aiScanning'))}<i class="dots-anim"><i></i><i></i><i></i></i></b><span class="ai-progress"><i data-scan-bar></i></span></div></div>`:''}
 </div>`;
}
function box(kind,title,body){
 const icon={what:'👀',decided:'🧭',learned:'💡'}[kind];
 return `<section class="box box--${kind}"><h3><span>${icon}</span>${esc(title)}</h3><div class="box-body" data-box="${kind}">${body}</div></section>`;
}
function clock(label){return `<div class="clock"><span>${esc(label)}</span><b data-clock>${fmt(state.screen==='ai'?state.ai.time:state.manual.time)} s</b></div>`;}
function header(){
 const steps=t('steps');const index={intro:0,manual:1,ai:2,results:3}[state.screen];
 return `<header class="top">
  <div class="top-brand"><img class="top-idb-group" src="../../../assets/brand/idb-group.jpg" alt="IDB Group"><span class="top-sep"></span><span><b>${esc(t('brand'))}</b><small>IDB Group Projects Across The Region</small></span></div>
  <ol class="stepper">${steps.map((s,i)=>`<li class="${i<index?'done':i===index?'current':''}"><span>${i+1}</span><em>${esc(s)}</em></li>`).join('')}</ol>
  <div class="top-tools"><div class="langs" aria-label="Language"><button id="es" type="button" aria-pressed="${state.lang==='es'}">ES</button><button id="en" type="button" aria-pressed="${state.lang==='en'}">EN</button></div><button type="button" class="home-btn" data-act="home">${esc(t('home'))}</button></div>
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
  body=`<div class="stats">${p.stats.map(([n,l])=>`<div class="stat-big"><b>${esc(n)}</b><small>${esc(l)}</small></div>`).join('')}</div>
   <p class="pop-sub">${esc(p.tapTitle)}</p>
   <div class="taps taps--inst">${p.inst.map(([i,l])=>`<button type="button" class="tap" data-tap="inst"><span class="tap-icon">${i}</span><b>${esc(l)}</b><em data-closed="${esc(p.closed)}" data-opened="${esc(p.opened)}"></em></button>`).join('')}</div>
   <p class="pop-count" data-count>${fill(p.count,{n:0})}</p>
   <p class="pop-note" data-note hidden>${esc(p.done)}</p>`;
 }else if(k==='how'){
  body=`<div class="taps taps--how">${p.items.map(([i,a,b])=>`<button type="button" class="tap tap--card" data-tap="how"><span class="tap-icon">${i}</span><b>${esc(a)}</b><p>${esc(b)}</p></button>`).join('')}</div>
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
 if(state.screen==='ai'&&state.ai.phase==='idle')runAi(); // el popup "¿Cómo lo hace VUCE 3.0?" da paso a la lectura automática
}

function infoBtn(k){return `<button type="button" class="info-btn" data-act="pop:${k}" aria-label="${esc(t('pop')[k].title)}">ⓘ</button>`;}
function factsStrip(){return `<div class="facts"><p class="facts-title">${esc(t('factsTitle'))}</p><div class="facts-grid">${t('facts').map(([n,l,k])=>`<button type="button" class="fact" data-act="pop:${k}"><b>${esc(n)}</b><small>${esc(l)}</small></button>`).join('')}</div></div>`;}

/* ---------- Pantallas ---------- */
function screenIntro(){
 const n=state.cases.length;
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
   <div class="road">${state.cases.map((c,i)=>`<span class="road-truck" style="animation-delay:${i*140}ms">${truckSvg('#CFE1FF',CARGO_ICON[c.cargo])}</span>`).join('')}</div>
   <div class="paper-stack"><span>📄</span><span>📄</span><span>📄</span></div>
  </section>
  <aside class="side side--intro">
   ${box('what',t('what'),fill(t('introWhat'),{n}))}
   ${box('learned',t('learned'),esc(t('introLearn')))}
  </aside>
 </main>`;
}
function doneCard(){const hits=state.manual.answers.filter(a=>a.ok).length;return `<div class="done-card"><span class="done-icon">🏁</span><div><b>${esc(t('manualDone'))}</b><p>${esc(t('yourTime'))}: <strong>${fmt(state.manual.time)} s</strong> · ${esc(t('hits'))}: <strong>${hits} / ${state.cases.length}</strong></p></div></div>`;}
function screenManual(){
 const c=state.cases[state.idx];const done=state.idx>=state.cases.length;
 return `<main class="screen screen--manual">
  <section class="stage">
   <div class="stage-head"><div><p class="eyebrow">${esc(t('simulated'))}</p><h1>${esc(t('manualTitle'))} ${infoBtn('play')}</h1><p class="stage-lead">${t('manualBody')}</p></div>${clock(t('yourTime'))}</div>
   <div data-desk>${done?doneCard():truckPanel(c)}</div>
   <div class="actions actions--3" data-actions>${done?'':['green','yellow','red'].map(c=>`<button type="button" class="btn btn--${c}" data-act="${c}"><span class="light light--big light--${c}"></span><span><b>${esc(t('lights')[c].name)}</b><small>${esc(t('lights')[c].action)}</small></span></button>`).join('')}</div>
  </section>
  <aside class="side">
   ${box('what',t('what'),esc(t('manualWhat')))}
   ${box('decided',t('decided'),esc(t('manualDecided')))}
   ${box('learned',t('learned'),esc(t('manualLearn')))}
   <button type="button" class="cta" data-act="to-ai" ${done?'':'disabled'}>${esc(t('manualCta'))} →</button>
  </aside>
 </main>`;
}
function screenAi(){
 return `<main class="screen screen--ai">
  <section class="stage">
   <div class="stage-head"><div><p class="eyebrow">${esc(t('simulated'))}</p><h1>${esc(t('aiTitle'))} ${infoBtn('how')}</h1><p class="stage-lead">${t('aiBody')}</p></div>${clock(t('aiTime'))}</div>
   <div data-desk></div>
   <p class="stage-hint" data-hint></p>
  </section>
  <aside class="side">
   ${box('what',t('what'),esc(t('aiWhat')))}
   ${box('decided',t('decided'),'')}
   ${box('learned',t('learned'),t('aiLearn'))}
   <button type="button" class="cta" data-act="to-results" disabled>${esc(t('aiCta'))} →</button>
  </aside>
 </main>`;
}
function screenResults(){
 const n=state.cases.length;
 const yourHits=state.manual.answers.filter(a=>a.ok).length,aiHits=state.ai.answers.filter(a=>a.ok).length;
 const docs=state.cases.reduce((s,c)=>s+(c.missing?2:3),0);
 const mt=state.manual.time,at=state.ai.time;
 const ratio=at>0?mt/at:0;
 const verdict=ratio>=1.5?fill(t('faster'),{x:Math.round(ratio)}):t('sameTime');
 const maxT=Math.max(mt,at,1);
 const col=(who,time,hits,extra)=>`<section class="who who--${who}"><header><b>${esc(t(who==='you'?'you':'ai'))}</b><span>${who==='you'?'👤':'🤖'}</span></header>
   <div class="stat"><small>${esc(t('time'))}</small><b>${fmt(time)}<em> ${esc(t('seconds'))}</em></b><i class="bar"><i style="width:${Math.max(4,time/maxT*100)}%"></i></i></div>
   <div class="stat"><small>${esc(t('hits'))}</small><b>${hits}<em> / ${n}</em></b><span class="dots">${(who==='you'?state.manual:state.ai).answers.map(a=>`<i class="${a.ok?'ok':'bad'}"></i>`).join('')}</span></div>
   <div class="stat"><small>${esc(t('docsRead'))}</small><b>${docs}</b></div>${extra||''}</section>`;
 return `<main class="screen screen--results">
  <div class="res-head"><div><p class="eyebrow">${esc(t('simulated'))}</p><h1>${esc(t('resTitle'))}</h1><p class="stage-lead">${esc(fill(t('resBody'),{n}))}</p></div><p class="verdict">${esc(verdict)}</p></div>
  <div class="compare">${col('you',mt,yourHits)}${col('ai',at,aiHits,`<button type="button" class="link-btn" data-act="pop:light"><span class="light light--green"></span><span class="light light--yellow"></span><span class="light light--red"></span>${esc(t('whyLight'))}</button>`)}
   <section class="per-truck"><h3>${esc(t('perTruck'))}</h3><div class="pt-grid">${state.cases.map((c,i)=>{const y=state.manual.answers[i],a=state.ai.answers[i];return `<div class="pt"><span class="pt-truck">${truckSvg('#CFE1FF',CARGO_ICON[c.cargo])}</span><b>CR-${c.id}</b><small><span class="light light--${expected(c)}"></span>${esc(t('lights')[expected(c)].action)}</small><span class="pt-row"><i class="${y&&y.ok?'ok':'bad'}">${esc(t('you'))}</i><i class="${a&&a.ok?'ok':'bad'}">IA</i></span></div>`;}).join('')}</div></section>
  </div>
  ${factsStrip()}
  <div class="res-bottom">
   ${box('decided',t('decided'),esc(fill(t('resDecided'),{d:docs,t:fmt(at),m:fmt(mt)})))}
   <section class="box box--learned box--final"><h3><span>💡</span>${esc(t('learned'))}</h3><p class="final-line">${esc(t('resLearnTitle'))}</p><p class="final-big">${esc(t('resLearnBig'))}</p><p class="final-body">${esc(t('resLearn'))}</p></section>
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

/* ---------- Ronda manual ---------- */
function answerManual(choice){
 if(state.manual.feedback||state.idx>=state.cases.length)return;
 const c=state.cases[state.idx];const exp=expected(c);const ok=choice===exp;
 pauseClock('manual');
 state.manual.answers.push({id:c.id,choice,ok});
 const field=c.issue?t('fields')[c.issue.field]:'';
 const msg=(ok?'':fill(t('itWas'),{name:t('lights')[exp].name.toLowerCase()})+' ')+fill(t('why')[exp],{field})+(c.issue&&c.missing?' '+t('why').yellow:'');
 state.manual.feedback={ok,msg,light:exp};
 const desk=app.querySelector('[data-desk]');desk.innerHTML=truckPanel(c,{reveal:true});
 app.querySelector('[data-actions]').innerHTML=`<div class="feedback ${ok?'feedback--ok':'feedback--bad'}"><span class="light light--big light--${exp}"></span><b>${esc(ok?t('fbRight'):t('fbWrong'))}</b><span>${esc(msg)}</span></div>`;
 setBox('decided',`<b>${esc(ok?t('fbRight'):t('fbWrong'))}</b> ${esc(msg)}`);emit();
 after(()=>{state.manual.feedback=null;state.idx+=1;
  if(state.idx>=state.cases.length){render();setBox('decided',esc(t('manualDone')));if(!state.seen.place)openModal('place');}
  else{render();startClock('manual');}
 },2200);
}

/* ---------- Ronda IA ---------- */
function runAi(){
 stop();state.idx=0;state.ai.answers=[];state.ai.time=0;state.ai.phase='running';state.ai.verdict=null;
 const step=()=>{
  if(state.idx>=state.cases.length){pauseClock('ai');state.ai.phase='done';
   const hint=app.querySelector('[data-hint]');if(hint){hint.innerHTML=`${esc(t('aiDone'))} <button type="button" class="link-btn" data-act="pop:light"><span class="light light--green"></span><span class="light light--yellow"></span><span class="light light--red"></span>${esc(t('whyLight'))}</button>`;bind();}
   const b=app.querySelector('[data-act="to-results"]');if(b)b.disabled=false;
   setBox('decided',esc(t('aiDone')));emit();return;}
  const c=state.cases[state.idx];
  const desk=app.querySelector('[data-desk]');desk.innerHTML=truckPanel(c,{scan:true});state.ai.verdict=null;emit();
  const hint=app.querySelector('[data-hint]');if(hint)hint.textContent='';
  startClock('ai');
  FIELDS.forEach((f,k)=>after(()=>{
   desk.querySelectorAll('.row').forEach(r=>{r.classList.toggle('row--reading',r.dataset.field===f);r.classList.toggle('row--read',FIELDS.indexOf(r.dataset.field)<k);});
   const lbl=desk.querySelector('[data-scan-label]');if(lbl)lbl.innerHTML=esc(fill(t('aiAnalyzing'),{field:t('fields')[f]}))+'<i class="dots-anim"><i></i><i></i><i></i></i>';
   const bar=desk.querySelector('[data-scan-bar]');if(bar)bar.style.width=Math.round((k+1)/FIELDS.length*90)+'%';
  },200+k*AI_ROW_MS));
  after(()=>{const lbl=desk.querySelector('[data-scan-label]');if(lbl)lbl.textContent=t('aiComparing');const bar=desk.querySelector('[data-scan-bar]');if(bar)bar.style.width='100%';desk.querySelectorAll('.row').forEach(r=>{r.classList.remove('row--reading');r.classList.add('row--read');});},200+FIELDS.length*AI_ROW_MS);
  after(()=>{
   const exp=expected(c);
   state.ai.answers.push({id:c.id,choice:exp,ok:true});
   desk.innerHTML=truckPanel(c,{reveal:true});
   const field=c.issue?t('fields')[c.issue.field]:'';
   const msg=fill(t('aiWhy')[exp],{field})+(c.issue&&c.missing?' '+t('why').yellow:'');
   state.ai.verdict={light:exp,msg};emit();
   desk.insertAdjacentHTML('beforeend',`<div class="ai-verdict ai-verdict--${exp}"><span class="light light--big light--${exp}"></span><b>${esc(fill(t('semaforo'),{name:t('lights')[exp].name.toLowerCase()}))} · ${esc(t('lights')[exp].action)}</b><span>${esc(msg)}</span></div>`);
   setBox('decided',`<ol class="decided-list">${state.ai.answers.map((a,i)=>{const cc=state.cases[i];return `<li class="decided--${a.choice}"><span class="light light--${a.choice}"></span><b>CR-${cc.id}</b> · ${esc(t('lights')[a.choice].action)}</li>`;}).join('')}</ol>`);
   pauseClock('ai');
   after(()=>{state.idx+=1;step();},AI_SHOW_MS);
  },AI_READ_MS);
 };
 step();
}

/* ---------- Espejo para la TV ----------
   La tableta (module.js) reenvía este resumen al estado de la estación y la TV lo pinta
   con tv.js. Solo lleva textos ya traducidos, cronómetros y semáforos: nunca documentos. */
function strip(html){return String(html).replace(/<[^>]+>/g,'');}
function tvPacket(){
 const n=state.cases.length,L=t('lights'),TV=t('tv');
 const screen=state.screen,who=screen==='ai'?'ai':'manual';
 const trucks=state.cases.map((c,i)=>{
  const y=state.manual.answers[i],a=state.ai.answers[i];
  const revealed=screen==='results'||(screen==='manual'&&!!y)||(screen==='ai'&&!!a);
  return {id:'CR-'+c.id,cargo:t('cargo')[c.cargo],icon:CARGO_ICON[c.cargo],light:revealed?expected(c):null,you:y?y.choice:null,ok:y?y.ok:null,ai:a?a.choice:null};
 });
 const done=state.idx>=n;
 let phase='deciding',hint='',title='',counter='',clockLabel='';
 if(screen==='intro'){phase='intro';hint=TV.intro;title=t('introTitle');}
 else if(screen==='manual'){title=t('manualTitle');clockLabel=t('yourTime');counter=fill(t('truckOf'),{i:Math.min(state.idx+1,n),n});
  if(done){phase='done';hint=TV.manualDone;}else if(state.manual.feedback){phase='feedback';}else{hint=TV.deciding;}}
 else if(screen==='ai'){title=t('aiTitle');clockLabel=t('aiTime');counter=fill(t('truckOf'),{i:Math.min(state.idx+1,n),n});
  if(state.ai.phase==='idle'){phase='waiting';hint=TV.waiting;}else if(state.ai.phase==='done'){phase='done';hint=TV.aiDone;}else if(state.ai.verdict){phase='verdict';}else{phase='scanning';hint=TV.scanning;}}
 else{phase='results';title=t('resTitle');hint=TV.results;}
 const fb=state.manual.feedback;
 const v=state.ai.verdict;
 let results=null;
 if(screen==='results'){
  const mt=state.manual.time,at=state.ai.time,ratio=at>0?mt/at:0;
  results={you:{time:Math.round(mt),hits:state.manual.answers.filter(a=>a.ok).length},ai:{time:Math.round(at),hits:state.ai.answers.filter(a=>a.ok).length},
   verdict:ratio>=1.5?fill(t('faster'),{x:Math.round(ratio)}):t('sameTime'),learnTitle:t('resLearnTitle'),learnBig:t('resLearnBig'),learn:t('resLearn')};
 }
 const mk=state.modal?t('pop')[state.modal]:null;
 return {v:1,screen,lang:state.lang,step:{intro:0,manual:1,ai:2,results:3}[screen],steps:t('steps'),simulated:t('simulated'),
  idx:Math.min(state.idx,n-1),n,trucks,title,subtitle:screen==='intro'?t('introBig'):'',counter,clockLabel,hint,phase,
  time:Math.round(state[who].time),running:!!state[who].running,scanMs:AI_READ_MS,
  feedback:fb?{ok:fb.ok,light:fb.light,title:fb.ok?t('fbRight'):t('fbWrong'),msg:fb.msg}:null,
  verdict:v?{light:v.light,title:fill(t('semaforo'),{name:L[v.light].name.toLowerCase()})+' · '+L[v.light].action,msg:v.msg}:null,
  modal:mk?{eyebrow:t('pop').eyebrow,title:mk.title,lead:strip(mk.lead)}:null,
  results,labels:{you:t('you'),ai:t('ai'),time:t('time'),hits:t('hits'),seconds:t('seconds'),reading:TV.reading}};
}
let emitPending=false;
function emit(){
 if(window.parent===window)return;
 if(emitPending)return;emitPending=true;
 setTimeout(()=>{emitPending=false;try{window.parent.postMessage({type:'cr-game',game:tvPacket()},'*');}catch{}},0);
}

/* ---------- Navegación ---------- */
function go(screen){
 stop();state.screen=screen;
 if(screen==='manual'){state.idx=0;state.manual={time:0,start:0,running:false,answers:[],feedback:null};render();
  if(state.seen.play)startClock('manual');else{state.resume=true;openModal('play');}return;}
 render();
 if(screen==='ai'){state.ai.phase='idle';if(state.seen.how)runAi();else openModal('how');}
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
  else if(act==='to-ai'&&state.idx>=state.cases.length)go('ai');
  else if(act==='to-results'&&state.ai.phase==='done')go('results');
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
 if(state.screen==='ai'&&state.ai.phase==='running'){render();runAi();return;}
 const wasRunning=state.manual.running;
 render();
 if(state.screen==='manual'&&wasRunning&&!state.modal)startClock('manual');
 if(state.screen==='manual'&&state.idx>=state.cases.length)setBox('decided',esc(t('manualDone')));
}
window.CR_GAME={state,go,setLanguage,tvPacket};
newRound();render();
})();
