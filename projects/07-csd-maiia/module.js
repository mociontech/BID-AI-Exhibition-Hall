/* Tablet owns interactions and the two timed transitions. The TV only renders
   complete session snapshots received through AI_SYNC, including on late join. */
window.ProjectModule={id:'07',async mountController({sync,mount}){
 const api=MAIIA,S=MAIIA_STATE;await api.ready;
 const config=api.config,key='maiia-ready-'+sync.station;
 let remembered=false;try{remembered=sessionStorage.getItem(key)==='true';}catch{}
 let state={projectId:'07',view:'project',mode:'landing',section:'landing',language:'es',game:S.fresh(remembered)};
 let timer=null,heartbeat=null,leaving=false,pending=0,dirty=false,reading=false,feedbackKey=null,cursor=[.5,.5];
 let stroke=null,strokeTimer=null;
 const now=()=>sync.now();
 function connection(ok){const el=mount.querySelector('.mai-network');if(el)el.hidden=ok;}
 async function publish(){dirty=true;pending++;const snapshot=JSON.stringify(state);
  try{const response=await sync.send(state);if(response?.ok&&snapshot===JSON.stringify(state))dirty=false;connection(!dirty);return response;}
  finally{pending--;}
 }
 function feedback(key){feedbackKey=key;const el=mount.querySelector('.mai-feedback');if(el)el.textContent=api.words[state.language][key]||'';}
 function render(){const active=document.activeElement,selector=active?.dataset.language?`[data-language="${active.dataset.language}"]`:active?.dataset.action?`[data-action="${active.dataset.action}"]`:active?.dataset.candidate?`[data-candidate="${active.dataset.candidate}"]`:active?.matches('[data-map]')?'[data-map]':null;
  api.renderInto(mount,state);if(selector)mount.querySelector(selector)?.focus({preventScroll:true});connection(!dirty);if(feedbackKey)feedback(feedbackKey);
 }
 function arm(){clearTimeout(timer);if(leaving)return;const g=state.game;
  // Deadlines live in the shared snapshot. Reloading or changing language
  // cannot restart them; the passive receiver never advances state itself.
  if(!g.ready&&g.unlockAt)timer=setTimeout(()=>update({game:{...state.game,ready:true,unlockAt:0}}),Math.max(0,g.unlockAt-now()));
  else if(state.mode==='game'&&g.phase==='analysis')timer=setTimeout(()=>update({game:{...state.game,phase:'assisted',analysisAt:0}}),Math.max(0,g.analysisAt+config.timing.analysisMs-now()));
 }
 function update(next){if(leaving)return;if(stroke){cancelStroke();if(next.game)next.game={...next.game,draft:[]};}state={...state,...next};state.section=state.mode==='game'?state.game.phase:state.mode;feedbackKey=null;
  if(state.game.ready)try{sessionStorage.setItem(key,'true');}catch{}
  render();void publish();arm();
 }
 function setGame(patch){update({game:{...state.game,...patch}});}
 function close(){const g=state.game;if(g.draft.length<3)return feedback('smallPolygon');if(g.polygons.length>=config.scoring.maxPolygons)return feedback('limit');setGame({polygons:[...g.polygons,g.draft],draft:[]});}
 function point(p){const g=state.game;if(state.mode!=='game')return;
  if(g.phase==='easy'){if(g.draft.length>=config.scoring.maxPoints||g.polygons.length>=config.scoring.maxPolygons)return feedback('limit');setGame({draft:[...g.draft,p]});}
  if(g.phase==='manual'){if(g.markers.length>=config.scoring.markerLimit)return feedback('limit');setGame({markers:[...g.markers,p]});}
 }
 function selectCandidate(id){if(state.mode!=='game'||state.game.phase!=='assisted')return;const a=state.game.selected;setGame({selected:a.includes(id)?a.filter(v=>v!==id):[...a,id]});}
 function removeMarker(i){if(state.mode==='game'&&state.game.phase==='manual')setGame({markers:state.game.markers.filter((_,n)=>n!==i)});}
 function coordinates(svg,event,clamp=false){
  const matrix=svg.getScreenCTM();if(!matrix)return null;
  const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
  if(!clamp&&(p.x<0||p.x>1000||p.y<0||p.y>562.5))return null;
  return [Math.max(0,Math.min(1,p.x/1000)),Math.max(0,Math.min(1,p.y/562.5))].map(n=>Number(n.toFixed(5)));
 }
 function cancelStroke(){
  clearTimeout(strokeTimer);strokeTimer=null;
  const old=stroke;stroke=null;
  if(old?.svg.hasPointerCapture(old.id))old.svg.releasePointerCapture(old.id);
  state.game={...state.game,draft:[]};
 }
 function preview(){
  if(!stroke)return;
  // Preserve the actual SVG node throughout the gesture: replacing the DOM
  // would lose pointer capture. Draw locally at input speed, sync at <=10 Hz.
  let line=stroke.svg.querySelector('.mai-draft');
  if(!line){line=document.createElementNS('http://www.w3.org/2000/svg','polyline');line.setAttribute('class','mai-draft');stroke.svg.appendChild(line);}
  line.setAttribute('points',stroke.points.map(([x,y])=>`${x*1000},${y*562.5}`).join(' '));
  if(!strokeTimer)strokeTimer=setTimeout(flushStroke,100);
 }
 function flushStroke(){
  strokeTimer=null;if(!stroke||leaving)return;
  if(pending){strokeTimer=setTimeout(flushStroke,100);return;}
  state.game={...state.game,draft:S.simplifyStroke(stroke.points,config.scoring.maxPoints)};
  void publish();
 }
 function sample(event){
  if(!stroke||event.pointerId!==stroke.id)return;
  for(const sample of event.getCoalescedEvents?.().length?event.getCoalescedEvents():[event]){
   const p=coordinates(stroke.svg,sample,true),last=stroke.points.at(-1);
   if(p&&Math.hypot(p[0]-last[0],p[1]-last[1])>.0015)stroke.points.push(p);
  }
  if(stroke.points.length>2048)stroke.points=stroke.points.filter((_,i,a)=>i%2===0||i===a.length-1);
  preview();
 }
 mount.addEventListener('pointerdown',event=>{
  if(leaving||event.button!==0||event.isPrimary===false||stroke)return;const svg=event.target.closest('[data-map]');if(!svg)return;event.preventDefault();
  const marker=event.target.closest('[data-marker]'),candidate=event.target.closest('[data-candidate]');
  if(marker)return removeMarker(Number(marker.dataset.marker));if(candidate)return selectCandidate(candidate.dataset.candidate);
  const p=coordinates(svg,event);if(!p)return;
  if(state.game.phase==='easy'){
   if(state.game.polygons.length>=config.scoring.maxPolygons)return feedback('limit');
   feedbackKey=null;feedback('');stroke={id:event.pointerId,svg,points:[p]};
   state.game={...state.game,draft:[]};svg.setPointerCapture(event.pointerId);preview();
  }else point(p);
 });
 mount.addEventListener('pointermove',event=>{if(stroke&&event.pointerId===stroke.id){event.preventDefault();sample(event);}});
 mount.addEventListener('pointerup',event=>{
  if(!stroke||event.pointerId!==stroke.id)return;event.preventDefault();sample(event);
  const polygon=S.simplifyStroke(stroke.points,config.scoring.maxPoints);
  cancelStroke();
  if(polygon.length>=3&&S.area(polygon)>=.0002)setGame({polygons:[...state.game.polygons,polygon],draft:[]});
  else{setGame({draft:[]});feedback('strokeTooSmall');}
 });
 function interrupted(event){if(stroke&&event.pointerId===stroke.id){cancelStroke();render();void publish();}}
 mount.addEventListener('pointercancel',interrupted);mount.addEventListener('lostpointercapture',interrupted);
 window.addEventListener('blur',()=>{if(stroke){cancelStroke();render();void publish();}});
 mount.addEventListener('keydown',event=>{
  const candidate=event.target.closest('[data-candidate]'),marker=event.target.closest('[data-marker]');
  if(['Enter',' '].includes(event.key)&&(candidate||marker)){event.preventDefault();if(candidate)selectCandidate(candidate.dataset.candidate);else removeMarker(Number(marker.dataset.marker));return;}
  if(!event.target.matches('[data-map]'))return;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();const i=event.key==='ArrowLeft'||event.key==='ArrowRight'?0:1;cursor[i]=Math.min(1,Math.max(0,cursor[i]+(['ArrowLeft','ArrowUp'].includes(event.key)?-.02:.02)));const cross=event.target.querySelector('.mai-crosshair');cross.setAttribute('visibility','visible');cross.setAttribute('transform',`translate(${cursor[0]*1000} ${cursor[1]*562.5})`);}
  else if(event.key==='Enter'){event.preventDefault();point([...cursor]);}
  else if(event.key===' '&&state.game.phase==='easy'){event.preventDefault();close();}
 });
 mount.addEventListener('click',async event=>{
  const b=event.target.closest('button');if(!b||b.disabled||leaving)return;
  if(b.dataset.language)return update({language:b.dataset.language});
  if(stroke)cancelStroke();const action=b.dataset.action,g=state.game;
  if(action==='retry')return publish();
  if(action==='fullscreen'){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{feedback('fullError');}return;}
  if(action==='home'){leaving=true;clearTimeout(timer);clearInterval(heartbeat);await sync.send({view:'home',projectId:null,mode:null,section:null,language:state.language,game:null});return location.assign('/index.html'+sync.stationQuery+'&projects=1');}
  if(action==='menu')return update({view:'project',mode:'landing',game:{...S.fresh(g.ready),unlockAt:g.unlockAt}});
  if(action==='information'){if(state.mode==='info')return;return update({mode:'info',view:'project',game:{...g,unlockAt:g.ready?0:g.unlockAt||now()+config.timing.unlockMs}});}
  if(action==='game'&&g.ready||action==='replay')return update({view:'game',mode:'game',game:S.fresh(true)});
  if(state.mode!=='game')return;
  if(action==='start'&&g.phase==='intro')return setGame({phase:'easy',startedAt:now()});
  if(action==='undo'&&g.phase==='easy')return g.draft.length?setGame({draft:g.draft.slice(0,-1)}):setGame({polygons:g.polygons.slice(0,-1)});
  if(action==='clear')return g.phase==='easy'?setGame({polygons:[],draft:[]}):g.phase==='manual'?setGame({markers:[]}):g.phase==='assisted'?setGame({selected:[]}):undefined;
  if(action==='review'){
   if(g.phase==='easy'){
    if(g.draft.length>0&&g.draft.length<3)return feedback('draftIncomplete');
    const polygons=g.draft.length?[...g.polygons,g.draft]:g.polygons;if(!polygons.length)return feedback('easyEmpty');
    return setGame({phase:'easyResult',polygons,draft:[],easyScore:S.iou(polygons,config.easy.reference,config.scoring)});
   }
   if(g.phase==='manual'){if(!g.markers.length)return feedback('needMarker');return setGame({phase:'manualResult',manual:S.manual(g.markers,config)});}
   if(g.phase==='assisted'){if(!g.selected.length)return feedback('needSelection');return setGame({phase:'final',assisted:S.assisted(g.selected,config)});}
  }
  if(action==='next'&&g.phase==='easyResult')return setGame({phase:'manual'});
  if(action==='activate'&&g.phase==='manualResult')return setGame({phase:'analysis',analysisAt:now()});
 });
 const remote=await sync.read(),restored=remote?.projectId==='07'?S.sanitize(remote.game,config):null;
 if(restored&&['landing','info','game'].includes(remote.mode))state={...state,mode:remote.mode,view:remote.mode==='game'?'game':'project',game:{...restored,draft:[]},language:remote.language==='en'?'en':'es'};
 else if(remote?.language==='en')state.language='en';
 render();void publish();arm();
 heartbeat=setInterval(async()=>{if(leaving||pending||reading||stroke)return;reading=true;try{if(dirty)await publish();else{const latest=await sync.read();if(latest?.projectId!=='07'||latest.language!==state.language||latest.mode!==state.mode||JSON.stringify(latest.game)!==JSON.stringify(state.game))void publish();}}finally{reading=false;}},1500);
 window.addEventListener('pagehide',()=>{cancelStroke();leaving=true;clearTimeout(timer);clearInterval(heartbeat);},{once:true});
 window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
}};
