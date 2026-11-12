/* Corridor exploration derives illustrative values from GAME_DATA, never live traffic. */
(function(){
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const roads={
  cali:['Av. Ciudad de Cali',['Avenida Carrera 86','Avenida Ciudad de Cali','Carrera 86']],
  abastos:['Av. Carrera 80',['Avenida Carrera 80','Carrera 80']],
  nqs:['NQS · Carrera 30',['Avenida Carrera 30','Carrera 30','NQS']],
  calle53:['Calle 53',['Avenida Calle 53','Calle 53']],
  calle63:['Calle 63',['Avenida Calle 63','Calle 63']],
  av68:['Av. 68',['Avenida Carrera 68','Carrera 68','Avenida 68']],
  calle100:['Calle 100',['Avenida Calle 100','Calle 100']],
  autopista:['Autopista Norte',['Avenida Carrera 45','Autopista Norte','Carrera 45']],
  cra15:['Carrera 15',['Avenida Carrera 15','Carrera 15']]
 };
 const byCase={cali_peak:['cali','abastos'],campin_arrival:['nqs','calle53','calle63','av68'],campin_exit:['nqs','calle53','calle63','av68'],calle100_quiet:['calle100','autopista','cra15']};
 const colors=['#28c98b','#f6cb42','#ff8b38','#ff304f'];
 const level=n=>n>=82?3:n>=65?2:n>=42?1:0;
 const ids=item=>byCase[item.id]||byCase.cali_peak;
 const selected=(item,id)=>ids(item).includes(id)?id:ids(item)[0];
 function values(data,game,id,hour=game.hour){
  const item=data.scenarios[game.scenarioIndex]||data.scenarios[0],index=Math.max(0,ids(item).indexOf(id));
  const base=window.PREDICTTODO_CONTROL.state(data,{...game,hour});
  const congestion=Math.max(10,base.congestion-index*6);
  return {congestion,speed:base.speed+index*3};
 }
 function profile(data,game,id){return Array.from({length:35},(_,i)=>values(data,game,id,6+i/2).congestion);}
 function chart(data,game,id,events=false){
  const points=profile(data,game,id).map((v,i)=>[i/34*1000,92-v*.75]);
  const line=points.map(([x,y],i)=>(i?'L':'M')+x.toFixed(1)+','+y.toFixed(1)).join(' '),x=(game.hour-6)/17*1000;
  // The flow path repeats the line; CSS moves its dashes along the day on the TV card.
  return `<svg class="cc-day-chart" viewBox="0 0 1000 108" preserveAspectRatio="none" aria-hidden="true"><path class="cc-chart-grid" d="M0 20H1000 M0 45H1000 M0 70H1000"/><path class="cc-chart-area" d="M0 108 L${line.slice(1)} L1000 108Z"/><path class="cc-chart-line" d="${line}"/><path class="cc-chart-flow" d="${line}"/><path class="cc-chart-cursor" d="M${x} 0V108"/></svg>${events?`<div class="cc-chart-events">${data.scenarios.map((s,i)=>`<button type="button" class="cc-case-dot${i===game.scenarioIndex?' is-current':''}" data-scenario="${i}" style="left:${(s.hour-6)/17*100}%" aria-label="${esc(s['title_'+(game.language||'en')])} · ${s.time}" title="${s.time}"><i aria-hidden="true">${window.PREDICTTODO_ICONS?.scenario(s.id)??''}</i></button>`).join('')}</div>`:''}`;
 }
 function selection(options){
  const {data,game}=options,lang=options.language==='es'?'es':'en',item=data.scenarios[game.scenarioIndex],id=selected(item,game.selectedCorridor);
  const now=values(data,game,id),future=values(data,game,id,Math.min(23,game.hour+.5));
  return {id,name:roads[id][0],now,future,level:level(now.congestion),color:colors[level(now.congestion)],lang};
 }
 function panel(options){
  const {data,game}=options,s=selection(options),es=s.lang==='es',item=data.scenarios[game.scenarioIndex];
  const ranked=ids(item).map(id=>({id,...values(data,game,id)})).sort((a,b)=>b.congestion-a.congestion);
  const title=es?'2. Compara la congestión de las vías':'2. Compare congestion across roads';
  const guide=es?'Más larga y más roja, más congestión. Toca una vía para verla en el mapa.':'Longer and redder means heavier traffic. Tap a road to see it on the map.';
  return `<section class="cc-corridor-panel" aria-label="${es?'Explorar vías':'Explore roads'}"><h3 class="cc-ranking-title">${title}</h3><p class="cc-ranking-guide">${guide}</p><div class="cc-road-ranking">${ranked.map(r=>`<button type="button" data-corridor="${r.id}" aria-pressed="${r.id===s.id}" style="--road-color:${colors[level(r.congestion)]}"><span>${esc(roads[r.id][0])}</span><b>${r.congestion}%</b><i><em style="width:${r.congestion}%"></em></i></button>`).join('')}</div><small class="cc-exploration-note">${es?'Valores ilustrativos del caso, no tráfico en vivo.':'Illustrative case values, not live traffic.'}</small></section>`;
 }
 function identify(feature,m){
  const p=feature?.properties||{},name=p.name||p['name:latin']||'';
  const named=ids(m.item).find(id=>p.corridor===id||[roads[id][0],...roads[id][1],...(m.features||[]).filter(f=>f.properties.corridor===id).map(f=>f.properties.osm_name)].includes(name));
  if(named)return named;
  // Transportation tiles carry geometry/classes, but their names live in a different source layer.
  // Match several points to the saved original OSM ways; an intersecting street must not match.
  if(!feature?.geometry||!['primary','secondary','tertiary','trunk','motorway'].includes(p.class))return;
  const points=feature.geometry.type==='LineString'?feature.geometry.coordinates:feature.geometry.type==='MultiLineString'?feature.geometry.coordinates.flat():[];
  if(points.length<2)return;
  const samples=[points[0],points[Math.floor(points.length/2)],points[points.length-1]];
  const distance=(point,a,b)=>{
   const x=(point[0]-a[0])*110900,y=(point[1]-a[1])*111320,dx=(b[0]-a[0])*110900,dy=(b[1]-a[1])*111320;
   const t=Math.max(0,Math.min(1,(x*dx+y*dy)/(dx*dx+dy*dy||1)));
   return Math.hypot(x-t*dx,y-t*dy);
  };
  let closest;
  for(const id of ids(m.item)){
   const segments=(m.active||[]).filter(f=>f.properties.corridor===id).flatMap(f=>f.geometry.coordinates.slice(1).map((b,i)=>[f.geometry.coordinates[i],b]));
   const distances=samples.map(point=>Math.min(...segments.map(([a,b])=>distance(point,a,b))));
   const average=distances.reduce((a,b)=>a+b,0)/3;
   if(Math.max(...distances)<45&&average<18&&(!closest||average<closest.average))closest={id,average};
  }
  return closest?.id;
 }
 window.PREDICTTODO_EXPLORATION=Object.freeze({roads,ids,selected,values,profile,chart,panel,selection,identify,colors,level});
})();
