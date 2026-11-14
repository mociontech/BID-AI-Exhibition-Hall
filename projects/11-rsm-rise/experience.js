/* Station 11 (RISE): main menu, animated "About the project" infographic and the v36 experience.
   Same pattern as stations 04 and 06. Both clients use only files in 11-rsm-rise/Public.
   Keep the capital P: hosting paths are case-sensitive. */
(function(){
 const version='?v=20261114-menu-1';
 const base=new URL('./Public/',document.currentScript.src);
 const asset=name=>new URL(name,base).href+version;
 const art={
  /* Main menu supplied on 14 Nov 2026 (1920 × 1080, English). */
  menu:asset('rise-menu-en.png'),
  /* "About the project" infographic (1920 × 1080) and the same sheet with its content erased,
     used as the empty blue panel, card frames and impact bar while the sheet builds. */
  info:asset('rise-infografia-en.png'),
  infoBase:asset('rise-infografia-base.png')
 };
 const words={
  screen:'RISE, IDB Invest: Risk Intelligence and Strategy Engine. About the project and Interactive experience.',
  info:'RISE infographic: the challenge, the solution and the impact to date',
  tvCta:'Select an option on the tablet',
  infoCta:'When you are ready, tap “Interactive experience” on the tablet'
 };

 /* What the TV shows: the v36 experience only with a valid game packet; otherwise the menu or the infographic. */
 function normalizeMode(data){
  if(['game','results'].includes(data?.mode)&&RISE_STATE.sanitize(data.game))return 'game';
  return data?.mode==='info'||data?.mode==='cta'?'info':'landing';
 }

 /* The menu artwork is drawn in two bands of the same 1920 × 1080 image: the blue bar (top 126 px)
    stays at the top of the screen and the body (the remaining 954 px) is centred in the space
    left, so 4:3 and 16:10 tablets keep it balanced. At 16:9 it is the PNG pixel for pixel. */
 function frame(cls,label,bar,body){
  return `<main class="rsm-menu ${cls}" lang="en" style="--art:url('${art.menu}')" aria-label="${label}"><div class="rsm-bar"><div class="rsm-band rsm-band--bar">${bar}</div></div><div class="rsm-body"><div class="rsm-band rsm-band--body">${body}</div></div></main>`;
 }
 const TABLET_ICON='<svg viewBox="0 0 21 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x=".75" y=".75" width="19.5" height="14.5" rx="2.2"/></svg>';
 const DOWN_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v15M5.5 13l6.5 6.5 6.5-6.5"/></svg>';
 const BACK_ICON='<svg viewBox="0 0 18 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.6 8H1.4M7.4 1.8 1.4 8l6 6.2"/></svg>';

 /* The infographic animated element by element, like the IDB reference
    "Iniciativa 2.2_animada_PRO" (same timing as the other stations): the blue panel sweeps in,
    the title rises, then the challenge, the solution and each impact figure.
    Every piece is a crop of the supplied PNG, so the finished frame is the PNG itself;
    at the end the full PNG fades in on top to remove any sub-pixel seam.
    These boxes are also the areas erased in rise-infografia-base.png. */
 const box=(x,y,w,h)=>({x,y,w,h});
 const SHEET={
  panel:box(0,0,764,1080),
  logo:box(60,64,301,77),title:box(62,447,300,110),sub1:box(62,566,430,48),sub2:box(62,614,430,48),unit:box(62,668,220,48),
  cards:[
   {frame:box(838,200,485,396),head:box(870,228,296,41),icon:box(870,292,119,119),text:box(870,430,421,139)},
   {frame:box(1366,200,485,396),head:box(1398,227,265,41),icon:box(1398,291,119,119),text:box(1398,429,403,139)}
  ],
  impactTitle:box(870,638,296,41),
  bar:box(838,695,1008,185),
  facts:[
   {value:box(874,718,200,68),label:box(874,786,206,56)},
   {value:box(1218,716,190,66),label:box(1218,784,196,78),divider:box(1181,723,9,128)},
   {value:box(1562,716,60,64),label:box(1562,784,222,56),divider:box(1529,723,9,128)}
  ]
 };
 /* One cropped piece: --x/--y are relative to its parent piece, --sx/--sy pick the crop. */
 function piece(cls,b,source,parent,inner='',style=''){
  const px=parent?parent.x:0,py=parent?parent.y:0;
  return `<span class="rss-el ${cls}" style="--x:${b.x-px};--y:${b.y-py};--w:${b.w};--h:${b.h};${style}"><i class="rss-crop rss-crop--${source}" style="--sx:${b.x};--sy:${b.y}"></i>${inner}</span>`;
 }
 function sheet(){
  const s=SHEET;
  const panel=piece('rss-panel',s.panel,'base',null,
   piece('rss-logo',s.logo,'full',s.panel)+
   piece('rss-rise rss-title',s.title,'full',s.panel,'','--t:1.2s')+
   piece('rss-rise rss-sub',s.sub1,'full',s.panel,'','--t:1.5s')+
   piece('rss-rise rss-sub',s.sub2,'full',s.panel,'','--t:1.62s')+
   piece('rss-rise rss-unit',s.unit,'full',s.panel,'','--t:1.8s'));
  const cards=s.cards.map((c,i)=>piece(`rss-card rss-card--${i?'solution':'challenge'}`,c.frame,'base',null,
   piece('rss-head',c.head,'full',c.frame)+
   piece('rss-icon',c.icon,'full',c.frame)+
   piece('rss-text',c.text,'full',c.frame),
   `--d:${(1.8+i*.7).toFixed(1)}s`)).join('');
  const facts=s.facts.map((f,i)=>
   (f.divider?piece('rss-divider',f.divider,'full',s.bar,'',`--i:${i}`):'')+
   piece('rss-rise rss-value',f.value,'full',s.bar,'',`--i:${i}`)+
   piece('rss-label',f.label,'full',s.bar,'',`--i:${i}`)).join('');
  return `<section class="rss-sheet is-animated" style="--full:url('${art.info}');--base:url('${art.infoBase}')" aria-label="RISE · Risk Intelligence and Strategy Engine · IDB Invest">
   <div class="rss-stage">
    <i class="rss-veil" aria-hidden="true"></i>
    ${panel}${cards}
    ${piece('rss-impact-title',s.impactTitle,'full',null)}
    ${piece('rss-bar',s.bar,'base',null,facts)}
    <img class="rss-final" src="${art.info}" width="1920" height="1080" alt="${words.info}">
   </div>
   <div class="rss-cta" role="status">${TABLET_ICON}<strong>${words.infoCta}</strong><i aria-hidden="true">${DOWN_ICON}</i></div>
  </section>`;
 }

 /* Tablet: the menu artwork with touch zones; the Back pill sits next to Home (module.js shows it). */
 function tabletMenu(t){
  const hit=(action,label,extra='')=>`<button type="button" class="rsm-hit rsm-hit--${action}" data-action="${action}" aria-label="${label}"${extra}></button>`;
  return frame('rsm-menu--tablet',words.screen,
   `<button type="button" class="rsm-back" data-action="back" aria-label="${t.back}" hidden>${BACK_ICON}<span>Back</span></button>`+hit('home',t.home),
   hit('information',t.info,' aria-pressed="false"')+hit('interactive',t.interactive));
 }

 function renderInfo(mount){
  // Do not remount (and restart the animation) if the sheet is already on screen.
  if(mount.querySelector('.rss-sheet'))return;
  mount.innerHTML=`<main class="rise-display rise-display--info" aria-label="RISE infographic">${sheet()}</main>`;
 }
 /* TV main menu: the same artwork without controls, plus the guidance pill used on the other TV menus. */
 function renderLanding(mount){
  if(mount.querySelector('.rsm-menu--landing'))return;
  mount.innerHTML=frame('rsm-menu--tv rsm-menu--landing',words.screen,'',
   `<div class="rsm-cta" role="status">${TABLET_ICON}<strong>${words.tvCta}</strong></div>`);
 }
 /* TV entry point: shared/display.js calls RSM_RISE.renderDisplay(app,data). */
 function renderDisplay(mount,data){
  const mode=normalizeMode(data);
  if(mode==='game'){
   RISE_GAME.renderDisplay(mount,{...data,game:RISE_STATE.sanitize(data.game),language:data.language==='es'?'es':'en'});
   return;
  }
  RISE_GAME.stopDisplay();
  document.documentElement.lang='en';
  if(mode==='info')return renderInfo(mount);
  return renderLanding(mount);
 }
 window.RSM_RISE={art,words,normalizeMode,tabletMenu,renderDisplay};
})();
