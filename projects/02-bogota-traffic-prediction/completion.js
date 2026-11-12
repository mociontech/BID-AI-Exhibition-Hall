(function(){
 'use strict';
 const service=window.PREDICTTODO_RANKING,esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function status(game,es){return game.rankStatus==='saved'?(es?'Tu resultado está guardado.':'Your result is saved.'):game.rankStatus==='error'?(es?'No se pudo guardar. Reintenta desde la tableta.':'Could not save. Retry on the tablet.'):(es?'Guardando tu resultado…':'Saving your result…');}
 function qr(url,label){const code=window.qrcode(0,'M');code.addData(url);code.make();return `<div class="ptd-qr" role="img" aria-label="QR: ${esc(label)}">${code.createSvgTag({cellSize:5,margin:20,scalable:true})}</div>`;}
 function render(options,header){
  const {game,language,readonly}=options,es=language==='es',score=Object.values(game.results||{}).reduce((a,b)=>a+b,0);
  // Figma 813:705 / 774:53003: the tablet offers map, replay and menu; the TV shows the project figures, one QR (GitHub) and the leaderboard.
  const actions=`<div class="ptd-completion-actions"><button class="pulse-command-secondary" data-action="resume-events">${es?'Volver al mapa':'Back to map'}</button>${game.rankStatus==='error'?`<button class="pulse-command-secondary" data-action="retry-ranking">${es?'Reintentar guardado':'Retry saving'}</button>`:''}<button class="pulse-command-secondary" data-action="reset-game">${es?'Jugar de nuevo':'Play again'}</button><button class="pulse-command-primary" data-action="exit-game">${es?'Volver al menú':'Back to menu'} <span>→</span></button></div>`;
  const impact=window.PREDICTTODO_INSIGHTS?.story('impact',language)||'';
  const title=readonly?`<h1>${es?'De la experiencia <span>a la acción</span>':'From experience <span>to action</span>'}</h1>`:`<p>PREDICTTODO · ${es?'SIGUE EXPLORANDO':'KEEP EXPLORING'}</p><h1>${es?'Tu turno <span>queda registrado</span>':'Your shift <span>is recorded</span>'}</h1><p>${es?'Mira el ranking y el código QR en la pantalla principal.':'View the ranking and QR code on the main screen.'}</p>`;
  return `<main class="pulse-command ptd-completion ${readonly?'ptd-completion--tv':''}" data-phase="resources">${header}<section class="ptd-completion-content"><div class="ptd-completion-title">${title}</div>${readonly?`<div class="ptd-completion-grid"><section class="ptd-completion-learn" aria-label="${es?'Recursos del proyecto':'Project resources'}">${impact}<h2 class="ptd-learn-more">${es?'Conoce <span>más</span>':'Learn <span>more</span>'}</h2><article class="ptd-resource-card">${qr(service.links.github,'Code4Dev')}<div><span>GITHUB</span><h2>Code4Dev</h2><p>github.com/EL-BID/PredictToDo</p></div></article></section><section class="ptd-leaderboard"><div class="ptd-ranking-heading"><p>${es?'PUNTAJES DE LA EXPERIENCIA':'EXPERIENCE SCORES'}</p><h2>${es?'Ranking de participantes':'Participant leaderboard'}</h2><span>${es?'Más puntos primero. En empate, menor tiempo de juego.':'Highest score first. Ties are broken by shorter playing time.'}</span></div><div data-ranking-rows aria-live="polite"><p>${es?'Consultando ranking…':'Loading leaderboard…'}</p></div><div class="ptd-current-result"><strong>${esc(game.playerName||'Visitor')}<small>${Object.keys(game.results||{}).length}/4 ${es?'casos':'cases'}</small></strong><span class="ptd-current-score">${score}<small>/ 400</small></span><span class="ptd-current-time">${service.time(game.durationMs)}<small>${es?'tiempo de juego':'playing time'}</small></span></div><p class="ptd-ranking-status" data-save-status>${status(game,es)}</p></section></div>`:`<section class="ptd-controller-completion"><strong>${score}<small>/ 400 ${es?'puntos':'points'}</small></strong><p>${service.time(game.durationMs)} · ${Object.keys(game.results||{}).length}/4 ${es?'casos jugados':'cases played'}</p><p role="status">${status(game,es)}</p></section>${actions}`}</section></main>`;
 }
 function mount(root,options){
  if(!options.readonly)return;
  const target=root.querySelector('[data-ranking-rows]');let busy=false;
  async function refresh(){
   if(!target.isConnected||busy)return;busy=true;
   try{
    const rows=await service.list();if(!target.isConnected)return;
    const es=options.language==='es';
    target.innerHTML=rows.length?`<table><thead><tr><th>#</th><th>${es?'Participante':'Participant'}</th><th>${es?'Puntos':'Points'}</th><th>${es?'Tiempo':'Time'}</th></tr></thead><tbody>${rows.map((row,i)=>`<tr class="${row.sessionId===options.game.sessionId?'is-current':''}"><td>${String(i+1).padStart(2,'0')}</td><td>${esc(row.displayName)}<small>${row.casesPlayed}/4 ${es?'casos':'cases'}</small></td><td>${row.score}</td><td>${service.time(row.durationMs)}</td></tr>`).join('')}</tbody></table>`:`<p class="ptd-ranking-empty">${es?'Aún no hay resultados guardados. Tu turno puede ser el primero.':'No saved results yet. Your shift could be the first.'}</p>`;
   }catch{if(target.isConnected)target.innerHTML=`<p role="status">${options.language==='es'?'Sin conexión al ranking. Volveremos a intentarlo.':'Leaderboard unavailable. Reconnecting automatically.'}</p>`;}finally{busy=false;}
  }
  void refresh();const timer=setInterval(()=>{if(!target.isConnected){clearInterval(timer);return;}void refresh();},5000);
 }
 window.PREDICTTODO_COMPLETION=Object.freeze({render,mount});
})();
