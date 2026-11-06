/* Presentation of a fictional educational case, never a model output. */
(function(){
 const copy={
 "es": {
  "home": "Home",
  "menu": "Volver al menú",
  "fullscreen": "Pantalla completa",
  "info": "Información",
  "game": "Minijuego",
  "explore": "Explorar minijuego",
  "locked": "Activa primero la información",
  "playing": "Información en la TV",
  "ready": "Minijuego disponible",
  "watch": "Mira la pantalla principal",
  "tag": "INTELIGENCIA PARA LA GESTIÓN DE RIESGOS",
  "headline": "Descubre el riesgo antes de que crezca",
  "intro": "La inteligencia artificial conecta la información, identifica señales y ayuda a los especialistas a anticipar riesgos.",
  "sim": "Simulación educativa · Caso ficticio",
  "sources": [
   "Propuestas de inversión",
   "Reportes de supervisión",
   "Datos financieros",
   "Fuentes externas relevantes"
  ],
  "capTitle": "Tres capacidades complementarias",
  "caps": [
   "Analizar propuestas de inversión",
   "Sintetizar reportes y destacar hallazgos",
   "Apoyar la anticipación de riesgos"
  ],
  "capBodies": [
   "Clasificación y resúmenes estructurados.",
   "ASR y Aide Memoire: información relevante y posibles señales de deterioro.",
   "Integra datos financieros, documentos y fuentes externas para apoyar la identificación de posibles riesgos de impago o deterioro crediticio."
  ],
  "dashboard": "De información compleja a señales para una mejor evaluación del riesgo",
  "concept": "Dashboard conceptual",
  "review": "Señal detectada: requiere revisión del especialista",
  "human": "La IA apoya el análisis. El especialista evalúa la información.",
  "summary": "Resumen ejecutivo",
  "report": "Reporte de supervisión",
  "findings": [
   "Retraso de cuatro meses en el cronograma",
   "Recepción periódica del reporte",
   "Permisos sin novedades críticas"
  ],
  "toSpecialist": "Información organizada para consultar y priorizar",
  "infoDesc": "Descubre cómo funciona en la pantalla principal.",
  "gameDesc": "Conecta la información y detecta una señal en Proyecto Aurora.",
  "inputs": [
   "Datos financieros",
   "Documentos",
   "Fuentes externas"
  ],
  "back": "Volver a proyectos"
 },
 "en": {
  "home": "Home",
  "menu": "Back to menu",
  "fullscreen": "Fullscreen",
  "info": "Information",
  "game": "Minigame",
  "explore": "Explore minigame",
  "locked": "Start the information experience first",
  "playing": "Information playing on the TV",
  "ready": "Minigame available",
  "watch": "Look at the main display",
  "tag": "INTELLIGENCE FOR RISK MANAGEMENT",
  "headline": "Discover risk before it grows",
  "intro": "Artificial intelligence connects information, identifies signals and helps specialists anticipate risks.",
  "sim": "Educational simulation · Fictional case",
  "sources": [
   "Investment proposals",
   "Supervision reports",
   "Financial data",
   "Relevant external sources"
  ],
  "capTitle": "Three complementary capabilities",
  "caps": [
   "Analyze investment proposals",
   "Summarize reports and highlight findings",
   "Support risk anticipation"
  ],
  "capBodies": [
   "Classification and structured summaries.",
   "ASR and Aide Memoire: relevant information and potential signs of risk deterioration.",
   "Combines financial data, documents and external sources to support identification of potential default or downgrade risks."
  ],
  "dashboard": "From complex information to signals for better risk assessment",
  "concept": "Conceptual dashboard",
  "review": "Signal detected: specialist review required",
  "human": "AI supports analysis. The specialist evaluates the information.",
  "summary": "Executive summary",
  "report": "Supervision report",
  "findings": [
   "A four-month delay in the schedule",
   "Periodic receipt of the report",
   "No critical permit updates"
  ],
  "toSpecialist": "Organized information to consult and prioritize",
  "infoDesc": "Discover how it works on the main display.",
  "gameDesc": "Choose a proposal, review the evidence and decide as a risk officer.",
  "inputs": [
   "Financial data",
   "Documents",
   "External sources"
  ],
  "back": "Back to projects"
 }
};
 const icon=(name)=>{
  const paths={doc:'M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6',signal:'M4 20V12 M9 20V8 M14 20V4 M19 20V10',link:'M8 7h8 M8 17h8 M12 7v10 M3 4h5v6H3z M16 4h5v6h-5z M8 15h8v6H8z',check:'M5 12l4 4L19 6',sun:'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10 M12 1v3 M12 20v3 M1 12h3 M20 12h3 M4 4l2 2 M18 18l2 2 M20 4l-2 2 M6 18l-2 2'};
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.doc}"/></svg>`;
 };
 const card=(title,body='',i='doc',extra='')=>`<article class="rise-card ${extra}"><span class="rise-icon">${icon(i)}</span><h3>${title}</h3>${body?`<p>${body}</p>`:''}</article>`;
 const capabilities=c=>`<div class="rise-grid">${c.caps.map((t,i)=>card(t,c.capBodies[i],['doc','link','signal'][i])).join('')}</div>`;
 const network=c=>`<div class="rise-network"><div class="rise-inputs">${c.inputs.map((t,i)=>card(t,'',['signal','doc','link'][i])).join('')}</div><div class="rise-converge" aria-hidden="true"><span></span><b>RISE</b><span></span></div><article class="rise-alert">${icon('signal')}<h2>${c.review}</h2><p>${c.human}</p></article></div>`;
 const report=(c,g)=>`<div class="rise-grid rise-findings">${[1,0,2].map(i=>card(c.findings[i],i===0&&g.correct?c.correct2:'',i===0?'signal':'doc',i===0&&g.correct?'is-signal':'')).join('')}</div>`;
 function renderDisplay(mount,data){
  if(['game','results'].includes(data.mode))return RISE_GAME.renderDisplay(mount,data);
  RISE_GAME.stopDisplay();
  const lang=data.language==='es'?'es':'en',c=copy[lang],g=RISE_STATE.sanitize(data.game)||RISE_STATE.fresh();
  document.documentElement.lang=lang;
  let body='',label=c.tag;
  if(data.mode==='info'||data.mode==='cta'){
   const elapsed=Math.max(0,((window.AI_SYNC?.now()||Date.now())-g.infoStartedAt)/1000);
   body=`<div class="rise-scenes" style="--elapsed:-${elapsed}s"><section class="rise-scene"><p class="rise-kicker">01 / ${c.info}</p><h1>${c.challenge}</h1><div class="rise-sources">${c.sources.map(t=>card(t)).join('')}</div><div class="rise-hub">${icon('link')} RSM RISE</div></section><section class="rise-scene"><p class="rise-kicker">02 / RSM RISE</p><h1>${c.capTitle}</h1>${capabilities(c)}</section><section class="rise-scene"><p class="rise-kicker">03 / ${c.concept}</p><h1>${c.dashboard}</h1><div class="rise-dashboard"><div>${card(c.summary,c.toSpecialist)}${card(c.report,c.findings[0],'signal')}</div><article class="rise-alert">${icon('signal')}<h2>${c.review}</h2><p>${c.human}</p></article></div></section></div>`;
  }else body=`<div class="rise-tv-hero"><section><p class="rise-kicker">11 · RSM RISE</p><h1>${c.headline}</h1><p class="rise-lead">${c.intro}</p><p class="rise-human">${c.human}</p></section>${network(c)}</div>`;
  mount.innerHTML=`<main class="rise rise-display"><header class="rise-header"><b>11 <span>RSM RISE</span></b><span>Risk Intelligence & Strategy Engine</span></header><section class="rise-stage">${body}</section><footer><span>${label}</span><span>BID Invest · AI Exhibition Hall</span></footer></main>`;
 }
 window.RSM_RISE={copy,icon,card,network,renderDisplay};
})();
