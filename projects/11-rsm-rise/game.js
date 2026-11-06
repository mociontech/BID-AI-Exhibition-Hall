/* Game mechanics restored from the supplied prototype. Fictional educational cases. */
(function(){
const EN=[
    {name:'SME credit line',who:'Commercial bank · Country A',ic:'bank',pages:186,
     sum:'Senior loan to a commercial bank to grow its SME and green lending portfolios.',
     model:'Universal bank serving individuals, companies and SMEs.',
     f:[['Country','Country A'],['CECL sector','Financial intermediaries'],['CECL subsector','Bank'],['Scorecard','S&P Bank Model']],
     conf:95,risks:['FX risk','Deposit concentration','Portfolio concentration'],mit:['Solid liquidity','Diversified funding','Use-of-funds covenants'],
     why:'A regulated commercial bank. Loans are most of its assets, and repayment relies on the bank’s overall operations, not on a single project.',
     ev:[['p. 12','“…supervised by the national banking regulator…”'],['p. 41','“…loans represent 70% of total assets…”'],['p. 88','“…repaid from the bank’s general cash flows…”']],
     warn:'Deposit concentration above the agreed limit',src:'quarterly financials and the latest aide memoire',
     lesson:'Clients asked to diversify funding early recovered faster.'},
    {name:'Urban metro line',who:'Metro concessionaire · Country B',ic:'train',pages:412,
     sum:'Long-term financing for the construction of an underground metro line.',
     model:'Special purpose company that builds and operates the line under a concession.',
     f:[['Country','Country B'],['CECL sector','Infrastructure'],['CECL subsector','Transport'],['Scorecard','Project finance']],
     conf:88,risks:['Construction delays','Cost overruns','Ridership below forecast'],mit:['Fixed-price EPC contract','Availability payments','Contingency reserve'],
     why:'Repayment depends on the cash flows of one project, held in a special purpose company, so the project finance scorecard applies.',
     ev:[['p. 7','“…a special purpose vehicle created for the concession…”'],['p. 63','“…debt service from project revenues only…”'],['p. 219','“…availability payments by the transport authority…”']],
     warn:'Construction nine months behind plan',src:'the latest aide memoire and site progress data',
     lesson:'An early meeting on schedule recovery limited cost overruns.'},
    {name:'Solar power plant',who:'Renewable developer · Country C',ic:'sun',pages:268,
     sum:'Financing to build and operate a utility-scale solar plant.',
     model:'Independent power producer selling energy under a long-term contract.',
     f:[['Country','Country C'],['CECL sector','Energy'],['CECL subsector','Renewable power'],['Scorecard','Project finance']],
     conf:91,risks:['Offtaker payment risk','Curtailment','Solar resource variability'],mit:['Long-term PPA','Payment guarantee','Debt service reserve'],
     why:'A single power plant whose debt is repaid from contracted energy sales, so the project finance scorecard applies.',
     ev:[['p. 9','“…20-year power purchase agreement…”'],['p. 74','“…repayment from energy sales under the PPA…”'],['p. 151','“…project company with no other assets…”']],
     warn:'Offtaker payments 60 days late',src:'payment records and the latest aide memoire',
     lesson:'Activating the payment guarantee early protected debt service.'}
  ];
const ES=[
 {name:'Línea de crédito para pymes',who:'Banco comercial · País A',sum:'Préstamo sénior a un banco comercial para ampliar sus carteras de pymes y financiamiento verde.',model:'Banco universal que atiende a personas, empresas y pymes.',f:[['País','País A'],['Sector CECL','Intermediarios financieros'],['Subsector CECL','Banco'],['Modelo de evaluación','S&P Bank Model']],risks:['Riesgo cambiario','Concentración de depósitos','Concentración de cartera'],mit:['Liquidez sólida','Financiamiento diversificado','Compromisos de uso de fondos'],why:'Es un banco comercial regulado. Los préstamos representan la mayoría de sus activos y el repago depende de las operaciones generales del banco, no de un proyecto individual.',ev:[['p. 12','«…supervisado por el regulador bancario nacional…»'],['p. 41','«…los préstamos representan el 70% de los activos totales…»'],['p. 88','«…repagado con los flujos generales de efectivo del banco…»']],warn:'Concentración de depósitos por encima del límite acordado',src:'los datos financieros trimestrales y el último aide memoire',lesson:'Los clientes que diversificaron su financiamiento temprano se recuperaron más rápido.'},
 {name:'Línea de metro urbano',who:'Concesionaria de metro · País B',sum:'Financiamiento de largo plazo para construir una línea de metro subterráneo.',model:'Sociedad de propósito específico que construye y opera la línea mediante una concesión.',f:[['País','País B'],['Sector CECL','Infraestructura'],['Subsector CECL','Transporte'],['Modelo de evaluación','Project finance']],risks:['Retrasos en la construcción','Sobrecostos','Demanda de pasajeros inferior a la prevista'],mit:['Contrato EPC de precio fijo','Pagos por disponibilidad','Reserva para contingencias'],why:'El repago depende de los flujos de un único proyecto, a cargo de una sociedad de propósito específico. Por eso se sugiere el modelo de financiamiento de proyectos.',ev:[['p. 7','«…vehículo de propósito específico creado para la concesión…»'],['p. 63','«…servicio de deuda únicamente con ingresos del proyecto…»'],['p. 219','«…pagos por disponibilidad de la autoridad de transporte…»']],warn:'Construcción con nueve meses de retraso',src:'el último aide memoire y los datos de avance de obra',lesson:'Una reunión temprana para recuperar el cronograma limitó los sobrecostos.'},
 {name:'Planta de energía solar',who:'Desarrollador renovable · País C',sum:'Financiamiento para construir y operar una planta solar a gran escala.',model:'Productor independiente que vende energía mediante un contrato de largo plazo.',f:[['País','País C'],['Sector CECL','Energía'],['Subsector CECL','Energía renovable'],['Modelo de evaluación','Project finance']],risks:['Riesgo de pago del comprador de energía','Restricciones de generación','Variabilidad del recurso solar'],mit:['PPA de largo plazo','Garantía de pago','Reserva de servicio de deuda'],why:'Es una planta cuya deuda se repaga con ventas de energía contratadas. Por eso se sugiere el modelo de financiamiento de proyectos.',ev:[['p. 9','«…contrato de compra de energía de 20 años…»'],['p. 74','«…repago con las ventas de energía bajo el PPA…»'],['p. 151','«…sociedad del proyecto sin otros activos…»']],warn:'Pagos del comprador de energía con 60 días de atraso',src:'los registros de pago y el último aide memoire',lesson:'Activar temprano la garantía de pago protegió el servicio de deuda.'}
];
const COPY={
 en:{steps:['Proposal','Read','Decide','Supervise','Remember'],pick:'Choose an investment proposal',pickBody:'You are the credit risk officer. Which deal lands on your desk?',send:'Send to RISE',back:'Back',next:'Next',read:'Run RISE on the proposal',readBody:'Both reviews start at once on screen: by hand and with RISE.',run:'Run RISE',reading:'RISE is reading',pre:'Pre-analysis ready',preBody:'RISE finished while the manual review is still on page',manual:'By hand',withRise:'With RISE',faster:'Faster coverage',simTime:'Illustrative comparison from the prototype. Times are simulated.',gain:'What the officer gains',gainBody:'The review starts from the risks, not from page one, with the same criteria on every deal.',summary:'Summary',business:'Business model',risks:'Risks',mitigants:'Mitigants',gaps:'Gaps',noGaps:'No critical gaps found',classification:'Classification',decide:'RISE suggests. You decide.',suggested:'Suggested scorecard',confidence:'Simulated confidence',confidenceBody:'Illustrative confidence in the classification, not a probability of default.',why:'Why?',whyBody:'See the evidence, page by page',accept:'Accept',acceptBody:'Keep the suggested classification',adjust:'Adjust',adjustBody:'Change it and log your reason',reason:'RISE reasoning',lockedWhy:'Tap «Why?» on the tablet to see the evidence behind the suggestion.',accepted:'Accepted by the risk officer',adjusted:'Adjusted by the risk officer',logged:'Simulated decision recorded · classification only',waiting:'Waiting for the risk officer’s decision',sup:'Years later, RISE keeps reading',supBody:'Supervision reports and aide memoires are summarized as they arrive.',yearsLater:'Years later…',readingReports:'RISE is reading the annual supervision reports.',alertTitle:'RISE flags an early warning',what:'What do you do?',year:'Year',approval:'Approval',annual:'Annual report',early:'RISE early warning · Year 2',late:'Without RISE: annual review · Year 3',found:'Found in',beforeAnnual:'months before the next annual review.',yourAction:'Your action',memory:'Institutional memory',similar:'3 similar fictional deals since 2016.',docCount:'8,200 illustrative documents',actions:[['Keep monitoring','Watch the next quarterly figures'],['Engage the client','Agree on a corrective plan now'],['Escalate to Special Assets','Bring in the recovery team']],review:'See your review',close:'Your review',tagline:['AI reads.','Experts decide.','The institution remembers.'],joined:'Your review is now document #8,201 in this simulated institutional memory.',joinBody:'Your review joins the bank’s memory. Every deal RISE reads makes the next review better informed.',again:'Start again',acceptedYou:'Accepted by you',adjustedYou:'Adjusted by you',sim:'Educational simulation · Fictional deals, pages, confidence and alerts',pages:'pages',onTV:'Look at the main display',simLesson:'Illustrative lesson from a fictional case'},
 es:{steps:['Propuesta','Lectura','Decisión','Supervisión','Memoria'],pick:'Elige una propuesta de inversión',pickBody:'Eres el oficial de riesgo crediticio. ¿Qué operación llega a tu escritorio?',send:'Enviar a RISE',back:'Volver',next:'Continuar',read:'Ejecuta RISE sobre la propuesta',readBody:'Ambas revisiones comienzan al mismo tiempo en la TV: manualmente y con RISE.',run:'Ejecutar RISE',reading:'RISE está leyendo',pre:'Preanálisis listo',preBody:'RISE terminó mientras la revisión manual sigue en la página',manual:'Manualmente',withRise:'Con RISE',faster:'Mayor cobertura',simTime:'Comparación ilustrativa del prototipo. Los tiempos son simulados.',gain:'Lo que gana el especialista',gainBody:'La revisión comienza por los riesgos, no por la primera página, con los mismos criterios para cada operación.',summary:'Resumen',business:'Modelo de negocio',risks:'Riesgos',mitigants:'Mitigantes',gaps:'Vacíos',noGaps:'No se encontraron vacíos críticos',classification:'Clasificación',decide:'RISE sugiere. Tú decides.',suggested:'Modelo de evaluación sugerido',confidence:'Confianza simulada',confidenceBody:'Confianza ilustrativa en la clasificación; no es una probabilidad de impago.',why:'¿Por qué?',whyBody:'Consulta la evidencia, página por página',accept:'Aceptar',acceptBody:'Mantener la clasificación sugerida',adjust:'Ajustar',adjustBody:'Cambiarla y registrar el motivo',reason:'Razonamiento de RISE',lockedWhy:'Toca «¿Por qué?» en la tableta para ver las evidencias de la sugerencia.',accepted:'Aceptada por el oficial de riesgo',adjusted:'Ajustada por el oficial de riesgo',logged:'Decisión simulada registrada · solo clasificación',waiting:'Esperando la decisión del oficial de riesgo',sup:'Años después, RISE sigue leyendo',supBody:'Los reportes de supervisión y aide memoires se resumen a medida que llegan.',yearsLater:'Años después…',readingReports:'RISE está leyendo los reportes anuales de supervisión.',alertTitle:'RISE destaca una alerta temprana',what:'¿Qué haces?',year:'Año',approval:'Aprobación',annual:'Reporte anual',early:'Alerta RISE · Año 2',late:'Sin RISE: revisión anual · Año 3',found:'Hallazgo en',beforeAnnual:'meses antes de la siguiente revisión anual.',yourAction:'Tu acción',memory:'Memoria institucional',similar:'3 operaciones ficticias similares desde 2016.',docCount:'8.200 documentos ilustrativos',actions:[['Seguir monitoreando','Observar las próximas cifras trimestrales'],['Hablar con el cliente','Acordar ahora un plan correctivo'],['Escalar a Activos Especiales','Involucrar al equipo de recuperación']],review:'Ver tu revisión',close:'Tu revisión',tagline:['La IA lee.','Los expertos deciden.','La institución recuerda.'],joined:'Tu revisión es ahora el documento #8.201 de esta memoria institucional simulada.',joinBody:'Tu revisión se suma a la memoria del banco. Cada operación que RISE lee ayuda a informar la siguiente revisión.',again:'Volver a empezar',acceptedYou:'Aceptada por ti',adjustedYou:'Ajustada por ti',sim:'Simulación educativa · Operaciones, páginas, confianza y alertas ficticias',pages:'páginas',onTV:'Mira la pantalla principal',simLesson:'Lección ilustrativa de un caso ficticio'}
};
const caseFor=(i,lang)=>i===null?null:{...EN[i],...(lang==='es'?ES[i]:{})};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>RSM_RISE.icon(({bank:'link',train:'link',sun:'sun',why:'doc',accept:'check',adjust:'doc'})[name]||name);
const action=(id,label,disabled=false,cls='rise-primary')=>`<button type="button" class="${cls}" data-game="${id}" ${disabled?'disabled':''}>${label}</button>`;
function transition(raw,action,value,now){
 const g=RISE_STATE.sanitize(raw);if(!g)return RISE_STATE.fresh();
 const live=RISE_STATE.snapshot(g,now),stages=RISE_STATE.stages;
 if(action==='reset')return {...RISE_STATE.fresh(),unlocked:true};
 if(action==='select'&&g.sc==='deal'&&Number.isInteger(value)&&value>=0&&value<3)return {...RISE_STATE.fresh(),unlocked:true,deal:value};
 if(action==='run'&&g.sc==='read'&&!g.readStartedAt)return {...g,readStartedAt:now};
 if(action==='why'&&g.sc==='decide')return {...g,why:true};
 if(action==='decision'&&g.sc==='decide'&&['accept','adjust'].includes(value))return {...g,dec:value,decisionAt:now};
 if(action==='action'&&g.sc==='sup'&&live.t===1&&Number.isInteger(value)&&value>=0&&value<3)return {...g,act:value,actionAt:now};
 if(action==='next'){
  if(g.sc==='deal'&&g.deal!==null)return {...g,sc:'read'};
  if(g.sc==='read'&&live.p===1)return {...g,sc:'decide'};
  if(g.sc==='decide'&&g.dec)return {...g,sc:'sup',supStartedAt:g.supStartedAt||now};
  if(g.sc==='sup'&&live.t===1&&g.act!==null)return {...g,sc:'loop'};
 }
 if(action==='back'&&stages.indexOf(g.sc)>0)return {...g,sc:stages[stages.indexOf(g.sc)-1]};
 return g;
}
function tabletHTML(raw,language,now){
 const c=COPY[language],g=RISE_STATE.snapshot(raw,now),d=caseFor(g.deal,language),index=RISE_STATE.stages.indexOf(g.sc);
 let title='',body='',next='',disabled=true;
 if(g.sc==='deal'){
  title=c.pick;body=`<p class="rise-lead">${c.pickBody}</p><div class="rise-deals">${EN.map((_,i)=>{const x=caseFor(i,language);return `<button type="button" data-game="select" data-value="${i}" aria-pressed="${g.deal===i}"><span class="rise-icon">${icon(x.ic)}</span><span><b>${x.name}</b><small>${x.who}</small></span><em>${x.pages} ${c.pages}</em></button>`;}).join('')}</div>`;next=c.send;disabled=g.deal===null;
 }else if(g.sc==='read'){
  title=g.p===1?c.pre:c.read;
  body=`<p class="rise-lead">${g.p===1?c.preBody+' '+Math.round(d.pages/3)+'.':c.readBody}</p><div class="rise-run-panel">${g.p===0?action('run',icon('signal')+c.run):g.p<1?`<p role="status">${c.reading} · <b>${Math.round(g.p*100)}%</b></p><progress max="1" value="${g.p}" aria-label="${c.reading}"></progress>`:`<strong>~3×</strong><span>${c.faster}</span><small>${c.simTime}</small>`}</div>`;next=c.next;disabled=g.p<1;
 }else if(g.sc==='decide'){
  title=c.decide;
  body=`<p class="rise-lead">${c.suggested}: <b>${d.f[3][1]}</b> · ${d.conf}% <small>${c.confidence.toLowerCase()}</small></p><div class="rise-decision-options">${[['why',c.why,c.whyBody,g.why],['accept',c.accept,c.acceptBody,g.dec==='accept'],['adjust',c.adjust,c.adjustBody,g.dec==='adjust']].map(([id,label,desc,selected])=>`<button type="button" data-game="${id==='why'?'why':'decision'}" data-value="${id}" aria-pressed="${selected}"><span class="rise-icon">${icon(id)}</span><b>${label}</b><small>${desc}</small></button>`).join('')}</div><p class="rise-feedback" role="status">${g.dec?(g.dec==='accept'?c.accepted:c.adjusted)+' · '+c.logged:g.why?c.reason+' · '+c.onTV:c.onTV}</p>`;next=c.next;disabled=!g.dec;
 }else if(g.sc==='sup'){
  title=g.t===1?c.alertTitle:c.yearsLater;
  body=`<p class="rise-lead">${g.t===1?d.warn+'. '+c.what:c.readingReports}</p>${g.t===1?`<div class="rise-supervision-actions">${c.actions.map((a,i)=>`<button type="button" data-game="action" data-value="${i}" aria-pressed="${g.act===i}"><b>${a[0]}</b><small>${a[1]}</small><span>${g.act===i?'✓':'○'}</span></button>`).join('')}</div>`:`<div class="rise-run-panel"><p role="status">${c.year} ${Math.min(4,Math.floor(g.t*4))} · ${c.reading}</p><progress max="1" value="${g.t}" aria-label="${c.readingReports}"></progress></div>`}`;next=c.review;disabled=g.act===null||g.t<1;
 }else{
  title=c.tagline.join(' ');body=`<p class="rise-lead">${c.joined}</p><div class="rise-review">${[[c.steps[0],d.name+' · '+d.pages+' '+c.pages],[c.classification,g.dec==='adjust'?c.adjustedYou:c.acceptedYou],[c.early,c.actions[g.act][0]]].map(([k,v])=>`<article><span>${k}</span><b>${v}</b></article>`).join('')}</div>`;
 }
 return `<section class="rise-restored-game" data-stage="${g.sc}"><div class="rise-restored-trail">${c.steps.map((s,i)=>`<span class="${index>=i?'active':''}">0${i+1} ${s}</span>`).join('')}</div><h1>${title}</h1>${body}<div class="rise-game-bottom">${g.sc==='loop'?action('reset',c.again):`${index>0?action('back',c.back,false,'rise-secondary'):''}${action('next',next,disabled)}`}</div></section>`;
}
const card=(title,body='',ic='doc',cls='')=>RSM_RISE.card(title,body,ic,cls);
const proposal=d=>`<article class="rise-proposal-document"><span class="rise-icon">${icon(d.ic)}</span><h2>${d.name}</h2><p>${d.who}</p><i></i><i></i><i></i><i></i><b>${d.pages} pp.</b></article>`;
const gridPages=(p)=>`<div class="rise-page-grid" aria-hidden="true">${Array.from({length:40},(_,i)=>`<i class="${i<Math.round(p*40)?'read':''}"></i>`).join('')}</div>`;
function displayHTML(raw,language,now){
 const c=COPY[language],g=RISE_STATE.snapshot(raw,now),d=caseFor(g.deal,language),index=RISE_STATE.stages.indexOf(g.sc);
 let title='',body='';
 if(g.sc==='deal'){
  title=d?`${d.pages} ${c.pages} · ${c.pick}`:c.pick;
  body=`<div class="rise-proposal-view">${d?proposal(d):`<div class="rise-proposal-prompt">${icon('doc')}<p>${c.pickBody}</p></div>`}<div class="rise-proposal-cases">${EN.map((_,i)=>{const x=caseFor(i,language);return card(x.name,x.who+' · '+x.pages+' '+c.pages,x.ic==='sun'?'sun':'doc',g.deal===i?'is-picked':'');}).join('')}</div></div>`;
 }else if(g.sc==='read'){
  title=c.reading;
  const rows=[[c.summary,d.sum],[c.business,d.model],[c.risks,d.risks.join(' · ')],[c.mitigants,d.mit.join(' · ')],[c.gaps,c.noGaps],[c.classification,d.f[1][1]+' · '+d.f[3][1]]];
  body=`<div class="rise-reading-split"><article class="rise-reading-pane"><header><b>${c.manual}</b><span>${Math.round(d.pages*g.p/3)} / ${d.pages} pp.</span></header>${gridPages(g.p/3)}<progress value="${g.p/3}" max="1" aria-label="${c.manual}"></progress></article><article class="rise-reading-pane rise-reading-ai"><header><b>${c.withRise}</b><span>${Math.round(d.pages*g.p)} / ${d.pages} pp.</span></header><div class="rise-extraction">${rows.map(([k,v],i)=>`<div class="${g.p>=(i+1)/6.2?'revealed':''}"><span>${k}</span><b>${g.p>=(i+1)/6.2?v:'…'}</b></div>`).join('')}</div><progress value="${g.p}" max="1" aria-label="${c.withRise}"></progress></article></div>${g.p===1?`<div class="rise-speed-result"><b>~3× <small>${c.faster}</small></b><p><strong>${c.gain}</strong><br>${c.gainBody}</p><small>${c.simTime}</small></div>`:`<p class="rise-human">${g.p?c.reading:c.readBody}</p>`}`;
 }else if(g.sc==='decide'){
  title=c.decide;
  body=`<div class="rise-classify"><article class="rise-card"><h2>${d.name}</h2><p>${d.sum}</p><div class="rise-class-fields">${d.f.map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join('')}</div><div class="rise-risk-tags">${d.risks.map(r=>`<span>${r}</span>`).join('')}${d.mit.map(r=>`<span class="mitigant">${r}</span>`).join('')}</div></article><div class="rise-evidence-panel"><article class="rise-confidence"><strong>${d.conf}%</strong><div><h3>${c.confidence}</h3><p>${c.confidenceBody}</p></div></article><article class="rise-card rise-evidence">${g.why?`<h3>${c.reason}</h3><p>${d.why}</p><div>${d.ev.map(([page,quote],i)=>`<p><b>${i+1} · ${page}</b><span>${escape(quote)}</span></p>`).join('')}</div>`:`<p>${c.lockedWhy}</p>`}</article><p class="rise-decision-log ${g.dec?'rise-success':''}">${g.dec?`<b>${g.dec==='accept'?c.accepted:c.adjusted}</b><br>${c.logged}`:c.waiting}</p></div></div>`;
 }else if(g.sc==='sup'){
  title=c.sup;
  body=`<p class="rise-lead">${c.supBody}</p><div class="rise-timeline"><div class="rise-timeline-track"><i style="width:${g.t*100}%"></i></div><div class="rise-timeline-years">${[0,1,2,3,4].map(i=>`<div class="${g.t*4>=i?'on':''}"><b>${c.year} ${i}</b><small>${i?c.annual:c.approval}</small></div>`).join('')}</div><div class="rise-timeline-pins"><span class="early ${g.t>=.6?'visible':''}">${c.early}</span><span class="late ${g.t>=.75?'visible':''}">${c.late}</span></div></div><div class="rise-supervision-detail"><article class="rise-alert">${g.t>=.6?`${icon('signal')}<h2>${d.warn}</h2><p>${c.found} ${d.src}, ${c.beforeAnnual}</p>${g.act!==null?`<b>${c.yourAction}: ${c.actions[g.act][0]}</b>`:''}`:`<p>${c.readingReports}</p>`}</article><article class="rise-memory-wall"><canvas data-memory="similar" aria-hidden="true"></canvas><div><h3>${c.memory}</h3><p>${g.t>=.6?c.similar+' '+d.lesson:c.docCount}</p><small>${c.simLesson}</small></div></article></div>`;
 }else{
  title='';body=`<div class="rise-memory-close"><section><p class="rise-kicker">${c.close}</p><h1>${c.tagline.map(t=>`<span>${t}</span>`).join('')}</h1><div class="rise-review">${[[c.steps[0],d.name+' · '+d.pages+' pp.'],[c.classification,g.dec==='adjust'?c.adjustedYou:c.acceptedYou],[c.early,c.actions[g.act][0]]].map(([k,v])=>`<article><span>${k}</span><b>${v}</b></article>`).join('')}</div></section><article class="rise-memory-wall"><canvas data-memory="close" aria-hidden="true"></canvas><div><b>#8,201</b><p>${c.joinBody}</p><small>${c.sim}</small></div></article></div>`;
 }
 return `<main class="rise rise-display rise-game-display" data-stage="${g.sc}"><header class="rise-header"><b>11 <span>RSM RISE</span></b><span>Risk Intelligence & Strategy Engine</span></header><section class="rise-stage"><div class="rise-restored-trail">${c.steps.map((s,i)=>`<span class="${index>=i?'active':''}">0${i+1} ${s}</span>`).join('')}</div>${title?`<h1>${title}</h1>`:''}${body}</section><footer><span>${c.sim}</span><span>BID Invest · AI in Action</span></footer></main>`;
}
function paintMemory(mount){
 mount.querySelectorAll('canvas[data-memory]').forEach(cv=>{
  const close=cv.dataset.memory==='close',r=cv.getBoundingClientRect(),ratio=window.devicePixelRatio||1,W=Math.max(10,r.width),H=Math.max(10,r.height),n=close?8201:8200;
  cv.width=Math.round(W*ratio);cv.height=Math.round(H*ratio);const x=cv.getContext('2d');x.scale(ratio,ratio);
  const cols=Math.floor(Math.sqrt(n*W/H)),rows=Math.ceil(n/cols),cw=W/cols,ch=H/rows,lit=close?[8200]:[1873,4410,6952];
  for(let i=0;i<n;i++){x.fillStyle=lit.includes(i)?(close?'#ffffff':'#ffcb52'):['#163d73','#23558d','#347ac0'][i%3];x.fillRect((i%cols)*cw,Math.floor(i/cols)*ch,Math.max(.5,cw-1),Math.max(.5,ch-1));}
  lit.forEach(i=>{x.strokeStyle=close?'white':'#ffcb52';x.lineWidth=2;x.beginPath();x.arc((i%cols+.5)*cw,(Math.floor(i/cols)+.5)*ch,Math.max(6,cw*2),0,Math.PI*2);x.stroke();});
 });
}
let displayTimer=null,resizeTimer=null;
function stopDisplay(){clearInterval(displayTimer);displayTimer=null;}
function renderDisplay(mount,data){
 stopDisplay();const language=data.language==='es'?'es':'en',raw=RISE_STATE.sanitize(data.game);if(!raw)return;
 document.documentElement.lang=language;
 const paint=()=>{mount.innerHTML=displayHTML(raw,language,AI_SYNC.now());paintMemory(mount);};paint();
 const live=RISE_STATE.snapshot(raw,AI_SYNC.now());
 if((live.sc==='read'&&live.readStartedAt&&live.p<1)||(live.sc==='sup'&&live.t<1))displayTimer=setInterval(()=>{if(!mount.querySelector('.rise-game-display'))return stopDisplay();paint();const next=RISE_STATE.snapshot(raw,AI_SYNC.now());if(next.sc==='read'?next.p===1:next.t===1)stopDisplay();},120);
}
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>paintMemory(document),100);});
window.RISE_GAME={caseFor,copy:COPY,tabletHTML,renderDisplay,transition,stopDisplay};
})();
