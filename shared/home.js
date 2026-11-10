// Station and room select the paired devices, independently of card position.
const sync=window.AI_SYNC;
const app=document.getElementById('app');
app.innerHTML=window.EXHIBITION_HOME.render({interactive:true,stationQuery:sync.stationQuery});
app.querySelectorAll('[data-project]').forEach(a=>a.addEventListener('click',async e=>{
  e.preventDefault();
  await sync.send({view:'project',projectId:a.dataset.project,section:null});
  location.assign(a.href);
}));
sync.send({view:'home',projectId:null,section:null});
