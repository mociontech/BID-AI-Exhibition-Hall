/* Station 04: the tablet selects information or the institutional video slot. */
window.ProjectModule={
 id:'04',
 async mountController({sync,mount,home}){
  const assets='./04_Guatiguara_BID_Bilingue/';
  const artwork={es:'04_Guatiguara_Inicio_ES_1920x1080.png',en:'04_Guatiguara_Home_EN_1920x1080.png'};
  let state={language:'es',displayMode:'landing'};
  function publish(){
   return sync.send({view:'project',projectId:'04',section:state.displayMode==='landing'?null:state.displayMode,language:state.language,mode:state.displayMode,screenIndex:null,game:null});
  }
  async function goHome(){
   await sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null});
   location.assign(home);
  }
  function render(){
   const copy=state.language==='es'
    ? {info:'Mostrar información en la pantalla principal',video:'Video institucional',soon:'Próximamente: aquí estará el video institucional del proyecto.',home:'Volver a los proyectos',next:'Mostrar información en la pantalla principal'}
    : {info:'Show information on the main display',video:'Institutional video',soon:'Coming soon: the project’s institutional video will be available here.',home:'Back to projects',next:'Show information on the main display'};
   mount.innerHTML=`<main class="guatiguara-controller" aria-label="Parque Tecnológico Guatiguará"><div class="guatiguara-artboard">${AI_ARTWORK(`${assets+artwork[state.language]}`,`alt="" aria-hidden="true"`)}<div class="guatiguara-video-copy"><h2>${copy.video}</h2><p>${copy.soon}</p></div><nav class="guatiguara-controls" aria-label="Guatiguará controls"><button class="guatiguara-hit guatiguara-hit--es" type="button" data-language="es" aria-label="Español" aria-pressed="${state.language==='es'}"></button><button class="guatiguara-hit guatiguara-hit--en" type="button" data-language="en" aria-label="English" aria-pressed="${state.language==='en'}"></button><button class="guatiguara-hit guatiguara-hit--info" type="button" data-action="information" aria-label="${copy.info}" aria-pressed="${state.displayMode==='info'}"></button><button class="guatiguara-hit guatiguara-hit--video" type="button" data-action="video" aria-label="${copy.video}" aria-pressed="${state.displayMode==='video'}"></button><button class="guatiguara-hit guatiguara-hit--home-text" type="button" data-action="home" aria-label="${copy.home}"></button><button class="guatiguara-hit guatiguara-hit--home-icon" type="button" data-action="home" aria-label="${copy.home}"></button><button class="guatiguara-hit guatiguara-hit--back" type="button" data-action="home" aria-label="${copy.home}"></button><button class="guatiguara-hit guatiguara-hit--next" type="button" data-action="information" aria-label="${copy.next}"></button></nav></div></main>`;
   mount.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{
    state={...state,language:button.dataset.language};render();void publish();
   }));
   mount.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
    const action=button.dataset.action;
    if(action==='home')return void goHome();
    state={...state,displayMode:action==='video'?'video':'info'};render();void publish();
   }));
  }
  try{
   const remote=await sync.read();
   if(remote?.projectId==='04'){
    state.language=remote.language==='en'?'en':'es';
    state.displayMode=remote.mode==='info'?'info':['video','game','results'].includes(remote.mode)?'video':'landing';
   }
  }catch{}
  render();void publish();
 }
};
