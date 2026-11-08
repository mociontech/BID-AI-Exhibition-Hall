/* Project 02 landing: approved artwork with semantic tablet controls. */
(function(){
  const artwork='/projects/02-bogota-traffic-prediction/predicttodoImages/fondoprincipal.png';
  const logo=new URL('predicttodoImages/idb-group-white.svg',document.currentScript.src).href;
  const homeIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/></svg>';
  const copy={
    es:{intro:'Inteligencia artificial para anticipar la congestión y apoyar la gestión del tráfico en Bogotá.',information:'Información',informationBody:'Conoce el reto, los datos y cómo la IA predice la congestión.',game:'Experiencia interactiva',gameBody:'Explora la movilidad y toma decisiones en escenarios simulados.',home:'Inicio',back:'Volver',station:'ESTACIÓN'},
    en:{information:'Information',game:'Interactive experience',home:'Home',back:'Back',station:'STATION'}
  };
  function landing(language,{station=1,informationActive=false,readonly=false}={}){
    const lang=language==='es'?'es':'en',c=copy[lang];
    const localized=lang==='es'?`<div class="ptd-art-intro-es">${c.intro}</div><div class="ptd-art-card-es ptd-art-card-es--info"><b>01</b><strong>${c.information}</strong><span>${c.informationBody}</span></div><div class="ptd-art-card-es ptd-art-card-es--game"><b>02</b><strong>${c.game}</strong><span>${c.gameBody}</span></div>`:'';
    const languageControl=readonly?`<span class="ptd-art-language ptd-art-language--readonly"><b aria-pressed="${lang==='es'}">ES</b><b aria-pressed="${lang==='en'}">EN</b></span>`:`<nav class="ptd-art-language" aria-label="Language"><button type="button" data-language="es" aria-pressed="${lang==='es'}">ES</button><button type="button" data-language="en" aria-pressed="${lang==='en'}">EN</button></nav>`;
    const header=`<header class="ptd-art-header"><div class="ptd-art-brand"><img src="${logo}" width="216" height="44" alt="IDB Group"><span class="ptd-art-brand-divider" aria-hidden="true"></span><span class="ptd-art-brand-copy"><strong>AI in Action</strong><small>IDB Group Projects Across the Region</small></span></div><div class="ptd-art-tools"><span class="ptd-art-station">${lang==='es'?'Estación':'Station'} ${String(station).padStart(2,'0')}</span>${languageControl}${readonly?'':`${informationActive?`<button type="button" class="ptd-art-home" data-action="back-information">← ${c.back}</button>`:''}<button type="button" class="ptd-art-home" data-action="home">${homeIcon}<span>${c.home}</span></button>`}</div></header>`;
    const controls=readonly?'':`<button type="button" class="ptd-art-hit ptd-art-hit--info ${informationActive?'is-selected':''}" data-action="information" aria-label="${c.information}"></button><button type="button" class="ptd-art-hit ptd-art-hit--game" data-action="open-game" aria-label="${c.game}"></button>`;
    return `<main class="ptd-art-shell" lang="${lang}">${header}<div class="ptd-art-body"><div class="ptd-art-frame"><img class="ptd-art-image" src="${artwork}" alt="PredictToDo: ${c.information} / ${c.game}">${localized}${controls}</div></div></main>`;
  }
  window.PREDICTTODO_VISUAL=Object.freeze({landing});
})();
