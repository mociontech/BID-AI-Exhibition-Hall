/* AquaData shared visual shell (project 01). Renders the same branded screens on the
   tablet (interactive) and on the TV (read-only mirror with a call to action). */
(function(){
 const base=new URL('./',document.currentScript.src);
 const url=rel=>new URL(rel,base).href;
 const logo=url('aquadata/idb-group-white.svg');
 const cardPhotos=[url('aquadata/card-information.jpg'),url('aquadata/card-experience.jpg')];
 const dataRoot=url('AquaData_12_Imagenes_Ligeras_JPG/');
 const MAX_PICKS=3;
 /* Real EMCALI figures (documented case). Kept apart from the simulated game outcomes. */
 const EMCALI={reference:1.4,withAquaData:11.6};
 const copy={
  en:{
   brand:'AI in Action',brandSub:'IDB Group Projects Across the Region',home:'Home',station:'Station',onTablet:'On the tablet',
   kicker:'01 Infrastructure & Resilience',intro:'Artificial intelligence to help decide which water accounts to inspect first.',
   info:'Information',infoBody:'Explore the challenge, the solution, how AI works and its impact.',infoOnTv:'Information on the TV',
   game:'Interactive experience',gameBody:'Choose which accounts to inspect before and after AI prioritization.',
   entered:"You've entered the interactive experience",
   back:'Back',next:'Next',continue:'Continue',confirm:'Confirm inspections',pick:'Select 3 contracts',again:'Play again',menu:'Back to AquaData menu',
   s1Kicker:'Project 01 · The mission',s1Title:'Which contracts',s1Accent:'would you inspect first?',s1Body:'Eight contracts are waiting. You can inspect only three.',
   s1Contracts:'Contracts',s1ContractsBody:'Contracts without risk ranking',s1Visits:'Visits',s1VisitsBody:'Three field visits per campaign (example)',
   s2Kicker:'Round 1 · Decision without data',s2Title:'Select without',s2Accent:'artificial intelligence',s2Body:'You have 8 contracts and can inspect only 3. Trust your judgment.',
   s4Kicker:'Round 2 · Prioritisation with AI',s4Title:'Select with',s4Accent:'AquaData',s4Body:'Now you can consult the estimated risk scores. Which contracts would you inspect first?',
   selected:'Selected inspections',risk:'Risk',
   s3Title:'AquaData finds',s3Accent:'patterns in existing data',s3Body:'Existing records become a prioritised inspection list.',
   s3Inputs:[['Consumption history','Monthly readings and evolution'],['Billing','Company records'],['Past inspections','Known outcomes']],
   s3Model:'Machine-learning model',s3Working:'Analysing patterns…',s3Done:'Priority list ready',s3Rank:'RIR risk ranking',s3RankBody:'Suggested inspection order',
   s3Note:'A risk score is an estimate, not proof of fraud. Only on-site inspections can verify irregularities.',
   s5Title:'What did field',s5Accent:'inspectors find?',s5Body:'We compare your decisions after inspection.',s5Without:'Without AI',s5With:'With AquaData',
   found:'Irregularity found',clear:'No irregularity',
   s5NoteMore:'In this example, prioritisation finds more cases. It does not guarantee accuracy in every inspection.',
   s5NoteSame:'In this round both selections found the same number of cases. Prioritisation helps on average, not in every inspection.',
   s5NoteLess:'In this round your own judgment found more cases. Prioritisation improves the average, not every inspection.',
   s6Kicker:'Documented case · EMCALI, Cali',s6Title:'AI helps inspectors',s6Accent:'know where to start',s6Body:'A real example demonstrates the value of prioritising inspections.',
   s6Reference:'Reference',s6With:'With AquaData',s6Metric:'Detection rate in the field trial',
   s6Quote:'Artificial intelligence does not replace the inspector. It helps them know where to start.',s6QuoteBody:'With the same field capacity, a prioritised list can help find more irregularities.',
   s6Source:'Source: AquaData sheet, data presented at ANDESCO (September 2026).',simulation:'Educational simulation · fictional data',
   cta:{1:'Press “Next” on the tablet to start the mission',2:'Choose 3 contracts on the tablet, then confirm',2.5:'Press “Confirm inspections” on the tablet',3:'AquaData is analysing. Press “Continue” on the tablet',4:'Now use the risk scores: choose 3 contracts and confirm',5:'Compare both rounds. Press “Continue” on the tablet',6:'Play again or return to the menu from the tablet'}
  },
  es:{
   brand:'AI in Action',brandSub:'IDB Group Projects Across the Region',home:'Inicio',station:'Estación',onTablet:'En la tableta',
   kicker:'01 Infraestructura y resiliencia',intro:'Inteligencia artificial para decidir qué contratos de agua inspeccionar primero.',
   info:'Información',infoBody:'Conoce el problema, la solución, cómo funciona la IA y su impacto.',infoOnTv:'Información en la TV',
   game:'Experiencia interactiva',gameBody:'Elige qué contratos inspeccionar antes y después de la priorización con IA.',
   entered:'Has entrado a la experiencia interactiva',
   back:'Volver',next:'Siguiente',continue:'Continuar',confirm:'Confirmar inspecciones',pick:'Selecciona 3 contratos',again:'Volver a jugar',menu:'Volver al menú AquaData',
   s1Kicker:'Proyecto 01 · La misión',s1Title:'¿Qué contratos',s1Accent:'inspeccionarías primero?',s1Body:'Ocho contratos esperan. Solo puedes inspeccionar tres.',
   s1Contracts:'Contratos',s1ContractsBody:'Contratos sin ranking de riesgo',s1Visits:'Visitas',s1VisitsBody:'Tres visitas de campo por campaña (ejemplo)',
   s2Kicker:'Ronda 1 · Decisión sin datos',s2Title:'Selecciona sin',s2Accent:'inteligencia artificial',s2Body:'Tienes 8 contratos y solo puedes inspeccionar 3. Confía en tu criterio.',
   s4Kicker:'Ronda 2 · Priorización con IA',s4Title:'Selecciona con',s4Accent:'AquaData',s4Body:'Ahora puedes consultar los puntajes de riesgo estimados. ¿Qué contratos visitarías primero?',
   selected:'Inspecciones seleccionadas',risk:'Riesgo',
   s3Title:'AquaData encuentra',s3Accent:'patrones en los datos',s3Body:'Los registros existentes se convierten en una lista de prioridades.',
   s3Inputs:[['Historial de consumo','Lecturas y evolución mensual'],['Facturación','Registros de la empresa'],['Inspecciones previas','Resultados conocidos']],
   s3Model:'Modelo de aprendizaje automático',s3Working:'Analizando patrones…',s3Done:'Lista de prioridades lista',s3Rank:'Ranking de riesgo RIR',s3RankBody:'Orden sugerido de inspección',
   s3Note:'El puntaje de riesgo es una estimación, no una prueba de fraude. Solo la inspección en campo puede verificar una irregularidad.',
   s5Title:'¿Qué encontró el',s5Accent:'equipo de campo?',s5Body:'Comparamos tus decisiones después de inspeccionar.',s5Without:'Sin IA',s5With:'Con AquaData',
   found:'Irregularidad encontrada',clear:'Sin irregularidad',
   s5NoteMore:'En este ejemplo la priorización encuentra más casos. No garantiza aciertos en todas las inspecciones.',
   s5NoteSame:'En esta ronda ambas selecciones encontraron la misma cantidad de casos. La priorización ayuda en promedio, no en cada inspección.',
   s5NoteLess:'En esta ronda tu criterio encontró más casos. La priorización mejora el promedio, no cada inspección.',
   s6Kicker:'Caso documentado · EMCALI, Cali',s6Title:'La IA ayuda a saber',s6Accent:'dónde empezar',s6Body:'Un ejemplo real demuestra el valor de priorizar las inspecciones.',
   s6Reference:'Referencia',s6With:'Con AquaData',s6Metric:'Tasa de detección en prueba de campo',
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
  replay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 6v7"/><circle cx="12" cy="17.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  tablet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M12 17h.01"/></svg>',
  brain:'<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M52 22c-9-8-26-3-26 11-10 2-13 16-5 22-6 9 0 21 10 22 1 10 14 14 21 7V22Z"/><path d="M68 22c9-8 26-3 26 11 10 2 13 16 5 22 6 9 0 21-10 22-1 10-14 14-21 7V22Z"/><rect x="44" y="44" width="32" height="32" rx="6"/><path d="M52 44v-8m8 8v-8m8 8v-8M52 84v-8m8 8v-8m8 8v-8M44 52h-8m8 8h-8m8 8h-8M84 52h-8m8 8h-8m8 8h-8"/><circle cx="34" cy="34" r="3" fill="currentColor" stroke="none"/><circle cx="86" cy="34" r="3" fill="currentColor" stroke="none"/><circle cx="30" cy="70" r="3" fill="currentColor" stroke="none"/><circle cx="90" cy="70" r="3" fill="currentColor" stroke="none"/></svg>'
 };
 const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
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
  const step=Math.max(1,Math.min(6,Number(state.step)||1));
  const picks=step<=3?(state.p1||[]):(state.p2||[]);
  const found=list=>(list||[]).filter(id=>data.outcomes.get(id)===true).length;
  /* Business names stay in Spanish in both languages; only the business type is translated. */
  const name=c=>c.es;
  const type=c=>lang==='es'?c.esType:c.enType;
  const tag=readonly?'span':'button type="button"';
  const close=readonly?'span':'button';
  const backBtn=()=>readonly?'':`<button type="button" class="aqd-secondary" data-action="back">${icons.back} ${x.back}</button>`;
  function header(){
   const steps=state.mode==='game'?`<ol class="aqd-steps" aria-label="${esc(lang==='es'?'Etapas':'Stages')}">${[1,2,3,4,5,6].map(n=>`<li class="${n===step?'is-current':n<step?'is-done':''}" ${n===step?'aria-current="step"':''}>${n}</li>`).join('')}</ol>`:'';
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
  function contractCard(c,withRisk){
   const selected=picks.includes(c.id);
   const full=picks.length>=MAX_PICKS&&!selected;
   const level=c.risk>=60?'high':c.risk>=40?'mid':'low';
   return `<${tag} class="aqd-contract ${selected?'is-selected':''}" data-contract="${c.id}" aria-pressed="${selected}" ${full?'aria-disabled="true"':''}><span class="aqd-contract-photo"><img src="${dataRoot}negocios/${esc(c.asset)}.jpg" alt="" aria-hidden="true">${withRisk?`<span class="aqd-risk aqd-risk--${level}"><b>${c.risk}</b><small>${x.risk}</small></span>`:''}</span><span class="aqd-contract-id">${c.id} · ${esc(type(c))}</span><span class="aqd-contract-name">${esc(name(c))}</span><span class="aqd-contract-check" aria-hidden="true">${icons.check}</span></${close}>`;
  }
  function selection(withRisk){
   const count=picks.length,ready=count===MAX_PICKS;
   const head=withRisk?[x.s4Kicker,x.s4Title,x.s4Accent,x.s4Body]:[x.s2Kicker,x.s2Title,x.s2Accent,x.s2Body];
   const counter=`<output class="aqd-counter" aria-live="polite"><span>${x.selected}</span><strong>${count}/${MAX_PICKS}</strong></output>`;
   const action=readonly?'':`${backBtn()}<button type="button" class="aqd-primary" data-action="confirm" ${ready?'':'disabled aria-disabled="true"'}>${ready?x.confirm:x.pick} ${icons.arrow}</button>`;
   return `${header()}<section class="aqd-screen aqd-select"><div class="aqd-select-head">${title(...head)}${counter}</div><div class="aqd-contract-grid">${data.contracts.map(c=>contractCard(c,withRisk)).join('')}</div><footer class="aqd-actions"><span class="aqd-note aqd-note--inline">${x.simulation}</span>${action}</footer></section>`;
  }
  function mission(){
   const actions=readonly?'':`<footer class="aqd-actions aqd-actions--center"><button type="button" class="aqd-secondary" data-action="cover">${x.back}</button><button type="button" class="aqd-primary" data-action="next">${x.next} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-mission">${title(x.s1Kicker,x.s1Title,x.s1Accent,x.s1Body)}<div class="aqd-stats"><div class="aqd-stat"><b>08</b><span><strong>${x.s1Contracts}</strong><small>${x.s1ContractsBody}</small></span></div><div class="aqd-stat"><b>03</b><span><strong>${x.s1Visits}</strong><small>${x.s1VisitsBody}</small></span></div></div>${actions}</section>`;
  }
  function analysis(){
   const ready=!!state.analysisReady;
   const ranking=[...data.contracts].sort((a,b)=>b.risk-a.risk).slice(0,3);
   const action=readonly?'':`<footer class="aqd-actions">${backBtn()}<button type="button" class="aqd-primary" data-action="next" ${ready?'':'disabled aria-disabled="true" hidden'}>${x.continue} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-analysis ${ready?'is-ready':''}">${title('',x.s3Title,x.s3Accent,x.s3Body)}<div class="aqd-analysis-grid"><div class="aqd-inputs">${x.s3Inputs.map(([a,b])=>`<div class="aqd-input"><strong>${a}</strong><small>${b}</small></div>`).join('')}</div><div class="aqd-model"><span class="aqd-model-icon">${icons.brain}</span><strong>${x.s3Model}</strong><span class="aqd-progress" role="progressbar" aria-label="${esc(x.s3Model)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${ready?100:0}"><i></i></span><em aria-live="polite">${ready?x.s3Done:x.s3Working}</em></div><div class="aqd-ranking"><strong>${x.s3Rank}</strong><small>${x.s3RankBody}</small><ol>${ranking.map((c,i)=>`<li><b>0${i+1}</b><span>${c.id} ${esc(type(c))}</span><i>${c.risk}</i></li>`).join('')}</ol></div></div><p class="aqd-note">${x.s3Note}</p>${action}</section>`;
  }
  function results(){
   const r1=found(state.p1),r2=found(state.p2);
   const note=r2>r1?x.s5NoteMore:r2===r1?x.s5NoteSame:x.s5NoteLess;
   const list=ids=>`<ul>${[...(ids||[])].sort().map(id=>{const hit=data.outcomes.get(id)===true;return `<li class="${hit?'is-found':''}"><b>${id}</b><i aria-hidden="true">${hit?icons.alert:icons.check}</i><span>${hit?x.found:x.clear}</span></li>`;}).join('')}</ul>`;
   const action=readonly?'':`<footer class="aqd-actions">${backBtn()}<button type="button" class="aqd-primary" data-action="next">${x.continue} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-results">${title('',x.s5Title,x.s5Accent,x.s5Body)}<div class="aqd-compare"><article class="aqd-result aqd-result--without"><h2>${x.s5Without}</h2><p class="aqd-score"><b>${r1}</b>/${MAX_PICKS}</p>${list(state.p1)}</article><span class="aqd-vs" aria-hidden="true">vs.</span><article class="aqd-result aqd-result--with"><h2>${x.s5With}</h2><p class="aqd-score"><b>${r2}</b>/${MAX_PICKS}</p>${list(state.p2)}</article></div><p class="aqd-note">${note}<small>${x.simulation}</small></p>${action}</section>`;
  }
  function impact(){
   const fmt=v=>lang==='es'?String(v).replace('.',',')+' %':v+' %';
   const scale=v=>Math.round(v/EMCALI.withAquaData*100);
   const action=readonly?'':`<footer class="aqd-actions">${backBtn()}<button type="button" class="aqd-secondary" data-action="restart">${icons.replay} ${x.again}</button><button type="button" class="aqd-primary" data-action="cover">${x.menu} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-impact">${title(x.s6Kicker,x.s6Title,x.s6Accent,x.s6Body)}<div class="aqd-impact-grid"><figure class="aqd-chart" aria-label="${esc(x.s6Metric)}"><div class="aqd-bars"><div class="aqd-bar aqd-bar--reference" style="--value:${scale(EMCALI.reference)}"><b>${fmt(EMCALI.reference)}</b><i></i><span>${x.s6Reference}</span></div><div class="aqd-bar aqd-bar--aquadata" style="--value:${scale(EMCALI.withAquaData)}"><b>${fmt(EMCALI.withAquaData)}</b><i></i><span>${x.s6With}</span></div></div><figcaption>${x.s6Metric}<small>${x.s6Source}</small></figcaption></figure><aside class="aqd-quote"><strong>${x.s6Quote}</strong><p>${x.s6QuoteBody}</p></aside></div>${action}</section>`;
  }
  const screen=state.mode!=='game'?landing():step===1?mission():step===2?selection(false):step===3?analysis():step===4?selection(true):step===5?results():impact();
  return `<main class="aqd-app ${state.mode==='game'?'aqd-app--game':'aqd-app--landing'} ${readonly?'aqd-app--readonly':''}">${screen}${cta()}</main>`;
 }
 function notice(language){return `<aside class="aqd-notice" role="status">${copy[language==='es'?'es':'en'].entered}</aside>`;}
 const tvCopy={
  en:{
   onTablet:'On the tablet',
   landingTitle:'Artificial intelligence to decide',landingAccent:'which water accounts to inspect first',
   landingBody:'AquaData uses machine learning to help water utilities decide which accounts to inspect first. With billing and meter-reading data they already have, it assigns each account a fraud-risk score.',
   landingCards:[['01','Information','See the technical sheet on this screen: the challenge, how AquaData works and its real results.'],['02','Interactive experience','Play the inspector. First decide without data, then with AquaData, and compare what the field team found.']],
   landingCta:'Choose “Information” or “Interactive experience” on the tablet',
   infoKicker:'About the project',infoTitle:'AquaData',
   infoBody:'AquaData uses machine learning to help water utilities decide which accounts to inspect first. Using billing and meter-reading data they already have, it assigns each account a fraud-risk score. With the same field crews, utilities find more irregularities: in Cali, detection rose from 1.4% to 11.6%.',
   infoFacts:[['>40%','of the water produced in the region is lost as non-revenue water'],['17','water utilities in 7 countries have worked with AquaData'],['7×','higher detection in the Cali field test']],
   infoCta:'When you are ready, press “Interactive experience” on the tablet',
   s1Kicker:'The challenge · Your mission',s1Title:'A utility cannot inspect',s1Accent:'every account',
   s1Body:'A water utility may have hundreds of thousands of accounts, but its crews can only visit a few hundred per campaign. More than 40% of the water produced in the region is lost without being billed, largely through unauthorized connections and tampered meters.',
   s1Steps:[['1','Decide without data','Pick 3 of 8 contracts using only your judgment.'],['2','Let AquaData analyse','The model turns existing records into a risk ranking.'],['3','Decide with AquaData','Pick 3 contracts again, now with risk scores.'],['4','Compare the findings','See what the field team found in each round.']],
   s2Kicker:'Round 1 · Decide manually',s2Title:'How do utilities choose',s2Accent:'without data?',
   s2Body:'Today many crews choose whom to inspect by intuition, by complaints or by routine. Without data, they spend visits that find nothing and leave the highest-risk cases unchecked. Try it yourself: which 3 of these 8 contracts would you visit?',
   s2Hint:'Trust your judgment. No risk scores are shown in this round.',
   s3Kicker:'AquaData at work',s3Title:'The data the utility',s3Accent:'already has',
   s3Body:'AquaData does not need new sensors. It uses billing records, meter readings and past inspections, assigns each account a risk score and produces a Risk Index Report: a ranked list showing which accounts to visit first. It does not penalize anyone; the inspector still verifies every case.',
   s3Steps:[['Collect data','Billing, meter readings and previous inspections.'],['AI analyses','Finds patterns and assigns a risk score to each account.'],['Risk Index Report','A ranked list of which accounts to visit first.'],['People verify','Inspectors confirm in the field. The decision stays with the utility.']],
   s4Kicker:'Round 2 · Decide with AquaData',s4Title:'A ranked list says',s4Accent:'where to start',
   s4Body:'Now the tablet shows the estimated risk score of each contract. A high score does not confirm fraud: it is the model’s estimate of where an inspection is most likely to find something. Which 3 contracts would you visit now?',
   s4RankTitle:'Risk Index Report (simulated)',
   s5Kicker:'Field verification',s5Title:'What did the',s5Accent:'field team find?',
   s5Body:'Irregularities are only confirmed after the visit. Compare both rounds: with the same three visits, a prioritised list can help find more irregularities.',
   s6Kicker:'Real results',s6Title:'Seven times more findings',s6Accent:'with the same crews',
   s6Body:'AquaData has worked with 17 water utilities in seven countries: Colombia, Mexico, Ecuador, Guatemala, Uruguay, Brazil and Argentina. In Cali, the detection rate in a field test rose from 1.4% to 11.6%. In Monterrey and in the Urabá region, findings doubled.',
   s6Facts:[['1.4% → 11.6%','Detection rate in Cali, seven times higher'],['2×','Findings in Monterrey and Urabá'],['17','Utilities in 7 countries']],
   s6Quote:'With the data that already exists, artificial intelligence helps reach first the places where it is needed most. The final decision always rests with the utility.',
   selected:'Selected on the tablet',picked:'picked',ofThree:'of 3',
   cta:{1:'Press “Next” on the tablet to start the mission',2:'Tap 3 contracts on the tablet',2.5:'Press “Confirm inspections” on the tablet',3:'Wait for the analysis, then press “Continue” on the tablet',4:'Use the risk scores: tap 3 contracts on the tablet',5:'Press “Continue” on the tablet to see the real case',6:'Press “Play again” or “Back to AquaData menu” on the tablet'},
   simulation:'Educational simulation · fictional contracts and outcomes',source:'Source: AquaData sheet, data presented at ANDESCO (September 2026).'
  },
  es:{
   onTablet:'En la tableta',
   landingTitle:'Inteligencia artificial para decidir',landingAccent:'qué contratos de agua inspeccionar primero',
   landingBody:'AquaData usa aprendizaje automático para ayudar a las empresas de agua a decidir qué contratos inspeccionar primero. Con datos de facturación y lecturas que ya existen, asigna un puntaje de riesgo de fraude a cada contrato.',
   landingCards:[['01','Información','Mira la ficha técnica en esta pantalla: el reto, cómo funciona AquaData y sus resultados reales.'],['02','Experiencia interactiva','Juega a ser inspector. Primero decide sin datos, luego con AquaData, y compara lo que encontró el equipo de campo.']],
   landingCta:'Elige “Información” o “Experiencia interactiva” en la tableta',
   infoKicker:'Sobre el proyecto',infoTitle:'AquaData',
   infoBody:'AquaData usa aprendizaje automático para ayudar a las empresas de agua a decidir qué contratos inspeccionar primero. Con datos de facturación y lecturas que ya existen, asigna un puntaje de riesgo de fraude a cada contrato. Con el mismo equipo de campo se detectan más irregularidades: en Cali, la detección pasó de 1,4% a 11,6%.',
   infoFacts:[['>40%','del agua producida en la región se pierde como agua no contabilizada'],['17','empresas de agua en 7 países han trabajado con AquaData'],['7×','más detección en la prueba de campo de Cali']],
   infoCta:'Cuando estés listo, pulsa “Experiencia interactiva” en la tableta',
   s1Kicker:'El reto · Tu misión',s1Title:'Una empresa no puede inspeccionar',s1Accent:'todos los contratos',
   s1Body:'Una empresa de agua puede tener cientos de miles de contratos, pero sus cuadrillas solo alcanzan a visitar unos cientos por campaña. Más del 40% del agua producida en la región se pierde sin poder cobrarla, en buena parte por conexiones no autorizadas y medidores manipulados.',
   s1Steps:[['1','Decide sin datos','Elige 3 de 8 contratos solo con tu criterio.'],['2','Deja que AquaData analice','El modelo convierte los registros existentes en un ranking de riesgo.'],['3','Decide con AquaData','Elige 3 contratos otra vez, ahora con puntajes de riesgo.'],['4','Compara los hallazgos','Mira qué encontró el equipo de campo en cada ronda.']],
   s2Kicker:'Ronda 1 · Decide manualmente',s2Title:'¿Cómo eligen las empresas',s2Accent:'sin datos?',
   s2Body:'Hoy muchas cuadrillas eligen a quién inspeccionar por intuición, por quejas o por rutina. Sin datos, gastan visitas que no encuentran nada y dejan sin revisar los casos con más probabilidad de irregularidad. Pruébalo: ¿cuáles 3 de estos 8 contratos visitarías?',
   s2Hint:'Confía en tu criterio. Esta ronda no muestra puntajes de riesgo.',
   s3Kicker:'AquaData en acción',s3Title:'Los datos que la empresa',s3Accent:'ya tiene',
   s3Body:'AquaData no requiere sensores nuevos. Usa la facturación, las lecturas de los medidores y las inspecciones anteriores, asigna a cada contrato un puntaje de riesgo y genera un Reporte de Índice de Riesgo: una lista ordenada que indica a qué contratos conviene ir primero. No sanciona a nadie; el inspector sigue verificando cada caso.',
   s3Steps:[['Reúne datos','Facturación, lecturas de medidores e inspecciones previas.'],['La IA analiza','Encuentra patrones y asigna un puntaje de riesgo a cada contrato.'],['Reporte de Índice de Riesgo','Una lista ordenada de a qué contratos ir primero.'],['Las personas verifican','El inspector confirma en terreno. La decisión es de la empresa.']],
   s4Kicker:'Ronda 2 · Decide con AquaData',s4Title:'Una lista ordenada dice',s4Accent:'por dónde empezar',
   s4Body:'Ahora la tableta muestra el puntaje de riesgo estimado de cada contrato. Un puntaje alto no confirma fraude: es la estimación del modelo sobre dónde es más probable que una inspección encuentre algo. ¿Cuáles 3 contratos visitarías ahora?',
   s4RankTitle:'Reporte de Índice de Riesgo (simulado)',
   s5Kicker:'Verificación en campo',s5Title:'¿Qué encontró el',s5Accent:'equipo de campo?',
   s5Body:'Las irregularidades solo se confirman después de la visita. Compara las dos rondas: con las mismas tres visitas, una lista priorizada puede ayudar a encontrar más irregularidades.',
   s6Kicker:'Resultados reales',s6Title:'Siete veces más hallazgos',s6Accent:'con el mismo equipo',
   s6Body:'AquaData ha trabajado con 17 empresas de agua en siete países: Colombia, México, Ecuador, Guatemala, Uruguay, Brasil y Argentina. En Cali, la tasa de detección en una prueba de campo pasó de 1,4% a 11,6%. En Monterrey y en la región de Urabá, los hallazgos se duplicaron.',
   s6Facts:[['1,4% → 11,6%','Tasa de detección en Cali, siete veces más'],['2×','Hallazgos en Monterrey y Urabá'],['17','Empresas en 7 países']],
   s6Quote:'Con los datos que ya existen, la inteligencia artificial ayuda a llegar primero a donde más se necesita. La decisión final siempre es de la empresa.',
   selected:'Seleccionados en la tableta',picked:'elegidos',ofThree:'de 3',
   cta:{1:'Pulsa “Siguiente” en la tableta para comenzar la misión',2:'Toca 3 contratos en la tableta',2.5:'Pulsa “Confirmar inspecciones” en la tableta',3:'Espera el análisis y pulsa “Continuar” en la tableta',4:'Usa los puntajes de riesgo: toca 3 contratos en la tableta',5:'Pulsa “Continuar” en la tableta para ver el caso real',6:'Pulsa “Volver a jugar” o “Volver al menú AquaData” en la tableta'},
   simulation:'Simulación educativa · contratos y hallazgos ficticios',source:'Fuente: ficha de AquaData, datos presentados en ANDESCO (septiembre de 2026).'
  }
 };
 /* TV guide: not a mirror of the tablet. Explains each stage and tells visitors what to press. */
 function renderTv(state,options){
  const {data,station=1}=options;
  const lang=state.language==='es'?'es':'en';
  const x=copy[lang],tv=tvCopy[lang];
  const step=Math.max(1,Math.min(6,Number(state.step)||1));
  const picks=step<=3?(state.p1||[]):(state.p2||[]);
  const name=c=>c.es,type=c=>lang==='es'?c.esType:c.enType;
  const found=list=>(list||[]).filter(id=>data&&data.outcomes.get(id)===true).length;
  const header=()=>{
   const steps=state.mode==='game'?`<ol class="aqd-steps" aria-hidden="true">${[1,2,3,4,5,6].map(n=>`<li class="${n===step?'is-current':n<step?'is-done':''}">${n}</li>`).join('')}</ol>`:'';
   return `<header class="aqd-header"><div class="aqd-brand"><img src="${logo}" width="216" height="44" alt="IDB Group"><span class="aqd-brand-divider" aria-hidden="true"></span><span class="aqd-brand-copy"><strong>${x.brand}</strong><small>${x.brandSub}</small></span></div>${steps}<div class="aqd-tools"><span class="aqd-station">${x.station} ${String(station).padStart(2,'0')}</span><span class="aqd-language aqd-language--readonly"><b aria-pressed="${lang==='es'}">ES</b><b aria-pressed="${lang==='en'}">EN</b></span></div></header>`;
  };
  const cta=(text,extra='')=>`<aside class="aqd-cta ${extra}" role="status"><span class="aqd-cta-icon">${icons.tablet}</span><span><small>${tv.onTablet}</small><strong>${text}</strong></span><i aria-hidden="true">${icons.arrow}</i></aside>`;
  const title=(kicker,plain,accent,body)=>`<div class="aqd-title aqd-tv-title">${kicker?`<p class="aqd-kicker">${kicker}</p>`:''}<h1>${plain} <span>${accent}</span></h1>${body?`<p class="aqd-lead">${body}</p>`:''}</div>`;
  const live=()=>{
   const chips=data?data.contracts.filter(c=>picks.includes(c.id)).map(c=>`<li>${icons.check}<b>${c.id}</b> ${esc(name(c))}</li>`).join(''):'';
   const empty=picks.length?'':`<li class="is-empty">—</li>`;
   return `<aside class="aqd-live" aria-live="polite"><p>${tv.selected}</p><strong>${picks.length}<small>/${MAX_PICKS}</small></strong><ul>${chips}${empty}</ul></aside>`;
  };
  function landing(){
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-landing">${title(x.kicker,tv.landingTitle,tv.landingAccent,tv.landingBody)}<div class="aqd-tv-options">${tv.landingCards.map(([n,t,b],i)=>`<article class="aqd-tv-option"><b>${n}</b><strong>${t}</strong><p>${b}</p><img src="${cardPhotos[i]}" alt="" aria-hidden="true"></article>`).join('')}</div></section>${cta(tv.landingCta)}`;
  }
  function infoPanel(){
   return cta(tv.infoCta,'aqd-cta--slim');
  }
  function mission(){
   return `${header()}<section class="aqd-screen aqd-tv">${title(tv.s1Kicker,tv.s1Title,tv.s1Accent,tv.s1Body)}<ol class="aqd-tv-steps">${tv.s1Steps.map(([n,t,b])=>`<li><b>${n}</b><strong>${t}</strong><span>${b}</span></li>`).join('')}</ol></section>${cta(tv.cta[1])}`;
  }
  function manual(){
   const key=picks.length===MAX_PICKS?2.5:2;
   const cards=data?data.contracts.map(c=>`<li class="${picks.includes(c.id)?'is-selected':''}"><img src="${dataRoot}negocios/${esc(c.asset)}.jpg" alt="" aria-hidden="true"><span><b>${c.id} · ${esc(type(c))}</b>${esc(name(c))}</span><i aria-hidden="true">${icons.check}</i></li>`).join(''):'';
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-split">${title(tv.s2Kicker,tv.s2Title,tv.s2Accent,tv.s2Body)}<div class="aqd-tv-side">${live()}<p class="aqd-note">${tv.s2Hint}<small>${tv.simulation}</small></p></div><ul class="aqd-tv-contracts">${cards}</ul></section>${cta(tv.cta[key])}`;
  }
  function analysis(){
   return `${header()}<section class="aqd-screen aqd-tv">${title(tv.s3Kicker,tv.s3Title,tv.s3Accent,tv.s3Body)}<ol class="aqd-tv-pipeline">${tv.s3Steps.map(([t,b],i)=>`<li><b>${i+1}</b><strong>${t}</strong><span>${b}</span></li>`).join('')}</ol><div class="aqd-model aqd-model--tv"><span class="aqd-progress"><i></i></span><em>${x.s3Working}</em></div></section>${cta(tv.cta[3])}`;
  }
  function withAi(){
   const key=picks.length===MAX_PICKS?2.5:4;
   const ranked=data?[...data.contracts].sort((a,b)=>b.risk-a.risk):[];
   const rows=ranked.map((c,i)=>`<li class="${picks.includes(c.id)?'is-selected':''} aqd-risk--${c.risk>=60?'high':c.risk>=40?'mid':'low'}"><b>0${i+1}</b><span>${c.id} · ${esc(name(c))}</span><i style="--value:${c.risk}"></i><em>${c.risk}</em></li>`).join('');
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-split">${title(tv.s4Kicker,tv.s4Title,tv.s4Accent,tv.s4Body)}<div class="aqd-tv-side">${live()}<p class="aqd-note">${x.s3Note}<small>${tv.simulation}</small></p></div><div class="aqd-tv-ranking"><strong>${tv.s4RankTitle}</strong><ol>${rows}</ol></div></section>${cta(tv.cta[key])}`;
  }
  function results(){
   const r1=found(state.p1),r2=found(state.p2);
   const note=r2>r1?x.s5NoteMore:r2===r1?x.s5NoteSame:x.s5NoteLess;
   const list=ids=>`<ul>${[...(ids||[])].sort().map(id=>{const hit=data&&data.outcomes.get(id)===true;return `<li class="${hit?'is-found':''}"><b>${id}</b><i aria-hidden="true">${hit?icons.alert:icons.check}</i><span>${hit?x.found:x.clear}</span></li>`;}).join('')}</ul>`;
   return `${header()}<section class="aqd-screen aqd-tv aqd-results">${title(tv.s5Kicker,tv.s5Title,tv.s5Accent,tv.s5Body)}<div class="aqd-compare"><article class="aqd-result aqd-result--without"><h2>${x.s5Without}</h2><p class="aqd-score"><b>${r1}</b>/${MAX_PICKS}</p>${list(state.p1)}</article><span class="aqd-vs" aria-hidden="true">vs.</span><article class="aqd-result aqd-result--with"><h2>${x.s5With}</h2><p class="aqd-score"><b>${r2}</b>/${MAX_PICKS}</p>${list(state.p2)}</article></div><p class="aqd-note">${note}<small>${tv.simulation}</small></p></section>${cta(tv.cta[5])}`;
  }
  function impact(){
   return `${header()}<section class="aqd-screen aqd-tv">${title(tv.s6Kicker,tv.s6Title,tv.s6Accent,tv.s6Body)}<ul class="aqd-facts aqd-facts--big">${tv.s6Facts.map(([n,t])=>`<li><b>${n}</b><span>${t}</span></li>`).join('')}</ul><aside class="aqd-quote"><strong>${tv.s6Quote}</strong><p>${tv.source}</p></aside></section>${cta(tv.cta[6])}`;
  }
  if(state.mode==='info')return infoPanel();
  const screen=state.mode!=='game'?landing():step===1?mission():step===2?manual():step===3?analysis():step===4?withAi():step===5?results():impact();
  return `<main class="aqd-app aqd-app--readonly aqd-app--tv">${screen}</main>`;
 }
 window.AQUADATA_VISUAL=Object.freeze({load,render,renderTv,notice,copy,MAX_PICKS});
})();
