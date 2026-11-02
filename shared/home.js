// Dedicated RegLAC entry; Home retains access to the general project menu.
if(new URLSearchParams(location.search).get('station')==='6'&&!new URLSearchParams(location.search).has('projects')){
 location.replace('projects/06-reglac/index.html?station=6');
}else{
const projects=window.EXHIBITION_PROJECTS;
// SIEMPLEA remains in the registry and keeps its route, but is intentionally
// not part of the public tablet menu at this stage.
const visibleProjects=projects.filter(project=>project.id!=='08');
const B=window.AI_BRAND;
const sync=window.AI_SYNC;
const app=document.getElementById('app');
const menuPhotos={
  '01':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/01_aquadata.jpg',
  '02':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/02_bogota_traffic_prediction.jpg',
  '03':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/03_costa_rica_smart_borders.jpg',
  '04':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/04_parque_tecnologico_guatiguara.jpg',
  '05':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/05_profe_gabi.jpg',
  '06':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/06_reglac.jpg',
  '07':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/07_csd_maiia.jpg',
  '08':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/08_siemplea.jpg',
  '09':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/09_teachy.jpg',
  '10':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/10_vpc_country_intelligence.jpg',
  '11':'assets/AI_Exhibition_Hall_Recursos_Graficos/cards/photos/11_rsm_rise.jpg'
};
// Resolving images against the active document makes the card art work both
// through the local server and when index.html is opened directly from disk.
const cardImage=(path)=>new URL(path,document.baseURI).href;
app.innerHTML=`<div class="exhibition-screen"><header class="header home-header" aria-label="BID AI Exhibition Hall"><div class="header-copy"><h1 class="hero-title">Explore <span class="em">AI</span> in Action</h1><p class="hero-deck">Select a project to begin your experience.</p></div><p class="home-motto" aria-hidden="true"><span>PEOPLE</span><span>SOLUTIONS</span><span>GREATER IMPACT</span></p></header><section class="projects-grid" aria-label="Projects">${visibleProjects.map((p,index)=>`<a href="${p.href}${sync.stationQuery}" class="project-tile" aria-label="Project ${String(index+1).padStart(2,'0')}: ${p.name}" style="--tile-art:url('${cardImage(menuPhotos[p.id]||p.image)}')" data-project="${p.id}"><span class="tile-copy"><span class="tile-number">${String(index+1).padStart(2,'0')}</span><span class="tile-title">${p.name}</span>${p.id==='11'?`<span class="tile-caption">${p.subtitle}</span>`:''}</span><span class="tile-arrow">${B.arrow}</span></a>`).join('')}</section>${B.footer('#','Back','index.html'+sync.stationQuery,sync.station,true)}<span class="station-note">STATION ${String(sync.station).padStart(2,'0')}</span></div>`;
app.querySelectorAll('[data-project]').forEach(a=>a.addEventListener('click',async e=>{
  e.preventDefault();
  const projectId=a.dataset.project;
  await sync.send({view:'project',projectId,section:null});
  location.assign(a.href);
}));
app.querySelector('[data-go-home]').addEventListener('click',e=>{e.preventDefault();sync.send({view:'home',projectId:null,section:null});});
sync.send({view:'home',projectId:null,section:null});
}
