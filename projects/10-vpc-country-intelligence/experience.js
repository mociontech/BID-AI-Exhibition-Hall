(function(){
 const model=window.COUNTRY_STATE;
 let displayTimer=null;
 const text=(en,es,language)=>language==='es'?es:en;
 function view(state,role,now){
  const visual=model.visual(state,now);
  if(state.screen==='info')return infographic(state.language);
  if(state.screen==='menu')visual.sc='ficha';
  const result=window.COUNTRY_PROTOTYPE(visual,role);
  return `<div class="${result.className}">${window.COUNTRY_TRANSLATE(result.html,state.language)}</div>`;
 }
 function header(state,display=false){const lang=state.language;return `<header class="ci-shell"><strong>10 <span>· ${text('Country Intelligence','Inteligencia País',lang)}</span></strong>${display?`<span>${text('Controlled from the tablet','Control desde la tableta',lang)}</span>`:`<nav aria-label="${text('Navigation','Navegación',lang)}"><button data-home>${text('Home','Inicio',lang)}</button><button data-menu>${text('Project menu','Menú del proyecto',lang)}</button><button data-fullscreen aria-label="${text('Fullscreen','Pantalla completa',lang)}">⛶</button><button data-language="es" aria-pressed="${lang==='es'}">ES</button><button data-language="en" aria-pressed="${lang==='en'}">EN</button></nav>`}</header>`;}
 function finalMessage(lang){return text('AI connects the information. You decide how to transform the country.','La IA conecta la información. Tú decides cómo transformar el país.',lang);}
 function infographic(lang){
  const capabilities=[
   [text('Design the strategy','Diseñar la estrategia',lang),text('Connect national priorities, diagnostics and portfolio evidence to identify where to focus.','Conectar prioridades nacionales, diagnósticos y evidencia de la cartera para identificar dónde concentrarse.',lang)],
   [text('Program the offer','Programar la oferta',lang),text('Read budget, regulation, community and partner signals to explore opportunities.','Relacionar señales de presupuesto, regulación, comunidades y socios para explorar oportunidades.',lang)],
   [text('Supervise and evaluate','Supervisar y evaluar',lang),text('Organize results, flag possible execution risks and feed lessons back into strategy.','Organizar resultados, señalar posibles riesgos de ejecución y devolver las lecciones a la estrategia.',lang)]
  ];
  return `<article class="ci-infographic" aria-label="${text('Country Intelligence infographic','Infografía de Inteligencia País',lang)}"><header><p class="ci-kicker">THE AI DIVIDEND · AI EXHIBITION HALL · VPC + TTD</p><h1>${text('Country Intelligence','Inteligencia País',lang)}</h1><p>${text('From scattered signals to strategic country knowledge','De señales dispersas a conocimiento estratégico del país',lang)}</p></header><div class="ci-info-flow"><section><span class="ci-info-icon" aria-hidden="true">▤ ◉ ▥</span><h2>${text('Scattered evidence','Evidencia dispersa',lang)}</h2><p>${text('National plans · IDB strategies · Project reports · Budget and regulation · Communities and partners','Planes nacionales · Estrategias del BID · Informes de proyectos · Presupuesto y regulación · Comunidades y socios',lang)}</p></section><span class="ci-info-arrow" aria-hidden="true">→</span><section class="ci-info-ai"><span class="ci-info-icon" aria-hidden="true">AI</span><h2>${text('AI connects','La IA conecta',lang)}</h2><p>${text('Gathers and organizes → Analyzes connections → Suggests opportunities and risks','Reúne y organiza → Analiza conexiones → Sugiere oportunidades y riesgos',lang)}</p></section><span class="ci-info-arrow" aria-hidden="true">→</span><section><span class="ci-info-icon" aria-hidden="true">◎</span><h2>${text('People decide','Las personas deciden',lang)}</h2><p>${text('Country teams verify the evidence, discuss the findings and evaluate what actions to take.','Los equipos país verifican la evidencia, dialogan sobre los hallazgos y evalúan qué acciones tomar.',lang)}</p></section></div><div class="ci-info-cycle">${capabilities.map((item,i)=>`<section><b>0${i+1}</b><div><h2>${item[0]}</h2><p>${item[1]}</p></div><span aria-hidden="true">${i===2?'↺':'→'}</span></section>`).join('')}</div><footer><p><strong>8+</strong> ${text('experiments across a connected strategy cycle; not a single fully deployed system.','experimentos en un ciclo de estrategia conectado; no un único sistema plenamente implementado.',lang)}</p><h2>${finalMessage(lang)}</h2></footer></article>`;
 }
 function footer(state){return `<p class="ci-notice">${state.screen==='game'?text('Educational simulation · All figures and choices are illustrative.','Simulación educativa · Todas las cifras y decisiones son ilustrativas.',state.language):text('VPC AI Agenda · Explore the infographic or start the minigame.','Agenda de IA de VPC · Explora la infografía o comienza el minijuego.',state.language)}</p>`;}
 function display(app,data){
  clearInterval(displayTimer);const state=model.sanitize(data.game);if(!state)return;
  const now=()=>window.AI_SYNC.now();let previous='';
  function paint(){
   const signature=JSON.stringify(model.visual(state,now()).p);
   if(signature===previous)return;previous=signature;document.documentElement.lang=state.language;
   app.innerHTML=`<main class="ci ci-display">${header(state,true)}<section class="ci-screen">${view(state,'display',now())}</section>${state.screen==='game'&&state.sc==='loop'?`<p class="ci-message">${finalMessage(state.language)}</p>`:footer(state)}</main>`;
  }paint();if(state.screen==='game'&&Object.values(state.ph).includes('run'))displayTimer=setInterval(paint,140);
 }
 async function mount({sync,mount,home}){
  const now=()=>sync.now();let state=model.fresh(now()),closed=false;
  const remote=await sync.read(),saved=remote?.projectId==='10'&&model.sanitize(remote.game);if(saved)state=saved;
  if(now()-state.lastActive>=45000)state=model.fresh(now(),state.language);
  const homeUrl=home+(home.includes('?')?'&':'?')+'projects=1';
  function send(){return sync.send({view:state.screen==='game'?'game':'project',projectId:'10',section:state.sc,language:state.language,mode:state.screen==='game'?'game':state.screen==='info'?'info':'landing',game:model.sanitize(state)});}
  function menu(){
   const lang=state.language;
   return `<section class="ci-menu"><div class="ci-menu-copy">
    <p class="ci-kicker">VPC + TTD · ${text('AI in Action','IA en acción',lang)}</p>
    <h1>${text('From scattered signals to strategic country knowledge','De señales dispersas a conocimiento estratégico del país',lang)}</h1>
    <p>${text('Discover how AI agents connect country information, identify opportunities and risks, and support better human decisions.','Descubre cómo los agentes de IA conectan información sobre los países, identifican oportunidades y riesgos, y apoyan mejores decisiones humanas.',lang)}</p>
    <div class="ci-options">
     <button data-info><b>01</b><span>${text('Information','Información',lang)}<small>${text('View the infographic on the TV','Ver la infografía en la TV',lang)}</small></span>↗</button>
     <button data-start><b>02</b><span>${text('Minigame','Minijuego',lang)}<small>${text('Connect · compare · decide','Conecta · compara · decide',lang)}</small></span>→</button>
    </div>
    <p class="ci-status" role="status">${state.screen==='info'?text('The infographic is on the TV. You can start the minigame whenever you want.','La infografía está en la TV. Puedes iniciar el minijuego cuando quieras.',lang):text('Choose the infographic or start the minigame. Both are available.','Elige la infografía o comienza el minijuego. Ambas opciones están disponibles.',lang)}</p>
   </div><div class="ci-keyvisual" aria-hidden="true"><div class="ci-orbit"><span>▤</span><span>◉</span><span>▥</span><span>◇</span><b>AI</b></div><p>${text('Evidence → Intelligence → Human decision','Evidencia → Inteligencia → Decisión humana',lang)}</p><small>8+ ${text('experiments across a connected cycle','experimentos en un ciclo conectado',lang)}</small></div></section>`;
  }
  function paint(){
   const focused=mount.contains(document.activeElement)?document.activeElement:null,identity=focused&&[...focused.attributes].find(a=>a.name.startsWith('data-'));
   document.documentElement.lang=state.language;
   mount.innerHTML=`<main class="ci ci-controller">${header(state)}${state.screen==='game'?`<section class="ci-game">${view(state,'tablet',now())}</section>${state.sc==='loop'?`<div class="ci-end"><p>${finalMessage(state.language)}</p><button data-menu>${text('Return to project menu','Volver al menú del proyecto',state.language)}</button></div>`:''}`:menu()}${footer(state)}</main>`;
   if(identity)mount.querySelector(identity.value?`[${identity.name}="${identity.value}"]`:`[${identity.name}]`)?.focus({preventScroll:true});
  }
  function commit(){state.lastActive=now();paint();void send();}
  function start(){state={...model.fresh(now(),state.language),screen:'game',unlocked:state.unlocked,infoStarted:state.infoStarted};}
  mount.addEventListener('click',async event=>{
   const b=event.target.closest('button');if(!b||b.disabled||closed)return;
   if(b.hasAttribute('data-home')){closed=true;clearInterval(timer);await sync.send({view:'home',projectId:null,game:null});location.assign(homeUrl);return;}
   if(b.hasAttribute('data-fullscreen')){if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen().catch(()=>{});state.lastActive=now();void send();return;}
   if(b.dataset.language)state.language=b.dataset.language;
   else if(b.hasAttribute('data-menu'))state.screen='menu';
   else if(b.hasAttribute('data-info')){state.screen='info';state.infoStarted=0;}
   else if(b.hasAttribute('data-start'))start();
   else if(state.screen==='game'){
    const k=Number(state.sc.slice(1));
    if(b.dataset.go){if(state.ph[k]==='run')state.ph[k]='done';state.sc=b.dataset.go;}
    else if(b.dataset.sig!==undefined){const i=Number(b.dataset.sig);if(!state.con.includes(i))state.con.push(i);}
    else if(b.dataset.all)state.con=[0,1,2,3,4,5,6,7];
    else if(b.dataset.run){state.ph[k]='run';state.runs[k]=now();}
    else if(b.dataset.pick!==undefined)state.pk[k]=Number(b.dataset.pick);
    else if(b.dataset.reset)start();
   }commit();
  });
  mount.addEventListener('pointerdown',()=>{state.lastActive=now();});
  let frame='';const timer=setInterval(()=>{
   if(closed)return;let changed=false;
   if(now()-state.lastActive>=45000&&(state.screen!=='menu'||state.infoStarted||state.con.length||state.sc!=='problem')){state=model.fresh(now(),state.language);changed=true;}
   for(let k=0;k<3;k++)if(state.ph[k]==='run'&&now()-state.runs[k]>=5200){state.ph[k]='done';changed=true;}
   const signature=JSON.stringify(model.visual(state,now()).p);
   if(changed){paint();void send();}else if(signature!==frame)paint();frame=signature;
  },140);
  window.addEventListener('pagehide',()=>{closed=true;clearInterval(timer);},{once:true});paint();await send();
 }
 window.COUNTRY_INTELLIGENCE={mount,renderDisplay:display,stopDisplay(){clearInterval(displayTimer);displayTimer=null;}};
})();
