/* Shared asset map and TV renderer for station 06 (RegLAC).
   Both clients use only files in 06-reglac/Public and 06-reglac/Video.
   Keep the capital P and V: hosting paths are case-sensitive. */
(function(){
 const version='?v=20261113-menu-1';
 const base=new URL('./Public/',document.currentScript.src);
 const videoBase=new URL('./Video/',document.currentScript.src);
 const asset=name=>new URL(name,base).href+version;
 const art={
  /* Main menu supplied on 13 Nov 2026 (1920 × 1080, English). */
  menu:asset('reglac-menu-en.png'),
  /* "About project" infographic (1920 × 1080) and the same sheet with its content erased,
     used as the empty blue panel, card frames and impact bar while the sheet builds. */
  info:asset('reglac-infografia-en.png'),
  infoBase:asset('reglac-infografia-base.png'),
  video:new URL('RegLac_SUB_EN_web.mp4',videoBase).href+version
 };
 const words={
  screen:'RegLAC, VPS · IFD: AI-Powered Regulatory Analysis. About the project and Video.',
  info:'RegLAC infographic: the challenge, the solution and the impact to date',
  video:'RegLAC video',
  tvCta:'Select an option on the tablet',
  infoCta:'When you are ready, tap “Video” on the tablet'
 };

 /* Older packets (game, results, cta) open their replacement: the video or the infographic. */
 const normalizeMode=mode=>['video','game','results'].includes(mode)?'video':['info','cta'].includes(mode)?'info':'landing';

 /* The menu artwork is drawn in two bands of the same 1920 × 1080 image: the blue bar (top 126 px)
    stays at the top of the screen and the body (the remaining 954 px) is centred in the space
    left, so 4:3 and 16:10 tablets keep it balanced. At 16:9 it is the PNG pixel for pixel. */
 function frame(cls,label,bar,body){
  return `<main class="rgl-menu ${cls}" lang="en" style="--art:url('${art.menu}')" aria-label="${label}"><div class="rgl-bar"><div class="rgl-band rgl-band--bar">${bar}</div></div><div class="rgl-body"><div class="rgl-band rgl-band--body">${body}</div></div></main>`;
 }
 const TABLET_ICON='<svg viewBox="0 0 21 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x=".75" y=".75" width="19.5" height="14.5" rx="2.2"/></svg>';
 const DOWN_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v15M5.5 13l6.5 6.5 6.5-6.5"/></svg>';
 const BACK_ICON='<svg viewBox="0 0 18 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.6 8H1.4M7.4 1.8 1.4 8l6 6.2"/></svg>';

 /* The infographic animated element by element, like the IDB reference
    "Iniciativa 2.2_animada_PRO" (same timing as the VUCE 3.0 and Teachy sheets): the blue panel
    sweeps in, the title rises, then the challenge, the solution and each impact figure.
    Every piece is a crop of the supplied PNG, so the finished frame is the PNG itself;
    at the end the full PNG fades in on top to remove any sub-pixel seam.
    These boxes are also the areas erased in reglac-infografia-base.png. */
 const box=(x,y,w,h)=>({x,y,w,h});
 const SHEET={
  panel:box(0,0,764,1080),
  logo:box(60,64,301,77),title:box(62,455,500,140),sub1:box(62,596,260,42),sub2:box(62,638,420,49),unit:box(62,689,200,48),
  cards:[
   {frame:box(838,200,486,397),head:box(870,228,296,41),icon:box(870,292,119,119),text:box(870,430,421,139)},
   {frame:box(1366,199,486,398),head:box(1398,227,265,41),icon:box(1398,291,119,119),text:box(1398,429,403,139)}
  ],
  impactTitle:box(870,638,296,41),
  bar:box(838,695,1008,185),
  facts:[
   {value:box(874,718,200,61),label:box(874,780,206,60)},
   {value:box(1214,718,60,61),label:box(1214,780,196,32),divider:box(1177,723,9,128)},
   {value:box(1535,716,170,63),label:box(1535,780,222,82),divider:box(1501,723,9,128)}
  ]
 };
 /* One cropped piece: --x/--y are relative to its parent piece, --sx/--sy pick the crop. */
 function piece(cls,b,source,parent,inner='',style=''){
  const px=parent?parent.x:0,py=parent?parent.y:0;
  return `<span class="rls-el ${cls}" style="--x:${b.x-px};--y:${b.y-py};--w:${b.w};--h:${b.h};${style}"><i class="rls-crop rls-crop--${source}" style="--sx:${b.x};--sy:${b.y}"></i>${inner}</span>`;
 }
 function sheet(){
  const s=SHEET;
  const panel=piece('rls-panel',s.panel,'base',null,
   piece('rls-logo',s.logo,'full',s.panel)+
   piece('rls-rise rls-title',s.title,'full',s.panel,'','--t:1.2s')+
   piece('rls-rise rls-sub',s.sub1,'full',s.panel,'','--t:1.5s')+
   piece('rls-rise rls-sub',s.sub2,'full',s.panel,'','--t:1.62s')+
   piece('rls-rise rls-unit',s.unit,'full',s.panel,'','--t:1.8s'));
  const cards=s.cards.map((c,i)=>piece(`rls-card rls-card--${i?'solution':'challenge'}`,c.frame,'base',null,
   piece('rls-head',c.head,'full',c.frame)+
   piece('rls-icon',c.icon,'full',c.frame)+
   piece('rls-text',c.text,'full',c.frame),
   `--d:${(1.8+i*.7).toFixed(1)}s`)).join('');
  const facts=s.facts.map((f,i)=>
   (f.divider?piece('rls-divider',f.divider,'full',s.bar,'',`--i:${i}`):'')+
   piece('rls-rise rls-value',f.value,'full',s.bar,'',`--i:${i}`)+
   piece('rls-label',f.label,'full',s.bar,'',`--i:${i}`)).join('');
  return `<section class="rls-sheet is-animated" style="--full:url('${art.info}');--base:url('${art.infoBase}')" aria-label="RegLAC · AI-Powered Regulatory Analysis · VPS · IFD">
   <div class="rls-stage">
    <i class="rls-veil" aria-hidden="true"></i>
    ${panel}${cards}
    ${piece('rls-impact-title',s.impactTitle,'full',null)}
    ${piece('rls-bar',s.bar,'base',null,facts)}
    <img class="rls-final" src="${art.info}" width="1920" height="1080" alt="${words.info}">
   </div>
   <div class="rls-cta" role="status">${TABLET_ICON}<strong>${words.infoCta}</strong><i aria-hidden="true">${DOWN_ICON}</i></div>
  </section>`;
 }

 /* Tablet: the menu artwork with touch zones; the Back pill sits next to Home (module.js shows it). */
 function tabletMenu(t){
  const hit=(action,label,extra='')=>`<button type="button" class="rgl-hit rgl-hit--${action}" data-action="${action}" aria-label="${label}"${extra}></button>`;
  return frame('rgl-menu--tablet',words.screen,
   `<button type="button" class="rgl-back" data-action="back" aria-label="${t.back}" hidden>${BACK_ICON}<span>Back</span></button>`+hit('home',t.home),
   hit('information',t.info,' aria-pressed="false"')+hit('video',t.video,' aria-pressed="false"'));
 }

 function renderVideo(mount){
  // Keep the running video when the same state arrives again.
  if(mount.querySelector('.reglac-display-video'))return;
  mount.innerHTML=`<main class="reglac-display reglac-display--video" aria-label="${words.video}"><video class="reglac-display-video" src="${art.video}" autoplay loop playsinline preload="auto" aria-label="${words.video}"></video></main>`;
  const video=mount.querySelector('.reglac-display-video');
  // Browsers may block sound without a user gesture on the TV: fall back to muted playback.
  video.play().catch(()=>{video.muted=true;return video.play().catch(()=>{});});
 }
 function renderInfo(mount){
  // Do not remount (and restart the animation) if the sheet is already on screen.
  if(mount.querySelector('.rls-sheet'))return;
  mount.innerHTML=`<main class="reglac-display reglac-display--info" aria-label="RegLAC infographic">${sheet()}</main>`;
 }
 /* TV main menu: the same artwork without controls, plus the guidance pill used on the other TV menus. */
 function renderLanding(mount){
  if(mount.querySelector('.rgl-menu--landing'))return;
  mount.innerHTML=frame('rgl-menu--tv rgl-menu--landing',words.screen,'',
   `<div class="rgl-cta" role="status">${TABLET_ICON}<strong>${words.tvCta}</strong></div>`);
 }
 /* TV entry point: shared/display.js calls REGLAC.renderInto(app,data,{readonly:true}). */
 function renderInto(mount,data){
  document.documentElement.lang='en';
  const mode=normalizeMode(data?.mode);
  if(mode==='video')return renderVideo(mount);
  if(mode==='info')return renderInfo(mount);
  return renderLanding(mount);
 }
 window.REGLAC={art,words,normalizeMode,renderInto,tabletMenu};
})();
