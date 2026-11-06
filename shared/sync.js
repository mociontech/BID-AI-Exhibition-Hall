/* Local server during development; Firebase Realtime Database on public hosting. */
(function(){
  const params=new URLSearchParams(location.search);
  let previous='1'; try { previous=sessionStorage.getItem('exhibition-station')||'1'; } catch {}
  const raw=Number(params.get('station')||previous);
  // Eleven station IDs: Teachy runs on station 8; 9 stays allowed by the published rules.
  const station=[1,2,3,4,5,6,7,8,9,10,11].includes(raw)?raw:1;
  try { sessionStorage.setItem('exhibition-station',String(station)); } catch {}
  const suppliedRoom=params.get('room');
  let previousRoom=null;
  try { if(sessionStorage.getItem('exhibition-room-station')===String(station))previousRoom=sessionStorage.getItem('exhibition-room'); } catch {}
  const room=/^[a-f0-9]{32}$/.test(suppliedRoom||'')?suppliedRoom:(!params.has('room')?previousRoom:null);
  const safeRoom=/^[a-f0-9]{32}$/.test(room||'')?room:null;
  try {
    if(safeRoom){sessionStorage.setItem('exhibition-room-station',String(station));sessionStorage.setItem('exhibition-room',safeRoom);}
    else {sessionStorage.removeItem('exhibition-room-station');sessionStorage.removeItem('exhibition-room');}
  } catch {}
  const KEY=`ai-exhibition-state-${station}${safeRoom?'-'+safeRoom:''}`;
  const stationQuery=`?station=${station}${safeRoom?'&room='+safeRoom:''}`;
  const localHost=['localhost','127.0.0.1','[::1]'].includes(location.hostname)||/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname);
  const firebaseURL=`https://f1-sap-default-rtdb.firebaseio.com/aiExhibitionHall/${safeRoom?'rooms/'+safeRoom:'stations/'+station}.json`;
  const endpoint=localHost?`/api/state${stationQuery}`:firebaseURL;
  let writeQueue=Promise.resolve();
  let clockOffset=0;
  let lastClockRead=0;
  async function readHostingClock(){
    // Firebase does not expose Date through CORS. The same-origin hosting
    // response provides a shared clock without adding another backend.
    if(lastClockRead&&Date.now()-lastClockRead<60000)return;
    const started=Date.now();
    try{
      const response=await fetch('/index.html',{method:'HEAD',cache:'no-store',signal:AbortSignal.timeout(5000)});
      const serverDate=Date.parse(response.headers.get('date')||'');
      if(response.ok&&Number.isFinite(serverDate)){
        clockOffset=serverDate+500-(started+Date.now())/2;
        lastClockRead=Date.now();
      }
    }catch{}
  }
  function connection(connected,source){window.dispatchEvent(new CustomEvent('ai-sync-connection',{detail:{station,connected,source}}));}
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
      if(station===5||station===6||station===7||station===10||['05','06','07','10','11'].includes(state.projectId)||location.pathname?.includes('/projects/11-rsm-rise/')){
        const serverDate=localHost?state.serverNow:Date.parse(r.headers.get('date')||'');
        if(Number.isFinite(serverDate))clockOffset=serverDate-(started+Date.now())/2;
        else if(!localHost)await readHostingClock();
        connection(true,'read');if(state.updatedAt)remember(state);
      }
      return state;
    }
    catch(e){connection(false,'read');try{const cached=JSON.parse(localStorage.getItem(KEY)||'null');if(station===5&&Number.isFinite(cached?.serverNow)&&Number.isFinite(cached?.ts))clockOffset=cached.serverNow-cached.ts;return cached;}catch{return null;}}
  }
  window.AI_SYNC={station,room:safeRoom,stationQuery,send,read,KEY,pollInterval:localHost?150:1000,now:()=>Math.round(Date.now()+clockOffset)};
})();
