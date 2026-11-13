/* Project 02 landing (November 2026). The tablet shows the supplied main menu (menu-principal-en.png, 1920 × 1080,
   English) with touch zones over Home and the two cards; while the TV shows the project sheet a Back pill sits next
   to Home. The TV shows the same artwork without the Home pill (menu-principal-tv.png). In both files the subtitle
   reads «Bogotá Traffic Prediction»: the delivered menuprincipal2.png said «ediction» and only that line was redrawn. */
(function(){
  const asset=name=>new URL('predicttodoImages/'+name,document.currentScript.src).href;
  const menuArt=Object.freeze({tablet:asset('menu-principal-en.png'),tv:asset('menu-principal-tv.png')});
  // The tablet opens on the menu: start loading it with the script.
  if(typeof Image!=='undefined'&&/\/projects\//.test(location.pathname))new Image().src=menuArt.tablet;
  // Thin arrow in the style of the house outline drawn in the Home pill.
  const backIcon='<svg viewBox="0 0 18 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.6 8H1.4M7.4 1.8 1.4 8l6 6.2"/></svg>';
  // English only: no language switch on the tablet or the TV.
  const copy={alt:'PredictToDo, VPS · INE: Bogotá Traffic Prediction. About the project and Interactive experience.',information:'About the project',game:'Interactive experience',home:'Home',back:'Back',tvCta:'Select an option on the tablet'};
  // The artwork is drawn in two bands of the same 1920 × 1080 image: the bar (top 126 px) stays at the top of the screen
  // and the body (the remaining 954 px) is centred in the space left, so 4:3 and 16:10 screens keep it balanced.
  // TV guidance pill (same as the AquaData TV menu): blue pill, landscape tablet outline, bold white text.
 const tvTablet='<svg viewBox="0 0 21 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x=".75" y=".75" width="19.5" height="14.5" rx="2.2"/></svg>';
 function landing(language,{informationActive=false,readonly=false}={}){
    const hit=(action,label)=>`<button type="button" class="ptd-menu-hit ptd-menu-hit--${action}" data-action="${action}" aria-label="${label}"></button>`;
    const back=informationActive?`<button type="button" class="ptd-menu-back" data-action="back-information">${backIcon}<span>${copy.back}</span></button>`:'';
    const art=readonly?menuArt.tv:menuArt.tablet;
    return `<main class="ptd-menu${readonly?' ptd-menu--tv':''}" lang="en" style="--art:url('${art}')" aria-label="${copy.alt}"><div class="ptd-menu-bar"><div class="ptd-menu-band ptd-menu-band--bar">${readonly?'':back+hit('home',copy.home)}</div></div><div class="ptd-menu-body"><div class="ptd-menu-band ptd-menu-band--body">${readonly?`<div class="ptd-menu-cta" role="status">${tvTablet}<strong>${copy.tvCta}</strong></div>`:hit('information',copy.information)+hit('open-game',copy.game)}</div></div></main>`;
  }
  window.PREDICTTODO_VISUAL=Object.freeze({landing,menuArt});
})();
