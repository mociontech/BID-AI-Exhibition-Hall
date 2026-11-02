/* Local server during development; Firebase Realtime Database on public hosting. */
(function(){
  const params=new URLSearchParams(location.search);
  let previous='1'; try { previous=sessionStorage.getItem('exhibition-station')||'1'; } catch {}
  const raw=Number(params.get('station')||previous);
  const station=[1,2,3,5].includes(raw)?raw:1;
  try { sessionStorage.setItem('exhibition-station',String(station)); } catch {}
  const KEY=`ai-exhibition-state-${station}`;
  const stationQuery=`?station=${station}`;
  const localHost=['localhost','127.0.0.1','[::1]'].includes(location.hostname)||/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname);
  const firebaseURL=`https://f1-sap-default-rtdb.firebaseio.com/aiExhibitionHall/stations/${station}.json`;
  const endpoint=localHost?`/api/state?station=${station}`:firebaseURL;
  let writeQueue=Promise.resolve();
  let clockOffset=0;
  function connection(connected,source){if(station===5)window.dispatchEvent(new CustomEvent('ai-sync-connection',{detail:{station,connected,source}}));}
  function remember(state){try{localStorage.setItem(KEY,JSON.stringify({...state,ts:Date.now()}));}catch{}}
  async function post(packet){
   const body=localHost?packet:{stationId:station,updatedAt:{'.sv':'timestamp'},payload:JSON.stringify(packet)};
   const response=await fetch(endpoint,{method:localHost?'POST':'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(localHost?1500:5000)});
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
    try {
      const started=Date.now();
      const r=await fetch(endpoint,{cache:'no-store',signal:AbortSignal.timeout(localHost?900:5000)});
      if(!r.ok)throw Error(`State read failed: ${r.status}`);
      const stored=await r.json();
      const state=localHost?stored:stored?.payload?JSON.parse(stored.payload):{stationId:station,view:'home',projectId:null};
      if(!localHost){state.stationId=station;if(stored?.updatedAt)state.updatedAt=stored.updatedAt;}
      if(station===5){
        const serverDate=localHost?state.serverNow:Date.parse(r.headers.get('date')||'');
        if(Number.isFinite(serverDate))clockOffset=serverDate-(started+Date.now())/2;
        connection(true,'read');if(state.updatedAt)remember(state);
      }
      return state;
    }
    catch(e){connection(false,'read');try{const cached=JSON.parse(localStorage.getItem(KEY)||'null');if(station===5&&Number.isFinite(cached?.serverNow)&&Number.isFinite(cached?.ts))clockOffset=cached.serverNow-cached.ts;return cached;}catch{return null;}}
  }
  window.AI_SYNC={station,stationQuery,send,read,KEY,pollInterval:localHost?150:1000,now:()=>Math.round(Date.now()+clockOffset)};
})();
