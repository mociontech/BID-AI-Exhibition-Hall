/* Native street rendering. Traffic changes road paint, never street geometry or a route overlay. */
(function(){
  const root='/projects/02-bogota-traffic-prediction/';
  const colors=['#28c98b','#f6cb42','#ff8b38','#ff304f'];
  const level=n=>n>=82?3:n>=65?2:n>=42?1:0;
  const nativeRoadIds=['highway_minor','highway_major_inner','highway_motorway_inner'];
  let enginePromise,stylePromise;
  const polygonCache={};
  function corridorArea(m,id){
    const key=m.item.id+':'+id;if(polygonCache[key])return polygonCache[key];
    const dx=30/110900,dy=30/111320;
    const points=m.active.filter(f=>f.properties.corridor===id).flatMap(f=>f.geometry.coordinates.flatMap(([x,y])=>[[x-dx,y-dy],[x-dx,y+dy],[x+dx,y-dy],[x+dx,y+dy]])).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    const half=list=>{const h=[];for(const p of list){while(h.length>1&&cross(h[h.length-2],h[h.length-1],p)<=0)h.pop();h.push(p);}return h.slice(0,-1);};
    const hull=[...half(points),...half([...points].reverse())];hull.push(hull[0]);
    return polygonCache[key]={type:'Polygon',coordinates:[hull]};
  }
  function load(){
    if(window.maplibregl)return Promise.resolve(window.maplibregl);
    return enginePromise ||= new Promise(resolve=>{
      const css=document.createElement('link');css.rel='stylesheet';css.href=root+'vendor/maplibre-gl.css';
      const script=document.createElement('script');script.src=root+'vendor/maplibre-gl.js';
      script.onload=()=>resolve(window.maplibregl||null);script.onerror=()=>resolve(null);
      document.head.append(css,script);
    });
  }
  function trafficPaint(m,base='#394658'){
    // The expression evaluates the ORIGINAL vector-tile road, in its original position/width.
    const point={type:'Point',coordinates:[m.scene.event[1],m.scene.event[0]]};
    const near=['<=',['distance',point],m.scene.area==='cali'?2300:1500];
    const explore=window.PREDICTTODO_EXPLORATION;
    const meshColor=offset=>['match',['get','class'],['motorway','trunk','primary'],colors[level(m.after.congestion-offset)],['secondary','tertiary'],colors[level(m.after.congestion-offset-4)],colors[level(m.after.congestion-offset-10)]];
    const mesh=['case',['<=',['distance',point],700],meshColor(0),['<=',['distance',point],1500],meshColor(6),meshColor(14)];
    const color=explore?['case',...explore.ids(m.item).flatMap(id=>{
      const aliases=[explore.roads[id][0],...explore.roads[id][1],...m.active.filter(f=>f.properties.corridor===id).flatMap(f=>[f.properties.name,f.properties.osm_name])].filter(Boolean);
      const match=['any',['==',['get','corridor'],id],['in',['coalesce',['get','name'],['get','name:latin'],''],['literal',[...new Set(aliases)]]],['all',['in',['get','class'],['literal',['primary','secondary','tertiary','trunk','motorway']]],['within',corridorArea(m,id)]]];
      return [match,colors[level(explore.values(m.data,m.game,id).congestion)]];
    }),['case',near,mesh,base]]:['case',near,mesh,base];
    // Main corridors can lie outside the event radius (for example Av. 68 near El Campín).
    return color;
  }
  function bounds(m){
    const points=m.active.flatMap(f=>f.geometry.coordinates);
    points.push([m.scene.event[1],m.scene.event[0]]);
    return [[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1]))],[Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))]];
  }
  function fit(record,m){
    if(!record.map||!record.node.isConnected)return;
    if(record.options?.readonly&&m.game?.mapView){applyCamera(record,m);return;}
    record.applyingView=true;
    record.map.resize();
    record.map.fitBounds(bounds(m),{padding:{top:70,bottom:65,left:30,right:55},maxZoom:15,duration:0});
    // Small landscape panels otherwise fit the long corridor at city scale, hiding its detail.
    if(record.map.getZoom()<13.3)record.map.jumpTo({center:[m.scene.event[1],m.scene.event[0]],zoom:13.3});
    record.applyingView=false;
    emitCamera(record,m);
  }
  function emitCamera(record,m){
    if(record.options?.readonly||record.applyingView||!record.ready||!record.node.isConnected)return;
    const center=record.map.getCenter();
    const container=record.map.getContainer();
    record.node.dispatchEvent(new CustomEvent('ptd-map-view',{bubbles:true,detail:{scenarioIndex:m.game.scenarioIndex,center:[center.lng,center.lat],zoom:record.map.getZoom(),viewport:{width:container.clientWidth,height:container.clientHeight}}}));
  }
  function applyViewport(record,m){
    if(!record.options?.readonly)return;
    const view=window.PREDICTTODO_VIEW_STATE?.camera(m.game?.mapView,m.game?.scenarioIndex),box=record.node.querySelector('.cc-map-live');
    if(!box)return;
    const size=view?.viewport;
    const key=JSON.stringify([size,record.node.clientWidth,record.node.clientHeight]);
    if(record.viewportKey===key)return;record.viewportKey=key;
    if(size){
      const scale=Math.min(record.node.clientWidth/size.width,record.node.clientHeight/size.height);
      Object.assign(box.style,{width:size.width+'px',height:size.height+'px',left:'50%',top:'50%',right:'auto',bottom:'auto',transform:`translate(-50%,-50%) scale(${scale})`,transformOrigin:'center'});
    }else for(const key of ['width','height','left','top','right','bottom','transform','transformOrigin'])box.style[key]='';
    record.applyingView=true;record.map.resize();record.applyingView=false;
  }
  function applyCamera(record,m){
    const view=window.PREDICTTODO_VIEW_STATE?.camera(m.game?.mapView,m.game?.scenarioIndex);
    if(!view||!record.map||!record.options?.readonly&&record.map.isMoving())return;
    const center=record.map.getCenter();
    if(Math.abs(center.lng-view.center[0])<.0000005&&Math.abs(center.lat-view.center[1])<.0000005&&Math.abs(record.map.getZoom()-view.zoom)<.0001)return;
    record.applyingView=true;
    record.map.jumpTo({center:view.center,zoom:view.zoom});
    record.applyingView=false;
  }
  function focusCorridor(record,id){
    if(!record.ready||!record.network||record.options.readonly)return false;
    const m=window.PREDICTTODO_CONTROL.model(record.options,record.network);
    const roads=m.active.filter(f=>f.properties.corridor===id);
    if(!roads.length)return false;
    const points=roads.flatMap(f=>f.geometry.coordinates);
    const box=[[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1]))],[Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))]];
    record.applyingView=true;
    record.map.fitBounds(box,{padding:{top:85,bottom:45,left:45,right:50},maxZoom:15.5,duration:0});
    record.applyingView=false;
    emitCamera(record,m);
    const point=window.PREDICTTODO_CONTROL.hotspotPositions(roads,1)[0];
    showPopup(record,m,point,id,false);
    return true;
  }
  function offlineStyle(network){
    // Locally saved original OSM ways are the basemap if the tile service is unavailable.
    const features=network.features.map(f=>({...f,properties:{...f.properties,class:f.properties.highway}}));
    return {version:8,sources:{streets:{type:'geojson',data:{type:'FeatureCollection',features},attribution:'© OpenStreetMap contributors'}},layers:[
      {id:'background',type:'background',paint:{'background-color':'#202b3b'}},
      {id:'local-streets',type:'line',source:'streets',layout:{'line-join':'round','line-cap':'round'},paint:{'line-color':'#394658','line-width':['interpolate',['linear'],['zoom'],12,.45,15,1.05,19,3]}}
    ]};
  }
  function paint(record,m){
    if(!record.ready)return;
    const map=record.map;
    const colorKey=m.item.id+':'+m.after.congestion+':'+record.roadIds.join(',');
    if(record.colorKey!==colorKey){
      for(const id of record.roadIds)map.setPaintProperty(id,'line-color',trafficPaint(m));
      record.colorKey=colorKey;
    }
    record.markers.forEach(marker=>marker.remove());record.markers=[];
    const control=window.PREDICTTODO_CONTROL;
    control.hotspotPositions(m.active,m.after.critical,[m.scene.event[1],m.scene.event[0]]).forEach(point=>{
      const el=document.createElement(record.options.readonly?'div':'button');if(!record.options.readonly)el.type='button';el.className='cc-hotspot';
      el.innerHTML='<span aria-hidden="true"></span>';el.setAttribute('aria-label',m.language==='es'?'Ver atasco simulado':'Inspect simulated backup');
      el.onclick=event=>{
        if(record.options.readonly)return;
        event.stopPropagation();
        const nearest=m.active.reduce((best,f)=>{
          const distance=Math.min(...f.geometry.coordinates.map(p=>(p[0]-point[0])**2+(p[1]-point[1])**2));
          return !best||distance<best.distance?{id:f.properties.corridor,distance}:best;
        },null);
        showPopup(record,m,point,nearest.id,true);
        record.node.dispatchEvent(new CustomEvent('ptd-corridor',{bubbles:true,detail:nearest.id}));
      };
      record.markers.push(new window.maplibregl.Marker({element:el}).setLngLat(point).addTo(map));
    });
    record.node.dataset.criticalCount=String(m.after.critical);
    applyViewport(record,m);
    if(record.scene!==m.item.id){fit(record,m);record.scene=m.item.id;}
    syncPresentation(record,m);
  }
  function syncPresentation(record,m){
    if(!record.ready)return;
    applyViewport(record,m);
    const popup=window.PREDICTTODO_VIEW_STATE?.popup(m.game?.mapPopup,m.game?.scenarioIndex);
    if(popup){
      const key=JSON.stringify(popup);
      if(record.popup&&record.popupKey===key)record.popup.setDOMContent(popupContent(m,popup.corridor,popup.hotspot));
      else showPopup(record,m,popup.point,popup.corridor,popup.hotspot,false);
    }else if(record.popup){record.removingPopup=true;record.popup.remove();record.popup=null;record.removingPopup=false;}
    applyCamera(record,m);
    record.map.triggerRepaint?.();
  }
  function popupContent(m,id,hotspot){
    const e=window.PREDICTTODO_EXPLORATION,es=m.language==='es',now=e.values(m.data,m.game,id),future=e.values(m.data,m.game,id,Math.min(23,m.game.hour+.5));
    const box=document.createElement('div');box.className='cc-road-popup';
    const tag=document.createElement('small');tag.textContent=hotspot?(es?'ATASCO SIMULADO':'SIMULATED BACKUP'):(es?'VÍA SELECCIONADA':'SELECTED ROAD');
    const title=document.createElement('strong');title.textContent=e.roads[id][0];
    const detail=document.createElement('p');detail.textContent=`${now.congestion}% · ${now.speed} km/h`;
    const forecast=document.createElement('span');forecast.textContent=(es?'En 30 min: ':'In 30 min: ')+future.congestion+'%';
    const note=document.createElement('small');note.textContent=es?'Ejemplo educativo · no es tráfico en vivo':'Educational example · not live traffic';
    box.append(tag,title,detail,forecast,note);return box;
  }
  function showPopup(record,m,point,id,hotspot=false,sync=true){
    record.removingPopup=true;record.popup?.remove();record.removingPopup=false;
    const coordinates=Array.isArray(point)?point:[point.lng,point.lat];
    const state={scenarioIndex:m.game.scenarioIndex,corridor:id,point:coordinates,hotspot};
    const clean=window.PREDICTTODO_VIEW_STATE.popup(state,m.game.scenarioIndex);
    record.popupKey=JSON.stringify(clean);
    record.popupRoad=id;record.popupCase=m.item.id;record.popupHotspot=hotspot;
    const popup=record.popup=new window.maplibregl.Popup({closeButton:!record.options.readonly,closeOnClick:false,closeOnMove:false,offset:15,maxWidth:'290px',focusAfterOpen:false})
      .setLngLat(coordinates).setDOMContent(popupContent(m,id,hotspot)).addTo(record.map);
    popup.on('close',()=>{
      if(record.popup!==popup)return;record.popup=null;
      if(!record.options.readonly&&!record.removingPopup&&record.node.isConnected)record.node.dispatchEvent(new CustomEvent('ptd-map-popup',{bubbles:true,detail:null}));
    });
    if(sync&&!record.options.readonly)record.node.dispatchEvent(new CustomEvent('ptd-map-popup',{bubbles:true,detail:clean}));
  }
  async function start(record,network){
    const engine=await load();if(!record.node.isConnected||!engine)return;
    let style;
    try{style=await(stylePromise ||= fetch(root+'map-style.json?v=20261106-01').then(r=>{if(!r.ok)throw Error('Map style unavailable');return r.json();}));}
    catch{style=offlineStyle(network);}
    if(!record.node.isConnected)return;
    const map=record.map=new engine.Map({container:record.node.querySelector('.cc-map-live'),style,center:[-74.09,4.65],zoom:13,
      interactive:!record.options.readonly,attributionControl:false,renderWorldCopies:false,maxZoom:19,minZoom:10,
      pitchWithRotate:false,dragRotate:false,touchPitch:false,fadeDuration:0});
    map.addControl(new engine.AttributionControl({compact:true}));
    record.markers=[];record.roadIds=[];
    const getModel=()=>window.PREDICTTODO_CONTROL.model(record.options,network);
    const ready=()=>{
      record.colorKey=null;
      record.roadIds=[...nativeRoadIds,'local-streets'].filter(id=>map.getLayer(id));record.ready=true;
      record.scene=null;paint(record,getModel());
      if(record.pendingCorridor){const id=record.pendingCorridor;delete record.pendingCorridor;focusCorridor(record,id);}
      record.node.parentElement.querySelectorAll('.cc-map-tools button').forEach(button=>button.disabled=Boolean(record.options.readonly));
    };
    map.on('style.load',ready);
    let fallbackTimer;
    const showMap=()=>{
      if(!record.node.isConnected||!record.ready||!map.isStyleLoaded())return;
      const source=map.getSource('openmaptiles')?'openmaptiles':'streets';
      if(!map.isSourceLoaded(source)||!map.queryRenderedFeatures({layers:record.roadIds}).length)return;
      record.live=true;record.node.classList.add('is-live');clearTimeout(fallbackTimer);
    };
    map.on('idle',showMap);
    // Tiles may be blocked by the venue's network: keep the real local street grid zoomable.
    fallbackTimer=setTimeout(()=>{
      if(record.node.isConnected&&!record.live){
        record.ready=false;record.roadIds=[];record.local=true;
        map.setStyle(offlineStyle(network),{diff:false});
      }
    },12000);
    let cameraTimer;
    record.cleanup=()=>{clearTimeout(fallbackTimer);clearTimeout(cameraTimer);};
    record.errors=[];
    map.on('error',event=>{record.errors.push(String(event.error?.message||event.error));});
    if(!record.options.readonly){
      map.on('move',()=>{
        if(record.applyingView||cameraTimer)return;
        cameraTimer=setTimeout(()=>{cameraTimer=null;emitCamera(record,getModel());},80);
      });
      map.on('moveend',()=>{clearTimeout(cameraTimer);cameraTimer=null;emitCamera(record,getModel());});
      map.on('click',event=>{
        const m=getModel(),explore=window.PREDICTTODO_EXPLORATION;
        const hits=map.queryRenderedFeatures([[event.point.x-7,event.point.y-7],[event.point.x+7,event.point.y+7]],{layers:record.roadIds});
        const hit=hits.find(f=>explore.identify(f,m)),id=explore.identify(hit,m);if(!id)return;
        showPopup(record,m,event.lngLat,id);
        record.node.dispatchEvent(new CustomEvent('ptd-corridor',{bubbles:true,detail:id}));
      });
      map.on('mousemove',event=>{
        if(!record.ready)return;
        const m=getModel(),hits=map.queryRenderedFeatures(event.point,{layers:record.roadIds});
        map.getCanvas().style.cursor=hits.some(f=>window.PREDICTTODO_EXPLORATION.identify(f,m))?'pointer':'';
      });
      map.touchZoomRotate.disableRotation();
    }
    if(typeof ResizeObserver!=='undefined'){
      record.observer=new ResizeObserver(()=>{
        const m=getModel();
        if(record.options.readonly){syncPresentation(record,m);return;}
        record.applyingView=true;map.resize();record.applyingView=false;
        if(m.game.mapView){applyCamera(record,m);emitCamera(record,m);}else fit(record,m);
      });record.observer.observe(record.node);
    }
    const resume=()=>{if(record.node.isConnected&&!document.hidden){syncPresentation(record,getModel());map.triggerRepaint();}};
    document.addEventListener('visibilitychange',resume);window.addEventListener('focus',resume);
    const cleanup=record.cleanup;record.cleanup=()=>{cleanup();document.removeEventListener('visibilitychange',resume);window.removeEventListener('focus',resume);};
  }
  window.PREDICTTODO_STREET_MAP=Object.freeze({start,paint,fit,focusCorridor,syncPresentation,trafficPaint,bounds,nativeRoadIds});
})();
