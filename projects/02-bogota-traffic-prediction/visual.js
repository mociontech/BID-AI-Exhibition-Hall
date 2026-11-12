/* Project 02 landing: native cover from Figma 662:4545 (kicker, two-tone title, two cards) with tablet controls. */
(function(){
  const asset=name=>new URL('predicttodoImages/'+name,document.currentScript.src).href;
  const logo=asset('idb-group-white.svg'),photo=asset('portada-about.png'),colombia=asset('colombia-pin.svg');
  const homeIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/></svg>';
  const copy={
    es:{kicker:'Predicción del tráfico en Bogotá',intro:'Inteligencia artificial para anticipar la congestión y apoyar la gestión del tráfico en Bogotá.',information:'Sobre <span>el proyecto</span>',informationBody:'Conoce el reto, los datos y cómo la IA predice la congestión.',game:'Experiencia <span>interactiva</span>',gameBody:'Explora la movilidad y toma decisiones en escenarios simulados.',home:'Inicio',back:'Volver'},
    en:{kicker:'Bogotá Traffic Prediction',intro:'Artificial intelligence to anticipate congestion and support traffic management in Bogotá.',information:'About <span>the project</span>',informationBody:'Explore the challenge, the data and how AI predicts congestion.',game:'Interactive <span>experience</span>',gameBody:'Explore mobility and make decisions in simulated scenarios.',home:'Home',back:'Back'}
  };
  function landing(language,{station=1,informationActive=false,readonly=false}={}){
    const lang=language==='es'?'es':'en',c=copy[lang];
    const languageControl=readonly?`<span class="ptd-art-language ptd-art-language--readonly"><b aria-pressed="${lang==='es'}">ES</b><b aria-pressed="${lang==='en'}">EN</b></span>`:`<nav class="ptd-art-language" aria-label="Language"><button type="button" data-language="es" aria-pressed="${lang==='es'}">ES</button><button type="button" data-language="en" aria-pressed="${lang==='en'}">EN</button></nav>`;
    const header=`<header class="ptd-art-header"><div class="ptd-art-brand"><img src="${logo}" width="216" height="44" alt="IDB Group"><span class="ptd-art-brand-divider" aria-hidden="true"></span><span class="ptd-art-brand-copy"><strong>AI in Action</strong><small>IDB Group Projects Across the Region</small></span></div><div class="ptd-art-tools">${languageControl}${readonly?'':`${informationActive?`<button type="button" class="ptd-art-home" data-action="back-information">← ${c.back}</button>`:''}<button type="button" class="ptd-art-home" data-action="home">${homeIcon}<span>${c.home}</span></button>`}</div></header>`;
    // The TV mirrors the cover without controls: the cards are plain blocks there.
    const card=(kind,action,title,body,art)=>readonly
      ?`<div class="ptd-home-card ptd-home-card--${kind}"><div class="ptd-home-card-copy"><strong>${title}</strong><small>${body}</small></div>${art}</div>`
      :`<button type="button" class="ptd-home-card ptd-home-card--${kind} ${kind==='info'&&informationActive?'is-selected':''}" data-action="${action}"><div class="ptd-home-card-copy"><strong>${title}</strong><small>${body}</small></div>${art}</button>`;
    const cards=card('info','information',c.information,c.informationBody,`<img class="ptd-home-card-photo" src="${photo}" alt="">`)+card('game','open-game',c.game,c.gameBody,`<span class="ptd-home-card-art" aria-hidden="true"><img src="${colombia}" width="141" height="189" alt=""></span>`);
    return `<main class="ptd-art-shell ptd-home-native" lang="${lang}">${header}<div class="ptd-home-main"><section class="ptd-home-intro"><p>${c.kicker}</p><h1>Predict<span>ToDo</span></h1><h2>${c.intro}</h2></section><div class="ptd-home-cards">${cards}</div></div></main>`;
  }
  window.PREDICTTODO_VISUAL=Object.freeze({landing});
})();
