/* Station 08: supplied tablet artwork with functional touch controls.
   Information and Video change only the TV; the tablet keeps its artwork. */
window.ProjectModule={
 id:'08',
 async mountController({sync,mount,home}){
  let state={language:'es',mode:'landing'};
  const labels={
   es:{screen:'Teachy: pantalla principal',info:'Mostrar información en la TV',video:'Reproducir el video en la TV',home:'Inicio: volver a los proyectos',back:'Volver al inicio de Teachy',fullscreen:'Activar o salir de pantalla completa'},
   en:{screen:'Teachy: main screen',info:'Show information on the TV',video:'Play the video on the TV',home:'Home: back to projects',back:'Back to Teachy',fullscreen:'Enter or exit fullscreen'}
  };
  function publish(){
   return sync.send({view:'project',projectId:'08',section:state.mode==='info'||state.mode==='video'?state.mode:null,language:state.language,mode:state.mode,screenIndex:null,game:null});
  }
  async function goHome(){
   await sync.send({view:'home',projectId:null,section:null,language:state.language,mode:null,screenIndex:null,game:null});
   location.assign(home);
  }
  function render(){
   const t=labels[state.language];
   document.documentElement.lang=state.language;
   mount.innerHTML=`<main class="teachy-tablet" aria-label="${t.screen}">
    <div class="teachy-artboard">
     ${AI_ARTWORK(`${TEACHY.art[state.language].tablet}`,`class="teachy-tablet-image"  alt="${t.screen}" draggable="false"`)}
     <nav class="teachy-controls" aria-label="Teachy">
      <button class="teachy-hit teachy-hit--es" type="button" data-language="es" aria-label="Español" aria-pressed="${state.language==='es'}"></button>
      <button class="teachy-hit teachy-hit--en" type="button" data-language="en" aria-label="English" aria-pressed="${state.language==='en'}"></button>
      <button class="teachy-hit teachy-hit--info" type="button" data-action="information" aria-label="${t.info}"></button>
      <button class="teachy-hit teachy-hit--video" type="button" data-action="video" aria-label="${t.video}" title="${t.video}"></button>
      <button class="teachy-hit teachy-hit--home-text" type="button" data-action="home" aria-label="${t.home}"></button>
      <button class="teachy-hit teachy-hit--home" type="button" data-action="home" aria-label="${t.home}"></button>
      <button class="teachy-hit teachy-hit--back" type="button" data-action="back" aria-label="${t.back}"></button>
      <button class="teachy-hit teachy-hit--next" type="button" data-action="information" aria-label="${t.info}"></button>
      <button class="teachy-hit teachy-hit--fullscreen" type="button" data-action="fullscreen" aria-label="${t.fullscreen}" title="${t.fullscreen}"></button>
     </nav>
    </div>
   </main>`;
  }
  mount.addEventListener('click',async event=>{
   const button=event.target.closest('button');if(!button||button.disabled)return;
   if(button.dataset.language){
    if(button.dataset.language===state.language)return;
    state.language=button.dataset.language;
    render();
    mount.querySelector('[data-language="'+state.language+'"]').focus({preventScroll:true});
    void publish();return;
   }
   if(button.dataset.action==='information'){state.mode='info';void publish();return;}
   if(button.dataset.action==='video'){state.mode='video';void publish();return;}
   if(button.dataset.action==='back'){state.mode='landing';void publish();return;}
   if(button.dataset.action==='home'){void goHome();return;}
   if(button.dataset.action==='fullscreen'){
    try{
     if(document.fullscreenElement)await document.exitFullscreen();
     else await document.documentElement.requestFullscreen();
    }catch{}
   }
  });
  try{
   const remote=await sync.read();
   if(remote?.projectId==='08'&&remote.view!=='home'){
    state.language=remote.language==='en'?'en':'es';
    state.mode=['info','video'].includes(remote.mode)?remote.mode:'landing';
   }
  }catch{}
  render();void publish();
 }
};
