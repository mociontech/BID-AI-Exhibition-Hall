/* The station opens the supplied v36 directly, with no additional product UI. */
window.ProjectModule={id:'11',async mountController({sync,mount}){
 let language='en',game={...RISE_STATE.fresh(),sceneStartedAt:sync.now()},disconnect,leaving=false;
 const remote=await sync.read();
 const restored=remote?.projectId==='11'&&['game','results'].includes(remote.mode)?RISE_STATE.sanitize(remote.game):null;
 if(restored){game=restored;language=remote.language==='es'?'es':'en';}
 const publish=()=>sync.send({view:'game',projectId:'11',section:game.sc,language,mode:game.sc==='loop'?'results':'game',screenIndex:RISE_STATE.stages.indexOf(game.sc)+1,game});
 async function home(){
  if(leaving)return;leaving=true;disconnect?.();
  await sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null});
  location.assign('../../index.html'+sync.stationQuery+'&projects=1');
 }
 document.documentElement.lang=language;
 mount.innerHTML=`<main class="rise-v34-controller">${RISE_GAME.tabletHTML()}</main>`;
 disconnect=RISE_GAME.connectController(mount,{game,language,onHome:home,onChange:(next,nextLanguage)=>{
  if(leaving)return;
  game=next;language=nextLanguage;document.documentElement.lang=language;void publish();
 }});
 await publish();
 window.addEventListener('pagehide',()=>{leaving=true;disconnect?.();},{once:true});
}};
