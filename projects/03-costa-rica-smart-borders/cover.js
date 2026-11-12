/* Portada del proyecto 03 (diseño «prueba1.png», nov 2026).
   Un solo marcado para la tableta (interactiva) y la TV (solo visual, sin botones activos).
   window.CRB_COVER(lang,{base,interactive,back}) → HTML */
(function(){
 const COPY={
  en:{start:'Start',back:'Back',about:['About','the project'],aboutText:'Learn about the challenge,|how the tool works, and|who benefits.',play:['Interactive','experience'],playText:'Discover how AI helps|coordinate border inspections|more effectively.',aboutAria:'Show information on the main display',playAria:'Open the interactive experience'},
  es:{start:'Inicio',back:'Volver',about:['Sobre','el proyecto'],aboutText:'Conoce el reto, cómo funciona la herramienta y quiénes se benefician.',play:['Experiencia','interactiva'],playText:'Descubre cómo la IA ayuda a coordinar mejor las inspecciones en frontera.',aboutAria:'Mostrar información en la pantalla principal',playAria:'Abrir la experiencia interactiva'}
 };
 const HOME='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>';
 const TRUCK='<svg class="crc-truck" viewBox="0 0 200 116" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="5" width="132" height="70" rx="3"/><path d="M34 22v36M58 22v36M82 22v36M106 22v36"/><path d="M137 26h32l22 22v42h-8"/><path d="M161 44h20"/><path d="M161 44v14h24"/><path d="M5 75v15h20M57 90h91"/><circle cx="41" cy="98" r="13"/><circle cx="73" cy="98" r="13" fill="#CFE1FF"/><circle cx="166" cy="98" r="13"/></svg>';
 window.CRB_COVER=function(lang,opts){
  const o=opts||{},t=COPY[lang==='es'?'es':'en'],base=o.base||'./public/',live=!!o.interactive;
  const tag=live?'button':'div';
  const act=(name,aria)=>live?` type="button" data-action="${name}" aria-label="${aria}"`:' aria-hidden="true"';
  const tools=`<nav class="crc-tools"${live?' aria-label="Station tools"':' aria-hidden="true"'}>${o.back?`<${tag} class="crc-pill crc-back"${live?' type="button" data-action="menu"':''}><span aria-hidden="true">←</span><span>${t.back}</span></${tag}>`:''}<div class="crc-langs"${live?' aria-label="Language"':''}>${['es','en'].map(l=>`<${tag} class="${l===lang?'is-on':''}"${live?` type="button" data-language="${l}" aria-pressed="${l===lang}"`:''}>${l.toUpperCase()}</${tag}>`).join('')}</div><${tag} class="crc-pill crc-start"${live?' type="button" data-action="home"':''}>${HOME}<span>${t.start}</span></${tag}></nav>`;
  return `<main class="crc ${live?'crc--tablet':'crc--tv'}" lang="${lang==='es'?'es':'en'}" aria-label="Costa Rica Smart Borders">
 <header class="crc-top"><div class="crc-brand"><img src="${base}idb-group-white.svg" width="216" height="44" alt="IDB Group"><span class="crc-sep" aria-hidden="true"></span><span class="crc-title"><b>AI in Action</b><small>IDB Group Projects Across the Region</small></span></div>${tools}</header>
 <section class="crc-body">
  <div class="crc-hero"><p class="crc-eyebrow">VPS · PTI</p><h1>VUCE 3.0</h1><p class="crc-name">Costa Rica<br>Smart Borders</p></div>
  <div class="crc-cards">
   <${tag} class="crc-card crc-card--about"${act('information',t.aboutAria)}><span class="crc-card-text"><b>${t.about[0]}<br>${t.about[1]}</b><span>${t.aboutText.split('|').join('<br>')}</span></span><span class="crc-card-media"><img src="${base}cover-truck.jpg" width="324" height="261" alt=""></span></${tag}>
   <${tag} class="crc-card crc-card--play"${act('game',t.playAria)}><span class="crc-card-text"><b>${t.play[0]}<br>${t.play[1]}</b><span>${t.playText.split('|').join('<br>')}</span></span><span class="crc-card-media crc-card-media--icon">${TRUCK}</span></${tag}>
  </div>
 </section>
</main>`;
 };
})();
