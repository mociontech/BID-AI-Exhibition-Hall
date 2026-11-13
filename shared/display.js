/* Non-interactive large display ? receives commands from the tablet on the
   same station. AquaData is intentionally rendered as full-screen approved art. */
const app=document.getElementById('app');
const sync=AI_SYNC;
const topics={what:'What It Is & the Problem',solution:'The Solution',ai:'How AI Is Used',results:'Results & Key Figures',users:'Who Uses It / Who Benefits','before-after':'Before & After'};
let last='';let busy=false;
Object.values(BOGOTA_TRAFFIC.INFO_IMAGES).forEach(src=>{const image=new Image();image.src=src;});
let aquaData=null,aquaDataLoading=false;
function renderAquaData(data){
 const language=data.language==='es'?'es':'en';
 const V=window.AQUADATA_VISUAL;
 if(!V){app.innerHTML='<main class="aqd-loading">AquaData…</main>';return;}
 if(!aquaData){
  if(!aquaDataLoading){aquaDataLoading=true;V.load().then(loaded=>{aquaData=loaded;last='';}).catch(()=>{aquaDataLoading=false;});}
  app.innerHTML='<main class="aqd-loading">AquaData…</main>';
  return;
 }
 const game=data.game||{step:1,p1:[],p2:[]};
 const opts={data:aquaData,station:sync.station};
 if(data.mode==='game'){
  // TV guide: context for the current stage plus the call to action for the tablet.
  app.innerHTML=V.renderTv({language,mode:'game',step:game.step,p1:game.p1||[],p2:game.p2||[],act:game.act,take:game.take},opts);
  return;
 }
 if(data.mode==='video'){
  // AquaData video, full screen. A language switch keeps it playing.
  if(!app.querySelector('.aquadata-display-video')){
   app.innerHTML=`<main class="aquadata-display aquadata-display--video" aria-label="AquaData video"><video class="aquadata-display-video" src="${AQUADATA.videoPath()}" autoplay loop playsinline preload="auto"></video></main>`;
   const video=app.querySelector('.aquadata-display-video');
   video.play().catch(()=>{video.muted=true;video.play().catch(()=>{});});
  }
  return;
 }
 if(data.mode==='info'||data.mode==='cta'){
  // Technical sheet with the project synopsis panel and the call to action.
  const sheet=AQUADATA.technicalSheetPath(language);
  app.innerHTML=`<main class="aquadata-display aquadata-display--info" aria-label="AquaData technical sheet">${AI_ARTWORK(`${sheet}`,`class="aquadata-display-image"  alt="AquaData technical sheet"`)}${V.renderTv({language,mode:'info'},opts)}</main>`;
  return;
 }
 app.innerHTML=V.renderTv({language,mode:'landing'},opts);
}
function renderBogotaTraffic(data){
 const language=data.language==='es'?'es':'en';
 const screenIndex=Number.isInteger(data.screenIndex)?data.screenIndex:1;
 const screen=BOGOTA_TRAFFIC.screen(screenIndex);
 const image=BOGOTA_TRAFFIC.imagePath(screen.index,language);
 if(window.PREDICTTODO_INSIGHTS){app.innerHTML=window.PREDICTTODO_INSIGHTS.information({language,image,label:`PredictToDo: ${screen.labels[language]}`});return;}
 app.innerHTML=`<main class="bogota-display" aria-label="Bogot? Traffic Prediction large display">${AI_ARTWORK(`${image}`,`class="bogota-display-image"  alt="Bogot? Traffic Prediction: ${screen.labels[language]}"`)}</main>`;
}
const COSTA_RICA_ART={
 es:{home:'projects/03-costa-rica-smart-borders/public/Imagen de ChatGPT 29 oct 2026, 03_20_41 p.m-1.png',info:'projects/03-costa-rica-smart-borders/public/Imagen de ChatGPT 29 oct 2026, 03_20_41 p.m-2.png'},
 en:{home:'projects/03-costa-rica-smart-borders/public/cover-en-1920x1080.png',info:'projects/03-costa-rica-smart-borders/public/info-en-2026-11.png'}
};
function renderTeachy(data){
 window.TEACHY.renderDisplay(app,data);
}
function renderCostaRica(data){
 const language=data.language==='es'?'es':'en';
 if(data.mode==='game'&&data.game&&(data.game.v===1||data.game.v===2)&&window.CRB_TV){window.CRB_TV.render(app,data.game);return;} // espejo del minijuego (tv.js)
 if(window.CRB_TV)window.CRB_TV.stop();
 if(data.mode==='video'){ // video de Peñas Blancas a pantalla completa; cambiar el idioma no lo reinicia
  if(!app.querySelector('.crb-video')){app.innerHTML='<main class="crb-display crb-display--video" aria-label="Costa Rica Smart Borders video"><video class="crb-video" src="projects/03-costa-rica-smart-borders/video/PenasBlancas_web.mp4" autoplay loop playsinline preload="auto"></video></main>';const v=app.querySelector('.crb-video');v.play().catch(()=>{v.muted=true;v.play().catch(()=>{});});}
  return;
 }
 const isInfo=data.mode==='info'||data.mode==='cta'||data.mode==='game'||data.mode==='results';
 if(!isInfo&&window.CRB_COVER){app.innerHTML=window.CRB_COVER(language,{base:'projects/03-costa-rica-smart-borders/public/',interactive:false});return;} // portada HTML idéntica a la tableta (cover.js)
 const image=COSTA_RICA_ART[language][isInfo?'info':'home'];
  const cta=(data.mode==='info'||data.mode==='cta')?(language==='en'?'When you are ready, tap “Video” or “Interactive experience” on the tablet':'Cuando estés listo, toca «Video» o «Experiencia interactiva» en la tableta'):null;
 // Información: infografía en HTML animada por elementos (cover.js → CRB_SHEET). No se vuelve a montar si ya está en pantalla en el mismo idioma, para no reiniciar la animación.
 const useSheet=!!cta&&!!window.CRB_SHEET;
 if(useSheet){const current=app.querySelector('.crs-sheet');if(current&&current.lang===language)return;}
 app.innerHTML=`<main class="crb-display ${cta?'crb-display--cta':''} ${useSheet?'crb-display--sheet':''}" aria-label="Costa Rica Smart Borders">${useSheet?window.CRB_SHEET(language,{base:'projects/03-costa-rica-smart-borders/public/'}):AI_ARTWORK(`${image}`,`alt="Costa Rica Smart Borders"`)}${cta?`<section class="crb-display-cta crb-display-cta--pill crb-display-cta--aqd" role="status"><i class="crb-cta-icon" aria-hidden="true"><svg viewBox="0 0 29 22" fill="currentColor" aria-hidden="true"><path d="M25.931 21.0553L2.86153 21.0649C1.37168 21.066 0 19.879 0 18.3428V2.70237C0 1.28172 1.27161 0 2.70184 0L26.0561 0.00532278C27.4666 0.00532278 28.7084 1.31526 28.7084 2.70025V18.3455C28.7079 19.8103 27.4086 21.0548 25.931 21.0553ZM25.9161 19.1498C26.4207 19.0752 26.805 18.7388 26.805 18.231V2.81894C26.805 2.30955 26.4154 1.98167 25.9416 1.90343H2.76731C2.27762 1.97901 1.97794 2.28241 1.89757 2.77051L1.90396 18.2337C1.90396 18.725 2.32073 19.145 2.81522 19.1455L25.9155 19.1508Z"/><circle cx="13.96" cy="3.96" r=".96"/></svg></i><b>${cta}</b><span class="crb-cta-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></span></section>`:''}</main>`;
}
let bogotaGameData=null;
fetch('projects/02-bogota-traffic-prediction/GAME_DATA.json',{cache:'no-store'}).then(response=>response.ok?response.json():null).then(data=>{bogotaGameData=data;last='';}).catch(()=>{});
function bogotaMap(){return `<svg class="pulse-map" viewBox="0 0 700 420" aria-hidden="true"><path d="M35 335C144 294 169 175 301 188S452 91 653 56"/><path d="M57 73C162 126 234 110 344 224S530 289 666 364"/><path d="M86 390C194 314 273 358 361 239S535 179 642 202"/><path d="M134 31C218 151 204 240 323 302S506 340 607 389"/><circle cx="302" cy="188" r="12"/><circle cx="344" cy="224" r="12"/><circle cx="361" cy="239" r="12"/></svg>`;}
function renderBogotaGame(data){
 const language=data.language==='es'?'es':'en';
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
/* Project 02 TV guidance follows the tablet's existing game state. */
function renderBogotaGame(data){
 const language=data.language==='es'?'es':'en';
 if(!bogotaGameData||!window.PULSE_VIAL){
  app.innerHTML='<main class="pulse-command pulse-command--loading"><p>Loading PredictToDo?</p></main>';
  return;
 }
 if(window.PREDICTTODO_INSIGHTS){window.PREDICTTODO_INSIGHTS.renderGameInto(app,{data:bogotaGameData,game:data.game||{},language,station:sync.station});return;}
 window.PULSE_VIAL.renderInto(app,{data:bogotaGameData,game:data.game||{},language,readonly:true});
}
function renderDefault(data){
 const p=EXHIBITION_PROJECTS.find(p=>p.id===data?.projectId);
 const isHome=!p||data?.view==='home';
 if(isHome){app.innerHTML=window.EXHIBITION_HOME.render();return;}
 let title=isHome?'Explore AI in Action':p.name;
 let intro=isHome?'Choose one of the eleven projects on the tablet to begin.':'Select Project Overview or Interactive Mini-Game on the tablet.';
 if(!isHome&&data.view==='overview'){title=topics[data.section]||'Project Overview';intro=`${p.name} ? This section will be developed and approved for the large display.`;}
 if(!isHome&&data.view==='game'){title='Interactive Mini-Game';intro=`${p.name} ? Interactive experience pending implementation.`;}
 app.innerHTML=`<main class="display-app"><header class="display-header">${AI_BRAND.header()}<span class="display-station">STATION ${String(sync.station).padStart(2,'0')} ? MAIN DISPLAY</span></header><section class="display-body"><div class="display-info"><div class="display-kicker">${isHome?'AI in Action':`PROJECT ${p.id} ? ${p.division}`}</div><h1 class="display-title">${title}</h1><p class="display-description">${intro}</p></div><div class="display-figure" aria-hidden="true">${isHome?'?':data.view==='game'?'?':data.view==='overview'?'?':'?'}</div></section><footer class="display-footer">IDB Group Projects Across The Region ? This screen is controlled by the tablet.</footer></main>`;
}
function render(data){
 if(data?.projectId!=='02'||data?.view!=='game')window.PREDICTTODO_CONTROL?.release(app);
 if(data?.projectId!=='11'||data?.view==='home')window.RISE_GAME?.stopDisplay();
 if(data?.projectId==='10'&&data?.view!=='home'){
  document.title='Country Intelligence | AI in Action';
  window.COUNTRY_INTELLIGENCE.renderDisplay(app,data);return;
 }
 window.COUNTRY_INTELLIGENCE?.stopDisplay();
 if(data?.projectId==='11'&&data?.view!=='home'){
  document.title='RSM RISE | AI in Action';
  window.RSM_RISE.renderDisplay(app,data);
  return;
 }
 if(data?.projectId==='07'&&data?.view!=='home'){
  document.title='MAIIA | AI in Action';
  window.MAIIA.renderInto(app,data,{readonly:true});
  return;
 }
 document.title=data?.projectId==='06'&&data?.view!=='home'?'RegLAC | AI in Action':'AI in Action | Main Display';
 if(data?.projectId==='06'&&data?.view!=='home'){
  window.REGLAC.renderInto(app,data,{readonly:true});
  return;
 }
 if(data?.projectId==='05'&&data?.view!=='home'){
  window.PROFE_GABI.renderInto(app,data,{readonly:true});
  return;
 }
 const isAquaData=data?.projectId==='01'&&data?.view!=='home';
 if(isAquaData)return renderAquaData(data);
 const isCostaRica=data?.projectId==='03'&&data?.view!=='home';
 if(isCostaRica)return renderCostaRica(data);
 if(data?.projectId==='04'&&data?.view!=='home')return window.GUATIGUARA.renderInto(app,data);
 const isTeachy=data?.projectId==='08'&&data?.view!=='home';
 if(isTeachy)return renderTeachy(data);
 const isBogotaTraffic=data?.projectId==='02'&&data?.view==='overview'&&data?.section==='info';
 if(isBogotaTraffic)return renderBogotaTraffic(data);
 const isBogotaGame=data?.projectId==='02'&&data?.view==='game';
 if(isBogotaGame)return renderBogotaGame(data);
 if(data?.projectId==='02'&&data?.view==='project'&&window.PREDICTTODO_VISUAL){
  app.innerHTML=window.PREDICTTODO_VISUAL.landing(data.language,{station:sync.station,readonly:true});
  return;
 }
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
render(null);tick();setInterval(tick,sync.pollInterval||150);
