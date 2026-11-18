/* Continuous clock animation shared by the tablet and the display. */
(() => {
 'use strict';

 const esc=value=>String(value??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

 function markup({cue, revolution, label, caption}) {
  const ticks=Array.from({length:12},(_,i)=>`<i style="--tick-angle:${i*30}deg"></i>`).join('');
  return `<div class="crb-clock" data-clock-cue="${esc(cue)}" style="--clock-revolution:${Number(revolution)||1250}ms">
   <div class="crb-clock-face" aria-hidden="true">${ticks}<i class="crb-clock-hand crb-clock-hand--hour"></i><i class="crb-clock-hand crb-clock-hand--minute"></i></div>
   <div class="crb-clock-copy"><span>${esc(label)}</span><strong>${esc(caption)}</strong></div>
  </div>`;
 }

 function replace(app, html) {
  // Keep both hands at their current angles when a stop or step re-renders the phase.
  const previous=app.querySelector('[data-clock-cue]');
  const cue=previous?.dataset.clockCue;
  const playbackTime=cue ? previous.getAnimations({subtree:true})[0]?.currentTime : null;
  app.innerHTML=html;
  const next=app.querySelector('[data-clock-cue]');
  if(playbackTime!=null && next?.dataset.clockCue===cue){
   for(const animation of next.getAnimations({subtree:true})) animation.currentTime=playbackTime;
  }
 }

 window.CRB_CLOCK={markup,replace};
})();
