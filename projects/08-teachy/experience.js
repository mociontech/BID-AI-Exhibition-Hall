/* Shared asset map: both clients use only files in 08-teachy/Public and
   08-teachy/Video. Keep the capital P and V: hosting paths are case-sensitive. */
(function(){
 const version='?v=20261103-video-1';
 const base=new URL('./Public/',document.currentScript.src);
 const videoBase=new URL('./Video/',document.currentScript.src);
 const asset=name=>new URL(name,base).href+version;
 const art={
  es:{
   tablet:asset('Imagen de ChatGPT 3 nov 2026, 12_24_11 p.m-1.png'),
   info:asset('Infografía Teachy_ IA para escuelas personalizadas.png')
  },
  en:{
   tablet:asset('Imagen de ChatGPT 3 nov 2026, 12_24_12 p.m-2.png'),
   info:asset('IA para una escuela personalizada y eficiente.png')
  },
  video:new URL('muestra-estacion-teachy-BID.mp4',videoBase).href+version
 };
 function renderVideo(mount,language){
  const alt=language==='en'?'Teachy video':'Video Teachy';
  // Keep the running video when only the language changes.
  const current=mount.querySelector('.teachy-display-video');
  if(current){current.closest('.teachy-display').setAttribute('aria-label',alt);return;}
  mount.innerHTML=`<main class="teachy-display teachy-display--video" aria-label="${alt}"><video class="teachy-display-video" src="${art.video}" autoplay loop playsinline preload="auto" aria-label="${alt}"></video></main>`;
  const video=mount.querySelector('.teachy-display-video');
  // Browsers may block sound without a user gesture on the TV: fall back to muted playback.
  const play=()=>video.play().catch(()=>{video.muted=true;return video.play().catch(()=>{});});
  play();
 }
 function renderDisplay(mount,data){
  const language=data.language==='es'?'es':'en';
  document.documentElement.lang=language;
  if(data.mode==='video')return renderVideo(mount,language);
  const info=data.mode==='info';
  const alt=language==='en'?(info?'Teachy infographic':'Teachy main screen'):(info?'Infografía Teachy':'Pantalla principal Teachy');
  mount.innerHTML=`<main class="teachy-display" aria-label="${alt}">${AI_ARTWORK(`${art[language][info?'info':'tablet']}`,`class="teachy-display-image"  alt="${alt}" width="1672" height="941"`)}</main>`;
 }
 window.TEACHY={art,renderDisplay};
})();
