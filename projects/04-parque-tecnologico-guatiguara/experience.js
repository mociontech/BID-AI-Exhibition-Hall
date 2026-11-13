/* Shared asset map and renderers for station 04 (Parque Tecnológico Guatiguará).
   Main menu and infographic supplied on 13 Nov 2026 (1920 × 1080, English only).
   Both clients use only files in 04-parque-tecnologico-guatiguara/Public and /Video.
   Keep the capital P and V: hosting paths are case-sensitive. */
(function(){
 const version='?v=20261113-menu-1';
 const base=new URL('./Public/',document.currentScript.src);
 const videoBase=new URL('./Video/',document.currentScript.src);
 const asset=name=>new URL(name,base).href+version;
 /* The institutional video has not been delivered yet. When it arrives, save it as
    Video/<name>.mp4 (H.264, under 100 MB) and write its file name here: the TV then plays it
    full screen in a loop instead of the "coming soon" screen. */
 const VIDEO_FILE='';
 const art={
  menu:asset('guatiguara-menu-en.png'),
  /* "About the project" infographic and the same sheet with its content erased, used as the
     empty blue panel, card frames and impact bar while the sheet builds. */
  info:asset('guatiguara-infografia-en.png'),
  infoBase:asset('guatiguara-infografia-base.png'),
  video:VIDEO_FILE?new URL(VIDEO_FILE,videoBase).href+version:''
 };
 const words={
  screen:'Parque Tecnológico Guatiguará, VPS · PTI: Regional AI Hub. About the project and Video.',
  info:'Parque Tecnológico Guatiguará infographic: the challenge, the solution and the impact to date',
  video:'Parque Tecnológico Guatiguará video',
  tvCta:'Select an option on the tablet',
  soon:'Coming soon'
 };

 /* Older packets (game, results, cta) open their replacement: the video or the infographic. */
 const normalizeMode=mode=>['video','game','results'].includes(mode)?'video':['info','cta'].includes(mode)?'info':'landing';

 /* The artwork is drawn in two bands of the same 1920 × 1080 image: the blue bar (top 126 px)
    stays at the top of the screen and the body (the remaining 954 px) is centred in the space
    left, so 4:3 and 16:10 tablets keep it balanced. At 16:9 it is the PNG pixel for pixel. */
 function frame(cls,label,bar,body){
  return `<main class="gtg-menu ${cls}" lang="en" style="--art:url('${art.menu}')" aria-label="${label}"><div class="gtg-bar"><div class="gtg-band gtg-band--bar">${bar}</div></div><div class="gtg-body"><div class="gtg-band gtg-band--body">${body}</div></div></main>`;
 }
 const TABLET_ICON='<svg viewBox="0 0 21 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x=".75" y=".75" width="19.5" height="14.5" rx="2.2"/></svg>';
 const BACK_ICON='<svg viewBox="0 0 18 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.6 8H1.4M7.4 1.8 1.4 8l6 6.2"/></svg>';

 /* The infographic animated element by element, like the IDB reference
    "Iniciativa 2.2_animada_PRO" (same timing as the VUCE 3.0, Teachy and RegLAC sheets): the blue
    panel sweeps in, the title rises, then the challenge, the solution and each impact figure.
    Every piece is a crop of the supplied PNG, so the finished frame is the PNG itself;
    at the end the full PNG fades in on top to remove any sub-pixel seam.
    These boxes are also the areas erased in guatiguara-infografia-base.png. */
 const box=(x,y,w,h)=>({x,y,w,h});
 const SHEET={
  panel:box(0,0,764,1080),
  logo:box(60,64,301,77),title:box(62,340,640,312),sub:box(62,660,340,60),unit:box(62,724,200,50),
  cards:[
   {frame:box(834,155,489,474),head:box(866,184,300,44),icon:box(866,247,122,122),text:box(866,385,430,222)},
   {frame:box(1362,155,489,474),head:box(1394,183,270,44),icon:box(1394,246,122,122),text:box(1394,384,400,144)}
  ],
  impactTitle:box(866,655,300,44),
  bar:box(834,712,1011,188),
  facts:[
   {value:box(872,734,290,68),label:box(872,802,270,56)},
   {value:box(1230,738,180,60),label:box(1230,800,200,58),divider:box(1194,742,10,128)},
   {value:box(1531,735,175,62),label:box(1531,799,170,34),divider:box(1498,742,10,128)}
  ]
 };
 /* One cropped piece: --x/--y are relative to its parent piece, --sx/--sy pick the crop. */
 function piece(cls,b,source,parent,inner='',style=''){
  const px=parent?parent.x:0,py=parent?parent.y:0;
  return `<span class="gts-el ${cls}" style="--x:${b.x-px};--y:${b.y-py};--w:${b.w};--h:${b.h};${style}"><i class="gts-crop gts-crop--${source}" style="--sx:${b.x};--sy:${b.y}"></i>${inner}</span>`;
 }
 function sheet(){
  const s=SHEET;
  const panel=piece('gts-panel',s.panel,'base',null,
   piece('gts-logo',s.logo,'full',s.panel)+
   piece('gts-rise gts-title',s.title,'full',s.panel,'','--t:1.2s')+
   piece('gts-rise gts-sub',s.sub,'full',s.panel,'','--t:1.55s')+
   piece('gts-rise gts-unit',s.unit,'full',s.panel,'','--t:1.8s'));
  const cards=s.cards.map((c,i)=>piece(`gts-card gts-card--${i?'solution':'challenge'}`,c.frame,'base',null,
   piece('gts-head',c.head,'full',c.frame)+
   piece('gts-icon',c.icon,'full',c.frame)+
   piece('gts-text',c.text,'full',c.frame),
   `--d:${(1.8+i*.7).toFixed(1)}s`)).join('');
  const facts=s.facts.map((f,i)=>
   (f.divider?piece('gts-divider',f.divider,'full',s.bar,'',`--i:${i}`):'')+
   piece('gts-rise gts-value',f.value,'full',s.bar,'',`--i:${i}`)+
   piece('gts-label',f.label,'full',s.bar,'',`--i:${i}`)).join('');
  return `<section class="gts-sheet is-animated" style="--full:url('${art.info}');--base:url('${art.infoBase}')" aria-label="Parque Tecnológico Guatiguará · Regional AI Hub · VPS · PTI">
   <div class="gts-stage">
    <i class="gts-veil" aria-hidden="true"></i>
    ${panel}${cards}
    ${piece('gts-impact-title',s.impactTitle,'full',null)}
    ${piece('gts-bar',s.bar,'base',null,facts)}
    <img class="gts-final" src="${art.info}" width="1920" height="1080" alt="${words.info}">
   </div>
  </section>`;
 }

 /* Tablet: the menu artwork with touch zones; the Back pill sits next to Home (module.js shows it). */
 function tabletMenu(t){
  const hit=(action,label,extra='')=>`<button type="button" class="gtg-hit gtg-hit--${action}" data-action="${action}" aria-label="${label}"${extra}></button>`;
  return frame('gtg-menu--tablet',words.screen,
   `<button type="button" class="gtg-back" data-action="back" aria-label="${t.back}" hidden>${BACK_ICON}<span>Back</span></button>`+hit('home',t.home),
   hit('information',t.info,' aria-pressed="false"')+hit('video',t.video,' aria-pressed="false"'));
 }

 function renderPlaceholder(mount){
  mount.innerHTML=frame('gtg-menu--tv gtg-menu--soon',words.video,'<i class="gtg-bar-patch" aria-hidden="true"></i>',
   `<section class="gtg-soon"><i class="gtg-soon-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="m8 4.5 12 7.5-12 7.5z"/></svg></i><h1>Parque Tecnológico <b>Guatiguará</b></h1><p>Video</p><div class="gtg-cta gtg-cta--soon" role="status"><strong>${words.soon}</strong></div></section>`);
 }
 function renderVideo(mount){
  // Keep the running video (or the placeholder) when the same state arrives again.
  if(mount.querySelector('.gtg-display-video,.gtg-menu--soon'))return;
  if(!art.video)return renderPlaceholder(mount);
  mount.innerHTML=`<main class="gtg-display gtg-display--video" aria-label="${words.video}"><video class="gtg-display-video" src="${art.video}" autoplay loop playsinline preload="auto" aria-label="${words.video}"></video></main>`;
  const video=mount.querySelector('.gtg-display-video');
  video.addEventListener('error',()=>renderPlaceholder(mount),{once:true});
  // Browsers may block sound without a user gesture on the TV: fall back to muted playback.
  video.play().catch(()=>{video.muted=true;return video.play().catch(()=>{});});
 }
 function renderInfo(mount){
  // Do not remount (and restart the animation) if the sheet is already on screen.
  if(mount.querySelector('.gts-sheet'))return;
  mount.innerHTML=`<main class="gtg-display gtg-display--info" aria-label="Parque Tecnológico Guatiguará infographic">${sheet()}</main>`;
 }
 /* TV main menu: the same artwork without controls, plus the guidance pill used on the
    AquaData and PredictToDo TV menus. */
 function renderLanding(mount){
  if(mount.querySelector('.gtg-menu--landing'))return;
  mount.innerHTML=frame('gtg-menu--tv gtg-menu--landing',words.screen,'',
   `<div class="gtg-cta" role="status">${TABLET_ICON}<strong>${words.tvCta}</strong></div>`);
 }
 /* TV entry point: shared/display.js calls GUATIGUARA.renderInto(app,data). */
 function renderInto(mount,data){
  document.documentElement.lang='en';
  const mode=normalizeMode(data?.mode);
  if(mode==='video')return renderVideo(mount);
  if(mode==='info')return renderInfo(mount);
  return renderLanding(mount);
 }
 window.GUATIGUARA={art,words,normalizeMode,renderInto,tabletMenu};
})();
