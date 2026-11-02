/* Non-interactive large display ? receives commands from the tablet on the
   same station. AquaData is intentionally rendered as full-screen approved art. */
const app=document.getElementById('app');
const sync=AI_SYNC;
const topics={what:'What It Is & the Problem',solution:'The Solution',ai:'How AI Is Used',results:'Results & Key Figures',users:'Who Uses It / Who Benefits','before-after':'Before & After'};
let last='';let busy=false;
Object.values(BOGOTA_TRAFFIC.INFO_IMAGES).forEach(src=>{const image=new Image();image.src=src;});
function renderAquaData(data){
 const language=data.language==='en'?'en':'es';
 if(data.mode==='game'){
  const game=data.game||{step:1};
  const image=AQUADATA.gameReferencePath(game.step,language);
  const progress=game.step===3?'<span class="aqua-display-progress" aria-hidden="true"><i></i></span>':'';
  app.innerHTML=`<main class="aquadata-display aquadata-game-display" aria-label="AquaData Detective del Agua"><img class="aquadata-display-image" src="${image}" alt="AquaData Detective del Agua">${progress}</main>`;
  return;
 }
 if(data.mode==='info'||data.mode==='cta'){
  const sheet=AQUADATA.technicalSheetPath(language);
  if(data.mode==='cta'){
   const copy=language==='en'
    ? {eyebrow:'AQUADATA ? NEXT STEP',title:'The mini-game is now available',body:'Return to the tablet and experience how AI helps prioritize inspections.'}
    : {eyebrow:'AQUADATA ? SIGUIENTE PASO',title:'El minijuego ya est? disponible',body:'Regresa a la tableta y vive c?mo la IA ayuda a priorizar inspecciones.'};
   app.innerHTML=`<main class="aquadata-display aquadata-display--cta" aria-label="AquaData technical sheet"><img class="aquadata-display-image" src="${sheet}" alt="AquaData technical sheet"><section class="aqua-cta-overlay" aria-live="polite"><div class="aqua-cta-card"><p>${copy.eyebrow}</p><h1>${copy.title}</h1><div class="aqua-cta-arrow" aria-hidden="true">?</div><span>${copy.body}</span></div></section></main>`;
  }else app.innerHTML=`<main class="aquadata-display" aria-label="AquaData technical sheet"><img class="aquadata-display-image" src="${sheet}" alt="AquaData technical sheet"></main>`;
  return;
 }
 const image=AQUADATA.imagePath(1,language);
 app.innerHTML=`<main class="aquadata-display" aria-label="AquaData large display"><img class="aquadata-display-image" src="${image}" alt="AquaData"></main>`;
}
function renderBogotaTraffic(data){
 const language=data.language==='en'?'en':'es';
 const screenIndex=Number.isInteger(data.screenIndex)?data.screenIndex:1;
 const screen=BOGOTA_TRAFFIC.screen(screenIndex);
 const image=BOGOTA_TRAFFIC.imagePath(screen.index,language);
 if(data.mode==='cta'){
  const copy=language==='en'
   ? {eyebrow:'PREDICTTODO ? NEXT STEP',title:'The mini-game is now available',body:'Return to the tablet and explore how anticipating congestion can support human decisions.'}
   : {eyebrow:'PREDICTTODO ? SIGUIENTE PASO',title:'El minijuego ya est? disponible',body:'Regresa a la tableta y explora c?mo anticipar la congesti?n puede apoyar decisiones humanas.'};
  app.innerHTML=`<main class="bogota-display bogota-display--cta" aria-label="Bogot? Traffic Prediction information"><img class="bogota-display-image" src="${image}" alt="Bogot? Traffic Prediction: ${screen.labels[language]}"><section class="bogota-cta-overlay" aria-live="polite"><div class="bogota-cta-card"><p>${copy.eyebrow}</p><h1>${copy.title}</h1><div class="bogota-cta-arrow" aria-hidden="true">?</div><span>${copy.body}</span></div></section></main>`;
  return;
 }
 app.innerHTML=`<main class="bogota-display" aria-label="Bogot? Traffic Prediction large display"><img class="bogota-display-image" src="${image}" alt="Bogot? Traffic Prediction: ${screen.labels[language]}"></main>`;
}
const COSTA_RICA_ART={
 es:{home:'projects/03-costa-rica-smart-borders/public/Imagen de ChatGPT 29 oct 2026, 03_20_41 p.m-1.png',info:'projects/03-costa-rica-smart-borders/public/Imagen de ChatGPT 29 oct 2026, 03_20_41 p.m-2.png'},
 en:{home:'projects/03-costa-rica-smart-borders/public/Imagen de ChatGPT 29 oct 2026, 03_20_42 p.m-4.png',info:'projects/03-costa-rica-smart-borders/public/Imagen de ChatGPT 29 oct 2026, 03_20_42 p.m-3.png'}
};
const GUATIGUARA_ART={
 es:{info:'projects/04-parque-tecnologico-guatiguara/04_Guatiguara_BID_Bilingue/04_Guatiguara_Infografia_ES_1920x1080.png'},
 en:{info:'projects/04-parque-tecnologico-guatiguara/04_Guatiguara_BID_Bilingue/04_Guatiguara_Infographic_EN_1920x1080.png'}
};
function renderGuatiguara(data){
 const language=data.language==='en'?'en':'es';
 const image=GUATIGUARA_ART[language].info;
 app.innerHTML=`<main class="guatiguara-display" aria-label="Parque Tecnológico Guatiguará information"><img src="${image}" alt="Parque Tecnológico Guatiguará information"></main>`;
}
function renderGuatiguaraGame(data){
 if(!window.GUATIGUARA_GAME)return renderGuatiguara(data);
 app.innerHTML=window.GUATIGUARA_GAME.renderTV(data.game,data.language);
}
function renderCostaRica(data){
 const language=data.language==='en'?'en':'es';
 const isInfo=data.mode==='info'||data.mode==='cta'||data.mode==='game'||data.mode==='results';
 const image=COSTA_RICA_ART[language][isInfo?'info':'home'];
 const cta=data.mode==='cta'?(language==='en'?{eyebrow:'COSTA RICA SMART BORDERS',title:'The mini-game is now available.',body:'Return to the tablet and start the experience.'}:{eyebrow:'COSTA RICA SMART BORDERS',title:'El minijuego ya está disponible.',body:'Regresa a la tableta para iniciar la experiencia.'}):null;
 app.innerHTML=`<main class="crb-display ${cta?'crb-display--cta':''}" aria-label="Costa Rica Smart Borders"><img src="${image}" alt="Costa Rica Smart Borders">${cta?`<section class="crb-display-cta"><p>${cta.eyebrow}</p><h1>${cta.title}</h1><span>${cta.body}</span></section>`:''}</main>`;
}
let bogotaGameData=null;
fetch('projects/02-bogota-traffic-prediction/GAME_DATA.json',{cache:'no-store'}).then(response=>response.ok?response.json():null).then(data=>{bogotaGameData=data;last='';}).catch(()=>{});
function bogotaMap(){return `<svg class="pulse-map" viewBox="0 0 700 420" aria-hidden="true"><path d="M35 335C144 294 169 175 301 188S452 91 653 56"/><path d="M57 73C162 126 234 110 344 224S530 289 666 364"/><path d="M86 390C194 314 273 358 361 239S535 179 642 202"/><path d="M134 31C218 151 204 240 323 302S506 340 607 389"/><circle cx="302" cy="188" r="12"/><circle cx="344" cy="224" r="12"/><circle cx="361" cy="239" r="12"/></svg>`;}
function renderBogotaGame(data){
 const language=data.language==='en'?'en':'es';
 const game=data.game||{};
 const gameCopy=language==='en'
  ? {concept:'Conceptual map ? Educational simulation',intro:'Bogot? Traffic Pulse',introBody:'Explore four simulated scenarios and see how anticipating congestion can support human decisions.',next:'Next',choosePlayer:'Choose your profile',name:'Your name',start:'Start simulation',explore:'Explore the map',selectEvent:'Select an event',decide:'Choose an action',result:'Simulated result',retry:'Try again',nextScenario:'Next scenario',finish:'Final result',restart:'Restart',score:'Score',warning:'Educational simulation. Actions and scores are not operational PredictToDo recommendations.'}
  : {concept:'Mapa conceptual ? Simulaci?n educativa',intro:'Pulso Vial Bogot?',introBody:'Explora cuatro escenarios simulados y observa c?mo anticipar la congesti?n puede apoyar decisiones humanas.',next:'Siguiente',choosePlayer:'Elige tu perfil',name:'Tu nombre',start:'Empezar simulaci?n',explore:'Explora el mapa',selectEvent:'Selecciona un evento',decide:'Elige una acci?n',result:'Resultado simulado',retry:'Intentar de nuevo',nextScenario:'Siguiente escenario',finish:'Resultado final',restart:'Reiniciar',score:'Puntos',warning:'Simulaci?n educativa. Las acciones y puntajes no son recomendaciones operativas de PredictToDo.'};
 const scenario=bogotaGameData?.scenarios?.[game.scenarioIndex]||bogotaGameData?.scenarios?.[0];
 const phase=game.phase||'intro';
 const total=Object.values(game.results||{}).reduce((sum,value)=>sum+value,0);
 const header=`<header class="pulse-header"><div><p>PREDICTTODO ? ${gameCopy.concept}</p><strong>${gameCopy.intro}</strong></div><div class="traffic-language" aria-label="Language"><button type="button" aria-pressed="${language==='es'}">ES</button><span aria-hidden="true">|</span><button type="button" aria-pressed="${language==='en'}">EN</button></div><button type="button" aria-hidden="true" tabindex="-1">?</button></header>`;
 const title=scenario?.[`title_${language}`]||gameCopy.intro;
 let panel='';
 if(phase==='intro')panel=`<section class="pulse-stage pulse-intro"><span class="pulse-badge">SIMULACI?N / SIMULATION</span><h1>${gameCopy.intro}</h1><p>${gameCopy.introBody}</p><div class="pulse-steps"><span>01<br><b>${gameCopy.choosePlayer}</b></span><span>02<br><b>${gameCopy.explore}</b></span><span>03<br><b>${gameCopy.decide}</b></span><span>04<br><b>${gameCopy.result}</b></span></div><button type="button" class="pulse-primary">${gameCopy.next} ?</button></section>`;
 else if(phase==='player')panel=`<section class="pulse-stage"><h1>${gameCopy.choosePlayer}</h1><label>${gameCopy.name}<input class="pulse-name" value="${game.playerName||''}" readonly></label><div class="pulse-players">${(bogotaGameData?.characters||[]).map(person=>`<button type="button" class="pulse-player ${game.playerId===person.id?'is-selected':''}"><span>${({valentina:'???????',camila:'???????',santiago:'???????',andres:'???????'})[person.id]}</span><b>${person.name}</b><small>${person[`role_${language}`]}</small></button>`).join('')}</div><button type="button" class="pulse-primary">${gameCopy.start} ?</button></section>`;
 else if(phase==='explore')panel=`<section class="pulse-map-layout"><div class="pulse-map-card">${bogotaMap()}<span>${gameCopy.concept}</span></div><aside><p class="pulse-eyebrow">${gameCopy.explore}</p><h1>${String(game.hour||16).padStart(2,'0')}:00</h1><input type="range" min="0" max="23" value="${game.hour||16}" tabindex="-1"><p class="pulse-eyebrow">${gameCopy.selectEvent}</p><div class="pulse-scenes">${(bogotaGameData?.scenarios||[]).map((item,index)=>`<button type="button" class="${game.scenarioIndex===index?'is-selected':''}"><b>${item.time}</b><span>${item[`title_${language}`]}</span></button>`).join('')}</div><button type="button" class="pulse-primary">${gameCopy.decide} ?</button></aside></section>`;
 else if(phase==='decision')panel=`<section class="pulse-map-layout"><div class="pulse-map-card">${bogotaMap()}<span>${gameCopy.concept}</span></div><aside class="pulse-decision"><p class="pulse-eyebrow">${scenario.time} ? ${(game.scenarioIndex||0)+1}/4</p><h1>${title}</h1><p>${gameCopy.decide}</p>${(bogotaGameData?.actions||[]).map(action=>`<button type="button">${action[language]} <b>?</b></button>`).join('')}</aside></section>`;
 else if(phase==='result') {const score=scenario.scores[game.actionId]||0;panel=`<section class="pulse-result"><p class="pulse-eyebrow">${gameCopy.result} ? ${title}</p><h1>${score}<small>/100</small></h1><p>${gameCopy.warning}</p><div>${(bogotaGameData?.actions||[]).map(action=>`<span class="${action.id===game.actionId?'is-choice':''}" style="--score:${scenario.scores[action.id]}%"><b>${action[language]}</b><i></i><em>${scenario.scores[action.id]}</em></span>`).join('')}</div><button type="button" class="pulse-secondary">${gameCopy.retry}</button><button type="button" class="pulse-primary">${(game.scenarioIndex||0)===3?gameCopy.finish:gameCopy.nextScenario} ?</button></section>`;}
 else panel=`<section class="pulse-final"><span>??</span><p class="pulse-eyebrow">${gameCopy.finish}</p><h1>${total}<small>/400</small></h1><p>${language==='en'?'Anticipating congestion supports better-informed planning.':'Anticipar la congesti?n permite planificar con mejor informaci?n.'}</p><div>${(bogotaGameData?.scenarios||[]).map((item,index)=>`<p><b>${index+1}. ${item[`title_${language}`]}</b><span>${game.results?.[index]||0} ${gameCopy.score.toLowerCase()}</span></p>`).join('')}</div><button type="button" class="pulse-primary">${gameCopy.restart} ?</button></section>`;
 app.innerHTML=`<main class="pulse-game pulse-game--display" aria-label="PredictToDo game mirror">${header}${panel}</main>`;
}
/* The command-center game is rendered from the same shared template as the
   tablet. The display has no active controls, but mirrors every selection. */
function renderBogotaGame(data){
 const language=data.language==='en'?'en':'es';
 if(!bogotaGameData||!window.PULSE_VIAL){
  app.innerHTML='<main class="pulse-command pulse-command--loading"><p>Loading PredictToDo?</p></main>';
  return;
 }
 window.PULSE_VIAL.renderInto(app,{data:bogotaGameData,game:data.game||{},language,readonly:true});
}
function renderDefault(data){
 const p=EXHIBITION_PROJECTS.find(p=>p.id===data?.projectId);
 const isHome=!p||data?.view==='home';
 let title=isHome?'Explore AI in Action':p.name;
 let intro=isHome?'Choose one of the eleven projects on the tablet to begin.':'Select Project Overview or Interactive Mini-Game on the tablet.';
 if(!isHome&&data.view==='overview'){title=topics[data.section]||'Project Overview';intro=`${p.name} ? This section will be developed and approved for the large display.`;}
 if(!isHome&&data.view==='game'){title='Interactive Mini-Game';intro=`${p.name} ? Interactive experience pending implementation.`;}
 app.innerHTML=`<main class="display-app"><header class="display-header">${AI_BRAND.header()}<span class="display-station">STATION ${String(sync.station).padStart(2,'0')} ? MAIN DISPLAY</span></header><section class="display-body"><div class="display-info"><div class="display-kicker">${isHome?'AI EXHIBITION HALL':`PROJECT ${p.id} ? ${p.division}`}</div><h1 class="display-title">${title}</h1><p class="display-description">${intro}</p></div><div class="display-figure" aria-hidden="true">${isHome?'?':data.view==='game'?'?':data.view==='overview'?'?':'?'}</div></section><footer class="display-footer">From Strategy to Impact ? This screen is controlled by the tablet.</footer></main>`;
}
function render(data){
 if(data?.projectId==='05'&&data?.view!=='home'){
  window.PROFE_GABI.renderInto(app,data,{readonly:true});
  return;
 }
 const isAquaData=data?.projectId==='01'&&data?.view!=='home';
 if(isAquaData)return renderAquaData(data);
 const isCostaRica=data?.projectId==='03'&&data?.view!=='home';
 if(isCostaRica)return renderCostaRica(data);
 const isGuatiguaraGame=data?.projectId==='04'&&data?.view==='game'&&data?.mode==='game';
 if(isGuatiguaraGame)return renderGuatiguaraGame(data);
 const isGuatiguara=data?.projectId==='04'&&data?.view!=='home'&&data?.mode==='info';
 if(isGuatiguara)return renderGuatiguara(data);
 const isBogotaTraffic=data?.projectId==='02'&&data?.view==='overview'&&data?.section==='info';
 if(isBogotaTraffic)return renderBogotaTraffic(data);
 const isBogotaGame=data?.projectId==='02'&&data?.view==='game';
 if(isBogotaGame)return renderBogotaGame(data);
 renderDefault(data);
}
async function tick(){
 if(busy)return;busy=true;
 try{
  const data=await sync.read();
  const sig=JSON.stringify(data&&[data.view,data.projectId,data.section,data.language,data.mode,data.screenIndex,data.game]);
  if(sig!==last){last=sig;render(data);}
 }finally{busy=false;}
}
render(null);tick();setInterval(tick,150);
