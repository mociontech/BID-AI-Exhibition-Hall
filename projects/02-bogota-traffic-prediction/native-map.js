/* Native street rendering. Traffic changes road paint, never street geometry or a route overlay. */
(function(){
  const root='/projects/02-bogota-traffic-prediction/';
  const colors=['#28c98b','#f6cb42','#ff8b38','#ff304f'];
  const level=n=>n>=82?3:n>=65?2:n>=42?1:0;
  const nativeRoadIds=['highway_minor','highway_major_inner','highway_motorway_inner'];
  let enginePromise,stylePromise,basemapPromise,geographyPromise;
  const cityBounds=[[-74.22358,4.46861],[-74.01206,4.83066]];
  function basemapRequest(url,manifest,origin){
    // Keep the original vector geometry. Only its delivery changes to local files.
    if(!manifest)return {url};
    const tile=url.match(/^https:\/\/tiles\.openfreemap\.org\/planet\/[^/]+\/(\d+\/\d+\/\d+)\.pbf(?:\?.*)?$/);
    if(tile&&manifest.tiles.includes(tile[1]))return {url:origin+root+'assets/bogota-map/tiles/'+tile[1]+'.pbf'};
    const glyph=url.match(/^https:\/\/tiles\.openfreemap\.org\/fonts\/Noto(?:%20| )Sans(?:%20| )Regular\/([\d-]+)\.pbf$/);
    if(glyph&&manifest.glyphs.includes(glyph[1]))return {url:origin+root+'assets/bogota-map/fonts/Noto%20Sans%20Regular/'+glyph[1]+'.pbf'};
    return {url};
  }
  function loadBasemap(){
    return basemapPromise ||= fetch(root+'assets/bogota-map/manifest.json?v=20261108-city-02')
      .then(r=>{if(!r.ok)throw Error('Local basemap unavailable');return r.json();}).catch(()=>null);
  }
  function loadGeography(){
    return geographyPromise ||= fetch(root+'assets/bogota-map/geography.geojson?v=20261108-city-01')
      .then(r=>{if(!r.ok)throw Error('Bogotá geography unavailable');return r.json();}).catch(()=>null);
  }
  function geographicStyle(original,geography,network){
    const style=JSON.parse(JSON.stringify(original));
    if(!geography||!style.sources.openmaptiles)return style;
    style.sources['bogota-geography']={type:'geojson',data:geography,attribution:'<a href="https://www.ideca.gov.co/recursos/mapas/mapa-de-referencia-para-bogota-dc" target="_blank">SDP · Catastro Bogotá / IDECA</a>'};
    const urban=geography.features.filter(f=>f.properties.kind==='urban');
    const holes=urban.flatMap(f=>f.geometry.type==='MultiPolygon'?f.geometry.coordinates.map(p=>p[0]):[f.geometry.coordinates[0]]);
    style.sources['bogota-context-mask']={type:'geojson',data:{type:'Feature',properties:{},geometry:{type:'Polygon',coordinates:[[[ -76,3],[-72,3],[-72,7],[-76,7],[-76,3]],...holes]}}};
    // Dim the surrounding municipalities in the overview, following the official urban outline.
    // This changes presentation only; it does not crop or replace any real street geometry.
    style.layers.push({id:'bogota-context-mask',type:'fill',source:'bogota-context-mask',maxzoom:13,paint:{'fill-color':'#060d15','fill-opacity':['interpolate',['linear'],['zoom'],10,.75,12,0]}});
    style.layers.push(
      {id:'bogota-urban-boundary',type:'line',source:'bogota-geography',filter:['==',['get','kind'],'urban'],maxzoom:14,paint:{'line-color':'#79c4df','line-width':1.6,'line-opacity':['interpolate',['linear'],['zoom'],11,.8,14,0]}},
      {id:'bogota-locality-boundaries',type:'line',source:'bogota-geography',filter:['==',['get','kind'],'locality'],maxzoom:13,paint:{'line-color':'#61869c','line-width':1,'line-dasharray':[3,3],'line-opacity':.45}},
      {id:'bogota-locality-names',type:'symbol',source:'bogota-geography',filter:['all',['==',['get','kind'],'locality'],['!=',['get','LOCCODIGO'],'20']],minzoom:9,maxzoom:12.5,layout:{'text-field':['get','LOCNOMBRE'],'text-font':['Noto Sans Regular'],'text-size':11,'text-max-width':12,'text-padding':9},paint:{'text-color':'#bdd7e6','text-halo-color':'#111c27','text-halo-width':2}}
    );
    const places=[['cali_peak','Av. Ciudad de Cali'],['campin_arrival','El Campín'],['calle100_quiet','Calle 100']];
    style.sources['bogota-scenario-places']={type:'geojson',data:{type:'FeatureCollection',features:places.map(([id,name])=>({type:'Feature',properties:{name},geometry:{type:'Point',coordinates:[network.scenes[id].event[1],network.scenes[id].event[0]]}}))}};
    style.layers.push(
      {id:'bogota-scenario-pins',type:'circle',source:'bogota-scenario-places',maxzoom:13,paint:{'circle-radius':4,'circle-color':'#8bd5ef','circle-stroke-color':'#111c27','circle-stroke-width':2}},
      {id:'bogota-scenario-names',type:'symbol',source:'bogota-scenario-places',maxzoom:13,layout:{'text-field':['get','name'],'text-font':['Noto Sans Regular'],'text-size':13,'text-offset':[.7,0],'text-anchor':'left','text-padding':5,'text-allow-overlap':true},paint:{'text-color':'#fff','text-halo-color':'#111c27','text-halo-width':2}}
    );
    const area=feature=>{
      const polygons=feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:[feature.geometry.coordinates];
      return polygons.reduce((sum,rings)=>sum+Math.abs(rings[0].reduce((a,p,i,r)=>{const q=r[(i+1)%r.length];return a+p[0]*q[1]-q[0]*p[1];},0)),0);
    };
    const main=urban.reduce((a,b)=>area(a)>area(b)?a:b);
    const polygons=main.geometry.type==='MultiPolygon'?main.geometry.coordinates:[main.geometry.coordinates];
    const ring=polygons.reduce((a,b)=>area({geometry:{type:'Polygon',coordinates:a}})>area({geometry:{type:'Polygon',coordinates:b}})?a:b)[0];
    let twiceArea=0,cx=0,cy=0;
    ring.forEach((p,i)=>{const q=ring[(i+1)%ring.length],cross=p[0]*q[1]-q[0]*p[1];twiceArea+=cross;cx+=(p[0]+q[0])*cross;cy+=(p[1]+q[1])*cross;});
    // A single label anchor prevents one label per vector-tile fragment of the polygon.
    style.sources['bogota-city-name']={type:'geojson',data:{type:'Feature',properties:{name:'Bogotá D.C., Colombia'},geometry:{type:'Point',coordinates:[cx/(3*twiceArea),cy/(3*twiceArea)]}}};
    style.layers.push({id:'bogota-city-name',type:'symbol',source:'bogota-city-name',maxzoom:11.5,layout:{'text-field':['get','name'],'text-font':['Noto Sans Regular'],'text-size':18,'text-max-width':10,'text-transform':'uppercase','text-letter-spacing':.08,'text-offset':[-7,-1],'text-allow-overlap':true},paint:{'text-color':'#eff8ff','text-halo-color':'#08121f','text-halo-width':3}});
    return style;
  }
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
  function trafficPaint(m,base='#465568'){
    // The expression evaluates the ORIGINAL vector-tile road, in its original position/width.
    const point={type:'Point',coordinates:[m.scene.event[1],m.scene.event[0]]};
    const near=['<=',['distance',point],m.scene.area==='cali'?2300:1500];
    const explore=window.PREDICTTODO_EXPLORATION;
    // Only the main road classes take traffic color; minor streets keep the base tone so the map stays readable.
    const meshColor=offset=>['match',['get','class'],['motorway','trunk','primary'],colors[level(m.after.congestion-offset)],['secondary','tertiary'],colors[level(m.after.congestion-offset-4)],base];
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
  function fitCity(record,m){
    if(!record.map||!record.node.isConnected)return;
    if(record.options?.readonly&&m.game?.mapView){applyCamera(record,m);return;}
    if(!record.options?.readonly)record.popup?.remove();
    record.applyingView=true;record.map.resize();
    record.map.fitBounds(record.cityBounds||cityBounds,{padding:{top:65,bottom:30,left:35,right:55},maxZoom:11,duration:0});
    record.applyingView=false;emitCamera(record,m);
  }
  function emitCamera(record,m){
    if(record.options?.readonly||record.applyingView||!record.ready||!record.node.isConnected)return;
    const center=record.map.getCenter();
    const container=record.map.getContainer();
    record.node.dispatchEvent(new CustomEvent('ptd-map-view',{bubbles:true,detail:{scenarioIndex:m.game.scenarioIndex,center:[center.lng,center.lat],zoom:record.map.getZoom(),viewport:{width:container.clientWidth,height:container.clientHeight}}}));
  }
  function applyViewport(record,m){
    if(!record.options?.readonly)return;
    const box=record.node.querySelector('.cc-map-live');
    if(!box)return;
    // The TV renders at its own pixel size, so streets stay sharp. The tablet framing is
    // reproduced by the camera (same center, zoom offset by the size ratio), not by a CSS scale.
    for(const key of ['width','height','left','top','right','bottom','transform','transformOrigin'])box.style[key]='';
    const key=JSON.stringify([record.node.clientWidth,record.node.clientHeight]);
    if(record.viewportKey===key)return;record.viewportKey=key;
    record.applyingView=true;record.map.resize();record.applyingView=false;
  }
  function mirrorZoom(record,view){
    const size=view.viewport;if(!size||!record.options?.readonly)return view.zoom;
    // Contain the whole tablet extent: the limiting axis matches, the other shows a little more city.
    const scale=Math.min(record.node.clientWidth/size.width,record.node.clientHeight/size.height);
    return scale>0&&Number.isFinite(scale)?view.zoom+Math.log2(scale):view.zoom;
  }
  function applyCamera(record,m){
    const view=window.PREDICTTODO_VIEW_STATE?.camera(m.game?.mapView,m.game?.scenarioIndex);
    if(!view||!record.map||!record.options?.readonly&&record.map.isMoving())return;
    const zoom=mirrorZoom(record,view),center=record.map.getCenter();
    if(Math.abs(center.lng-view.center[0])<.0000005&&Math.abs(center.lat-view.center[1])<.0000005&&Math.abs(record.map.getZoom()-zoom)<.0001)return;
    record.applyingView=true;
    record.map.jumpTo({center:view.center,zoom});
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
    // Re-selecting the current case also clears mapView in the controller.
    // Republish its framing even though the underlying scene has not changed.
    if(record.scene!==m.item.id||!record.options?.readonly&&!m.game.mapView){
      if(record.scene===null&&m.game.phase==='explore'&&!m.game.mapView)fitCity(record,m);
      else fit(record,m);
      record.scene=m.item.id;
    }else if(record.phase!==m.game.phase&&m.game.phase==='decision'&&map.getZoom()<12)fit(record,m);
    record.phase=m.game.phase;
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
    // Every figure carries its label: the audience should never have to guess what a percentage means.
    const box=document.createElement('div');box.className='cc-road-popup';
    const tag=document.createElement('small');tag.textContent=hotspot?(es?'PUNTO CRÍTICO':'HOTSPOT'):(es?'VÍA SELECCIONADA':'SELECTED ROAD');
    const title=document.createElement('strong');title.textContent=e.roads[id][0];
    const rows=document.createElement('dl');
    for(const [label,value] of [[es?'Congestión':'Congestion',now.congestion+' %'],[es?'Velocidad':'Speed',now.speed+' km/h'],[es?'En 30 min':'In 30 min',future.congestion+' %']]){
      const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);rows.append(row);
    }
    box.append(tag,title,rows);return box;
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
    const [basemap,geography]=await Promise.all([loadBasemap(),loadGeography()]);
    let style;
    try{style=await(stylePromise ||= fetch(root+'map-style.json?v=20261110-labels-01').then(r=>{if(!r.ok)throw Error('Map style unavailable');return r.json();}));}
    catch{style=offlineStyle(network);}
    if(!record.node.isConnected)return;
    style=geographicStyle(style,geography,network);
    record.cityBounds=geography?.urbanBounds||cityBounds;
    if(basemap&&style.sources.openmaptiles){
      // A local snapshot covers the city, not just the four small street cutouts.
      // Outside that coverage, preserve the provider's original online tiles.
      style=JSON.parse(JSON.stringify(style));
      style.sources.openmaptiles={type:'vector',tiles:[basemap.tileTemplate],minzoom:0,maxzoom:basemap.maxzoom,attribution:basemap.attribution};
      style.sprite=location.origin+root+'assets/bogota-map/sprite';
      record.localBasemap=true;
    }
    const map=record.map=new engine.Map({container:record.node.querySelector('.cc-map-live'),style,center:[-74.11782,4.649635],zoom:10,
      // The TV may need a little extra zoom range to contain a tablet view rendered at a different size.
      interactive:!record.options.readonly,attributionControl:false,renderWorldCopies:false,maxZoom:record.options.readonly?21:19,minZoom:record.options.readonly?7.5:8.5,
      maxBounds:[[-75.23,3.46],[-73.01,5.84]],
      pitchWithRotate:false,dragRotate:false,touchPitch:false,fadeDuration:0,transformRequest:url=>basemapRequest(url,basemap,location.origin)});
    map.addControl(new engine.AttributionControl({compact:true}));
    map.addControl(new engine.ScaleControl({maxWidth:85,unit:'metric'}),'bottom-left');
    // Night tint lives between the canvas and the markers/popups, so avisos stay bright after dusk.
    const sky=document.createElement('div');sky.className='cc-map-sky';sky.setAttribute('aria-hidden','true');map.getCanvasContainer().after(sky);
    record.markers=[];record.roadIds=[];
    const getModel=()=>window.PREDICTTODO_CONTROL.model(record.options,network);
    const ready=()=>{
      record.colorKey=null;
      record.roadIds=[...nativeRoadIds,'local-streets'].filter(id=>map.getLayer(id));record.ready=true;
      record.scene=null;paint(record,getModel());
      if(record.pendingCorridor){const id=record.pendingCorridor;delete record.pendingCorridor;focusCorridor(record,id);}
      record.node.parentElement.querySelectorAll('.cc-map-tools button,.cc-map-city-button').forEach(button=>button.disabled=Boolean(record.options.readonly));
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
  window.PREDICTTODO_STREET_MAP=Object.freeze({start,paint,fit,fitCity,focusCorridor,syncPresentation,trafficPaint,bounds,nativeRoadIds,basemapRequest,cityBounds,geographicStyle,mirrorZoom});
})();
