/* Project 02 landing: approved artwork with semantic tablet controls. */
(function(){
  const artwork='/projects/02-bogota-traffic-prediction/predicttodoImages/fondoprincipal.png';
  const copy={
    es:{intro:'Inteligencia artificial para anticipar la congestión y apoyar la gestión del tráfico en Bogotá.',information:'Información',informationBody:'Conoce el reto, los datos y cómo la IA predice la congestión.',game:'Experiencia interactiva',gameBody:'Explora la movilidad y toma decisiones en escenarios simulados.',home:'Inicio',back:'Volver',station:'ESTACIÓN'},
    en:{information:'Information',game:'Interactive experience',home:'Home',back:'Back',station:'STATION'}
  };
  function landing(language,{station=1,informationActive=false,readonly=false}={}){
    const lang=language==='es'?'es':'en',c=copy[lang];
    const localized=lang==='es'?`<div class="ptd-art-intro-es">${c.intro}</div><div class="ptd-art-card-es ptd-art-card-es--info"><b>01</b><strong>${c.information}</strong><span>${c.informationBody}</span></div><div class="ptd-art-card-es ptd-art-card-es--game"><b>02</b><strong>${c.game}</strong><span>${c.gameBody}</span></div>`:'';
    const controls=readonly?'':`<nav class="ptd-art-language" aria-label="Language"><button type="button" data-language="es" aria-pressed="${lang==='es'}">ES</button><button type="button" data-language="en" aria-pressed="${lang==='en'}">EN</button></nav><button type="button" class="ptd-art-hit ptd-art-hit--info ${informationActive?'is-selected':''}" data-action="information" aria-label="${c.information}"></button><button type="button" class="ptd-art-hit ptd-art-hit--game" data-action="open-game" aria-label="${c.game}"></button><footer class="ptd-art-footer"><button type="button" data-action="home">← ${c.home}</button>${informationActive?`<button type="button" data-action="back-information">← ${c.back}</button>`:''}</footer>`;
    return `<main class="ptd-art-shell" lang="${lang}"><div class="ptd-art-frame"><img class="ptd-art-image" src="${artwork}" alt="PredictToDo: ${c.information} / ${c.game}"><span class="ptd-art-station">${c.station} ${String(station).padStart(2,'0')}</span>${localized}${controls}</div></main>`;
  }
  window.PREDICTTODO_VISUAL=Object.freeze({landing});
})();
