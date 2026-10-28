/* Shared controller for individual project folders. Content lives in each project/module.js. */
(function(){
const project=EXHIBITION_PROJECTS.find(p=>p.id===window.ProjectModule.id);
if(!project) throw new Error('Unknown project id in this module.');
const brand=AI_BRAND, sync=AI_SYNC, mount=document.getElementById('app');
const root='../../',home=root+'index.html'+sync.stationQuery;
if(typeof window.ProjectModule.mountController==='function'){
  window.ProjectModule.mountController({project,brand,sync,mount,root,home});
  return;
}
const sections=[
  {id:'what',title:'What It Is & the Problem',subtitle:'Purpose, challenge and context.',icon:'▤'},
  {id:'solution',title:'The Solution',subtitle:'How the project addresses the problem.',icon:'✦'},
  {id:'ai',title:'How AI Is Used',subtitle:'The role of artificial intelligence.',icon:'▦'},
  {id:'results',title:'Results & Key Figures',subtitle:'Impact, metrics and evidence.',icon:'▂'},
  {id:'users',title:'Who Uses It / Who Benefits',subtitle:'Main users and beneficiaries.',icon:'♟'},
  {id:'before-after',title:'Before & After',subtitle:'How the workflow changes with AI.',icon:'⇄'}
];
let stage='landing';let active=null;
function goToSection(next,section=null){stage=next;active=section;render();sync.send({view:next==='landing'?'project':next==='overview-detail'?'overview':next,projectId:project.id,section});}
function render(){
 const top=`<header class="header">${brand.hero()}${brand.header()}<div class="header-copy"><div class="project-kicker">PROJECT ${project.id}</div><h1 class="project-heading"><span class="accent">${project.name}</span></h1><p class="project-descriptor">${project.subtitle}</p>${stage==='landing'?`<p class="project-intro">${project.description}</p>`:''}</div></header>`;
 let middle='';
 if(stage==='landing') middle=`<div class="two-options"><button class="option-card" data-action="overview"><div class="option-image" style="--project-image:url('${root}${project.image}')"><span class="cover-icon">▤</span></div><div class="option-info"><h2>Project Overview</h2><p>Key facts, objectives, process and evidence.</p><span class="option-arrow">${brand.arrow}</span></div></button><button class="option-card" data-action="game"><div class="option-image" style="--project-image:url('${root}${project.image}')"><span class="cover-icon">✦</span></div><div class="option-info"><h2>Interactive Mini-Game</h2><p>Explore how AI can change this project's workflow.</p><span class="option-arrow">${brand.arrow}</span></div></button></div>`;
 else if(stage==='overview') middle=`<h2 class="section-title">Project Overview</h2><p class="section-description">Select a topic to explore this project on the large display.</p><div class="overview-grid">${sections.map(s=>`<button class="overview-card" data-section="${s.id}"><span class="overview-icon">${s.icon}</span><span class="overview-title">${s.title}</span><span class="overview-sub">${s.subtitle}</span><span class="option-arrow">${brand.arrow}</span></button>`).join('')}</div>`;
 else if(stage==='overview-detail'){
  const s=sections.find(s=>s.id===active);
  const override=(window.ProjectModule.overview||{})[s.id];
  middle=`<div class="detail-view"><span class="pill">PROJECT OVERVIEW</span><h2>${s.title}</h2><p>${override?.body||'Content for this section is pending review. It will be added when we develop this project individually.'}</p><div class="mini-label">${override?'APPROVED PROJECT CONTENT':'CONTENT NOT YET PROGRAMMED'}</div></div>`;
 }
 else if(stage==='game')middle=`<div id="game-mount" class="detail-view"></div>`;
 const backName=stage==='overview-detail'?'Back to Overview':(stage==='landing'?'Back to Projects':'Back to Project');
 mount.innerHTML=`<div class="project-layout">${top}<section class="project-content">${middle}</section>${brand.footer(home,backName,home,sync.station)}</div>`;
 mount.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>goToSection(el.dataset.action)));
 mount.querySelectorAll('[data-section]').forEach(el=>el.addEventListener('click',()=>goToSection('overview-detail',el.dataset.section)));
 mount.querySelector('[data-go-back]').addEventListener('click',async(e)=>{e.preventDefault();if(stage==='landing'){await sync.send({view:'home',projectId:null,section:null});location.assign(home);}else if(stage==='overview-detail'){goToSection('overview');}else{goToSection('landing');}});
 mount.querySelector('[data-go-home]').addEventListener('click',async(e)=>{e.preventDefault();await sync.send({view:'home',projectId:null,section:null});location.assign(home);});
 if(stage==='game')window.ProjectModule.mountMiniGame(document.getElementById('game-mount'));
}
render();sync.send({view:'project',projectId:project.id,section:null});
})();
