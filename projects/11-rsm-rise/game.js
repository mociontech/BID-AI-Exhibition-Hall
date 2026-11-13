/* Each isolated source document exposes one device. AI_SYNC is the only transport. */
(function(){
 const source=new URL('./v36/screen.html',document.currentScript.src);
 const frameHTML=role=>`<iframe class="rise-v34-frame" data-rise-device="${role}" src="${source.href}?role=${role}&v=36-back-1" title="RISE ${role==='tv'?'main display':'tablet controller'}" allow="fullscreen"></iframe>`;
 function send(frame,game,language){
  frame?.contentWindow?.postMessage({type:'rise:state',game,language,now:window.AI_SYNC?.now()||Date.now()},location.origin);
 }
 function connectController(mount,{game,language,onChange,onHome}){
  const frame=mount.querySelector('[data-rise-device="tablet"]');
  const receive=event=>{
   if(event.origin!==location.origin||event.source!==frame.contentWindow)return;
   if(event.data?.type==='rise:ready')send(frame,game,language);
   if(event.data?.type==='rise:home')onHome();
   if(event.data?.type==='rise:change'){
    const clean=RISE_STATE.sanitize(event.data.game);
    if(clean&&['en','es'].includes(event.data.language)){
     game=clean;language=event.data.language;onChange(game,language);
    }
   }
  };
  window.addEventListener('message',receive);
  return ()=>window.removeEventListener('message',receive);
 }
 let displayFrame=null,displayData=null;
 window.addEventListener('message',event=>{
  if(event.origin===location.origin&&event.source===displayFrame?.contentWindow&&event.data?.type==='rise:ready'&&displayData)
   send(displayFrame,displayData.game,displayData.language);
 });
 function renderDisplay(mount,data){
  displayData=data;document.documentElement.lang=data.language==='es'?'es':'en';
  if(!displayFrame?.isConnected||!mount.contains(displayFrame)){
   mount.innerHTML=`<main class="rise-v34-tv">${frameHTML('tv')}</main>`;
   displayFrame=mount.querySelector('iframe');
  }else send(displayFrame,data.game,data.language);
 }
 function stopDisplay(){displayData=null;displayFrame=null;}
 window.RISE_GAME={tabletHTML:()=>frameHTML('tablet'),connectController,renderDisplay,stopDisplay};
})();
