/* Session sync: independent state for station 1, 2 and 3. HTTP polling over local network. */
(function(){
  const params=new URLSearchParams(location.search);
  let previous='1'; try { previous=sessionStorage.getItem('exhibition-station')||'1'; } catch {}
  const raw=Number(params.get('station')||previous);
  const station=[1,2,3].includes(raw)?raw:1;
  try { sessionStorage.setItem('exhibition-station',String(station)); } catch {}
  const KEY=`ai-exhibition-state-${station}`;
  const stationQuery=`?station=${station}`;
  let writeQueue=Promise.resolve();
  function remember(state){try{localStorage.setItem(KEY,JSON.stringify({...state,ts:Date.now()}));}catch{}}
  async function post(packet){
   const response=await fetch(`/api/state?station=${station}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(packet),cache:'no-store',signal:AbortSignal.timeout(1500)});
   if(!response.ok)throw Error(`State update failed: ${response.status}`);
   return response;
  }
  async function deliver(packet){
   try{return await post(packet);}
   catch(error){
    // Preserve the newest tablet command when a local Wi-Fi request is lost.
    await new Promise(resolve=>setTimeout(resolve,120));
    try{return await post(packet);}catch{return null;}
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
    try {const r=await fetch(`/api/state?station=${station}`,{cache:'no-store',signal:AbortSignal.timeout(900)});if(!r.ok)throw Error('HTTP');return await r.json();}
    catch(e){try{return JSON.parse(localStorage.getItem(KEY)||'null');}catch{return null;}}
  }
  window.AI_SYNC={station,stationQuery,send,read,KEY};
})();
