/* AquaData shared visual shell (project 01). Renders the branded tablet screens (interactive)
   and the TV guide screens (context, animations and a call to action per stage). */
(function(){
 const base=new URL('./',document.currentScript.src);
 const url=rel=>new URL(rel,base).href;
 const logo=url('aquadata/idb-group-white.svg');
 const cardPhotos=[url('aquadata/card-information.jpg'),url('aquadata/card-experience.jpg')];
 const dataRoot=url('AquaData_12_Imagenes_Ligeras_JPG/');
 const MAX_PICKS=3;
 /* Game steps: 1 mission, 2 blind round, 3 blind result, 4 how the score works, 5 analysis,
    6 round with AquaData, 7 comparison, 8 real case. The header shows them as six chapters. */
 const LAST_STEP=8,ANALYSIS_STEP=5;
 const CHAPTER=[0,1,2,2,3,3,4,5,6];
 /* Example contract for the explainer: not one of the eight, so it gives nothing away. */
 const SAMPLE={series:[52,50,54,51,22,14,12],risk:88};
 /* Real EMCALI figures (documented case). Kept apart from the simulated game outcomes. */
 const EMCALI={reference:1.4,withAquaData:11.6};
 const copy={
  en:{
   brand:'AI in Action',brandSub:'IDB Group Projects Across the Region',home:'Home',station:'Station',onTablet:'On the tablet',
   kicker:'01 Infrastructure & Resilience',intro:'Artificial intelligence to help decide which water accounts to inspect first.',
   info:'Information',infoBody:'The challenge, the solution and real results.',infoOnTv:'Discover AquaData on the main screen',
   game:'Interactive experience',gameBody:'A short game about how AI thinks.',
   entered:"You've entered the interactive experience",
   back:'Back',next:'Start',continue:'Continue',confirm:'Confirm selection',pick:'Tap 3 contracts',again:'Play again',menu:'Back to menu',
   watch3:'Watch the analysis on the main screen',watch5:'See the findings on the main screen',watch6:'See the real case on the main screen',
   f1Kicker:'Round 1 · Result',f1Of:'of 3 cases found.',f1Body:'This is how a random inspection works.',f1Next:'See how AI does it',
   e1Kicker:'How AI does it',e1Title:'This is how AI reads',e1Accent:'each contract',e1Score:'Risk score: how likely it is that there is fraud',e1Body:'Each card now shows the consumption history and the score the model calculates.',e1Ok:'Got it',sample:'Example',
   s1Kicker:'Your mission',s1Title:'Water',s1Accent:'Detective',s1Body:'Some contracts hide irregularities. You have two rounds to find them.',watch1:'The instructions are on the main screen',s1Go:'Round 1 · Choose 3 contracts blind',s1Menu:'Choose another option',
   s1Contracts:'Contracts',s1ContractsBody:'on the water network',s1Visits:'Inspections',s1VisitsBody:'per round',s1Rounds:'Rounds',s1RoundsBody:'blind, then with AI',
   s2Kicker:'Round 1 · No data',s2Title:'Choose',s2Accent:'blind',s2Body:'Tap 3 contracts you think hide irregularities.',
   s4Kicker:'Round 2 · With AquaData',s4Title:'Now choose',s4Accent:'with risk scores',s4Body:'Each card shows its risk score. Choose 3.',
   selected:'Selected',risk:'Risk',
   s3Kicker:'How the AI thinks',s3Title:'This is how',s3Accent:'AquaData analyses',s3Body:'The model reads each contract’s consumption and estimates how likely an inspection is to find an irregularity.',
   s3Phases:['Collects the data','Reads consumption','Detects patterns','Scores and ranks'],s3Sources:['Billing','Readings','Inspections'],s3Trend:'Consumption',
   s3Inputs:[['Consumption history','Monthly readings and evolution'],['Billing','Company records'],['Past inspections','Known outcomes']],
   s3Model:'AquaData · analysis agent',s3Working:'Analysing contracts…',s3Done:'Scores ready',s3Play:'Play on screen',s3NextAct:'Next step',s3Prev:'Previous step',s3Replay:'Replay',s3Intro:'Four steps to read the 8 contracts.',s3Rank:'RIR risk ranking',s3RankBody:'Suggested inspection order',
   s3Note:'A high score is not proof of fraud. The inspector verifies it in the field.',
   s5Kicker:'The result',s5Title:'Same contracts.',s5Accent:'A different way of looking.',s5Body:'This is what the field team found in each round.',s5Without:'Blind',s5With:'With AquaData',
   found:'Irregularity',clear:'Nothing found',
   s5NoteMore:'In a real city, that difference means inspections that are not wasted and water that is recovered.',
   s5NoteSame:'A tie this round. AI improves the average, not every visit.',
   s5NoteLess:'Your intuition won this time. AI improves the average, not every visit.',
   s6Kicker:'Real case · EMCALI, Cali',s6Title:'Real',s6Accent:'impact',s6Body:'A real example demonstrates the value of prioritising inspections.',
   s6Reference:'Before',s6With:'With AquaData',s6Metric:'Detection rate in the field trial',
   s6Quote:'Artificial intelligence does not replace the inspector. It helps them know where to start.',s6QuoteBody:'With the same field capacity, a prioritised list can help find more irregularities.',
   s6Source:'Source: AquaData sheet, data presented at ANDESCO (September 2026).',simulation:'Educational simulation · fictional data',
   cta:{1:'Press “Next” on the tablet to start the mission',2:'Choose 3 contracts on the tablet, then confirm',2.5:'Press “Confirm inspections” on the tablet',3:'AquaData is analysing. Press “Continue” on the tablet',4:'Now use the risk scores: choose 3 contracts and confirm',5:'Compare both rounds. Press “Continue” on the tablet',6:'Play again or return to the menu from the tablet'}
  },
  es:{
   brand:'AI in Action',brandSub:'IDB Group Projects Across the Region',home:'Inicio',station:'Estación',onTablet:'En la tableta',
   kicker:'01 Infraestructura y resiliencia',intro:'Inteligencia artificial para decidir qué contratos de agua inspeccionar primero.',
   info:'Información',infoBody:'El reto, la solución y los resultados reales.',infoOnTv:'Descubre AquaData en la pantalla principal',
   game:'Experiencia interactiva',gameBody:'Un juego corto sobre cómo piensa la IA.',
   entered:'Has entrado a la experiencia interactiva',
   back:'Volver',next:'Comenzar',continue:'Continuar',confirm:'Confirmar selección',pick:'Toca 3 contratos',again:'Jugar de nuevo',menu:'Volver al menú',
   watch3:'Mira el análisis en la pantalla grande',watch5:'Mira los hallazgos en la pantalla grande',watch6:'Mira el caso real en la pantalla grande',
   f1Kicker:'Ronda 1 · Resultado',f1Of:'de 3 casos encontrados.',f1Body:'Así funciona una inspección al azar.',f1Next:'Ver cómo lo hace la IA',
   e1Kicker:'Cómo lo hace la IA',e1Title:'Así lee la IA',e1Accent:'cada contrato',e1Score:'Puntaje de riesgo: qué tan probable es que haya fraude',e1Body:'Cada tarjeta ahora muestra el historial de consumo y el puntaje que calcula el modelo.',e1Ok:'Entendido',sample:'Ejemplo',
   s1Kicker:'Tu misión',s1Title:'Detective',s1Accent:'del Agua',s1Body:'Algunos contratos esconden irregularidades. Tienes dos rondas para encontrarlos.',watch1:'Las instrucciones están en la pantalla grande',s1Go:'Ronda 1 · Elige 3 contratos a ciegas',s1Menu:'Elegir otra opción',
   s1Contracts:'Contratos',s1ContractsBody:'en la red de agua',s1Visits:'Inspecciones',s1VisitsBody:'por ronda',s1Rounds:'Rondas',s1RoundsBody:'a ciegas y con IA',
   s2Kicker:'Ronda 1 · Sin datos',s2Title:'Elige',s2Accent:'a ciegas',s2Body:'Toca 3 contratos que creas que tienen irregularidades.',
   s4Kicker:'Ronda 2 · Con AquaData',s4Title:'Ahora elige',s4Accent:'con puntajes de riesgo',s4Body:'Cada tarjeta muestra su puntaje de riesgo. Elige 3.',
   selected:'Seleccionados',risk:'Riesgo',
   s3Kicker:'Así piensa la IA',s3Title:'Así analiza',s3Accent:'AquaData',s3Body:'El modelo lee el consumo de cada contrato y calcula qué tan probable es que una inspección encuentre una irregularidad.',
   s3Phases:['Reúne los datos','Lee el consumo','Detecta patrones','Calcula y ordena'],s3Sources:['Facturación','Lecturas','Inspecciones'],s3Trend:'Consumo',
   s3Inputs:[['Historial de consumo','Lecturas y evolución mensual'],['Facturación','Registros de la empresa'],['Inspecciones previas','Resultados conocidos']],
   s3Model:'AquaData · agente de análisis',s3Working:'Analizando contratos…',s3Done:'Puntajes listos',s3Play:'Ver en pantalla',s3NextAct:'Siguiente paso',s3Prev:'Paso anterior',s3Replay:'Repetir',s3Intro:'Cuatro pasos para leer los 8 contratos.',s3Rank:'Ranking de riesgo RIR',s3RankBody:'Orden sugerido de inspección',
   s3Note:'Un puntaje alto no es prueba de fraude. El inspector lo verifica en campo.',
   s5Kicker:'El resultado',s5Title:'Mismos contratos.',s5Accent:'Distinta forma de mirar.',s5Body:'Esto encontró el equipo de campo en cada ronda.',s5Without:'A ciegas',s5With:'Con AquaData',
   found:'Irregularidad',clear:'Sin hallazgo',
   s5NoteMore:'En una ciudad real, esa diferencia son inspecciones que no se desperdician y agua que sí se recupera.',
   s5NoteSame:'Empate en esta ronda. La IA mejora el promedio, no cada visita.',
   s5NoteLess:'Esta vez ganó tu intuición. La IA mejora el promedio, no cada visita.',
   s6Kicker:'Caso real · EMCALI, Cali',s6Title:'Impacto',s6Accent:'real',s6Body:'Un ejemplo real demuestra el valor de priorizar las inspecciones.',
   s6Reference:'Antes',s6With:'Con AquaData',s6Metric:'Tasa de detección en prueba de campo',
   s6Quote:'La inteligencia artificial no reemplaza al inspector. Le ayuda a saber dónde empezar.',s6QuoteBody:'Con la misma capacidad de campo, una lista priorizada puede ayudar a encontrar más irregularidades.',
   s6Source:'Fuente: ficha de AquaData, datos presentados en ANDESCO (septiembre de 2026).',simulation:'Simulación educativa · datos ficticios',
   cta:{1:'Pulsa “Siguiente” en la tableta para comenzar la misión',2:'Elige 3 contratos en la tableta y confirma',2.5:'Pulsa “Confirmar inspecciones” en la tableta',3:'AquaData está analizando. Pulsa “Continuar” en la tableta',4:'Ahora usa los puntajes de riesgo: elige 3 contratos y confirma',5:'Compara las dos rondas. Pulsa “Continuar” en la tableta',6:'Vuelve a jugar o regresa al menú desde la tableta'}
  }
 };
 const icons={
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L19 7"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M10 20v-5h4v5"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 9h5a1 1 0 0 1 1 1v11M2 21h20M8 8h2M8 12h2M8 16h2"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>',
  replay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 6v7"/><circle cx="12" cy="17.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  tablet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M12 17h.01"/></svg>',
  dice:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="36" height="36" rx="9"/><g fill="currentColor" stroke="none"><circle cx="16" cy="16" r="2.8"/><circle cx="32" cy="16" r="2.8"/><circle cx="24" cy="24" r="2.8"/><circle cx="16" cy="32" r="2.8"/><circle cx="32" cy="32" r="2.8"/></g></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V4m-6 6 6-6 6 6"/></svg>',
  screen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/></svg>',
  brain:'<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M52 22c-9-8-26-3-26 11-10 2-13 16-5 22-6 9 0 21 10 22 1 10 14 14 21 7V22Z"/><path d="M68 22c9-8 26-3 26 11 10 2 13 16 5 22 6 9 0 21-10 22-1 10-14 14-21 7V22Z"/><rect x="44" y="44" width="32" height="32" rx="6"/><path d="M52 44v-8m8 8v-8m8 8v-8M52 84v-8m8 8v-8m8 8v-8M44 52h-8m8 8h-8m8 8h-8M84 52h-8m8 8h-8m8 8h-8"/><circle cx="34" cy="34" r="3" fill="currentColor" stroke="none"/><circle cx="86" cy="34" r="3" fill="currentColor" stroke="none"/><circle cx="30" cy="70" r="3" fill="currentColor" stroke="none"/><circle cx="90" cy="70" r="3" fill="currentColor" stroke="none"/></svg>'
 };
 const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 /* Entry animations play once per stage: re-renders of the same stage (a pick, a language switch) stay still. */
 const played={};
 const fresh=(scope,key)=>{const is=played[scope]!==key;played[scope]=key;return is;};
 const riskLevel=risk=>risk>=60?'high':risk>=40?'mid':'low';
 /* Consumption sparkline from the contract series; a dot marks a sharp drop. CSS draws the line. */
 function spark(series){
  const max=Math.max(...series)||1;
  const pts=series.map((value,i)=>[(i/(series.length-1)*94+3).toFixed(1),(37-value/max*32).toFixed(1)]);
  let drop=0,at=0;series.forEach((value,i)=>{if(i&&series[i-1]-value>drop){drop=series[i-1]-value;at=i;}});
  const dot=drop/max>.2?`<circle class="aqd-spark-dot" cx="${pts[at][0]}" cy="${pts[at][1]}" r="3.2"/>`:'';
  return `<svg class="aqd-spark" viewBox="0 0 100 40" aria-hidden="true"><polyline pathLength="1" points="${pts.map(point=>point.join(',')).join(' ')}"/>${dot}</svg>`;
 }
 const photo=c=>`${dataRoot}negocios/${esc(c.asset)}.jpg`;
 /* Three inspection slots: the chosen contract photo, or a dashed placeholder. */
 function slots(data,picks){
  const chosen=picks.map(id=>data.contracts.find(c=>c.id===id)).filter(Boolean);
  return `<ol class="aqd-slots">${[0,1,2].map(i=>{const c=chosen[i];return c?`<li class="is-filled ${i===chosen.length-1?'is-new':''}"><img src="${photo(c)}" alt=""><i aria-hidden="true">${icons.check}</i><b>${c.id}</b></li>`:`<li><span>${i+1}</span></li>`;}).join('')}</ol>`;
 }
 /* One round of the comparison: score, a three-step meter and each inspected contract with its outcome.
    The tablet uses the compact form (score only); the photos belong to the TV. */
 function resultCard(data,ids,label,kind,x,compact){
  const list=[...(ids||[])].sort();
  const hits=list.filter(id=>data.outcomes.get(id)===true).length;
  return `<article class="aqd-result aqd-result--${kind}"><h2>${label}</h2><p class="aqd-score"><b>${hits}</b>/${MAX_PICKS}</p><span class="aqd-meter" aria-hidden="true">${[0,1,2].map(i=>`<i class="${i<hits?'is-on':''}"></i>`).join('')}</span>${compact?'':`<ul>${list.map((id,i)=>{const c=data.contracts.find(item=>item.id===id);const hit=data.outcomes.get(id)===true;return `<li class="${hit?'is-found':''}" style="--i:${i}"><span class="aqd-result-photo">${c?`<img src="${photo(c)}" alt="">`:''}<i aria-hidden="true">${hit?icons.alert:icons.minus}</i></span><b>${id}</b><small>${hit?x.found:x.clear}</small></li>`;}).join('')}</ul>`}</article>`;
 }
 /* Documented EMCALI field test (real figures, never mixed with the simulated game). */
 function chart(x,lang,animate){
  const fmt=value=>lang==='es'?String(value).replace('.',',')+' %':value+' %';
  const scale=value=>Math.round(value/EMCALI.withAquaData*100);
  return `<figure class="aqd-chart ${animate?'is-animated':''}" aria-label="${esc(x.s6Metric)}"><div class="aqd-bars"><div class="aqd-bar aqd-bar--reference" style="--value:${scale(EMCALI.reference)}"><b>${fmt(EMCALI.reference)}</b><i></i><span>${x.s6Reference}</span></div><div class="aqd-bar aqd-bar--aquadata" style="--value:${scale(EMCALI.withAquaData)}"><b>${fmt(EMCALI.withAquaData)}</b><i></i><span>${x.s6With}</span></div></div><figcaption>${x.s6Metric}<small>${x.s6Source}</small></figcaption></figure>`;
 }
 /* Four acts of about 3.5 s each: [start, length] in seconds. aquadata.css follows the same clock. */
 const ACTS=4;
 /* The agent panel: what the model is doing while the contract cards are scanned. */
 function agent(x,act,animate){
  return `<aside class="aqd-agent ${animate?'is-animated':''}" data-act="${act}"><div class="aqd-agent-head"><span class="aqd-model-icon">${icons.brain}</span><span><strong>${x.s3Model}</strong><em class="aqd-agent-status"><span>${x.s3Working}</span><span>${x.s3Done}</span></em></span></div><ul class="aqd-agent-sources">${x.s3Sources.map((source,i)=>`<li style="--i:${i}">${source}</li>`).join('')}</ul><ol>${x.s3Phases.map((phase,i)=>`<li class="${i+1<act?'is-done':i+1===act?'is-active':''}"><i aria-hidden="true"><b>${i+1}</b>${icons.check}</i><strong>${phase}</strong></li>`).join('')}</ol><span class="aqd-progress" role="progressbar" aria-label="${esc(x.s3Model)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${act*25}"><i style="--p:${act}"></i></span></aside>`;
 }
 /* Each contract is read in turn: consumption line, risk score, then its place in the ranking. */
 function scanGrid(data,x,act,animate){
  const ranked=[...data.contracts].sort((a,b)=>b.risk-a.risk);
  return `<ul class="aqd-scan ${animate?'is-animated':''}" data-act="${act}">${data.contracts.map((c,i)=>{const rank=ranked.indexOf(c)+1;return `<li class="aqd-scan-card aqd-risk--${riskLevel(c.risk)} ${rank<=MAX_PICKS?'is-top':''}" style="--i:${i}"><span class="aqd-scan-head"><b>${c.id}</b>${esc(c.es)}</span><span class="aqd-scan-trend">${x.s3Trend}</span>${spark(c.series)}<span class="aqd-scan-score"><i style="--value:${c.risk}"></i><b class="aqd-count" style="--to:${c.risk}" aria-label="${c.risk}"></b></span><em class="aqd-scan-rank">#${rank}</em></li>`;}).join('')}</ul>`;
 }
 /* The explainer card: a consumption line and the score the model gives it. */
 function sample(x,animate){
  return `<article class="aqd-sample aqd-risk--high ${animate?'is-animated':''}"><span class="aqd-sample-tag">${x.sample}</span><span class="aqd-scan-trend"><em>1</em>${x.s3Trend}</span>${spark(SAMPLE.series)}<span class="aqd-scan-score"><em>2</em><i style="--value:${SAMPLE.risk}"></i><b class="aqd-count" style="--to:${SAMPLE.risk}" aria-label="${SAMPLE.risk}"></b></span></article>`;
 }
 let dataPromise=null;
 /* Contracts and simulated outcomes are shared by both screens. */
 function load(){
  if(!dataPromise)dataPromise=(async()=>{
   const [c,o]=await Promise.all([fetch(dataRoot+'contratos_ficticios.json'),fetch(dataRoot+'hallazgos_simulados_DEMO.json')]);
   if(!c.ok||!o.ok)throw Error('AquaData resources');
   const contracts=await c.json();const demo=await o.json();
   return {contracts,outcomes:new Map(demo.outcomes.map(item=>[item.id,item.finding]))};
  })().catch(error=>{dataPromise=null;throw error;});
  return dataPromise;
 }
 function render(state,options){
  const {data,readonly=false,station=1}=options;
  const lang=state.language==='es'?'es':'en';
  const x=copy[lang];
  const step=Math.max(1,Math.min(LAST_STEP,Number(state.step)||1));
  const picks=step<=ANALYSIS_STEP?(state.p1||[]):(state.p2||[]);
  const chapter=CHAPTER[step];
  /* Business names stay in Spanish in both languages; only the business type is translated. */
  const name=c=>c.es;
  const type=c=>lang==='es'?c.esType:c.enType;
  const tag=readonly?'span':'button type="button"';
  const close=readonly?'span':'button';
  const animate=fresh('tablet',`${state.mode}:${step}`);
  const backBtn=()=>readonly?'':`<button type="button" class="aqd-secondary" data-action="back">${icons.back} ${x.back}</button>`;
  /* Points the visitor to the TV, where the detail of this stage is shown. */
  const watch=(text,big)=>`<p class="aqd-watch ${big?'aqd-watch--big':''}"><i aria-hidden="true">${icons.screen}</i><span>${text}</span></p>`;
  function header(){
   const steps=state.mode==='game'?`<ol class="aqd-steps" aria-label="${esc(lang==='es'?'Etapas':'Stages')}">${[1,2,3,4,5,6].map(n=>`<li class="${n===chapter?'is-current':n<chapter?'is-done':''}" ${n===chapter?'aria-current="step"':''}>${n}</li>`).join('')}</ol>`:'';
   const tools=readonly
    ?`<div class="aqd-tools"><span class="aqd-station">${x.station} ${String(station).padStart(2,'0')}</span><span class="aqd-language aqd-language--readonly"><b aria-pressed="${lang==='es'}">ES</b><b aria-pressed="${lang==='en'}">EN</b></span></div>`
    :`<div class="aqd-tools"><span class="aqd-station">${x.station} ${String(station).padStart(2,'0')}</span><nav class="aqd-language" aria-label="Language"><button type="button" data-language="es" aria-pressed="${lang==='es'}">ES</button><button type="button" data-language="en" aria-pressed="${lang==='en'}">EN</button></nav><button type="button" class="aqd-home" data-action="home">${icons.home}<span>${x.home}</span></button></div>`;
   return `<header class="aqd-header"><div class="aqd-brand"><img src="${logo}" width="216" height="44" alt="IDB Group"><span class="aqd-brand-divider" aria-hidden="true"></span><span class="aqd-brand-copy"><strong>${x.brand}</strong><small>${x.brandSub}</small></span></div>${steps}${tools}</header>`;
  }
  function title(kicker,plain,accent,body,joiner=' '){
   return `<div class="aqd-title">${kicker?`<p class="aqd-kicker">${kicker}</p>`:''}<h1>${plain}${joiner}<span>${accent}</span></h1>${body?`<p class="aqd-lead">${body}</p>`:''}</div>`;
  }
  function cta(){
   if(!readonly||state.mode!=='game')return '';
   const key=(step===2||step===4)&&picks.length===MAX_PICKS?2.5:step;
   return `<aside class="aqd-cta" role="status"><span class="aqd-cta-icon">${icons.tablet}</span><span><small>${x.onTablet}</small><strong>${x.cta[key]}</strong></span><i aria-hidden="true">${icons.arrow}</i></aside>`;
  }
  function landing(){
   const infoActive=state.mode==='info';
   return `${header()}<section class="aqd-screen aqd-landing">${title(x.kicker,'Aqua','Data',x.intro,'')}<div class="aqd-home-cards"><${tag} class="aqd-home-card ${infoActive?'is-active':''}" data-action="information"><span class="aqd-home-card-copy"><b>01</b><strong>${x.info}</strong><small>${x.infoBody}</small>${infoActive?`<em>${x.infoOnTv}</em>`:''}</span><img src="${cardPhotos[0]}" alt="" aria-hidden="true"></${close}><${tag} class="aqd-home-card" data-action="game"><span class="aqd-home-card-copy"><b>02</b><strong>${x.game}</strong><small>${x.gameBody}</small></span><img src="${cardPhotos[1]}" alt="" aria-hidden="true"></${close}></div></section>`;
  }
  function contractCard(c,withRisk,index){
   const selected=picks.includes(c.id);
   const full=picks.length>=MAX_PICKS&&!selected;
   const level=c.risk>=60?'high':c.risk>=40?'mid':'low';
   return `<${tag} class="aqd-contract ${selected?'is-selected':''}" data-contract="${c.id}" style="--i:${index}" aria-pressed="${selected}" ${full?'aria-disabled="true"':''}><span class="aqd-contract-photo"><img src="${dataRoot}negocios/${esc(c.asset)}.jpg" alt="" aria-hidden="true">${withRisk?`<span class="aqd-risk aqd-risk--${level}"><b class="aqd-count" style="--to:${c.risk}" aria-label="${c.risk}"></b><small>${x.risk}</small></span><span class="aqd-risk-meter aqd-risk--${level}"><i style="--value:${c.risk}"></i></span>`:''}</span><span class="aqd-contract-id">${c.id} · ${esc(type(c))}</span><span class="aqd-contract-name">${esc(name(c))}</span><span class="aqd-contract-check" aria-hidden="true">${icons.check}</span></${close}>`;
  }
  function selection(withRisk){
   const count=picks.length,ready=count===MAX_PICKS;
   const head=withRisk?[x.s4Kicker,x.s4Title,x.s4Accent,x.s4Body]:[x.s2Kicker,x.s2Title,x.s2Accent,x.s2Body];
   const counter=`<output class="aqd-counter" aria-live="polite"><span>${x.selected}</span><strong>${count}/${MAX_PICKS}</strong></output>`;
   const action=readonly?'':`${backBtn()}<button type="button" class="aqd-primary" data-action="confirm" ${ready?'':'disabled aria-disabled="true"'}>${ready?x.confirm:x.pick} ${icons.arrow}</button>`;
   return `${header()}<section class="aqd-screen aqd-select"><div class="aqd-select-head">${title(...head)}${counter}</div><div class="aqd-contract-grid ${withRisk&&animate?'is-animated':''}">${data.contracts.map((c,i)=>contractCard(c,withRisk,i)).join('')}</div><footer class="aqd-actions"><span class="aqd-note aqd-note--inline">${x.simulation}</span>${action}</footer></section>`;
  }
  function mission(){
   const panel=readonly?'':`<div class="aqd-panel"><button type="button" class="aqd-tile aqd-tile--go" data-action="next"><span class="aqd-tile-copy"><strong>${x.next}</strong><small>${x.s1Go}</small></span><i aria-hidden="true">${icons.arrow}</i></button><button type="button" class="aqd-tile" data-action="cover"><span class="aqd-tile-copy"><strong>${x.menu}</strong><small>${x.s1Menu}</small></span><i aria-hidden="true">${icons.back}</i></button></div>`;
   return `${header()}<section class="aqd-screen aqd-mission aqd-mission--remote">${title(x.s1Kicker,x.s1Title,x.s1Accent,'')}${watch(x.watch1)}${panel}</section>`;
  }
  /* Round 1 outcome: only the number. Which contracts had a finding is revealed in the comparison. */
  function blindResult(){
   const hits=(state.p1||[]).filter(id=>data.outcomes.get(id)===true).length;
   const action=readonly?'':`<footer class="aqd-actions"><span class="aqd-note aqd-note--inline">${x.simulation}</span>${backBtn()}<button type="button" class="aqd-primary" data-action="next">${x.f1Next} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-feedback-screen"><div class="aqd-feedback aqd-feedback--stack ${animate?'is-animated':''}"><p class="aqd-kicker">${x.f1Kicker}</p><span class="aqd-dice" aria-hidden="true">${icons.dice}</span><p class="aqd-feedback-score"><b class="aqd-count" style="--to:${hits};--cd:.9s" aria-label="${hits}"></b><span>${x.f1Of}</span></p><p class="aqd-feedback-body">${x.f1Body}</p></div>${action}</section>`;
  }
  /* What the risk score is, before the model runs. */
  function explain(){
   const action=readonly?'':`<footer class="aqd-actions">${backBtn()}<button type="button" class="aqd-primary" data-action="next">${x.e1Ok} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-explain-screen">${title(x.e1Kicker,x.e1Title,x.e1Accent,'')}<div class="aqd-tutorial ${animate?'is-animated':''}"><p class="aqd-tutorial-score"><i aria-hidden="true">${icons.up}</i><b class="aqd-count" style="--to:${SAMPLE.risk};--cd:.3s" aria-label="${SAMPLE.risk}"></b><span>${x.e1Score}</span></p><p class="aqd-tutorial-body">${x.e1Body}</p></div>${action}</section>`;
  }
  function analysis(){
   const act=Math.max(0,Math.min(4,Number(state.act)||0)),ready=!!state.analysisReady;
   const play=fresh('tablet-act',`${step}:${act}:${state.take||0}`);
   const main=act>=4?`<button type="button" class="aqd-primary" data-action="next" ${ready?'':'disabled aria-disabled="true"'}>${x.continue} ${icons.arrow}</button>`:`<button type="button" class="aqd-primary" data-action="play">${act?x.s3NextAct:x.s3Play} ${icons.arrow}</button>`;
   const prev=act?`<button type="button" class="aqd-secondary" data-action="replay">${icons.replay} ${act>1?x.s3Prev:x.s3Replay}</button>`:'';
   const action=readonly?'':`<footer class="aqd-actions">${backBtn()}${prev}${main}</footer>`;
   return `${header()}<section class="aqd-screen aqd-analysis aqd-analysis--solo ${ready?'is-ready':''}">${title(x.s3Kicker,x.s3Title,x.s3Accent,'')}<div class="aqd-agent-solo">${agent(x,act,play)}</div>${watch(act?tvCopy[lang].s3Captions[act-1]:x.watch3)}${action}</section>`;
  }
  function results(){
   const action=readonly?'':`<footer class="aqd-actions"><span class="aqd-note aqd-note--inline">${x.simulation}</span>${backBtn()}<button type="button" class="aqd-primary" data-action="next">${x.continue} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-results aqd-results--compact">${title(x.s5Kicker,x.s5Title,x.s5Accent,'')}<div class="aqd-compare ${animate?'is-animated':''}">${resultCard(data,state.p1,x.s5Without,'without',x,true)}<span class="aqd-vs" aria-hidden="true">vs.</span>${resultCard(data,state.p2,x.s5With,'with',x,true)}</div>${watch(x.watch5)}${action}</section>`;
  }
  function impact(){
   const action=readonly?'':`<footer class="aqd-actions">${backBtn()}<button type="button" class="aqd-secondary" data-action="restart">${icons.replay} ${x.again}</button><button type="button" class="aqd-primary" data-action="cover">${x.menu} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-impact aqd-impact--remote">${title(x.s6Kicker,x.s6Title,x.s6Accent,'')}${watch(x.watch6,true)}${action}</section>`;
  }
  const screen=state.mode!=='game'?landing():step===1?mission():step===2?selection(false):step===3?blindResult():step===4?explain():step===5?analysis():step===6?selection(true):step===7?results():impact();
  return `<main class="aqd-app ${state.mode==='game'?'aqd-app--game':'aqd-app--landing'} ${readonly?'aqd-app--readonly':''}">${screen}${cta()}</main>`;
 }
 function notice(language){return `<aside class="aqd-notice" role="status">${copy[language==='es'?'es':'en'].entered}</aside>`;}
 const tvCopy={
  en:{
   onTablet:'On the tablet',
   landingLead:'Artificial intelligence that shows where to inspect first.',
   landingCards:[['01','Information','The challenge, the solution and real results.'],['02','Interactive experience','A short game about how AI thinks.']],
   landingCta:'Choose an option on the tablet',
   infoCta:'When you are ready, press “Interactive experience” on the tablet',
   s1Kicker:'Water Detective',s1Title:'Can you find',s1Accent:'the water fraud?',
   s1Stats:[['8','contracts','on the water network'],['3','inspections','per round'],['2','rounds','blind, then with AI']],
   s1Insight:'Some hide irregularities. Without data, there are no clues.',s1Steps:[['Round 1 · Blind','Choose 3 contracts without any clue, like a traditional inspection.'],['How AI reads them','AquaData reads each contract’s consumption and calculates a risk score.'],['Round 2 · With AquaData','Choose again using the scores and compare both results.']],
   s2Kicker:'Round 1 · No data',s2Title:'Choose 3',s2Accent:'blind',s2Hint:'This is how a traditional inspection works: no clues.',
   f1Kicker:'Round 1 · Result',f1Title:'This is how',f1Accent:'a random inspection works',f1Of:'of 3 cases found',f1Insight:'What if AI showed where to look first?',
   e1Kicker:'How AI does it',e1Title:'This is how AI reads',e1Accent:'each contract',
   e1Notes:[['Consumption history','How the contract’s consumption has changed.'],['Risk score','How likely it is that there is fraud.']],
   s3Kicker:'AquaData at work',s3Title:'AquaData reads',s3Accent:'the data behind each contract',
   s3Captions:['It collects data the utility already has: billing, readings and inspections.','It reads the consumption history of each contract.','It detects patterns: a sudden change in consumption is a clue.','It calculates the risk score and ranks the contracts.'],
   s4Kicker:'Round 2 · With AquaData',s4Title:'Choose 3',s4Accent:'with risk scores',s4Hint:'A high score is not proof of fraud.',s4RankTitle:'Risk score: how likely an irregularity is',
   s5Kicker:'The result',s5Title:'Same contracts.',s5Accent:'A different way of looking.',
   s6Kicker:'Real case · EMCALI, Cali',s6Title:'More findings',s6Accent:'with the same effort',
   s6Facts:[['7×','higher detection in Cali'],['2×','findings in Monterrey and Urabá'],['17','water utilities in 7 countries']],
   selected:'Your inspections',
   cta:{mission:'Press “Start” on the tablet',pick:'Tap 3 contracts on the tablet',confirm:'Press “Confirm selection” on the tablet',feedback:'Press “See how AI does it” on the tablet',explain:'Press “Got it” on the tablet',analysis:'Press “Play on screen” on the tablet',analysisNext:'Press “Next step” on the tablet',analysisDone:'Press “Continue” on the tablet',results:'Press “Continue” to see the real case',impact:'Play again or go back to the menu'},
   simulation:'Educational simulation · fictional data'
  },
  es:{
   onTablet:'En la tableta',
   landingLead:'Inteligencia artificial que muestra dónde inspeccionar primero.',
   landingCards:[['01','Información','El reto, la solución y los resultados reales.'],['02','Experiencia interactiva','Un juego corto sobre cómo piensa la IA.']],
   landingCta:'Elige una opción en la tableta',
   infoCta:'Cuando estés listo, pulsa “Experiencia interactiva” en la tableta',
   s1Kicker:'Detective del Agua',s1Title:'¿Puedes encontrar',s1Accent:'el fraude de agua?',
   s1Stats:[['8','contratos','en la red de agua'],['3','inspecciones','por ronda'],['2','rondas','a ciegas y con IA']],
   s1Insight:'Algunos esconden irregularidades. Sin datos, no hay ninguna pista.',s1Steps:[['Ronda 1 · A ciegas','Elige 3 contratos sin ninguna pista, como una inspección tradicional.'],['Así lee la IA','AquaData lee el consumo de cada contrato y calcula un puntaje de riesgo.'],['Ronda 2 · Con AquaData','Elige de nuevo usando los puntajes y compara los dos resultados.']],
   s2Kicker:'Ronda 1 · Sin datos',s2Title:'Elige 3',s2Accent:'a ciegas',s2Hint:'Así trabaja una inspección tradicional: sin ninguna pista.',
   f1Kicker:'Ronda 1 · Resultado',f1Title:'Así funciona',f1Accent:'una inspección al azar',f1Of:'de 3 casos encontrados',f1Insight:'¿Y si la IA mostrara dónde mirar primero?',
   e1Kicker:'Cómo lo hace la IA',e1Title:'Así lee la IA',e1Accent:'cada contrato',
   e1Notes:[['Historial de consumo','Cómo ha cambiado el consumo del contrato.'],['Puntaje de riesgo','Qué tan probable es que haya fraude.']],
   s3Kicker:'AquaData en acción',s3Title:'AquaData lee',s3Accent:'los datos de cada contrato',
   s3Captions:['Reúne los datos que la empresa ya tiene: facturación, lecturas e inspecciones.','Lee el historial de consumo de cada contrato.','Detecta patrones: un cambio brusco de consumo es una pista.','Calcula el puntaje de riesgo y ordena los contratos.'],
   s4Kicker:'Ronda 2 · Con AquaData',s4Title:'Elige 3',s4Accent:'con puntajes de riesgo',s4Hint:'Un puntaje alto no es prueba de fraude.',s4RankTitle:'Puntaje de riesgo: qué tan probable es una irregularidad',
   s5Kicker:'El resultado',s5Title:'Mismos contratos.',s5Accent:'Distinta forma de mirar.',
   s6Kicker:'Caso real · EMCALI, Cali',s6Title:'Más hallazgos',s6Accent:'con el mismo esfuerzo',
   s6Facts:[['7×','más detección en Cali'],['2×','hallazgos en Monterrey y Urabá'],['17','empresas de agua en 7 países']],
   selected:'Tus inspecciones',
   cta:{mission:'Pulsa “Comenzar” en la tableta',pick:'Toca 3 contratos en la tableta',confirm:'Pulsa “Confirmar selección” en la tableta',feedback:'Pulsa “Ver cómo lo hace la IA” en la tableta',explain:'Pulsa “Entendido” en la tableta',analysis:'Pulsa “Ver en pantalla” en la tableta',analysisNext:'Pulsa “Siguiente paso” en la tableta',analysisDone:'Pulsa “Continuar” en la tableta',results:'Pulsa “Continuar” para ver el caso real',impact:'Vuelve a jugar o regresa al menú'},
   simulation:'Simulación educativa · datos ficticios'
  }
 };
 /* TV stage: not a mirror of the tablet. Each screen is a title, one main graphic, one line of insight
    and the call to action, so the story can be followed without looking at the tablet. */
 function renderTv(state,options){
  const {data,station=1}=options;
  const lang=state.language==='es'?'es':'en';
  const x=copy[lang],tv=tvCopy[lang];
  const step=Math.max(1,Math.min(LAST_STEP,Number(state.step)||1));
  const picks=step<=ANALYSIS_STEP?(state.p1||[]):(state.p2||[]);
  const chapter=CHAPTER[step];
  const name=c=>c.es;
  const full=picks.length===MAX_PICKS;
  const animate=fresh('tv',`${state.mode}:${step}`);
  const header=()=>{
   const steps=state.mode==='game'?`<ol class="aqd-steps" aria-hidden="true">${[1,2,3,4,5,6].map(n=>`<li class="${n===chapter?'is-current':n<chapter?'is-done':''}">${n}</li>`).join('')}</ol>`:'';
   return `<header class="aqd-header"><div class="aqd-brand"><img src="${logo}" width="216" height="44" alt="IDB Group"><span class="aqd-brand-divider" aria-hidden="true"></span><span class="aqd-brand-copy"><strong>${x.brand}</strong><small>${x.brandSub}</small></span></div>${steps}<div class="aqd-tools"><span class="aqd-station">${x.station} ${String(station).padStart(2,'0')}</span><span class="aqd-language aqd-language--readonly"><b aria-pressed="${lang==='es'}">ES</b><b aria-pressed="${lang==='en'}">EN</b></span></div></header>`;
  };
  const cta=(text,extra='')=>`<aside class="aqd-cta ${extra}" role="status"><span class="aqd-cta-icon">${icons.tablet}</span><span><small>${tv.onTablet}</small><strong>${text}</strong></span><i aria-hidden="true">${icons.arrow}</i></aside>`;
  const title=(kicker,plain,accent,lead='',joiner=' ')=>`<div class="aqd-title aqd-tv-title"><p class="aqd-kicker">${kicker}</p><h1>${plain}${joiner}<span>${accent}</span></h1>${lead?`<p class="aqd-lead">${lead}</p>`:''}</div>`;
  /* One short line of meaning under the main graphic. */
  const insight=(text,style='',mark=icons.bulb)=>`<p class="aqd-insight" ${style}><i aria-hidden="true">${mark}</i><span>${text}</span></p>`;
  /* Side panel of both rounds: how many inspections are chosen and which ones. */
  const picksPanel=(hint,mark)=>`<aside class="aqd-tv-picks" aria-live="polite"><p>${tv.selected}</p><strong>${picks.length}<small>/${MAX_PICKS}</small></strong>${slots(data,picks)}<span class="aqd-hint"><i aria-hidden="true">${mark}</i>${hint}</span><small>${tv.simulation}</small></aside>`;
  function landing(){
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-landing">${title(x.kicker,'Aqua','Data',tv.landingLead,'')}<div class="aqd-tv-options">${tv.landingCards.map(([n,t,b],i)=>`<article class="aqd-tv-option"><b>${n}</b><strong>${t}</strong><p>${b}</p><img src="${cardPhotos[i]}" alt="" aria-hidden="true"></article>`).join('')}</div></section>${cta(tv.landingCta)}`;
  }
  function mission(){
   const marks=[icons.building,icons.search,icons.replay];
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-mission">${title(tv.s1Kicker,tv.s1Title,tv.s1Accent)}<ul class="aqd-bigstats ${animate?'is-animated':''}">${tv.s1Stats.map(([n,t,b],i)=>`<li style="--i:${i}"><i aria-hidden="true">${marks[i]}</i><b>${n}</b><span><strong>${t}</strong><small>${b}</small></span></li>`).join('')}</ul><ol class="aqd-howto ${animate?'is-animated':''}">${tv.s1Steps.map(([t,b],i)=>`<li style="--i:${i}"><i aria-hidden="true">${[icons.search,icons.brain,icons.check][i]}<b>${i+1}</b></i><span><strong>${t}</strong><small>${b}</small></span></li>`).join('')}</ol>${insight(tv.s1Insight)}</section>${cta(tv.cta.mission)}`;
  }
  function manual(){
   const cards=data.contracts.map((c,i)=>`<li class="${picks.includes(c.id)?'is-selected':''}" style="--i:${i}"><img src="${photo(c)}" alt="" aria-hidden="true"><span><b>${c.id}</b>${esc(name(c))}</span><em aria-hidden="true">?</em><i aria-hidden="true">${icons.check}</i></li>`).join('');
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-round">${title(tv.s2Kicker,tv.s2Title,tv.s2Accent)}<ul class="aqd-tv-photos ${full?'is-full':''} ${animate?'is-animated':''}">${cards}</ul>${picksPanel(tv.s2Hint,'?')}</section>${cta(tv.cta[full?'confirm':'pick'])}`;
  }
  /* Round 1 outcome on the TV: the dice, the number and the three contracts that were inspected. */
  function blindResult(){
   const hits=(state.p1||[]).filter(id=>data.outcomes.get(id)===true).length;
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-feedback">${title(tv.f1Kicker,tv.f1Title,tv.f1Accent)}<div class="aqd-feedback ${animate?'is-animated':''}"><span class="aqd-dice" aria-hidden="true">${icons.dice}</span><p class="aqd-feedback-score"><b class="aqd-count" style="--to:${hits};--cd:.9s" aria-label="${hits}"></b><span>${tv.f1Of}</span><small>${tv.simulation}</small></p>${slots(data,state.p1||[])}</div>${insight(tv.f1Insight)}</section>${cta(tv.cta.feedback)}`;
  }
  /* How to read a card: the consumption line and the score, on an example contract. */
  function explain(){
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-explain">${title(tv.e1Kicker,tv.e1Title,tv.e1Accent)}<div class="aqd-explain ${animate?'is-animated':''}">${sample(x,animate)}<ol class="aqd-explain-notes">${tv.e1Notes.map(([head,body],i)=>`<li style="--i:${i}"><b>${i+1}</b><span><strong>${head}</strong><small>${body}</small></span></li>`).join('')}</ol></div>${insight(tv.s4Hint,'',icons.alert)}</section>${cta(tv.cta.explain)}`;
  }
  function analysis(){
   const act=Math.max(0,Math.min(4,Number(state.act)||0));
   const play=fresh('tv-act',`${step}:${act}:${state.take||0}`);
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-analysis">${title(tv.s3Kicker,tv.s3Title,tv.s3Accent)}<div class="aqd-agent-grid">${agent(x,act,play)}${scanGrid(data,x,act,play)}</div><div class="aqd-captions ${play?'is-animated':''}" role="status">${act?insight(tv.s3Captions[act-1],'',act):insight(x.s3Intro)}</div></section>${cta(tv.cta[act>=4?'analysisDone':act?'analysisNext':'analysis'])}`;
  }
  function withAi(){
   const ranked=[...data.contracts].sort((a,b)=>b.risk-a.risk);
   const rows=ranked.map((c,i)=>`<li class="${picks.includes(c.id)?'is-selected':''} aqd-risk--${riskLevel(c.risk)}" style="--i:${i}"><b>${i+1}</b><img src="${photo(c)}" alt="" aria-hidden="true"><span>${esc(name(c))}</span><i style="--value:${c.risk}"></i><em class="aqd-count" style="--to:${c.risk}" aria-label="${c.risk}"></em></li>`).join('');
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-round">${title(tv.s4Kicker,tv.s4Title,tv.s4Accent)}<div class="aqd-tv-ranking"><strong>${tv.s4RankTitle}</strong><ol class="${animate?'is-animated':''}">${rows}</ol></div>${picksPanel(tv.s4Hint,icons.alert)}</section>${cta(tv.cta[full?'confirm':'pick'])}`;
  }
  function results(){
   const found=list=>(list||[]).filter(id=>data.outcomes.get(id)===true).length;
   const r1=found(state.p1),r2=found(state.p2);
   const note=r2>r1?x.s5NoteMore:r2===r1?x.s5NoteSame:x.s5NoteLess;
   return `${header()}<section class="aqd-screen aqd-tv aqd-results">${title(tv.s5Kicker,tv.s5Title,tv.s5Accent)}<div class="aqd-compare ${animate?'is-animated':''}">${resultCard(data,state.p1,x.s5Without,'without',x)}<span class="aqd-vs" aria-hidden="true">vs.</span>${resultCard(data,state.p2,x.s5With,'with',x)}</div><p class="aqd-note">${note}<small>${tv.simulation}</small></p></section>${cta(tv.cta.results)}`;
  }
  function impact(){
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-impact">${title(tv.s6Kicker,tv.s6Title,tv.s6Accent)}<div class="aqd-impact-grid">${chart(x,lang,animate)}<ul class="aqd-facts ${animate?'is-animated':''}">${tv.s6Facts.map(([n,t],i)=>`<li style="--i:${i}"><b>${n}</b><span>${t}</span></li>`).join('')}</ul></div>${insight(x.s6Quote)}</section>${cta(tv.cta.impact)}`;
  }
  if(state.mode==='info')return cta(tv.infoCta,'aqd-cta--slim');
  const screen=state.mode!=='game'?landing():step===1?mission():step===2?manual():step===3?blindResult():step===4?explain():step===5?analysis():step===6?withAi():step===7?results():impact();
  return `<main class="aqd-app aqd-app--readonly aqd-app--tv">${screen}</main>`;
 }
 window.AQUADATA_VISUAL=Object.freeze({load,render,renderTv,notice,copy,MAX_PICKS});
})();
