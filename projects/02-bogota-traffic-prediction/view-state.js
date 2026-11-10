/* Optional presentation state, shared by the local server and both screens. */
(function(root){
 const caseRoads=[['cali','abastos'],['nqs','calle53','calle63','av68'],['nqs','calle53','calle63','av68'],['calle100','autopista','cra15']];
 const point=value=>Array.isArray(value)&&value.length===2&&value.every(Number.isFinite)&&Math.abs(value[0])<=180&&Math.abs(value[1])<=85;
 const round=(n,d=6)=>Number(n.toFixed(d));
 function camera(value,scenarioIndex){
  if(!value||value.scenarioIndex!==scenarioIndex||!point(value.center)||!Number.isFinite(value.zoom)||value.zoom<8.5||value.zoom>19)return null;
  const result={scenarioIndex,center:value.center.map(n=>round(n)),zoom:round(value.zoom,4)};
  if(value.viewport){
   const {width,height}=value.viewport;
   if(!Number.isFinite(width)||!Number.isFinite(height)||width<80||width>4096||height<80||height>2160)return null;
   result.viewport={width:Math.round(width),height:Math.round(height)};
  }
  return result;
 }
 function popup(value,scenarioIndex){
  if(!value||value.scenarioIndex!==scenarioIndex||!caseRoads[scenarioIndex]?.includes(value.corridor)||!point(value.point))return null;
  return {scenarioIndex,corridor:value.corridor,point:value.point.map(n=>round(n)),hotspot:value.hotspot===true};
 }
 const api=Object.freeze({camera,popup,caseRoads});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.PREDICTTODO_VIEW_STATE=api;
})(typeof window!=='undefined'?window:null);
