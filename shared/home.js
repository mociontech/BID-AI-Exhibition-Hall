// Dedicated RegLAC entry; Home retains access to the general project menu.
if(new URLSearchParams(location.search).get('station')==='7'&&!new URLSearchParams(location.search).has('projects')){
 location.replace('projects/07-csd-maiia/index.html'+window.AI_SYNC.stationQuery);
}else if(new URLSearchParams(location.search).get('station')==='6'&&!new URLSearchParams(location.search).has('projects')){
 location.replace('projects/06-reglac/index.html'+window.AI_SYNC.stationQuery);
}else{
const projects=window.EXHIBITION_PROJECTS;
// Ten visitor projects, including a single Teachy entry at position 08.
const visibleProjects=projects;
const sync=window.AI_SYNC;
const app=document.getElementById('app');
const cardNames={'07':'MAIIA','10':'Country<br>Intelligence'};
// Crop the photos from the approved artwork; titles and touch targets remain live HTML.
const photoXs=[4.84,27.40,49.97,72.53,95.10];
app.innerHTML=`<div class="exhibition-screen approved-home"><header class="home-header" aria-label="AI in Action · IDB Group Projects Across the Region"><div class="home-approved-logo" role="img" aria-label="IDB Group"></div><div class="home-heading"><div class="home-heading-row"><h1>AI in Action</h1><p>IDB Group Projects Across the Region</p></div><span class="home-instruction">Select a project to begin your experience.</span></div></header><nav class="projects-grid" aria-label="Projects">${visibleProjects.map((p,index)=>`<a href="${p.href}${sync.stationQuery}" class="project-tile" aria-label="Project ${String(index+1).padStart(2,'0')}: ${p.name}" data-project="${p.id}"><span class="tile-copy"><span class="tile-number">${String(index+1).padStart(2,'0')}</span><span class="tile-title">${cardNames[p.id]||p.name}</span></span><span class="home-card-photo" style="--photo-x:${photoXs[index%5]}%;--photo-y:${index<5?'52.84':'88.10'}%" aria-hidden="true"></span></a>`).join('')}</nav></div>`;
app.querySelectorAll('[data-project]').forEach(a=>a.addEventListener('click',async e=>{
  e.preventDefault();
  const projectId=a.dataset.project;
  await sync.send({view:'project',projectId,section:null});
  location.assign(a.href);
}));
sync.send({view:'home',projectId:null,section:null});
}
