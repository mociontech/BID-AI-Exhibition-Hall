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
 const fmt=ms=>{const s=Math.floor(ms/1000),d=Math.floor((ms%1000)/100);return `${s}.${d}`;};
 const POS={manual:[8,20,42,64,94],ai:[8,42,42,42,94]},GATE=82; // GATE: línea del peaje (% del ancho)
 let clock={time:0,running:false,received:0},timer=null,key='',lastPct=null,prevMerged=false,prevPhase='',prevLit=0,prevScreen='';
 function flashTv(app,color){const f=document.createElement('div');f.className='crtv-flash crtv-flash--'+esc(color);(app.querySelector('.crtv')||app).appendChild(f);setTimeout(()=>f.remove(),1300);}
 function truck(icon,cls){
  const wheel=cx=>`<g class="crtv-wheel"><circle cx="${cx}" cy="70" r="12" fill="#141414"/><circle cx="${cx}" cy="70" r="6" fill="#EBEDF7"/><path d="M${cx} 60v20M${cx-10} 70h20" stroke="#141414" stroke-width="2"/><circle cx="${cx}" cy="70" r="2" fill="#141414"/></g>`;
  return `<svg class="crtv-svg ${cls||''}" viewBox="0 0 200 90" aria-hidden="true"><ellipse cx="100" cy="82" rx="92" ry="5" fill="rgba(20,20,20,.22)"/><rect x="4" y="10" width="120" height="54" rx="8" fill="#fff" stroke="#C0C2CA" stroke-width="2"/><rect x="4" y="42" width="120" height="8" fill="#005CFF"/><circle cx="42" cy="32" r="16" fill="#CFE1FF"/><text x="42" y="38" text-anchor="middle" font-size="18">${icon||'📦'}</text><rect x="126" y="22" width="58" height="42" rx="9" fill="#005CFF"/><rect x="134" y="27" width="30" height="18" rx="4" fill="#CFE1FF"/><rect x="184" y="44" width="8" height="12" rx="2" fill="#FFCB52"/><rect x="4" y="62" width="184" height="7" rx="3" fill="#141414"/><rect x="124" y="58" width="68" height="7" rx="3" fill="#6A6B6F"/>${wheel(36)}${wheel(98)}${wheel(158)}</svg>`;
 }
 function toll(label,open){
  return `<svg class="crtv-toll" viewBox="0 0 280 220" aria-hidden="true"><defs><pattern id="crtvStripe" width="20" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#FFCB52"/><rect x="10" width="10" height="10" fill="#141414"/></pattern></defs><rect x="6" y="196" width="120" height="14" rx="4" fill="#6A6B6F"/><rect x="22" y="78" width="76" height="118" rx="6" fill="#F7F9FF" stroke="#141414" stroke-width="4"/><path d="M8 80 L60 44 L112 80 Z" fill="#005CFF"/><rect x="8" y="78" width="104" height="12" rx="3" fill="#005CFF"/><rect x="34" y="100" width="52" height="40" rx="4" fill="#CFE1FF" stroke="#141414" stroke-width="3"/><rect x="44" y="150" width="32" height="46" rx="3" fill="#6A6B6F"/><text x="60" y="70" text-anchor="middle" font-size="13" font-weight="900" fill="#fff" font-family="Inter,Arial">${esc(label).toUpperCase()}</text><rect x="120" y="120" width="14" height="86" rx="3" fill="#141414"/><rect x="108" y="202" width="38" height="12" rx="4" fill="#141414"/><g class="crtv-arm"><rect x="127" y="121" width="146" height="12" rx="6" fill="url(#crtvStripe)" stroke="#141414" stroke-width="2"/><circle cx="127" cy="127" r="9" fill="#FC5D5D" stroke="#141414" stroke-width="3"/></g></svg>`;
 }
 const light=(c,big)=>`<span class="crtv-light ${c?'crtv-light--'+esc(c)+' is-lit':''} ${big?'crtv-light--big':''}"></span>`;
 const pct=g=>POS[g.mode==='ai'?'ai':'manual'][Math.max(0,Math.min(4,Number(g.pos)||0))];
 function header(g){
  return `<header class="crtv-top"><div class="crtv-brand"><img src="assets/brand/idb-group.jpg" alt="IDB Group"><span class="crtv-sep"></span><span><b>AI in Action</b><small>Costa Rica Smart Borders · VUCE 3.0</small></span></div>
   <ol class="crtv-steps">${(g.steps||[]).map((s,i)=>`<li class="${i<g.step?'done':i===g.step?'current':''}"><span>${i+1}</span><em>${esc(s)}</em></li>`).join('')}</ol>
   <p class="crtv-simulated">${esc(g.simulated)}</p></header>`;
 }
 /* Escena: carretera con 3 paradas (o 1 ventanilla única), frontera y el camión. */
 function scene(g,merged){
  const stops=g.stops||[],L=g.labels||{};
  const atStop=i=>g.mode==='manual'&&g.screen==='manual'&&g.phase!=='crossed'&&!g.moving&&i===g.idx;
  const checking=i=>atStop(i)&&g.phase==='deciding';
  const booths=stops.map((s,i)=>`<div class="crtv-booth crtv-booth--${i} ${atStop(i)?'is-current':''} ${checking(i)?'is-checking':''} ${s.light?'is-done':''}" style="left:${POS.manual[i+1]}%"><span class="crtv-booth-icon">${s.icon}</span><b>${esc(s.name)}</b><small>${esc(s.rule)}</small><div class="crtv-booth-light">${light(s.light,true)}</div><i class="crtv-beam"></i></div>`).join('');
  const vuceScan=g.mode==='ai'&&g.busy&&(g.phase==='scanning'||g.phase==='verdict');
  const vuce=`<div class="crtv-booth crtv-booth--vuce ${vuceScan?'is-checking':''} ${g.verdict?'is-done':''}" style="left:${POS.ai[2]}%"><span class="crtv-booth-icon">🤖</span><b>${esc(L.vuce)}</b><div class="crtv-vuce-rules">${stops.map((s,i)=>`<em class="${g.phase==='scanning'&&i===g.scanIdx?'is-reading':''} ${s.light?'is-done':''}">${s.icon} ${esc(s.short)}${light(s.light)}</em>`).join('')}</div>${g.verdict?`<div class="crtv-booth-light">${light(g.verdict.light,true)}</div>`:''}<i class="crtv-beam"></i></div>`;
  const left=lastPct===null?pct(g):lastPct;
  const crossed=Number(g.pos)>=4;
  return `<section class="crtv-scene crtv-scene--${esc(g.mode)} ${merged?'is-merged':''} ${crossed?'is-crossed':''}" data-crtv-scene><div class="crtv-road2">
   <div class="crtv-start"><b>${esc(L.start)}</b></div>
   <div class="crtv-line" style="left:${GATE}%"></div><div class="crtv-gate ${crossed?'is-open':''}" style="left:${GATE}%">${toll(L.border,crossed)}</div>
   ${booths}${vuce}
   <div class="crtv-rig ${g.moving?'is-moving':''} ${crossed?'is-crossed':''}" data-crtv-rig style="left:${left}%"><i class="crtv-puff"></i><i class="crtv-puff"></i><i class="crtv-puff"></i>${truck(g.truck&&g.truck.icon)}<b>${esc(g.truck&&g.truck.id)}</b></div>
  </div></section>`;
 }
 function status(g){
  const p=g.phase;
  if(p==='feedback'&&g.feedback)return `<div class="crtv-status crtv-status--${g.feedback.ok?'ok':'bad'}">${light(g.feedback.light,true)}<div><h2>${esc(g.feedback.title)}</h2><p>${esc(g.feedback.msg)}</p><small class="crtv-tap">📱 ${esc(g.hint)}</small></div></div>`;
  if(g.verdict&&(p==='verdict'||p==='stepDone'))return `<div class="crtv-status crtv-status--verdict crtv-status--${esc(g.verdict.light)}">${light(g.verdict.light,true)}<div><h2>${esc(g.verdict.title)}</h2><p>${esc(g.verdict.msg)}</p>${(g.verdict.lines||[]).length&&p==='verdict'?`<ul class="crtv-lines">${g.verdict.lines.map(l=>`<li>${esc(l)}</li>`).join('')}</ul>`:''}${p==='stepDone'?`<small class="crtv-tap">📱 ${esc(g.hint)}</small>`:''}</div></div>`;
  if(p==='scanning')return `<div class="crtv-status crtv-status--scan"><span class="crtv-bot">🤖</span><div><h2>${esc(g.hint)}<i class="crtv-dots"><i></i><i></i><i></i></i></h2><span class="crtv-segs">${(g.stops||[]).map((s,i)=>`<i class="${s.light?'is-done':i===g.scanIdx?'is-reading':''}"></i>`).join('')}</span></div></div>`;
  if(p==='merging')return `<div class="crtv-status crtv-status--scan"><span class="crtv-bot">🤝</span><div><h2>${esc(g.hint)}<i class="crtv-dots"><i></i><i></i><i></i></i></h2></div></div>`;
  if(p==='moving')return `<div class="crtv-status crtv-status--move"><span class="crtv-bot crtv-bot--drive">🚛</span><div><h2>${esc(g.hint)}</h2></div></div>`;
  if(p==='crossed')return `<div class="crtv-status crtv-status--done"><span class="crtv-bot">🏁</span><div><h2>${esc(g.hint)}</h2></div></div>`;
  if(p==='stepDone'||p==='waiting')return `<div class="crtv-status crtv-status--wait"><span class="crtv-bot">📱</span><div><h2>${esc(g.hint)}</h2></div></div>`;
  return `<div class="crtv-status"><span class="crtv-bot">${g.screen==='ai'?'🤖':'👀'}</span><div><h2>${esc(g.hint)}</h2></div></div>`;
 }
 function explain(g){
  if(!g.explain)return '';
  return `<div class="crtv-explain"><b>${esc(g.explain.step)}</b><p>${esc(g.explain.text)}</p></div>`;
 }
 function board(g){
  const tr=g.truck||{},L=g.labels||{};
  const counter=g.mode==='ai'?L.vuce:(g.stops&&g.stops[g.idx]?g.stops[g.idx].name:'');
  return `<section class="crtv-board">
   <div class="crtv-current"><span class="crtv-counter">${esc(g.title)}</span>${truck(tr.icon,'crtv-svg--big')}<b>${esc(tr.id)}</b><small>${esc(tr.cargo)}</small>${g.phase!=='crossed'?`<em>${esc(counter)}</em>`:''}</div>
   <div class="crtv-middle">${status(g)}${explain(g)}</div>
   <div class="crtv-clocks"><div class="crtv-clock"><span>${esc(g.clockLabel)}</span><b data-crtv-clock>${fmt(g.time||0)} s</b></div><div class="crtv-clock crtv-clock--sim"><span>${esc(g.sim&&g.sim.label)}</span><b>${esc(g.sim&&g.sim.text)}</b></div></div>
  </section>`;
 }
 function intro(g){
  return `<section class="crtv-hero crtv-hero--compact"><div><h1>${esc(g.title)}</h1><p class="crtv-big">${esc(g.subtitle)}</p></div><p class="crtv-hint">📱 ${esc(g.hint)}</p></section>${scene(g,false)}`;
 }
 /* Final: la TV muestra solo LO QUE TE LLEVAS de VUCE 3.0 (3 ideas grandes) y la frase de cierre.
    El semáforo final es el único elemento de color. La comparación con cifras queda en la tableta. */
 function results(g){
  const r=g.results||{},f=r.final||{};
  const ins=(r.insights||[]).map(x=>`<div class="crtv-ins"><span>${esc(x.big)}</span><b>${esc(x.title)}</b><p>${esc(x.text)}</p></div>`).join('');
  return `<section class="crtv-results crtv-res2">
   <div class="crtv-res2-head"><div><small>${esc(g.simulated)}</small><h1>${esc(g.title)}</h1><p>${esc(r.verdict)}</p></div><div class="crtv-final crtv-final--${esc(f.light)}">${light(f.light,true)}<div><small>${esc(r.solFinal)}</small><b>${esc(f.name)} · ${esc(f.action)}</b></div></div></div>
   <h2 class="crtv-res2-title">${esc(r.insightsTitle)}</h2>
   <div class="crtv-ins3">${ins}</div>
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
  if(g.phase==='verdict'&&prevPhase!=='verdict'&&g.verdict)flashTv(app,g.verdict.light); // destello: semáforo único de la IA
  if(g.screen==='results'&&prevScreen!=='results'&&g.results&&g.results.final)flashTv(app,g.results.final.light); // destello: llega la comparación
  prevLit=lit;prevPhase=g.phase;prevScreen=g.screen;
  placeTruck(g);
  if(animateMerge)requestAnimationFrame(()=>requestAnimationFrame(()=>{const s=app.querySelector('[data-crtv-scene]');if(s)s.classList.add('is-merged','is-animating');})); // is-animating: escalona la aparición de las reglas solo la primera vez
  prevMerged=merged;
  if(!timer)timer=setInterval(tickClock,100);
 }
 function stop(){if(timer){clearInterval(timer);timer=null;}key='';lastPct=null;prevMerged=false;prevPhase='';prevLit=0;prevScreen='';}
 window.CRB_TV={render,stop};
})();
