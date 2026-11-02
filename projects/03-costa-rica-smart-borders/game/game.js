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
  brand:'AI Exhibition Hall',station:'Estación 03 · Costa Rica Smart Borders',home:'Inicio',
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
  pass:'Todo coincide · Dejar pasar',inspect:'Algo no coincide · Inspeccionar',
  manualWhat:'Aquí decides tú. Lee con calma cada fila y compara entre documentos.',
  manualDecided:'Todavía nadie te ayuda. El cronómetro corre.',
  manualLearn:'Un detalle pequeño, como una cifra o una letra, puede esconder un problema.',
  missingDoc:'Falta un documento',
  fbRight:'¡Correcto!',fbWrong:'Ups, no era así.',
  fbPassOk:'Los documentos coincidían. El camión podía pasar.',
  fbInspectOk:'Había una diferencia en {field}.',
  fbMissedIssue:'Había una diferencia en {field} y el camión pasó sin revisión.',
  fbFalseAlarm:'Los documentos coincidían. Se inspeccionó sin necesidad.',
  fbMissing:'A este camión le faltaba un documento.',
  manualDone:'¡Terminaste! Ahora la IA revisará los mismos camiones.',
  manualCta:'Ver cómo lo hace la IA',
  // IA
  aiTitle:'La IA revisa',
  aiBody:'Los <b>mismos camiones</b> y los <b>mismos documentos</b>. Ahora lee la computadora.',
  aiReading:'Leyendo documentos…',aiScanning:'Escaneando',aiAnalyzing:'Analizando {field}…',aiComparing:'Comparando documentos…',
  aiWhat:'La IA compara todas las filas de todos los documentos al mismo tiempo y marca en rojo lo que no coincide.',
  aiDecidedPass:'Todo coincide. Propone dejar pasar.',
  aiDecidedInspect:'Encontró una diferencia en {field}. Propone inspeccionar.',
  aiDecidedMissing:'Falta un documento. Propone inspeccionar.',
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
  truckAria:'Camión {id}, {cargo}'
 },
 en:{
  brand:'AI Exhibition Hall',station:'Station 03 · Costa Rica Smart Borders',home:'Home',
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
  pass:'Everything matches · Let it pass',inspect:'Something is off · Inspect',
  manualWhat:'You decide here. Read each row calmly and compare across documents.',
  manualDecided:'Nobody is helping you yet. The clock is running.',
  manualLearn:'A small detail, like a digit or a letter, can hide a problem.',
  missingDoc:'Missing document',
  fbRight:'Correct!',fbWrong:'Oops, not quite.',
  fbPassOk:'The documents matched. The truck could pass.',
  fbInspectOk:'There was a difference in {field}.',
  fbMissedIssue:'There was a difference in {field} and the truck passed unchecked.',
  fbFalseAlarm:'The documents matched. It was inspected unnecessarily.',
  fbMissing:'This truck was missing a document.',
  manualDone:'Done! Now the AI will check the same trucks.',
  manualCta:'See how the AI does it',
  aiTitle:'AI checks',
  aiBody:'The <b>same trucks</b> and the <b>same documents</b>. Now the computer reads.',
  aiReading:'Reading documents…',aiScanning:'Scanning',aiAnalyzing:'Analyzing {field}…',aiComparing:'Comparing documents…',
  aiWhat:'The AI compares every row of every document at once and marks in red what does not match.',
  aiDecidedPass:'Everything matches. It suggests letting it pass.',
  aiDecidedInspect:'It found a difference in {field}. It suggests inspecting.',
  aiDecidedMissing:'A document is missing. It suggests inspecting.',
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
  truckAria:'Truck {id}, {cargo}'
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
 {id:105,cargo:'electronica',base:{cantidad:'310',peso:'3.720',origen:'Nicaragua',placa:'MGA-8864'},issue:{field:'origen',doc:'factura',value:'Panamá'}}
];
const AI_ROW_MS=260, AI_READ_MS=FIELDS.length*AI_ROW_MS+400, AI_SHOW_MS=1500; // duración de la lectura automática por camión

/* ---------- Utilidades ---------- */
const fill=(text,vars)=>text.replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=ms=>{const s=Math.floor(ms/1000),d=Math.floor((ms%1000)/100);return `${s}.${d}`;};
function rng(v){let x=v>>>0;return()=>{x+=0x6D2B79F5;let a=x;a=Math.imul(a^(a>>>15),a|1);a^=a+Math.imul(a^(a>>>7),a|61);return((a^(a>>>14))>>>0)/4294967296;};}
function needsInspection(c){return !!(c.issue||c.missing);}
function docValue(c,doc,field){
 if(field==='producto')return null; // se traduce al renderizar
 if(c.issue&&c.issue.doc===doc&&c.issue.field===field)return c.issue.value;
 return c.base[field];
}

/* ---------- Estado ---------- */
const state={lang:'es',screen:'intro',round:1,cases:[],idx:0,
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
 state.cases=order;state.idx=0;
 state.manual={time:0,start:0,running:false,answers:[],feedback:null};
 state.ai={time:0,start:0,running:false,answers:[],phase:'idle'};
}
function startClock(who){state[who].start=performance.now()-state[who].time;state[who].running=true;
 if(!ticker)ticker=setInterval(()=>{const el=app.querySelector('[data-clock]');if(el&&state[who].running){state[who].time=performance.now()-state[who].start;el.textContent=fmt(state[who].time)+' s';}},100);}
function pauseClock(who){if(state[who].running){state[who].time=performance.now()-state[who].start;state[who].running=false;}}

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
  <div class="top-brand"><span class="top-bid">BID</span><span class="top-sep"></span><span><b>${esc(t('brand'))}</b><small>${esc(t('station'))}</small></span></div>
  <ol class="stepper">${steps.map((s,i)=>`<li class="${i<index?'done':i===index?'current':''}"><span>${i+1}</span><em>${esc(s)}</em></li>`).join('')}</ol>
  <div class="top-tools"><div class="langs" aria-label="Language"><button id="es" type="button" aria-pressed="${state.lang==='es'}">ES</button><button id="en" type="button" aria-pressed="${state.lang==='en'}">EN</button></div><button type="button" class="home-btn" data-act="home">${esc(t('home'))}</button></div>
 </header>`;
}

/* ---------- Pantallas ---------- */
function screenIntro(){
 const n=state.cases.length;
 return `<main class="screen screen--intro">
  <section class="intro-hero">
   <p class="eyebrow">${esc(t('simulated'))}</p>
   <h1>${esc(t('introTitle'))}</h1>
   <p class="intro-big">${esc(t('introBig'))}</p>
   <p class="intro-body">${t('introBody')}</p>
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
   <div class="stage-head"><div><p class="eyebrow">${esc(t('simulated'))}</p><h1>${esc(t('manualTitle'))}</h1><p class="stage-lead">${t('manualBody')}</p></div>${clock(t('yourTime'))}</div>
   <div data-desk>${done?doneCard():truckPanel(c)}</div>
   <div class="actions" data-actions>${done?'':`<button type="button" class="btn btn--pass" data-act="pass">✔ ${esc(t('pass'))}</button><button type="button" class="btn btn--inspect" data-act="inspect">🔍 ${esc(t('inspect'))}</button>`}</div>
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
   <div class="stage-head"><div><p class="eyebrow">${esc(t('simulated'))}</p><h1>${esc(t('aiTitle'))}</h1><p class="stage-lead">${t('aiBody')}</p></div>${clock(t('aiTime'))}</div>
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
  <div class="compare">${col('you',mt,yourHits)}${col('ai',at,aiHits)}
   <section class="per-truck"><h3>${esc(t('perTruck'))}</h3><div class="pt-grid">${state.cases.map((c,i)=>{const y=state.manual.answers[i],a=state.ai.answers[i];return `<div class="pt"><span class="pt-truck">${truckSvg('#CFE1FF',CARGO_ICON[c.cargo])}</span><b>CR-${c.id}</b><small>${esc(needsInspection(c)?t('inspect').split(' · ')[1]:t('pass').split(' · ')[1])}</small><span class="pt-row"><i class="${y&&y.ok?'ok':'bad'}">${esc(t('you'))}</i><i class="${a&&a.ok?'ok':'bad'}">IA</i></span></div>`;}).join('')}</div></section>
  </div>
  <div class="res-bottom">
   ${box('decided',t('decided'),esc(fill(t('resDecided'),{d:docs,t:fmt(at),m:fmt(mt)})))}
   <section class="box box--learned box--final"><h3><span>💡</span>${esc(t('learned'))}</h3><p class="final-line">${esc(t('resLearnTitle'))}</p><p class="final-big">${esc(t('resLearnBig'))}</p><p class="final-body">${esc(t('resLearn'))}</p></section>
   <div class="res-actions"><button type="button" class="cta" data-act="again">${esc(t('again'))}</button><button type="button" class="cta cta--ghost" data-act="home">${esc(t('toHome'))}</button><p class="simulated-note">${esc(t('resSimulated'))}</p></div>
  </div>
 </main>`;
}

/* ---------- Render ---------- */
function render(){
 const screens={intro:screenIntro,manual:screenManual,ai:screenAi,results:screenResults};
 app.innerHTML=header()+screens[state.screen]();
 app.className='app app--'+state.screen;
 bind();window.scrollTo(0,0);
}
function setBox(kind,html){const el=app.querySelector(`[data-box="${kind}"]`);if(el)el.innerHTML=html;}

/* ---------- Ronda manual ---------- */
function answerManual(choice){
 if(state.manual.feedback||state.idx>=state.cases.length)return;
 const c=state.cases[state.idx];const should=needsInspection(c);const ok=(choice==='inspect')===should;
 pauseClock('manual');
 state.manual.answers.push({id:c.id,choice,ok});
 const field=c.issue?t('fields')[c.issue.field]:'';
 let msg;
 if(ok&&!should)msg=t('fbPassOk');
 else if(ok&&should)msg=c.missing&&!c.issue?t('fbMissing'):fill(t('fbInspectOk'),{field})+(c.missing?' '+t('fbMissing'):'');
 else if(!ok&&should)msg=c.missing&&!c.issue?t('fbMissing'):fill(t('fbMissedIssue'),{field});
 else msg=t('fbFalseAlarm');
 state.manual.feedback={ok,msg};
 const desk=app.querySelector('[data-desk]');desk.innerHTML=truckPanel(c,{reveal:true});
 app.querySelector('[data-actions]').innerHTML=`<div class="feedback ${ok?'feedback--ok':'feedback--bad'}"><b>${esc(ok?t('fbRight'):t('fbWrong'))}</b><span>${esc(msg)}</span></div>`;
 setBox('decided',`<b>${esc(ok?t('fbRight'):t('fbWrong'))}</b> ${esc(msg)}`);
 after(()=>{state.manual.feedback=null;state.idx+=1;
  if(state.idx>=state.cases.length){render();setBox('decided',esc(t('manualDone')));}
  else{render();startClock('manual');}
 },2200);
}

/* ---------- Ronda IA ---------- */
function runAi(){
 stop();state.idx=0;state.ai.answers=[];state.ai.time=0;
 const step=()=>{
  if(state.idx>=state.cases.length){pauseClock('ai');state.ai.phase='done';
   const hint=app.querySelector('[data-hint]');if(hint)hint.textContent=t('aiDone');
   const b=app.querySelector('[data-act="to-results"]');if(b)b.disabled=false;
   setBox('decided',esc(t('aiDone')));return;}
  const c=state.cases[state.idx];
  const desk=app.querySelector('[data-desk]');desk.innerHTML=truckPanel(c,{scan:true});
  const hint=app.querySelector('[data-hint]');if(hint)hint.textContent='';
  startClock('ai');
  FIELDS.forEach((f,k)=>after(()=>{
   desk.querySelectorAll('.row').forEach(r=>{r.classList.toggle('row--reading',r.dataset.field===f);r.classList.toggle('row--read',FIELDS.indexOf(r.dataset.field)<k);});
   const lbl=desk.querySelector('[data-scan-label]');if(lbl)lbl.innerHTML=esc(fill(t('aiAnalyzing'),{field:t('fields')[f]}))+'<i class="dots-anim"><i></i><i></i><i></i></i>';
   const bar=desk.querySelector('[data-scan-bar]');if(bar)bar.style.width=Math.round((k+1)/FIELDS.length*90)+'%';
  },200+k*AI_ROW_MS));
  after(()=>{const lbl=desk.querySelector('[data-scan-label]');if(lbl)lbl.textContent=t('aiComparing');const bar=desk.querySelector('[data-scan-bar]');if(bar)bar.style.width='100%';desk.querySelectorAll('.row').forEach(r=>{r.classList.remove('row--reading');r.classList.add('row--read');});},200+FIELDS.length*AI_ROW_MS);
  after(()=>{
   const should=needsInspection(c);
   state.ai.answers.push({id:c.id,choice:should?'inspect':'pass',ok:true});
   desk.innerHTML=truckPanel(c,{reveal:true});
   const field=c.issue?t('fields')[c.issue.field]:'';
   const msg=!should?t('aiDecidedPass'):c.issue?fill(t('aiDecidedInspect'),{field})+(c.missing?' '+t('aiDecidedMissing'):''):t('aiDecidedMissing');
   desk.insertAdjacentHTML('beforeend',`<div class="ai-verdict ${should?'ai-verdict--inspect':'ai-verdict--pass'}"><b>${should?'🔍':'✔'} ${esc(should?t('inspect').split(' · ')[1]:t('pass').split(' · ')[1])}</b><span>${esc(msg)}</span></div>`);
   setBox('decided',`<ol class="decided-list">${state.ai.answers.map((a,i)=>{const cc=state.cases[i];return `<li class="${a.choice==='inspect'?'decided--inspect':'decided--pass'}"><b>CR-${cc.id}</b> · ${esc(a.choice==='inspect'?t('inspect').split(' · ')[1]:t('pass').split(' · ')[1])}</li>`;}).join('')}</ol>`);
   pauseClock('ai');
   after(()=>{state.idx+=1;step();},AI_SHOW_MS);
  },AI_READ_MS);
 };
 step();
}

/* ---------- Navegación ---------- */
function go(screen){
 stop();state.screen=screen;
 if(screen==='manual'){state.idx=0;state.manual={time:0,start:0,running:false,answers:[],feedback:null};render();startClock('manual');return;}
 render();
 if(screen==='ai')runAi();
}
function bind(){
 app.querySelector('#es').onclick=()=>setLanguage('es');
 app.querySelector('#en').onclick=()=>setLanguage('en');
 app.querySelectorAll('[data-act]').forEach(btn=>btn.onclick=()=>{
  const act=btn.dataset.act;
  if(act==='start')go('manual');
  else if(act==='pass'||act==='inspect')answerManual(act);
  else if(act==='to-ai'&&state.idx>=state.cases.length)go('ai');
  else if(act==='to-results'&&state.ai.phase==='done')go('results');
  else if(act==='again'){state.round+=1;newRound();go('intro');}
  else if(act==='home'){/* module.js intercepta este botón en la tableta */state.round+=1;newRound();go('intro');}
 });
}
function setLanguage(lang){
 if(!COPY[lang]||lang===state.lang)return;
 state.lang=lang;document.documentElement.lang=lang;
 if(state.screen==='ai'&&state.ai.phase!=='done'){render();runAi();return;}
 const wasRunning=state.manual.running;
 render();
 if(state.screen==='manual'&&wasRunning)startClock('manual');
 if(state.screen==='manual'&&state.idx>=state.cases.length)setBox('decided',esc(t('manualDone')));
}
window.CR_GAME={state,go,setLanguage};
newRound();render();
})();
