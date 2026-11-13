/* Portada del proyecto 03 (diseño «prueba1.png», nov 2026).
   Un solo marcado para la tableta (interactiva) y la TV (solo visual, sin botones activos).
   window.CRB_COVER(lang,{base,interactive,back}) → HTML */
(function(){
 const COPY={
  en:{start:'Start',back:'Back',video:'Video',videoText:'Watch a short video to see Smart Borders in action.',videoAria:'Play the video on the main display',about:['About','the project'],aboutText:'Learn about the challenge,|how the tool works, and|who benefits.',play:['Interactive','experience'],playText:'Discover how AI helps|coordinate border inspections|more effectively.',aboutAria:'Show information on the main display',playAria:'Open the interactive experience'},
  es:{start:'Inicio',back:'Volver',video:'Video',videoText:'Mira un video corto para ver Smart Borders en acción.',videoAria:'Reproducir el video en la pantalla principal',about:['Sobre','el proyecto'],aboutText:'Conoce el reto, cómo funciona la herramienta y quiénes se benefician.',play:['Experiencia','interactiva'],playText:'Descubre cómo la IA ayuda a coordinar mejor las inspecciones en frontera.',aboutAria:'Mostrar información en la pantalla principal',playAria:'Abrir la experiencia interactiva'}
 };
 const HOME='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>';
 const TRUCK='<svg class="crc-truck" viewBox="0 0 200 116" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="5" width="132" height="70" rx="3"/><path d="M34 22v36M58 22v36M82 22v36M106 22v36"/><path d="M137 26h32l22 22v42h-8"/><path d="M161 44h20"/><path d="M161 44v14h24"/><path d="M5 75v15h20M57 90h91"/><circle cx="41" cy="98" r="13"/><circle cx="73" cy="98" r="13" fill="#CFE1FF"/><circle cx="166" cy="98" r="13"/></svg>';
 /* Infografía «Sobre el proyecto» (Infografia.png, nov 2026) reconstruida en HTML para animarla
    elemento por elemento, como la referencia animada del BID («Iniciativa 2.2_animada_PRO»).
    La versión ES es traducción propia del PNG en inglés: pendiente de aprobación. */
 const SHEET={
  en:{sub:'Costa Rica Smart Borders',unit:'VPS · PTI',
   cards:[['THE','CHALLENGE','Fragmented Risk Assessments','Five institutions lacked integrated tools to identify high-risk shipments, making border inspections less coordinated and efficient.'],['THE','SOLUTION','AI-Powered Risk Management','VUCE 3.0 combines AI, institutional rules, and risk analysis to prioritize inspections and improve border coordination.']],
   impact:'IMPACT TO DATE',facts:[['330,000+',['historical records','used to train AI models']],['5 agencies',['checkpoints','brought together']],['650+',['cargo vehicles','cross the border','per day']]]},
  es:{sub:'Costa Rica Smart Borders',unit:'VPS · PTI',
   cards:[['EL','RETO','Riesgo evaluado por separado','Cinco instituciones sin herramientas integradas para detectar envíos de alto riesgo: inspecciones menos coordinadas y eficientes.'],['LA','SOLUCIÓN','Gestión de riesgos con IA','VUCE 3.0 combina IA, reglas institucionales y análisis de riesgo para priorizar inspecciones y mejorar la coordinación en frontera.']],
   impact:'IMPACTO A LA FECHA',facts:[['330.000+',['registros históricos','para entrenar la IA']],['5 entidades',['puntos de control','integrados']],['650+',['vehículos de carga','cruzan la frontera','cada día']]]}
 };
 const ICON_WARN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 4.2 2.6 17.6A2 2 0 0 0 4.3 20.6h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9.2v4.8"/><path d="M12 17.2h.01"/></svg>';
 const ICON_AI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="5.5" width="13" height="13" rx="2.5"/><path d="M9 2.8v2.7M12 2.8v2.7M15 2.8v2.7M9 18.5v2.7M12 18.5v2.7M15 18.5v2.7M2.8 9h2.7M2.8 12h2.7M2.8 15h2.7M18.5 9h2.7M18.5 12h2.7M18.5 15h2.7"/><text x="12" y="14.6" text-anchor="middle" fill="currentColor" stroke="none" font-family="Inter,Arial,sans-serif" font-size="7" font-weight="800">AI</text></svg>';
 window.CRB_SHEET=function(lang,opts){
  const o=opts||{},s=SHEET[lang==='es'?'es':'en'],base=o.base||'./public/',anim=o.animate!==false;
  const card=([a,b,head,body],i)=>`<article class="crs-card crs-card--${i?'solution':'challenge'}" style="--d:${(1.8+i*.7).toFixed(1)}s"><h2><span><b>${a}</b> ${b}</span></h2><span class="crs-icon" aria-hidden="true">${i?ICON_AI:ICON_WARN}</span><p><strong>${head}</strong>${body}</p></article>`;
  const fact=([n,lines],i)=>`<li style="--i:${i}"><b><span>${n}</span></b><p>${lines.join('<br>')}</p></li>`;
  return `<section class="crs-sheet ${anim?'is-animated':''}" lang="${lang==='es'?'es':'en'}" aria-label="VUCE 3.0 · Costa Rica Smart Borders"><div class="crs-stage"><i class="crs-veil" aria-hidden="true"></i><div class="crs-side"><img class="crs-logo" src="${base}idb-group-white.svg" width="216" height="44" alt="IDB Group"><div class="crs-title"><h1><span>VUCE 3.0</span></h1><p class="crs-sub"><span>${s.sub}</span></p><p class="crs-unit"><span>${s.unit}</span></p></div></div>${s.cards.map(card).join('')}<h2 class="crs-impact-title"><span>${s.impact}</span></h2><ul class="crs-impact">${s.facts.map(fact).join('')}</ul></div></section>`;
 };
 window.CRB_COVER=function(lang,opts){
  const o=opts||{},t=COPY[lang==='es'?'es':'en'],base=o.base||'./public/',live=!!o.interactive;
  const tag=live?'button':'div';
  const act=(name,aria)=>live?` type="button" data-action="${name}" aria-label="${aria}"`:' aria-hidden="true"';
  const tools=`<nav class="crc-tools"${live?' aria-label="Station tools"':' aria-hidden="true"'}>${o.back?`<${tag} class="crc-pill crc-back"${live?' type="button" data-action="menu"':''}><span aria-hidden="true">←</span><span>${t.back}</span></${tag}>`:''}<div class="crc-langs"${live?' aria-label="Language"':''}>${['es','en'].map(l=>`<${tag} class="${l===lang?'is-on':''}"${live?` type="button" data-language="${l}" aria-pressed="${l===lang}"`:''}>${l.toUpperCase()}</${tag}>`).join('')}</div><${tag} class="crc-pill crc-start"${live?' type="button" data-action="home"':''}>${HOME}<span>${t.start}</span></${tag}></nav>`;
  return `<main class="crc ${live?'crc--tablet':'crc--tv'}" lang="${lang==='es'?'es':'en'}" aria-label="Costa Rica Smart Borders">
 <header class="crc-top"><div class="crc-brand"><img src="${base}idb-group-white.svg" width="216" height="44" alt="IDB Group"><span class="crc-sep" aria-hidden="true"></span><span class="crc-title"><b>AI in Action</b><small>IDB Group Projects Across the Region</small></span></div>${tools}</header>
 <section class="crc-body crc-body--video">
  <div class="crc-hero"><p class="crc-eyebrow">VPS · PTI</p><h1>VUCE 3.0</h1><p class="crc-name">Costa Rica<br>Smart Borders</p></div>
  <${tag} class="crc-card crc-card--video"${act('video',t.videoAria)}><span class="crc-card-text"><b>${t.video}</b><span>${t.videoText}</span></span><span class="crc-card-media"><img src="${base}cover-video.jpg" width="335" height="241" alt=""></span></${tag}>
  <div class="crc-cards">
   <${tag} class="crc-card crc-card--about"${act('information',t.aboutAria)}><span class="crc-card-text"><b>${t.about[0]}<br>${t.about[1]}</b><span>${t.aboutText.split('|').join(' ')}</span></span><span class="crc-card-media"><img src="${base}cover-truck.jpg" width="324" height="261" alt=""></span></${tag}>
   <${tag} class="crc-card crc-card--play"${act('game',t.playAria)}><span class="crc-card-text"><b>${t.play[0]}<br>${t.play[1]}</b><span>${t.playText.split('|').join(' ')}</span></span><span class="crc-card-media crc-card-media--icon">${TRUCK}</span></${tag}>
  </div>
 </section>
</main>`;
 };
})();
