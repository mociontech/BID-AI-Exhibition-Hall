/* One media element and one operator gesture for the entire display session.
   Browser permission is never inferred from localStorage: a reload may need setup again. */
(function(){
 const tone=new URL('../assets/audio/setup-tone.wav',document.currentScript.src).href;
 const media=document.createElement('video');
 const panel=document.createElement('aside');
 panel.className='display-audio-setup';
 panel.setAttribute('aria-label','Display sound setup');
 panel.innerHTML='<p>Display setup</p><button type="button" data-display-audio-enable>Enable sound for all projects</button><span role="status">Enable once when preparing this display.</span>';
 document.body.append(panel);
 const button=panel.querySelector('button');
 const status=panel.querySelector('[role="status"]');
 let generation=0;
 function ready(){panel.hidden=true;button.disabled=false;}
 function needsSetup(){
  panel.hidden=false;button.disabled=false;
  status.textContent='Sound is blocked. Enable it on this display.';
 }
 async function start(){
  const current=++generation;
  media.muted=false;
  media.volume=1;
  try{
   await media.play();
   if(current===generation)ready();
  }catch(error){
   if(current!==generation||error.name==='AbortError')return;
   if(error.name!=='NotAllowedError'){
    button.disabled=false;
    status.textContent='Sound could not start. Check the media and try again.';
    return;
   }
   needsSetup();
   media.muted=true;
   // Keep the exhibition usable while the operator enables sound.
   if(media.isConnected)await media.play().catch(()=>{});
  }
 }
 function play(placeholder,{onError=null}={}){
  media.onerror=onError;
  if(placeholder!==media){
   ++generation;
   media.pause();
   // Keep the element itself: some browsers grant playback per media element.
   for(const attribute of Array.from(media.attributes))media.removeAttribute(attribute.name);
   for(const attribute of Array.from(placeholder.attributes)){
    if(attribute.name!=='autoplay')media.setAttribute(attribute.name,attribute.value);
   }
   placeholder.replaceWith(media);
  }
  return start();
 }
 button.addEventListener('click',()=>{
  button.disabled=true;
  status.textContent='Enabling sound…';
  if(!media.isConnected){
   // A brief audible confirmation unlocks this same player before any project opens.
   ++generation;media.pause();media.removeAttribute('loop');media.src=tone;
  }
  void start();
 });
 window.AI_DISPLAY_AUDIO={play};
 // On configured kiosks this succeeds without a gesture, including after a reload.
 media.src=tone;
 void start();
})();
