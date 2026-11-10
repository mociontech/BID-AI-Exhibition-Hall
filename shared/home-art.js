/* Display order belongs to the approved home artwork; project IDs remain stable. */
(function(){
 const cards=[
  {id:'10',name:'AI-powered Country Strategies',subtitle:'From country dialogue to results'},
  {id:'01',name:'AquaData',subtitle:'Smarter Water Loss Detection'},
  {id:'07',name:'MAIIA',subtitle:'Mapping with AI for Informal Areas'},
  {id:'04',name:'Parque Tecnológico Guatiguará',subtitle:'Regional AI Hub'},
  {id:'02',name:'PredictToDo',subtitle:'Bogotá Traffic Prediction'},
  {id:'05',name:'Profe Gabi',subtitle:'Mentoring New Teachers'},
  {id:'06',name:'RegLAC',subtitle:'Simplifying Regulation with AI'},
  {id:'11',name:'RISE',subtitle:'Risk Intelligence & Strategy Engine'},
  {id:'08',name:'Teachy',subtitle:'AI Co-Pilot for Teachers'},
  {id:'03',name:'Vuce 3.0',subtitle:'Costa Rica Smart Borders'}
 ];
 const columns=[85,444,803,1158,1514];
 const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 function render({interactive=false,stationQuery=''}={}){
  const instruction=interactive?'Select a project to start your experience':'Select a project on the tablet to start your experience';
  const links=interactive?`<nav class="home-art-targets" aria-label="Projects">${cards.map((card,index)=>{
   const project=window.EXHIBITION_PROJECTS.find(project=>project.id===card.id);
   const left=columns[index%5]/1920*100,top=(index<5?293:618)/1080*100;
   return `<a class="home-art-target" href="${escape(project.href+stationQuery)}" data-project="${card.id}" aria-label="${escape(card.name+' — '+card.subtitle)}" style="left:${left}%;top:${top}%;width:${329/1920*100}%;height:${294/1080*100}%"></a>`;
  }).join('')}</nav>`:'';
  return `<main class="home-art-viewport" aria-label="AI in Action — IDB Group Projects Across the Region"><div class="home-art-canvas"><img class="home-art-image" src="assets/home/${interactive?'tablet':'display'}-en.png?v=20261110-home-refresh" width="1920" height="1080" alt="AI in Action. IDB Group Projects Across the Region. ${interactive?'':cards.map(card=>escape(card.name+' — '+card.subtitle)).join('; ')+'. '}${instruction}." draggable="false">${links}</div></main>`;
 }
 window.EXHIBITION_HOME={cards,render};
})();
