/* Session sync: independent states for stations 1, 2, 3 and 5. HTTP polling over local network. */
(function(){
  const params=new URLSearchParams(location.search);
  let previous='1'; try { previous=sessionStorage.getItem('exhibition-station')||'1'; } catch {}
  const raw=Number(params.get('station')||previous);
  const station=[1,2,3,5].includes(raw)?raw:1;
  try { sessionStorage.setItem('exhibition-station',String(station)); } catch {}
  const KEY=`ai-exhibition-state-${station}`;
  const stationQuery=`?station=${station}`;
  let writeQueue=Promise.resolve();
  let clockOffset=0;
  function connection(connected,source){if(station===5)window.dispatchEvent(new CustomEvent('ai-sync-connection',{detail:{station,connected,source}}));}
  function remember(state){try{localStorage.setItem(KEY,JSON.stringify({...state,ts:Date.now()}));}catch{}}
  async function post(packet){
   const response=await fetch(`/api/state?station=${station}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(packet),cache:'no-store',signal:AbortSignal.timeout(1500)});
   if(!response.ok)throw Error(`State update failed: ${response.status}`);
   connection(true,'write');
   return response;
  }
  async function deliver(packet){
   try{return await post(packet);}
   catch(error){
    // Preserve the newest tablet command when a local Wi-Fi request is lost.
    await new Promise(resolve=>setTimeout(resolve,120));
    try{return await post(packet);}catch{connection(false,'write');return null;}
   }
  }
  function send(state){
    const packet={station,...state,ts:Date.now()}; remember(packet);
    // Queue writes so quick taps cannot arrive at the station server out of order.
    const task=writeQueue.then(()=>deliver(packet));
    writeQueue=task.catch(()=>null);
    return task;
  }
  async function read(){
    try {const started=Date.now();const r=await fetch(`/api/state?station=${station}`,{cache:'no-store',signal:AbortSignal.timeout(900)});if(!r.ok)throw Error('HTTP');const state=await r.json();if(station===5){if(Number.isFinite(state.serverNow))clockOffset=state.serverNow-(started+Date.now())/2;connection(true,'read');if(state.updatedAt)remember(state);}return state;}
    catch(e){connection(false,'read');try{const cached=JSON.parse(localStorage.getItem(KEY)||'null');if(station===5&&Number.isFinite(cached?.serverNow)&&Number.isFinite(cached?.ts))clockOffset=cached.serverNow-cached.ts;return cached;}catch{return null;}}
  }
  window.AI_SYNC={station,stationQuery,send,read,KEY,now:()=>Math.round(Date.now()+clockOffset)};
})();
