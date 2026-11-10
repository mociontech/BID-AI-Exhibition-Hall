/* PredictToDo tablet controller. The main display receives the exact same
   game state through the existing three-station HTTP synchronization. */
window.ProjectModule={
  id:'02',
  mountController({project,sync,mount,home}){
    let gameData=null,dayTimer=null,playRate=1000;
    const savingSessions=new Set();
    const ranking=window.PREDICTTODO_RANKING,sessionClock=ranking.clock();
    const landingCopy={
      es:{information:'Información',game:'Minijuego',home:'Inicio',loading:'Preparando el centro de control…'},
      en:{information:'Information',game:'Mini game',home:'Home',loading:'Preparing the control center…'}
    };
    let state={language:'en',mode:'landing',informationActive:false,game:null};
    const words=()=>landingCopy[state.language];
    // The panel guide is tablet-only UI: shown once per visitor, never part of the shared game state.
    let guideOpen=false,guideSeen=false;
    const freshGame=()=>{sessionClock.reset();guideOpen=false;guideSeen=false;return {phase:'intro',playerId:'valentina',playerName:'',hour:16,scenarioIndex:0,selectedCorridor:null,mapView:null,mapPopup:null,actionId:null,results:{},sessionId:crypto.randomUUID(),durationMs:0,rankStatus:null};};
    const infoImages=window.BOGOTA_TRAFFIC.INFO_IMAGES;
    Object.values(infoImages).forEach(path=>{const image=new Image();image.src=`../../${path}`;});
    async function loadData(){
      if(gameData)return gameData;
      gameData=await fetch('./GAME_DATA.json',{cache:'no-store'}).then(response=>{
        if(!response.ok)throw Error('GAME_DATA.json could not be loaded.');
        return response.json();
      });
      return gameData;
    }
    const displayView=()=>state.informationActive?'overview':state.mode==='game'?'game':'project';
    function publish(){
      return sync.send({
        view:displayView(),projectId:project.id,
        section:state.informationActive?'info':state.mode==='game'?'pulse-game':null,
        language:state.language,mode:state.informationActive?'overview':state.mode,
        screenIndex:state.informationActive?1:null,game:state.mode==='game'?state.game:null
      });
    }
    function stopDay(){
      if(dayTimer)clearInterval(dayTimer);dayTimer=null;
      const button=mount.querySelector('[data-cc-play]');
      if(button)button.textContent='▶ '+window.PREDICTTODO_CONTROL.words[state.language].play;
    }
    // Day playback runs continuously in quarter hours: one hour of simulation takes `playRate` ms.
    // Each step uses the light update path (no full re-render); the TV follows every published quarter.
    function startDay(){
      if(dayTimer)clearInterval(dayTimer);
      let last=performance.now(),carry=state.game.hour;
      dayTimer=setInterval(()=>{
        const now=performance.now();carry=Math.min(23,carry+(now-last)/playRate);last=now;
        const hour=Math.round(carry*4)/4;
        if(hour!==state.game.hour)applyHour(hour);
        if(hour>=23){stopDay();render();}
      },100);
    }
    function applyHour(hour){
      state.game={...state.game,hour};
      if(mount.querySelector('[data-cc-geography]'))window.PREDICTTODO_CONTROL.update(mount,{data:gameData,game:state.game,language:state.language});
      else window.PULSE_VIAL.mountLiveMap(mount,{data:gameData,game:state.game,language:state.language});
      void publish();
    }
    function setState(next){
      if(next.mode==='landing'||next.game?.phase&&next.game.phase!=='explore')stopDay();
      state={...state,...next};render();void publish();armIdle();
    }
    // Inactivity: with nobody touching the tablet, both screens return to the project cover.
    // Any state change (including day playback ticks) re-arms it, so active use is never interrupted.
    // `?idle=<minutes>` overrides the default; `?idle=0` disables it while reviewing.
    const idleMinutes=Number(new URLSearchParams(location.search).get('idle'));
    const IDLE_MS=(Number.isFinite(idleMinutes)&&idleMinutes>=0&&location.search.includes('idle=')?idleMinutes:4)*60*1000;let idleTimer=null;
    function armIdle(){
      clearTimeout(idleTimer);idleTimer=null;
      if(!IDLE_MS||state.mode==='landing'&&!state.informationActive)return;
      idleTimer=setTimeout(()=>{if(state.mode!=='landing'||state.informationActive)setState({mode:'landing',informationActive:false,game:null});},IDLE_MS);
    }
    ['pointerdown','keydown','touchstart','input'].forEach(type=>document.addEventListener(type,armIdle,{passive:true}));
    function showInformation(){setState({informationActive:true});}
    function leaveInformation(){setState({informationActive:false});}
    async function goHome(){
      stopDay();
      await sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null});
      location.assign(home);
    }
    function landing(){
      return window.PREDICTTODO_VISUAL.landing(state.language,{
        station:sync.station,
        informationActive:state.informationActive
      });
    }
    function render(){
      if(state.mode!=='game')window.PREDICTTODO_CONTROL?.release(mount);
      if(state.mode==='landing')mount.innerHTML=landing();
      else if(!gameData)mount.innerHTML=`<main class="pulse-command pulse-command--loading"><p>${words().loading}</p></main>`;
      else window.PULSE_VIAL.renderInto(mount,{data:gameData,game:state.game,language:state.language});
      if(guideOpen&&state.mode==='game'&&state.game?.phase==='explore')mount.insertAdjacentHTML('beforeend',window.PREDICTTODO_CONTROL.guide(state.language));
      else guideOpen=false;
      bind();
      const play=mount.querySelector('[data-cc-play]');
      if(play)play.textContent=(dayTimer?'Ⅱ ':'▶ ')+window.PREDICTTODO_CONTROL.words[state.language][dayTimer?'pause':'play'];
      mount.querySelectorAll('[data-play-rate]').forEach(button=>button.setAttribute('aria-pressed',Number(button.dataset.playRate)===playRate));
    }
    function updateGame(next){
      const game={...state.game,...next};
      if(game.mapPopup?.hotspot){
        const item=gameData.scenarios[game.scenarioIndex];
        if(item.baseline.critical+(item.effects[game.actionId]?.critical||0)<=0)game.mapPopup=null;
      }
      setState({game});
    }
    function closeGuide(){
      guideOpen=false;guideSeen=true;mount.querySelector('[data-cc-guide]')?.remove();
      sessionClock.start(performance.now());armIdle();
    }
    function selectCorridor(id,focus=false){
      updateGame({selectedCorridor:id,...(focus?{mapPopup:null}:{})});
      if(focus)window.PREDICTTODO_CONTROL.focusCorridor(mount,id);
      const side=mount.querySelector('.cc-side-content'),detail=mount.querySelector('[data-cc-exploration]');
      if(side&&detail)side.scrollTop+=detail.getBoundingClientRect().top-side.getBoundingClientRect().top-12;
    }
    async function saveRanking(){
      if(savingSessions.has(state.game.sessionId)||state.game.rankStatus==='saved')return;
      const game={...state.game,rankStatus:'saving'},sessionId=game.sessionId;
      const unchanged=()=>state.game?.sessionId===sessionId&&state.game.durationMs===game.durationMs&&JSON.stringify(state.game.results)===JSON.stringify(game.results)&&state.game.rankStatus==='saving';
      savingSessions.add(sessionId);updateGame(game);
      try{await ranking.save(game);if(unchanged())updateGame({rankStatus:'saved'});}
      catch{if(unchanged())updateGame({rankStatus:'error'});}
      finally{savingSessions.delete(sessionId);if(state.game?.phase==='resources'&&state.game.rankStatus===null)void saveRanking();}
    }
    function bind(){
      mount.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{
        if(button.dataset.language!==state.language)setState({language:button.dataset.language});
      }));
      mount.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',async event=>{
        event.preventDefault();
        const action=button.dataset.action;
        if(action==='toggle-day'){
          if(dayTimer){stopDay();return;}
          if(state.game.hour>=23)applyHour(6);
          startDay();
          render();return;
        }
        if(action==='information')return showInformation();
        if(action==='back-information')return leaveInformation();
        if(action==='open-game'){
          try{await loadData();return setState({mode:'game',informationActive:false,game:freshGame()});}
          catch{mount.innerHTML='<main class="pulse-command pulse-command--loading"><p>GAME_DATA.json could not be loaded.</p></main>';return;}
        }
        if(action==='home')return goHome();
        if(action==='exit-game')return setState({mode:'landing',informationActive:false,game:null});
        if(action==='to-player')return updateGame({phase:'player'});
        if(action==='back-player')return updateGame({phase:'player',actionId:null});
        if(action==='to-intro')return updateGame({phase:'intro'});
        if(action==='start-explore'){
          const name=mount.querySelector('[data-name]')?.value.trim()||'';
          const scenario=gameData.scenarios[state.game.scenarioIndex];
          // First entry: the guide covers the panel and the ranking clock waits until it is closed.
          if(guideSeen)sessionClock.start(performance.now());else guideOpen=true;
          return updateGame({phase:'explore',playerName:name,hour:scenario.hour,actionId:null});
        }
        if(action==='close-guide')return closeGuide();
        if(action==='to-explore'){sessionClock.start(performance.now());return updateGame({phase:'explore',actionId:null});}
        if(action==='to-decision')return updateGame({phase:'decision',hour:gameData.scenarios[state.game.scenarioIndex].hour,actionId:null});
        if(action==='confirm-decision'){
          if(!state.game.actionId)return;
          const chosenScenario=gameData.scenarios[state.game.scenarioIndex];
          const score=window.PULSE_VIAL.roleScore(gameData,state.game,chosenScenario,state.game.actionId);
          return updateGame({phase:'result',results:{...state.game.results,[state.game.scenarioIndex]:score}});
        }
        if(action==='retry')return updateGame({phase:'decision',actionId:null});
        if(action==='choose-event')return updateGame({phase:'explore',actionId:null});
        if(action==='finish-session'&&Object.keys(state.game.results).length)return updateGame({phase:'final',actionId:null,durationMs:sessionClock.pause(performance.now())});
        if(action==='resume-events'){sessionClock.start(performance.now());return updateGame({phase:'explore',actionId:null,rankStatus:null});}
        if(action==='to-ranking'){updateGame({phase:'resources'});return saveRanking();}
        if(action==='retry-ranking')return saveRanking();
        if(action==='back-summary')return updateGame({phase:'final'});
        if(action==='reset-game')return updateGame(freshGame());
      }));
      mount.querySelectorAll('[data-role]').forEach(button=>button.addEventListener('click',()=>updateGame({playerId:button.dataset.role})));
      mount.querySelectorAll('[data-action-choice]').forEach(button=>button.addEventListener('click',()=>updateGame({actionId:button.dataset.actionChoice})));
      mount.querySelector('[data-hour]')?.addEventListener('input',event=>{
        stopDay();
        applyHour(Math.round(Number(event.target.value)*4)/4);
      });
      mount.querySelector('[data-hour]')?.addEventListener('change',()=>render());
      mount.querySelector('[data-name]')?.addEventListener('input',event=>{
        state.game={...state.game,playerName:event.target.value.slice(0,40)};
        void publish();
      });
    }
    // Delegation keeps freshly redrawn graph markers and road rankings interactive.
    mount.addEventListener('click',event=>{
      if(event.target.matches('[data-cc-guide]')){closeGuide();return;}
      const caseButton=event.target.closest('[data-scenario]');
      if(caseButton){
        stopDay();
        const scenarioIndex=Number(caseButton.dataset.scenario),scenario=gameData.scenarios[scenarioIndex];
        updateGame({scenarioIndex,hour:scenario.hour,selectedCorridor:null,mapView:null,mapPopup:null,actionId:null});return;
      }
      const roadButton=event.target.closest('[data-corridor]');
      if(roadButton){selectCorridor(roadButton.dataset.corridor,true);return;}
      const rate=event.target.closest('[data-play-rate]');
      if(rate){playRate=Number(rate.dataset.playRate);if(dayTimer)startDay();render();}
    });
    mount.addEventListener('ptd-corridor',event=>{
      const item=gameData?.scenarios[state.game?.scenarioIndex];
      if(item&&window.PREDICTTODO_EXPLORATION.ids(item).includes(event.detail))selectCorridor(event.detail);
    });
    function publishMapState(key,value){
      if(state.mode!=='game'||!['explore','decision','result'].includes(state.game?.phase))return;
      const clean=window.PREDICTTODO_VIEW_STATE[key==='mapView'?'camera':'popup'](value,state.game.scenarioIndex);
      if(value&&!clean)return;
      if(JSON.stringify(state.game[key]||null)===JSON.stringify(clean))return;
      state.game={...state.game,[key]:clean};
      const record=mount.querySelector('[data-cc-geography]')?._ccRecord;
      if(record)record.options={...record.options,game:state.game};
      void publish();
    }
    mount.addEventListener('ptd-map-view',event=>publishMapState('mapView',event.detail));
    mount.addEventListener('ptd-map-popup',event=>publishMapState('mapPopup',event.detail));
    render();void publish();
  }
};
