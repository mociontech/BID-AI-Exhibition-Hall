/* Station 04: the tablet selects information or the institutional video slot.
   Portada nov 2026 ("AI en acción") con barra superior ES/EN · Back · Home como la Station 03. */
window.ProjectModule={
 id:'04',
 async mountController({sync,mount,home}){
  const cover='./Parque Tecnológico Guatiguará_ AI en acción.png';
  let state={language:'en',displayMode:'landing'};
  function publish(){
   return sync.send({view:'project',projectId:'04',section:state.displayMode==='landing'?null:state.displayMode,language:state.language,mode:state.displayMode,screenIndex:null,game:null});
  }
  async function goHome(){
   await sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null});
   location.assign(home);
  }
  function render(){
   const es=state.language==='es';
   const copy=es
    ? {info:'Mostrar información en la pantalla principal',video:'Video institucional',home:'Inicio',homeLabel:'Inicio: ver los 11 proyectos',back:'Volver',backLabel:'Volver a la portada del proyecto',live:'La información se muestra en la pantalla principal.'}
    : {info:'Show information on the main display',video:'Institutional video',home:'Home',homeLabel:'Home: view the 11 projects',back:'Back',backLabel:'Back to the project cover',live:'Information is playing on the main display.'};
   const showBack=state.displayMode!=='landing';
   mount.innerHTML=`<main class="gt-art" aria-label="Parque Tecnológico Guatiguará controller"><div class="gt-artboard"><img src="${cover}" alt="" aria-hidden="true"><div class="gt-art-controls"><nav class="gt-nav" aria-label="Station tools"><div class="gt-language" aria-label="Language"><button type="button" data-language="es" aria-pressed="${es}">ES</button><button type="button" data-language="en" aria-pressed="${!es}">EN</button></div>${showBack?`<button class="gt-home gt-back" type="button" data-action="menu" aria-label="${copy.backLabel}"><span aria-hidden="true">←</span><span>${copy.back}</span></button>`:''}<button class="gt-home" type="button" data-action="home" aria-label="${copy.homeLabel}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg><span>${copy.home}</span></button></nav><button class="gt-hit gt-hit--info" type="button" data-action="information" aria-label="${copy.info}" aria-pressed="${state.displayMode==='info'}"></button><button class="gt-hit gt-hit--video" type="button" data-action="video" aria-label="${copy.video}" aria-pressed="${state.displayMode==='video'}"></button><span class="gt-sr" aria-live="polite">${state.displayMode==='info'?copy.live:''}</span></div></div></main>`;
   mount.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{
    state={...state,language:button.dataset.language};render();void publish();
   }));
   mount.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
    const action=button.dataset.action;
    if(action==='home')return void goHome();
    state={...state,displayMode:action==='menu'?'landing':action==='video'?'video':'info'};render();void publish();
   }));
  }
  try{
   const remote=await sync.read();
   if(remote?.projectId==='04'){
    state.language=remote.language==='es'?'es':'en';
    state.displayMode=remote.mode==='info'?'info':['video','game','results'].includes(remote.mode)?'video':'landing';
   }
  }catch{}
  render();void publish();
 }
};
