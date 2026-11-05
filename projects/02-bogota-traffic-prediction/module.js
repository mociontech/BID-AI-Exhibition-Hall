/* PredictToDo tablet controller. The main display receives the exact same
   game state through the existing three-station HTTP synchronization. */
window.ProjectModule={
  id:'02',
  mountController({project,sync,mount,home}){
    let gameData=null;
    const landingCopy={
      es:{information:'Información',game:'Minijuego',home:'Inicio',loading:'Preparando el centro de control…'},
      en:{information:'Information',game:'Mini game',home:'Home',loading:'Preparing the control center…'}
    };
    let state={language:'en',mode:'landing',informationActive:false,game:null};
    const words=()=>landingCopy[state.language];
    const freshGame=()=>({phase:'intro',playerId:'valentina',playerName:'',hour:16,scenarioIndex:0,actionId:null,results:{}});
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
    function setState(next){state={...state,...next};render();void publish();}
    function showInformation(){setState({informationActive:true});}
    function leaveInformation(){setState({informationActive:false});}
    async function goHome(){
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
      if(state.mode==='landing')mount.innerHTML=landing();
      else if(!gameData)mount.innerHTML=`<main class="pulse-command pulse-command--loading"><p>${words().loading}</p></main>`;
      else {
        window.PULSE_VIAL.renderInto(mount,{data:gameData,game:state.game,language:state.language});
        window.PREDICTTODO_INSIGHTS?.attachFacts(mount,state.language);
      }
      bind();
    }
    function updateGame(next){setState({game:{...state.game,...next}});}
    function bind(){
      mount.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{
        if(button.dataset.language!==state.language)setState({language:button.dataset.language});
      }));
      mount.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',async event=>{
        event.preventDefault();
        const action=button.dataset.action;
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
          return updateGame({phase:'explore',playerName:name,hour:scenario.hour,actionId:null});
        }
        if(action==='to-explore')return updateGame({phase:'explore',actionId:null});
        if(action==='to-decision')return updateGame({phase:'decision',actionId:null});
        if(action==='confirm-decision'){
          if(!state.game.actionId)return;
          const chosenScenario=gameData.scenarios[state.game.scenarioIndex];
          const score=window.PULSE_VIAL.roleScore(gameData,state.game,chosenScenario,state.game.actionId);
          return updateGame({phase:'result',results:{...state.game.results,[state.game.scenarioIndex]:score}});
        }
        if(action==='retry')return updateGame({phase:'decision',actionId:null});
        if(action==='choose-event')return updateGame({phase:'explore',actionId:null});
        if(action==='finish-session'&&Object.keys(state.game.results).length)return updateGame({phase:'final',actionId:null});
        if(action==='resume-events')return updateGame({phase:'explore',actionId:null});
        if(action==='reset-game')return updateGame(freshGame());
      }));
      mount.querySelectorAll('[data-role]').forEach(button=>button.addEventListener('click',()=>updateGame({playerId:button.dataset.role})));
      mount.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{
        const scenarioIndex=Number(button.dataset.scenario),scenario=gameData.scenarios[scenarioIndex];
        updateGame({scenarioIndex,hour:scenario.hour,actionId:null});
      }));
      mount.querySelectorAll('[data-action-choice]').forEach(button=>button.addEventListener('click',()=>updateGame({actionId:button.dataset.actionChoice})));
      mount.querySelector('[data-hour]')?.addEventListener('input',event=>{
        state.game={...state.game,hour:Number(event.target.value)};
        const hourLabel=String(state.game.hour).padStart(2,'0')+':00';
        const clock=mount.querySelector('.pulse-command-clock strong');
        const timeline=mount.querySelector('.pulse-timeline>span b');
        if(clock)clock.textContent=hourLabel;
        if(timeline)timeline.textContent=hourLabel;
        window.PULSE_VIAL.mountLiveMap(mount,{data:gameData,game:state.game,language:state.language});
        void publish();
      });
      mount.querySelector('[data-hour]')?.addEventListener('change',()=>render());
      mount.querySelector('[data-name]')?.addEventListener('input',event=>{
        state.game={...state.game,playerName:event.target.value.slice(0,40)};
        void publish();
      });
    }
    render();void publish();
  }
};
