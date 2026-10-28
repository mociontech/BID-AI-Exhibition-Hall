window.ProjectModule={
 id:'01',
 async mountController({project,sync,mount,home}){
  const root='./AquaData_12_Imagenes_Ligeras_JPG/';
  const cover={es:'./assets/es/01_Pantalla_Principal.png',en:'./assets/en/01_Main_Screen.png'};
  const words={es:{info:'Ver ficha técnica',game:'Detective del Agua',home:'Inicio',back:'Volver',start:'Comenzar misión',confirm:'Confirmar inspecciones',again:'Jugar de nuevo',menu:'Volver al menú AquaData'},en:{info:'View technical sheet',game:'Water Detective',home:'Home',back:'Back',start:'Start mission',confirm:'Confirm inspections',again:'Play again',menu:'Return to AquaData menu'}};
  let contracts=[],outcomes=new Map(),unlockTimer=null,flowTimer=null;
  let state={language:'es',mode:'landing',step:1,p1:[],p2:[],analysisReady:false};
  const t=()=>words[state.language], chosen=()=>state.step===2?state.p1:state.p2;
  const result=list=>list.filter(id=>outcomes.get(id)===true).length;
  const payload=()=>({step:state.step,p1:state.p1,p2:state.p2,p1Result:result(state.p1),p2Result:result(state.p2)});
  function send(){return sync.send({view:state.mode==='game'?'game':'project',projectId:project.id,section:state.mode==='game'?`game-${state.step}`:state.mode==='info'?'technical-sheet':null,language:state.language,mode:state.mode,screenIndex:state.mode==='game'?state.step:1,game:state.mode==='game'?payload():null});}
  function flow(){if(flowTimer)clearTimeout(flowTimer);flowTimer=null;const ms=state.mode==='game'&&state.step===3&&!state.analysisReady?3200:0;if(ms)flowTimer=setTimeout(()=>{if(state.mode==='game'&&state.step===3)set({analysisReady:true});},ms);}
  function set(next){state={...state,...next};flow();render();void send();}
  function hot(className,label,attrs=''){return `<button type="button" class="aqua-hotspot ${className}" aria-label="${label}" ${attrs}></button>`;}
  function languages(){return `${hot('aqua-hotspot--spanish','Español',`data-language="es" aria-pressed="${state.language==='es'}"`)}${hot('aqua-hotspot--english','English',`data-language="en" aria-pressed="${state.language==='en'}"`)}`;}
  function landing(){const x=t();return `<main class="aqua-approved-screen aqua-approved-screen--landing"><img class="aqua-approved-art" src="${cover[state.language]}" alt="" aria-hidden="true"><nav class="aqua-approved-actions">${languages()}${hot('aqua-hotspot--information',x.info,'data-action="information"')}${hot('aqua-hotspot--game',x.game,'data-action="game"')}${hot('aqua-hotspot--home',x.home,'data-action="home"')}${hot('aqua-hotspot--back',x.back,'data-action="home"')}</nav></main>`;}
  function game(){
   const language=state.language==='en'?'EN':'ES',files=['01_Mision.jpg','02_Seleccion_Sin_IA_Negocios.jpg','03_Analisis_AquaData.jpg','04_Seleccion_Con_IA_Negocios.jpg','05_Verificacion_Resultados.jpg','06_Impacto_Real.jpg'];
   let controls=languages();
   if(state.step===1)controls+=hot('aqua-game-hit aqua-game-hit--start',t().start,'data-action="next"');
   if(state.step===2||state.step===4){
    controls+=contracts.map((c,i)=>hot(`aqua-game-hit aqua-game-hit--card aqua-game-hit--card-${i+1} ${chosen().includes(c.id)?'is-selected':''}`,state.language==='es'?c.es:c.en,`data-contract="${c.id}" aria-pressed="${chosen().includes(c.id)}"`)).join('');
    controls+=`<output class="aqua-game-counter" aria-live="polite"><span>${state.language==='es'?'Inspecciones<br>seleccionadas':'Selected<br>inspections'}</span><strong>${chosen().length}/3</strong></output>`;
    controls+=chosen().length===3?`<button type="button" class="aqua-game-ready aqua-game-hit--confirm" data-action="confirm">${t().confirm}<span aria-hidden="true">→</span></button>`:hot('aqua-game-hit aqua-game-hit--confirm',t().confirm,'disabled aria-disabled="true"');
   }
   if(state.step===6)controls+=`${hot('aqua-game-hit aqua-game-hit--restart',t().again,'data-action="restart"')}${hot('aqua-game-hit aqua-game-hit--cover',t().menu,'data-action="cover"')}`;
   const progress=state.step===3?'<span class="aqua-game-progress" aria-hidden="true"><i></i></span>':'';
   if(state.step===3&&state.analysisReady)controls+=`<button type="button" class="aqua-game-continue aqua-game-continue--analysis" data-action="next">${state.language==='es'?'Continuar':'Continue'} <span aria-hidden="true">→</span></button>`;
   if(state.step===5)controls+=`<button type="button" class="aqua-game-continue aqua-game-continue--results" data-action="next">${state.language==='es'?'Continuar':'Continue'} <span aria-hidden="true">→</span></button>`;
   return `<main class="aqua-approved-screen aqua-game-reference"><img class="aqua-approved-art" src="${root}${language}/${files[state.step-1]}" alt="" aria-hidden="true">${progress}<nav class="aqua-approved-actions">${controls}</nav></main>`;
  }
  function render(){if(!contracts.length){mount.innerHTML='<main class="detective-loading">Cargando recursos de AquaData…</main>';return;}mount.innerHTML=state.mode==='game'?game():landing();bind();}
  function info(){if(unlockTimer)clearTimeout(unlockTimer);set({mode:'info'});unlockTimer=setTimeout(()=>set({mode:'cta'}),10000);}
  function bind(){
   mount.querySelectorAll('[data-language]').forEach(button=>button.onclick=()=>button.dataset.language!==state.language&&set({language:button.dataset.language}));
   mount.querySelectorAll('[data-contract]').forEach(button=>button.onclick=()=>{const key=state.step===2?'p1':'p2',id=button.dataset.contract,list=state[key],next=list.includes(id)?list.filter(value=>value!==id):list.length<3?[...list,id]:list;set({[key]:next});});
   mount.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>{const a=button.dataset.action;if(a==='information')info();if(a==='game')set({mode:'game',step:1,p1:[],p2:[],analysisReady:false});if(a==='next')set({step:Math.min(6,state.step+1)});if(a==='confirm')set({step:state.step===2?3:5,analysisReady:false});if(a==='restart')set({step:1,p1:[],p2:[],analysisReady:false});if(a==='cover')set({mode:'landing'});if(a==='home')sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null}).then(()=>location.assign(home));});
  }
  try{const [contractsResponse,outcomesResponse]=await Promise.all([fetch(root+'contratos_ficticios.json'),fetch(root+'hallazgos_simulados_DEMO.json')]);if(!contractsResponse.ok||!outcomesResponse.ok)throw Error('resources');contracts=await contractsResponse.json();const demo=await outcomesResponse.json();outcomes=new Map(demo.outcomes.map(item=>[item.id,item.finding]));render();void send();}catch(error){mount.innerHTML='<main class="detective-loading">No se pudieron cargar los recursos del minijuego.</main>';}
 }
};

// DETECTIVE DEL AGUA
