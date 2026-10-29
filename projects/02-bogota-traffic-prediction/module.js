/* PredictToDo tablet controller. The main display receives the exact same
   game state through the existing three-station HTTP synchronization. */
window.ProjectModule={
  id:'02',
  mountController({project,sync,mount,home}){
    let gameData=null, idleTimer=null, infoTimer=null;
    const landingCopy={
      es:{information:'Información',game:'Minijuego',home:'Inicio',loading:'Preparando el centro de control…'},
      en:{information:'Information',game:'Mini game',home:'Home',loading:'Preparing the control center…'}
    };
    let state={language:'es',mode:'landing',informationActive:false,infoCtaActive:false,game:null};
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
        language:state.language,mode:state.informationActive?(state.infoCtaActive?'cta':'overview'):state.mode,
        screenIndex:state.informationActive?1:null,game:state.mode==='game'?state.game:null
      });
    }
    function armIdle(){
      clearTimeout(idleTimer);
      if(state.mode==='game')idleTimer=setTimeout(()=>setState({mode:'landing',informationActive:false,infoCtaActive:false,game:null}),90000);
    }
    function setState(next){state={...state,...next};render();void publish();armIdle();}
    function showInformation(){
      clearTimeout(infoTimer);setState({informationActive:true,infoCtaActive:false});
      infoTimer=setTimeout(()=>{if(state.informationActive&&state.mode==='landing')setState({infoCtaActive:true});},10000);
    }
    async function goHome(){
      clearTimeout(idleTimer);clearTimeout(infoTimer);
      await sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null});
      location.assign(home);
    }
    function landing(){
      const copy=words();
      const artwork=`./assets/TABLET/PredictToDo_Pantalla_Inicio_${state.language==='es'?'ES':'EN'}.png`;
      return `<main class="traffic-approved-landing"><img class="traffic-approved-landing-art" src="${artwork}" alt="" aria-hidden="true"><nav class="traffic-approved-landing-actions" aria-label="PredictToDo"><button type="button" class="traffic-landing-hit traffic-landing-hit--es" data-language="es" aria-label="Español"></button><button type="button" class="traffic-landing-hit traffic-landing-hit--en" data-language="en" aria-label="English"></button><button type="button" class="traffic-landing-hit traffic-landing-hit--overview" data-action="information" aria-label="${copy.information}"></button><button type="button" class="traffic-landing-hit traffic-landing-hit--game" data-action="open-game" aria-label="${copy.game}"></button><button type="button" class="traffic-landing-hit traffic-landing-hit--home" data-action="home" aria-label="${copy.home}"></button></nav></main>`;
    }
    function render(){
      if(state.mode==='landing')mount.innerHTML=landing();
      else if(!gameData)mount.innerHTML=`<main class="pulse-command pulse-command--loading"><p>${words().loading}</p></main>`;
      else mount.innerHTML=window.PULSE_VIAL.render({data:gameData,game:state.game,language:state.language});
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
        if(action==='open-game'){
          clearTimeout(infoTimer);
          try{await loadData();return setState({mode:'game',informationActive:false,infoCtaActive:false,game:freshGame()});}
          catch{mount.innerHTML='<main class="pulse-command pulse-command--loading"><p>GAME_DATA.json could not be loaded.</p></main>';return;}
        }
        if(action==='home')return goHome();
        if(action==='exit-game')return setState({mode:'landing',informationActive:false,infoCtaActive:false,game:null});
        if(action==='to-player')return updateGame({phase:'player'});
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
        if(action==='next-scenario'){
          const nextIndex=gameData.scenarios.findIndex((_,index)=>!Object.hasOwn(state.game.results,index));
          if(nextIndex===-1)return updateGame({phase:'final',actionId:null});
          return updateGame({phase:'explore',scenarioIndex:nextIndex,hour:gameData.scenarios[nextIndex].hour,actionId:null});
        }
        if(action==='reset-game')return updateGame(freshGame());
      }));
      mount.querySelectorAll('[data-role]').forEach(button=>button.addEventListener('click',()=>updateGame({playerId:button.dataset.role})));
      mount.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{
        const scenarioIndex=Number(button.dataset.scenario),scenario=gameData.scenarios[scenarioIndex];
        updateGame({scenarioIndex,hour:scenario.hour,actionId:null});
      }));
      mount.querySelectorAll('[data-action-choice]').forEach(button=>button.addEventListener('click',()=>updateGame({actionId:button.dataset.actionChoice})));
      mount.querySelector('[data-hour]')?.addEventListener('input',event=>updateGame({hour:Number(event.target.value)}));
      mount.querySelector('[data-name]')?.addEventListener('input',event=>{
        state.game={...state.game,playerName:event.target.value.slice(0,40)};
        void publish();
      });
    }
    render();void publish();
  }
};
