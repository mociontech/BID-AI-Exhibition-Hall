/* Shared geometry and deterministic session transitions, used by browser and server.
   Coordinates are fractions of the visible map, including the close-up crop. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MAIIA_STATE=api;})(typeof window==='undefined'?globalThis:window,()=>{
 const phases=['intro','easy','easyResult','manual','manualResult','analysis','assisted','final'];
 const fresh=(ready=false)=>({phase:'intro',ready,unlockAt:0,analysisAt:0,startedAt:0,polygons:[],draft:[],markers:[],selected:[],easyScore:null,manual:null,assisted:null});
 // Keep curved gestures within the existing 40-point sync contract. Remove
 // near-collinear samples first; increase tolerance only if the budget requires it.
 function simplifyStroke(points,maxPoints=40){
  const distance=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy,t=d?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/d)):0;return (p[0]-a[0]-t*dx)**2+(p[1]-a[1]-t*dy)**2;};
  function simplify(list,tolerance){
   const keep=new Set([0,list.length-1]),stack=[[0,list.length-1]];
   while(stack.length){const [a,b]=stack.pop();let best=tolerance*tolerance,index=-1;
    for(let i=a+1;i<b;i++){const d=distance(list[i],list[a],list[b]);if(d>best){best=d;index=i;}}
    if(index!==-1){keep.add(index);stack.push([a,index],[index,b]);}
   }return [...keep].sort((a,b)=>a-b).map(i=>list[i]);
  }
  if(points.length<3)return points.map(p=>[...p]);
  const list=points.map(p=>p.map(n=>Number(n.toFixed(5))));
  if(list.length>3&&Math.hypot(list[0][0]-list.at(-1)[0],list[0][1]-list.at(-1)[1])<.003)list.pop();
  let tolerance=.0008,result=simplify(list,tolerance);
  while(result.length>maxPoints){tolerance*=1.5;result=simplify(list,tolerance);}
  return result;
 }
 function area(points){return Math.abs(points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1];},0))/2;}
 function inside(point,polygon){
  const [x,y]=point;let hit=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
   const [a,b]=polygon[i],[c,d]=polygon[j];
   if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)hit=!hit;
  }return hit;
 }
 // Rasterize the UNION of each set (so overlapping visitor polygons do not
 // inflate the score). Cell centers estimate geometric IoU without dependencies.
 function iou(polygons,reference,scoring){
  let intersection=0,union=0;
  for(let y=0;y<scoring.iouRows;y++)for(let x=0;x<scoring.iouColumns;x++){
   const p=[(x+.5)/scoring.iouColumns,(y+.5)/scoring.iouRows];
   const a=polygons.some(poly=>inside(p,poly)),b=reference.some(zone=>inside(p,zone.points));
   if(a||b)union++;if(a&&b)intersection++;
  }return union?Math.round(100*intersection/union):0;
 }
 function outcome(hits,errors,config){return {hits,errors,score:Math.round(100*Math.max(0,hits-errors*config.scoring.falsePositivePenalty)/config.scoring.markerLimit)};}
 function manual(markers,config){const found=new Set();let errors=0;
  for(const p of markers){const zone=config.hard.reference.find(z=>inside(p,z.points));if(zone&&!found.has(zone.id))found.add(zone.id);else errors++;}
  return outcome(found.size,errors,config);
 }
 function assisted(selected,config){const found=new Set();let errors=0;
  for(const id of selected){const c=config.hard.candidates.find(c=>c.id===id);if(c?.referenceId)found.add(c.referenceId);else errors++;}
  return outcome(found.size,errors,config);
 }
 function sanitize(value,config){
  if(!value||!phases.includes(value.phase)||typeof value.ready!=='boolean')return null;
  if(value.easyScore!==null&&(!Number.isInteger(value.easyScore)||value.easyScore<0||value.easyScore>100))return null;
  if(!['manual','assisted'].every(k=>value[k]===null||value[k]&&typeof value[k]==='object'))return null;
  if(['easyResult','manual','manualResult','analysis','assisted','final'].includes(value.phase)&&value.easyScore===null)return null;
  if(['manualResult','analysis','assisted','final'].includes(value.phase)&&value.manual===null)return null;
  if(value.phase==='final'&&value.assisted===null)return null;
  const point=p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isFinite(n)&&n>=0&&n<=1);
  if(!Array.isArray(value.polygons)||value.polygons.length>config.scoring.maxPolygons||!value.polygons.every(p=>Array.isArray(p)&&p.length>=3&&p.length<=config.scoring.maxPoints&&p.every(point)))return null;
  if(!Array.isArray(value.draft)||value.draft.length>config.scoring.maxPoints||!value.draft.every(point))return null;
  if(!Array.isArray(value.markers)||value.markers.length>config.scoring.markerLimit||!value.markers.every(point))return null;
  if(!Array.isArray(value.selected)||value.selected.length>config.hard.candidates.length||new Set(value.selected).size!==value.selected.length||!value.selected.every(id=>config.hard.candidates.some(c=>c.id===id)))return null;
  if(!['unlockAt','analysisAt','startedAt'].every(k=>Number.isSafeInteger(value[k])&&value[k]>=0))return null;
  const g={...fresh(value.ready),phase:value.phase,unlockAt:value.unlockAt,analysisAt:value.analysisAt,startedAt:value.startedAt,polygons:value.polygons.map(p=>p.map(p=>[...p])),draft:value.draft.map(p=>[...p]),markers:value.markers.map(p=>[...p]),selected:[...value.selected]};
  if(value.easyScore!==null)g.easyScore=iou(g.polygons,config.easy.reference,config.scoring);
  if(value.manual!==null)g.manual=manual(g.markers,config);
  if(value.assisted!==null)g.assisted=assisted(g.selected,config);
  return g;
 }
 return {fresh,inside,iou,manual,assisted,sanitize,phases,simplifyStroke,area};
});
