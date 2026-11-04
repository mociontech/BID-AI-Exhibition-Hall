/* Costa Rica Smart Borders / VUCE 3.0 — vista de la TV durante el minijuego.
   Recibe el resumen que la tableta publica en el estado de la estación (packet.game, v:1)
   y lo muestra en grande y simple: etapa, camión en turno, cronómetro, semáforos, popup
   abierto y comparación final. Nunca muestra los documentos ni los botones: eso vive en
   la tableta. Todos los textos llegan ya traducidos desde el juego. */
(function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const fmt=ms=>{const s=Math.floor(ms/1000),d=Math.floor((ms%1000)/100);return `${s}.${d}`;};
 let clock={time:0,running:false,received:0},timer=null,key='';
 function truck(icon,cls){
  return `<svg class="crtv-svg ${cls||''}" viewBox="0 0 150 70" aria-hidden="true"><rect x="4" y="12" width="92" height="40" rx="6" fill="#CFE1FF"/><circle cx="34" cy="32" r="15" fill="#fff"/><text x="34" y="38" text-anchor="middle" font-size="17">${icon||'📦'}</text><path d="M98 24h24l20 16v12H98z" fill="#F7F9FF" stroke="#95979C" stroke-width="2"/><path d="M106 28h12l12 10h-24z" fill="#2E79FF"/><path d="M4 52h138" stroke="#95979C" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="55" r="9" fill="#141414"/><circle cx="30" cy="55" r="3.5" fill="#EBEDF7"/><circle cx="116" cy="55" r="9" fill="#141414"/><circle cx="116" cy="55" r="3.5" fill="#EBEDF7"/></svg>`;
 }
 const light=(c,big)=>`<span class="crtv-light ${c?'crtv-light--'+esc(c):''} ${big?'crtv-light--big':''}"></span>`;
 function header(g){
  return `<header class="crtv-top"><div class="crtv-brand"><img src="assets/brand/idb-group.jpg" alt="IDB Group"><span class="crtv-sep"></span><span><b>AI in Action</b><small>Costa Rica Smart Borders · VUCE 3.0</small></span></div>
   <ol class="crtv-steps">${(g.steps||[]).map((s,i)=>`<li class="${i<g.step?'done':i===g.step?'current':''}"><span>${i+1}</span><em>${esc(s)}</em></li>`).join('')}</ol>
   <p class="crtv-simulated">${esc(g.simulated)}</p></header>`;
 }
 function trucksRow(g){
  const results=g.screen==='results';
  return `<div class="crtv-trucks">${(g.trucks||[]).map((tr,i)=>{
   const current=i===g.idx&&(g.screen==='manual'||g.screen==='ai')&&g.phase!=='done';
   return `<div class="crtv-truck ${current?'is-current':''} ${tr.light||results?'is-done':''}">${truck(tr.icon)}<b>${esc(tr.id)}</b><small>${esc(tr.cargo)}</small>
    <div class="crtv-truck-lights">${results?`<span class="crtv-tag ${tr.ok?'ok':'bad'}">${esc(g.labels.you)}${light(tr.you)}</span><span class="crtv-tag ok">${esc(g.labels.ai)}${light(tr.ai)}</span>`:light(tr.light)}</div></div>`;}).join('')}</div>`;
 }
 function status(g){
  const p=g.phase;
  if(p==='feedback'&&g.feedback)return `<div class="crtv-status crtv-status--${g.feedback.ok?'ok':'bad'}">${light(g.feedback.light,true)}<div><h2>${esc(g.feedback.title)}</h2><p>${esc(g.feedback.msg)}</p></div></div>`;
  if(p==='verdict'&&g.verdict)return `<div class="crtv-status crtv-status--verdict crtv-status--${esc(g.verdict.light)}">${light(g.verdict.light,true)}<div><h2>${esc(g.verdict.title)}</h2><p>${esc(g.verdict.msg)}</p></div></div>`;
  if(p==='scanning')return `<div class="crtv-status crtv-status--scan"><span class="crtv-bot">🤖</span><div><h2>${esc(g.hint)}<i class="crtv-dots"><i></i><i></i><i></i></i></h2><span class="crtv-progress"><i style="animation-duration:${Number(g.scanMs)||1700}ms"></i></span></div></div>`;
  if(p==='done')return `<div class="crtv-status crtv-status--done"><span class="crtv-bot">🏁</span><div><h2>${esc(g.hint)}</h2></div></div>`;
  return `<div class="crtv-status"><span class="crtv-bot">${g.screen==='ai'?'🤖':'👀'}</span><div><h2>${esc(g.hint)}</h2></div></div>`;
 }
 function stage(g){
  const tr=g.trucks[g.idx]||{};
  return `<section class="crtv-stage">
   <div class="crtv-current"><span class="crtv-counter">${esc(g.counter)}</span>${truck(tr.icon,'crtv-svg--big')}<b>${esc(tr.id)}</b><small>${esc(tr.cargo)}</small></div>
   <div class="crtv-middle"><h1>${esc(g.title)}</h1>${status(g)}</div>
   <div class="crtv-clock"><span>${esc(g.clockLabel)}</span><b data-crtv-clock>${fmt(g.time||0)} s</b></div>
  </section>${trucksRow(g)}`;
 }
 function intro(g){
  return `<section class="crtv-hero"><div><h1>${esc(g.title)}</h1><p class="crtv-big">${esc(g.subtitle)}</p><p class="crtv-hint">📱 ${esc(g.hint)}</p></div>
   <div class="crtv-road">${(g.trucks||[]).map((tr,i)=>`<span style="animation-delay:${i*140}ms">${truck(tr.icon)}</span>`).join('')}</div></section>`;
 }
 function results(g){
  const r=g.results;const L=g.labels;const max=Math.max(r.you.time,r.ai.time,1);
  const who=(w,d,cls)=>`<div class="crtv-who ${cls}"><header><b>${esc(w)}</b><span>${cls?'🤖':'👤'}</span></header><div class="crtv-stat"><small>${esc(L.time)}</small><b>${fmt(d.time)}<em> ${esc(L.seconds)}</em></b><i class="crtv-bar"><i style="width:${Math.max(4,d.time/max*100)}%"></i></i></div><div class="crtv-stat"><small>${esc(L.hits)}</small><b>${d.hits}<em> / ${g.n}</em></b></div></div>`;
  return `<section class="crtv-results"><div><h1>${esc(g.title)}</h1><p class="crtv-verdict">${esc(r.verdict)}</p></div>
   <div class="crtv-compare">${who(L.you,r.you,'')}${who(L.ai,r.ai,'crtv-who--ai')}<div class="crtv-learn"><p>${esc(r.learnTitle)}</p><b>${esc(r.learnBig)}</b><small>${esc(r.learn)}</small></div></div></section>${trucksRow(g)}<p class="crtv-hint crtv-hint--bottom">📱 ${esc(g.hint)}</p>`;
 }
 function popup(g){
  if(!g.modal)return '';
  return `<aside class="crtv-pop"><p>${esc(g.modal.eyebrow)}</p><h3>${esc(g.modal.title)}</h3><span>${esc(g.modal.lead)}</span><small>📱 ${esc(g.labels.reading)}</small></aside>`;
 }
 function tickClock(){
  const el=document.querySelector('[data-crtv-clock]');if(!el)return;
  const t=clock.time+(clock.running?Date.now()-clock.received:0);
  el.textContent=fmt(t)+' s';
 }
 function render(app,g){
  clock={time:Number(g.time)||0,running:!!g.running,received:Date.now()};
  const k=JSON.stringify({...g,time:0,running:false});
  if(k===key&&app.querySelector('.crtv')){tickClock();return;} // solo cambió el reloj
  key=k;
  const body=g.screen==='intro'?intro(g):g.screen==='results'?results(g):stage(g);
  document.documentElement.lang=g.lang==='es'?'es':'en';
  app.innerHTML=`<main class="crtv crtv--${esc(g.screen)}" aria-label="Costa Rica Smart Borders">${header(g)}${body}${popup(g)}</main>`;
  if(!timer)timer=setInterval(tickClock,100);
 }
 function stop(){if(timer){clearInterval(timer);timer=null;}key='';}
 window.CRB_TV={render,stop};
})();
