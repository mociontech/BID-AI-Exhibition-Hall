/* Costa Rica Smart Borders / VUCE 3.0 — vista de la TV durante el minijuego.
   Recibe el resumen que la tableta publica en el estado de la estación (packet.game, v:2)
   y muestra la escena en grande y despacio: UN camión que avanza por la carretera, las 3
   instituciones (paradas) con su semáforo, la frontera, el cronómetro, el tiempo simulado y
   una explicación de qué hace VUCE 3.0 en cada paso. En la etapa de la IA cada paso arranca
   con un toque en la tableta: las 3 cajas se unen en una sola ventanilla, el camión para una
   sola vez y cruza. Al final la TV muestra la SOLUCIÓN del reto (la tableta, la comparación).
   Nunca muestra los documentos, los botones ni los popups: eso vive en la tableta. */
(function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 /* Iconos de línea fina (24×24, trazo 1.6). Sustituyen a los emojis en tableta y TV. */
 const ICONS={
  aduana:'<path d="M3 21h18M5 21V10m4.7 11V10m4.6 11V10M19 21V10M3 10l9-6 9 6H3z"/>',
  policia:'<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"/><path d="M9.5 12l2 2 3.5-4"/>',
  salud:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  animal:'<circle cx="12" cy="14.5" r="3.5"/><circle cx="7" cy="9.5" r="1.6"/><circle cx="17" cy="9.5" r="1.6"/><circle cx="9.5" cy="5.5" r="1.6"/><circle cx="14.5" cy="5.5" r="1.6"/>',
  vegetal:'<path d="M5 19C5 10 11 5 20 5c0 9-5 15-14 15z"/><path d="M5 19c3-5 7-8 11-10"/>',
  doc:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M9.5 13h5M9.5 17h5"/>',
  screen:'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  flag:'<path d="M5 21V4"/><path d="M5 5h12l-2.5 3.5L17 12H5"/>',
  replay:'<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v5h5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  cpu:'<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
  rules:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  network:'<circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 11l10-4M7 13l10 4"/>',
  dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  box:'<path d="M3 8l9-4 9 4v9l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v9"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>'
 };
 function ico(name,cls){return `<svg class="ico ico--${name} ${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.doc}</svg>`;}
 
 const fmt=ms=>{const s=Math.floor(ms/1000),d=Math.floor((ms%1000)/100);return `${s}.${d}`;};
 const GATE=89.5,VUCE_X=46; // GATE: caseta fronteriza · VUCE_X: columna central (% del ancho de la foto)
 const ASSETS='projects/03-costa-rica-smart-borders/public/';
 const PILLARS=[14,30,46,62,76.6]; // columnas del peaje en la foto tv-border.jpg
 function stopX(n,i){return n<=1?VUCE_X:n===PILLARS.length?PILLARS[i]:13+i*(51/(n-1));}
 function posOf(g){const n=(g.stops||[]).length||1;const out=[9];for(let i=0;i<n;i++)out.push(g.mode==='ai'?VUCE_X:stopX(n,i));out.push(94);return out;}
 let clock={time:0,running:false,received:0},timer=null,key='',lastPct=null,prevMerged=false,prevPhase='',prevLit=0,prevScreen='',prevConf=0;
 function flashTv(app,color){const f=document.createElement('div');f.className='crtv-flash crtv-flash--'+esc(color);(app.querySelector('.crtv')||app).appendChild(f);setTimeout(()=>f.remove(),1300);}
 function truck(icon,cls,id,cargo){
  return `<div class="crtv-lorry ${cls||''}"><img src="${ASSETS}tv-truck.png" alt=""><span class="crtv-lorry-tag"><b>${esc(id||'')}</b><small>${esc(cargo||'')}</small></span></div>`;
 }
 /* Barrera propia (la foto no trae): se levanta cuando el camión cruza. */
 function barrier(){
  return `<svg class="crtv-barrier" viewBox="0 0 240 120" aria-hidden="true"><defs><pattern id="crtvStripe" width="20" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#FC5D5D"/><rect x="10" width="10" height="10" fill="#fff"/></pattern></defs>
   <rect x="206" y="24" width="18" height="96" rx="4" fill="#5B5F68"/><rect x="196" y="112" width="40" height="8" rx="3" fill="#3B3E44"/>
   <g class="crtv-arm"><rect x="4" y="40" width="212" height="12" rx="6" fill="url(#crtvStripe)" stroke="#3B3E44" stroke-width="2"/><circle cx="214" cy="46" r="9" fill="#141414"/></g></svg>`;
 }
 /* Puesto fronterizo: letrero FRONTERA · Costa Rica con la bandera, caseta y barrera. */
 function gate(label,sub){
  return `<svg class="crtv-toll crtv-border" viewBox="0 0 320 260" aria-hidden="true"><defs><pattern id="crtvStripe" width="20" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#FFCB52"/><rect x="10" width="10" height="10" fill="#141414"/></pattern></defs>
   <rect x="46" y="100" width="12" height="160" fill="#9AA0AA"/><rect x="262" y="100" width="12" height="160" fill="#9AA0AA"/>
   <rect x="18" y="18" width="284" height="92" rx="10" fill="#0B3C8C"/><rect x="18" y="18" width="284" height="92" rx="10" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
   <g><rect x="36" y="36" width="60" height="56" rx="4" fill="#002B7F"/><rect x="36" y="46" width="60" height="36" fill="#fff"/><rect x="36" y="53" width="60" height="22" fill="#CE1126"/></g>
   <text x="112" y="60" font-size="24" font-weight="900" fill="#fff" font-family="Inter,Arial" letter-spacing="1">${esc(label).toUpperCase()}</text><text x="112" y="90" font-size="21" font-weight="700" fill="#CFE1FF" font-family="Inter,Arial">${esc(sub)}</text>
   <rect x="200" y="150" width="90" height="110" rx="6" fill="#F7F9FF" stroke="#8F939C" stroke-width="3"/><rect x="192" y="142" width="106" height="12" rx="4" fill="#005CFF"/><rect x="214" y="166" width="62" height="40" rx="4" fill="#CFE1FF" stroke="#8F939C" stroke-width="2"/><rect x="232" y="214" width="26" height="46" rx="2" fill="#6A6B6F"/>
   <rect x="120" y="150" width="14" height="110" rx="3" fill="#141414"/><rect x="108" y="252" width="38" height="8" rx="3" fill="#141414"/>
   <g class="crtv-arm"><rect x="127" y="152" width="170" height="12" rx="6" fill="url(#crtvStripe)" stroke="#141414" stroke-width="2"/><circle cx="127" cy="158" r="9" fill="#FC5D5D" stroke="#141414" stroke-width="3"/></g></svg>`;
 }
 /* Fondo ilustrado: cielo, montañas, selva. */
 function backdrop(){
  const trees=[];for(let x=-10;x<=1010;x+=46){const r=22+((x/46)%3)*5;trees.push(`<circle cx="${x}" cy="${292-((x/46)%2)*8}" r="${r}" fill="${(x/46)%2?'#3F8F55':'#357D49'}"/>`);}
  return `<svg class="crtv-bg" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="crtvSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9DBFF"/><stop offset="1" stop-color="#F3F8FF"/></linearGradient></defs>
   <rect width="1000" height="420" fill="url(#crtvSky)"/><circle cx="880" cy="70" r="34" fill="#FFF3C4"/>
   <path d="M0 232L80 160L170 206L270 128L370 196L460 146L560 204L660 136L760 196L860 148L940 184L1000 156V420H0Z" fill="#A9D4B0"/>
   <path d="M0 272L120 224L220 254L330 206L430 254L540 220L640 258L760 216L870 254L1000 226V420H0Z" fill="#7DBE8A"/>
   ${trees.join('')}<rect y="300" width="1000" height="120" fill="#2F7A45"/></svg>`;
 }
 function toll(label,open){
  return `<svg class="crtv-toll" viewBox="0 0 280 220" aria-hidden="true"><defs><pattern id="crtvStripe" width="20" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#FFCB52"/><rect x="10" width="10" height="10" fill="#141414"/></pattern></defs><rect x="6" y="196" width="120" height="14" rx="4" fill="#6A6B6F"/><rect x="22" y="78" width="76" height="118" rx="6" fill="#F7F9FF" stroke="#141414" stroke-width="4"/><path d="M8 80 L60 44 L112 80 Z" fill="#005CFF"/><rect x="8" y="78" width="104" height="12" rx="3" fill="#005CFF"/><rect x="34" y="100" width="52" height="40" rx="4" fill="#CFE1FF" stroke="#141414" stroke-width="3"/><rect x="44" y="150" width="32" height="46" rx="3" fill="#6A6B6F"/><text x="60" y="70" text-anchor="middle" font-size="13" font-weight="900" fill="#fff" font-family="Inter,Arial">${esc(label).toUpperCase()}</text><rect x="120" y="120" width="14" height="86" rx="3" fill="#141414"/><rect x="108" y="202" width="38" height="12" rx="4" fill="#141414"/><g class="crtv-arm"><rect x="127" y="121" width="146" height="12" rx="6" fill="url(#crtvStripe)" stroke="#141414" stroke-width="2"/><circle cx="127" cy="127" r="9" fill="#FC5D5D" stroke="#141414" stroke-width="3"/></g></svg>`;
 }
 const light=(c,big)=>`<span class="crtv-light ${c?'crtv-light--'+esc(c)+' is-lit':''} ${big?'crtv-light--big':''}"></span>`;
 const pct=g=>{const P=posOf(g);return P[Math.max(0,Math.min(P.length-1,Number(g.pos)||0))];};
 function header(g){
  return `<header class="crtv-top"><div class="crtv-brand"><img src="projects/03-costa-rica-smart-borders/public/idb-group-white.svg" width="216" height="44" alt="IDB Group"><span class="crtv-sep"></span><span><b>AI in Action</b><small>IDB Group Projects Across the Region</small></span></div>
   <ol class="crtv-steps">${(g.steps||[]).map((s,i)=>`<li class="${i<g.step?'done':i===g.step?'current':''}"><span>${i+1}</span><em>${esc(s)}</em></li>`).join('')}</ol>
   <div class="crtv-tools" aria-hidden="true"><span class="crtv-pill crtv-pill--back"><i>←</i>${g.lang==='es'?'Volver':'Back'}</span><span class="crtv-langs"><i class="${g.lang==='es'?'on':''}">ES</i><i class="${g.lang==='es'?'':'on'}">EN</i></span><span class="crtv-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>${g.lang==='es'?'Inicio':'Home'}</span></div></header>`;
 }
 /* Escena: carretera con 3 paradas (o 1 ventanilla única), frontera y el camión. */
 function scene(g,merged){
  const stops=g.stops||[],L=g.labels||{};
  const atStop=i=>g.mode==='manual'&&g.screen==='manual'&&g.phase!=='crossed'&&!g.moving&&i===g.idx;
  const checking=i=>atStop(i)&&g.phase==='deciding';
  const n=stops.length;
  const booths=stops.map((s,i)=>`<div class="crtv-booth crtv-booth--${i} ${atStop(i)?'is-current':''} ${checking(i)?'is-checking':''} ${s.light?'is-done':''}" style="left:${stopX(n,i)}%"><svg class="crtv-roof" viewBox="0 0 100 22" aria-hidden="true"><path d="M2 22 L50 2 L98 22 Z" fill="#005CFF"/><rect x="0" y="18" width="100" height="4" rx="2" fill="#005CFF"/></svg><span class="crtv-booth-win"><span class="crtv-booth-icon">${ico(s.icon)}</span></span><b>${esc(s.name)}</b><div class="crtv-booth-light">${light(s.light,true)}</div><i class="crtv-beam"></i></div>`).join('');
  const vuceScan=g.mode==='ai'&&g.busy&&(g.phase==='scanning'||g.phase==='verdict');
  const showLight=Number(g.pos)>=stops.length+1; /* semáforo verde solo cuando el camión ya cruzó */const conf=Number(g.confirmed)||0;
  const vuce=`<div class="crtv-booth crtv-booth--vuce ${vuceScan?'is-checking':''} ${showLight?'is-done':''}" style="left:${VUCE_X}%"><b>${esc(L.vuce)}</b><div class="crtv-vuce-rules">${stops.map((s,i)=>`<em class="${g.phase==='scanning'&&i===g.scanIdx?'is-reading':''} ${s.light?'is-done':''} ${i<conf?'is-confirmed':''}">${ico(s.icon)} ${esc(s.short)}${i<conf?'<i class="crtv-tick">✓</i>':light(s.light)}</em>`).join('')}</div>${showLight?`<div class="crtv-booth-light">${light('green',true)}</div>`:''}<i class="crtv-beam"></i></div>`;
  const left=lastPct===null?pct(g):lastPct;
  const crossed=Number(g.pos)>=stops.length+1;
  return `<section class="crtv-scene crtv-scene--${esc(g.mode)} crtv-scene--v4 ${merged?'is-merged':''} ${crossed?'is-crossed':''}" data-crtv-scene><div class="crtv-road2"><img class="crtv-photo" src="${ASSETS}tv-border.jpg" alt="">
   <div class="crtv-start"><b>${esc(L.start)}</b></div>
   <div class="crtv-bsign"><i></i><span><b>${esc(L.border)}</b><small>Costa Rica</small></span></div>
   <div class="crtv-gate ${crossed?'is-open':''}" style="left:${GATE}%">${barrier()}</div>
   ${booths}${vuce}
   <div class="crtv-rig ${g.moving?'is-moving':''} ${crossed?'is-crossed':''}" data-crtv-rig style="left:${left}%"><i class="crtv-puff"></i><i class="crtv-puff"></i><i class="crtv-puff"></i>${truck(g.truck&&g.truck.icon,'',g.truck&&g.truck.id,g.truck&&g.truck.cargo)}</div>
  </div></section>`;
 }
 function status(g){
  const p=g.phase;
  if(p==='feedback'&&g.feedback)return `<div class="crtv-status crtv-status--${g.feedback.ok?'ok':'bad'}">${light(g.feedback.light,true)}<div><h2>${esc(g.feedback.title)}</h2><p>${esc(g.feedback.msg)}</p></div></div>`;
  if(p==='verdict'){const conf=Number(g.confirmed)||0;return `<div class="crtv-status crtv-status--confirm"><div><h2>${esc(g.hint)}<i class="crtv-dots"><i></i><i></i><i></i></i></h2><div class="crtv-confirm">${(g.stops||[]).map((s,i)=>`<em class="${i<conf?'is-confirmed':i===conf?'is-next':''}"><span>${ico(s.icon)}</span><b>${esc(s.short)}</b><i>✓</i></em>`).join('')}</div></div></div>`;}
  if(p==='scanning')return `<div class="crtv-status crtv-status--scan"><div><h2>${esc(g.hint)}<i class="crtv-dots"><i></i><i></i><i></i></i></h2><span class="crtv-segs">${(g.stops||[]).map((s,i)=>`<i class="${s.light?'is-done':i===g.scanIdx?'is-reading':''}"></i>`).join('')}</span></div></div>`;
  if(p==='merging')return `<div class="crtv-status crtv-status--scan"><div><h2>${esc(g.hint)}<i class="crtv-dots"><i></i><i></i><i></i></i></h2></div></div>`;
  if(p==='moving')return `<div class="crtv-status crtv-status--move"><div><h2>${esc(g.hint)}</h2></div></div>`;
  if(p==='crossed')return `<div class="crtv-status crtv-status--done"><div><h2>${esc(g.hint)}</h2></div></div>`;
  if(p==='stepDone'||p==='waiting')return `<div class="crtv-status crtv-status--wait"><div><h2>${esc(g.hint)}</h2></div></div>`;
  return `<div class="crtv-status"><div><h2>${esc(g.hint)}</h2></div></div>`;
 }
 function explain(g){
  if(!g.explain)return '';
  return `<div class="crtv-explain"><b>${esc(g.explain.step)}</b><p>${esc(g.explain.text)}</p></div>`;
 }
 function board(g){
  const tr=g.truck||{},L=g.labels||{};
  const counter=g.mode==='ai'?L.vuce:(g.stops&&g.stops[g.idx]?g.stops[g.idx].name:'');
  return `<section class="crtv-board">
   <div class="crtv-current crtv-current--plain"><b>${esc(tr.id)}</b><small>${esc(tr.cargo)}</small>${g.phase!=='crossed'?`<em>${esc(counter)}</em>`:''}</div>
   <div class="crtv-middle">${status(g)}${g.phase==='feedback'&&g.hint?`<p class="crtv-remind">${esc(g.hint)}</p>`:''}</div>
   <div class="crtv-clocks crtv-clocks--one"><div class="crtv-clock"><span>${esc(g.clockLabel)}</span><b data-crtv-clock>${fmt(g.time||0)} s</b></div></div>
  </section>`;
 }
 function intro(g){
  return `<section class="crtv-hero crtv-hero--compact"><div><h1>${esc(g.title)}</h1><p class="crtv-big">${esc(g.subtitle)}</p></div><p class="crtv-hint">${esc(g.hint)}</p></section>${scene(g,false)}`;
 }
 /* Final: la TV muestra solo LO QUE TE LLEVAS de VUCE 3.0 (3 ideas grandes) y la frase de cierre.
    El semáforo final es el único elemento de color. La comparación con cifras queda en la tableta. */
 function results(g){
  const r=g.results||{},f=r.final||{};
  const ins=(r.insights||[]).map(x=>`<div class="crtv-ins"><span>${esc(x.big)}</span><b>${esc(x.title)}</b><p>${esc(x.text)}</p></div>`).join('');
  const L=g.labels||{};
  const col=(w,v,m,x)=>{const h=Math.max(6,v/m*100);return `<div class="crtv-col crtv-col--${w}"><em style="bottom:max(2.5vh,calc(${h}% - 3.5vh))">${esc(x)}</em><i style="height:max(1.5vh,calc(${h}% - 4.5vh))"></i></div>`;};
  const chart=`<section class="crtv-chart"><header><h2>${esc(r.chartTitle)}</h2><div><b><i class="crtv-key crtv-key--you"></i>${esc(L.you)}</b><b><i class="crtv-key crtv-key--ai"></i>${esc(L.ai)}</b></div></header><div class="crtv-groups">${(r.chart||[]).map(x=>{const m=Math.max(x.you,x.ai,1);return `<div class="crtv-group"><div class="crtv-cols">${col('you',x.you,m,x.youText)}${col('ai',x.ai,m,x.aiText)}</div><small>${esc(x.label)}</small></div>`;}).join('')}</div></section>`;
  return `<section class="crtv-results crtv-res2 crtv-res3">
   <div class="crtv-res3-body">${chart}<div class="crtv-res3-side"><h2 class="crtv-res2-title">${esc(r.insightsTitle)}</h2><div class="crtv-ins3 crtv-ins3--col">${ins}</div></div></div>
   <div class="crtv-learn crtv-learn--row"><p>${esc(r.learnTitle)}</p><b>${esc(r.learnBig)}</b><small>${esc(r.learn)}</small></div></section>`;
 }
 function tickClock(){
  const el=document.querySelector('[data-crtv-clock]');if(!el)return;
  const t=clock.time+(clock.running?Date.now()-clock.received:0);
  el.textContent=fmt(t)+' s';
 }
 function placeTruck(g){
  const rig=document.querySelector('[data-crtv-rig]');if(!rig)return;
  const to=pct(g);
  if(lastPct===null||lastPct===to){rig.style.left=to+'%';lastPct=to;return;}
  rig.style.left=lastPct+'%';lastPct=to;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{rig.style.left=to+'%';}));
 }
 function render(app,g){
  clock={time:Number(g.time)||0,running:!!g.running,received:Date.now()};
  const k=JSON.stringify({...g,time:0,running:false,pos:0});
  if(k===key&&app.querySelector('.crtv')){tickClock();placeTruck(g);return;} // solo cambió el reloj o la posición del camión
  key=k;
  const merged=!!g.merged;
  const animateMerge=merged&&(!prevMerged||(g.phase==='merging'&&prevPhase!=='merging')); // primera vez o al repetir el paso 1: pintar sin unir y animar la unión
  const body=g.screen==='intro'?intro(g):g.screen==='results'?results(g):`${scene(g,merged&&!animateMerge)}${board(g)}`;
  document.documentElement.lang=g.lang==='es'?'es':'en';
  app.innerHTML=`<main class="crtv crtv--${esc(g.screen)}" aria-label="Costa Rica Smart Borders">${header(g)}${body}</main>`;
  if(g.screen==='intro')lastPct=null; // el camión arranca en la salida sin animación
  if(g.phase==='feedback'&&prevPhase!=='feedback'&&g.feedback)flashTv(app,g.feedback.light); // destello: semáforo manual
  const lit=g.screen==='ai'?(g.stops||[]).filter(x=>x.light).length:0;
  if(g.screen==='ai'&&lit>prevLit&&g.phase==='scanning')flashTv(app,g.stops[lit-1].light); // destello: cada regla que aplica la IA
  const conf=g.screen==='ai'?(Number(g.confirmed)||0):0;
  if(g.phase==='verdict'&&conf>prevConf)flashTv(app,'bid'); // destello: una institución confirma la decisión final
  if(g.screen==='results'&&prevScreen!=='results'&&g.results&&g.results.final)flashTv(app,g.results.final.light); // destello: llega la comparación
  prevLit=lit;prevPhase=g.phase;prevScreen=g.screen;prevConf=conf;
  placeTruck(g);
  if(animateMerge)requestAnimationFrame(()=>requestAnimationFrame(()=>{const s=app.querySelector('[data-crtv-scene]');if(s)s.classList.add('is-merged','is-animating');})); // is-animating: escalona la aparición de las reglas solo la primera vez
  prevMerged=merged;
  if(!timer)timer=setInterval(tickClock,100);
 }
 function stop(){if(timer){clearInterval(timer);timer=null;}key='';lastPct=null;prevMerged=false;prevPhase='';prevLit=0;prevScreen='';prevConf=0;}
 window.CRB_TV={render,stop};
})();
