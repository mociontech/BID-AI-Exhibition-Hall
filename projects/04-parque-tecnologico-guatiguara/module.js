/* Station 04 controller. Information stays independent from the approved game. */
window.ProjectModule={
 id:'04',
 async mountController({sync,mount,home}){
  const assets='./04_Guatiguara_BID_Bilingue/';
  const artwork={es:'04_Guatiguara_Inicio_ES_1920x1080.png',en:'04_Guatiguara_Home_EN_1920x1080.png'};
  const gameApi=window.GUATIGUARA_GAME;
  let idleTimer=null;
  let state={language:'es',displayMode:'landing',game:null};
  const isGame=()=>state.displayMode==='game';
  function cancelIdle(){if(idleTimer){clearTimeout(idleTimer);idleTimer=null;}}
  function armIdle(){cancelIdle();if(isGame())idleTimer=setTimeout(()=>exitGame(),120000);}
  function publish(){
   const game=isGame()?gameApi.sanitize(state.game):null;
   return sync.send({view:isGame()?'game':'project',projectId:'04',section:isGame()?'game':state.displayMode==='info'?'info':null,language:state.language,mode:isGame()?'game':state.displayMode,screenIndex:null,game});
  }
  async function goHome(){
   cancelIdle();
   await sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null});
   location.assign(home);
  }
  function exitGame(){cancelIdle();state={...state,displayMode:'landing',game:null};render();void publish();}
  function renderLanding(){
   const copy=state.language==='es'
    ? {info:'Mostrar información en la pantalla principal',game:'Abrir minijuego Activa la innovación',home:'Volver a los 11 proyectos',back:'Volver a los proyectos',next:'Mostrar información en la pantalla principal'}
    : {info:'Show information on the main display',game:'Open Activate innovation mini-game',home:'Return to the 11 projects',back:'Back to projects',next:'Show information on the main display'};
   return `<main class="guatiguara-controller" aria-label="Parque Tecnológico Guatiguará"><div class="guatiguara-artboard">${AI_ARTWORK(`${assets+artwork[state.language]}`,`alt="" aria-hidden="true"`)}<nav class="guatiguara-controls" aria-label="Guatiguará controls"><button class="guatiguara-hit guatiguara-hit--es" type="button" data-language="es" aria-label="Español" aria-pressed="${state.language==='es'}"></button><button class="guatiguara-hit guatiguara-hit--en" type="button" data-language="en" aria-label="English" aria-pressed="${state.language==='en'}"></button><button class="guatiguara-hit guatiguara-hit--info" type="button" data-action="information" aria-label="${copy.info}"></button><button class="guatiguara-hit guatiguara-hit--game" type="button" data-action="game" aria-label="${copy.game}"></button><button class="guatiguara-hit guatiguara-hit--home-text" type="button" data-action="home" aria-label="${copy.home}"></button><button class="guatiguara-hit guatiguara-hit--home-icon" type="button" data-action="home" aria-label="${copy.home}"></button><button class="guatiguara-hit guatiguara-hit--back" type="button" data-action="home" aria-label="${copy.back}"></button><button class="guatiguara-hit guatiguara-hit--next" type="button" data-action="information" aria-label="${copy.next}"></button></nav></div></main>`;
  }
  function render(){mount.innerHTML=isGame()?gameApi.renderTablet(state.game,state.language):renderLanding();bind();}
  function setLanguage(language){if(language===state.language)return;state={...state,language};render();void publish();armIdle();}
  function bind(){
   mount.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
   mount.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',event=>{
    event.preventDefault();
    if(button.dataset.action==='information'){cancelIdle();state={...state,displayMode:'info',game:null};render();void publish();}
    if(button.dataset.action==='game'){state={...state,displayMode:'game',game:gameApi.fresh()};render();void publish();armIdle();}
    if(button.dataset.action==='home')void goHome();
   }));
   mount.querySelectorAll('[data-game-action]').forEach(button=>button.addEventListener('click',event=>{
    event.preventDefault();const action=button.dataset.gameAction;
    if(action==='exit')return exitGame();
    state={...state,game:gameApi.transition(state.game,action,button.dataset.id)};
    render();void publish();armIdle();
   }));
  }
  try{
   const remote=await sync.read();
   if(remote?.projectId==='04'){
    state.language=remote.language==='en'?'en':'es';
    if(remote.mode==='game'&&remote.game)state={...state,displayMode:'game',game:gameApi.sanitize(remote.game)};
    else state={...state,displayMode:remote.mode==='info'?'info':'landing',game:null};
   }
  }catch{}
  render();void publish();armIdle();
 }
};
