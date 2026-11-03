/* Station 03 controller. The tablet remains on the approved main screen while
   information is shown on the TV. The supplied prototype starts after the CTA. */
window.ProjectModule={
 id:'03',
 async mountController({sync,mount,home}){
  const asset='./public/';
  const art={es:'Imagen de ChatGPT 29 oct 2026, 03_20_41 p.m-1.png',en:'Imagen de ChatGPT 29 oct 2026, 03_20_42 p.m-4.png'};
  /* Minijuego rediseñado (HTML/CSS/JS propios). El prototipo V5 original queda disponible con ?legacy=1 para comparar. */
  const legacyGame=new URLSearchParams(location.search).get('legacy')==='1';
  const gameUrl=legacyGame?'./Codex_Paquete_CR_Smart_Borders_VUCE/Codex_Paquete_CR_Smart_Borders_VUCE/03_HTML_BASE/prototipo_actual_V5.html':'./game/index.html';
  let timer=null;
  let state={language:'es',screen:'home',displayMode:'landing',gameReady:false};
  function packet(){const isGame=state.screen==='game',mode=isGame?'game':state.displayMode;return {view:isGame?'game':'project',projectId:'03',section:mode,language:state.language,mode,screenIndex:isGame?3:(mode==='landing'?1:2),game:null};}
  function cancelTimer(){if(timer){clearTimeout(timer);timer=null;}}
  function render(){mount.innerHTML=state.screen==='game'?game():home();bind();}
  function update(next){state={...state,...next};render();void sync.send(packet());}
  function unlockGame(){timer=null;if(state.screen!=='home'||state.displayMode!=='info')return;update({displayMode:'cta',gameReady:true});}
  function startInformation(){cancelTimer();update({screen:'home',displayMode:'info',gameReady:false});timer=setTimeout(unlockGame,10000);}
  function returnToMenu(){cancelTimer();update({screen:'home',displayMode:'landing',gameReady:false});}
  async function goExhibitionHome(){cancelTimer();await sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null});location.assign('/index.html'+sync.stationQuery);}
  function openGame(){if(!state.gameReady)return;cancelTimer();update({screen:'game',displayMode:'game'});}
  function home(){const image=asset+art[state.language],disabled=state.gameReady?'':' disabled aria-disabled="true"';return `<main class="crb-art" aria-label="Costa Rica Smart Borders controller">${AI_ARTWORK(`${image}`,`alt="Costa Rica Smart Borders"`,'none')}<div class="crb-art-controls"><div class="crb-language" aria-label="Language"><button type="button" data-language="es" aria-pressed="${state.language==='es'}">ES</button><button type="button" data-language="en" aria-pressed="${state.language==='en'}">EN</button></div><button class="crb-hit crb-hit--info" type="button" data-action="information" aria-label="${state.language==='es'?'Mostrar información en la pantalla principal':'Show information on the main display'}"></button><button class="crb-hit crb-hit--game" type="button" data-action="game" aria-label="${state.language==='es'?'Abrir minijuego':'Open mini-game'}"${disabled}></button><button class="crb-hit crb-hit--home-left" type="button" data-action="home" aria-label="${state.language==='es'?'Inicio: ver los 11 proyectos':'Home: view the 11 projects'}"></button><button class="crb-hit crb-hit--home-right" type="button" data-action="home" aria-label="${state.language==='es'?'Inicio: ver los 11 proyectos':'Home: view the 11 projects'}"></button><button class="crb-hit crb-hit--back" type="button" data-action="home" aria-label="${state.language==='es'?'Volver a proyectos':'Back to projects'}"></button><button class="crb-hit crb-hit--next" type="button" data-action="information" aria-label="${state.language==='es'?'Siguiente: información':'Next: information'}"></button><span class="crb-sr" aria-live="polite">${state.displayMode==='info'?'Information is playing on the main display.':state.displayMode==='cta'?'The mini-game is available.':''}</span></div></main>`;}
  function game(){return `<main class="crb-prototype" aria-label="Costa Rica Smart Borders mini-game"><iframe src="${gameUrl}" title="Costa Rica Smart Borders mini-game"></iframe>${legacyGame?`<button class="crb-exit" type="button" data-action="home">${state.language==='es'?'Inicio':'Home'}</button>`:''}</main>`;}
  function connectGame(frame){
   frame.addEventListener('load',()=>{
    const doc=frame.contentDocument;
    if(!doc)return;
    doc.getElementById(state.language==='en'?'en':'es')?.click();
    doc.addEventListener('click',event=>{
     const control=event.target.closest('button');
     if(!control)return;
     if(control.matches('#home,#navHome,#brandBtn,[data-act="home"]')){
      event.preventDefault();event.stopImmediatePropagation();void goExhibitionHome();return;
     }
     if(control.id==='es'||control.id==='en'||control.id==='langES'||control.id==='langEN'){
      state.language=(control.id==='en'||control.id==='langEN')?'en':'es';
      void sync.send(packet());
     }
    },true);
   },{once:true});
  }
  function bind(){
   mount.querySelectorAll('[data-language]').forEach(button=>button.onclick=()=>update({language:button.dataset.language}));
   mount.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>{const action=button.dataset.action;if(action==='information')startInformation();if(action==='game')openGame();if(action==='menu')returnToMenu();if(action==='home')void goExhibitionHome();});
   const frame=mount.querySelector('.crb-prototype iframe');if(frame)connectGame(frame);
  }
  try{const remote=await sync.read();if(remote?.projectId==='03'){state.language=remote.language==='en'?'en':'es';if(remote.mode==='game')state={...state,screen:'game',displayMode:'game',gameReady:true};else if(remote.mode==='cta')state={...state,displayMode:'cta',gameReady:true};else if(remote.mode==='info'){state={...state,displayMode:'info',gameReady:false};timer=setTimeout(unlockGame,10000);}}}catch{}
  render();void sync.send(packet());
 }
};
