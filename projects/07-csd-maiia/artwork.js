/* Approved PNG screens are kept byte-for-byte. Live maps, scores and transparent
   touch targets are positioned in their original 1920 x 1080 coordinate space. */
(function(){
 const base=new URL('./',document.currentScript.src);
 const files={
  landing:'TABLET/ES/00 Portada.png',tvLanding:'TABLET/ES/00 Portada-1.png',
  info:'Frame 11.png',intro:'Frame 3.png',tvIntro:'Frame 27.png',
  easy:'Frame 4.png',easyResult:'Frame 22.png',manual:'Frame 23.png',
  manualResult:'Frame 24.png',analysis:'Frame 25.png',assisted:'Frame 26.png',
  tvEasy:'Frame 28.png',tvEasyResult:'Frame 29.png',tvManual:'Frame 30.png',
  tvManualResult:'Frame 31.png',tvAnalysis:'Frame 32.png',tvAssisted:'Frame 33.png',
  final:'TABLET/ES/00 Portada-2.png'
 };
 const asset=name=>new URL('assets/branding/'+(files[name]||name),base).href;
 const warmed=new Set();
 function warm(url){if(warmed.has(url))return;warmed.add(url);const image=new Image();image.src=url;}
 const next={landing:['info','intro'],tvLanding:['info','tvIntro'],intro:['easy'],tvIntro:['tvEasy'],easy:['easyResult'],tvEasy:['tvEasyResult'],easyResult:['manual'],tvEasyResult:['tvManual'],manual:['manualResult'],tvManual:['tvManualResult'],manualResult:['intro','analysis'],tvManualResult:['tvIntro','tvAnalysis'],analysis:['assisted'],tvAnalysis:['tvAssisted'],assisted:['easyResult'],tvAssisted:['final']};
 const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 const box=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
 const patch=(rect,html,cls='',style='')=>`<div class="mai-art-patch ${cls}" style="${box(rect)}${style}">${html}</div>`;
 const title=(rect,black,blue,size=72)=>patch(rect,`<h1>${esc(black)} <em>${esc(blue)}</em></h1>`,'mai-art-title mai-controller-heading',`font-size:${size}px;`);
 const hit=(rect,action,label,{disabled=false,cls=''}={})=>`<button type="button" class="mai-art-hit ${cls}" style="${box(rect)}" data-action="${action}" aria-label="${esc(label)}" ${disabled?'disabled':''}></button>`;
 function fragment(name,source,rect){
  return `<svg class="mai-art-fragment" style="${box(rect)}" viewBox="${source.join(' ')}" preserveAspectRatio="none" aria-hidden="true"><image href="${asset(name)}" width="1920" height="1080"/></svg>`;
 }
 function buttonLabel(rect,label){const [x,y,w,h]=rect;return patch([x+14,y+9,w-60,h-18],esc(label),'mai-art-button-label');}
 const mapRect=[427,315,1065,600],tvMap=[788,350,1065,600];
 function liveMap(s,rect,options={},cls=''){
  return `<div class="mai-art-map mai-controller-canvas ${cls}" style="${box(rect)}">${MAIIA.map(s,options)}</div>`;
 }
 function navigation(s){
  const back=[1492,28,250,70],full=[1790,34,58,58];
  return `<nav class="mai-art-navigation" aria-label="Exhibition navigation"><a class="mai-art-hit" style="${box([56,20,710,84])}" href="/index.html${esc(AI_SYNC.stationQuery)}&amp;projects=1" data-action="home" aria-label="Home: back to all projects"></a>${fragment('intro',[1316,915,250,70],back)}${hit(back,'menu','Back to MAIIA menu')}${fragment('final',[1789,37,52,52],full)}${patch([1800,43,38,39],MAIIA.icon('expand'),'mai-art-fullscreen-symbol')}${hit([1778,23,82,82],'fullscreen','Full screen')}</nav>`;
 }
 function legend(s){
  const t=MAIIA.words.en;
  return MAIIA.legend(t,[['mai-reference-key',t.correctAreas],['mai-answer-key',t.assistedAnswers],['mai-incorrect-key',t.incorrectSelection],['mai-marker-key',t.manualAnswers]]);
 }
 function tablet(s){
  const g=s.game,p=g.phase,t=MAIIA.words.en;
  let screen=p,html='',cls='';
  if(s.mode!=='game'){
   screen='landing';cls='mai-landing';
   html+=patch([64,257,710,48],'07 MAIIA','mai-art-project-label');
   html+=hit([66,560,512,85],'information','Information');
   html+=hit([66,677,512,85],'game','Start MAIIA simulation');
   if(s.mode==='info')html+='<span class="mai-art-information-selected" aria-hidden="true"></span>';
  }else if(p==='intro'){
   cls='mai-intro';
   html+=hit([1316,915,250,70],'menu','Back to MAIIA menu');
   html+=hit([1603,915,250,70],'start','Start identifying informal settlements');
  }else if(p==='activation'){
   screen='intro';cls='mai-activation';
   html+=patch([60,249,675,620],`<div class="mai-art-activation-icon">${MAIIA.icon('chip')}</div><h1>Activate <em>MAIIA</em></h1><p>${esc(t.activationText)}</p>`,'mai-art-activation-copy');
   html+=liveMap(s,[788,257,1065,600],{readonly:true});
   html+=hit([1316,915,250,70],'menu','Back to MAIIA menu');
   html+=buttonLabel([1603,915,250,70],'Activate MAIIA')+hit([1603,915,250,70],'activate','Activate MAIIA and scan the territory');
  }else{
   const easy=p==='easy'||p==='easyResult',review=p==='easyResult'||p==='manualResult',analysis=p==='analysis',final=p==='final';
   if(final){screen='easyResult';cls='mai-final-map';}
   else cls='mai-controller';
   html+=liveMap(s,mapRect,{kind:easy?'easy':'hard',reference:final||p==='easyResult',candidates:analysis||p==='assisted',answers:final,readonly:review||analysis||final,scan:analysis});
   if(p==='easy'){
    html+=title([420,174,1390,82],'Outline','informal settlements');
    html+=hit([427,948,250,70],'undo','Undo last area',{disabled:!g.polygons.length&&!g.draft.length});
    html+=hit([710,948,250,70],'clear','Clear all drawn areas',{disabled:!g.polygons.length&&!g.draft.length});
    html+=hit([1242,948,250,70],'review','Review drawn areas');
   }else if(p==='easyResult'){
    html+=patch([421,251,1100,45],`${g.easyScore}% overlap with the reference areas`,'mai-art-subtitle');
    html+=buttonLabel([1242,949,250,68],'Continue')+hit([1242,949,250,68],'next','Continue to level 2');
   }else if(p==='manual'){
    html+=title([420,174,1390,82],'Mark','informal settlements');
    html+=patch([701,951,440,68],`${g.markers.length} / ${MAIIA.config.scoring.markerLimit} Markers`,'mai-art-count');
    html+=hit([427,948,250,70],'clear','Clear all markers',{disabled:!g.markers.length});
    html+=hit([1242,948,250,70],'review','Review marked settlements');
   }else if(p==='manualResult'){
    html+=patch([421,251,1100,45],`${g.manual.hits} / ${MAIIA.config.scoring.markerLimit} areas identified · ${g.manual.score}%`,'mai-art-subtitle');
    html+=buttonLabel([1097,949,395,68],'Continue')+hit([1097,949,395,68],'next','Continue to Activate MAIIA');
   }else if(analysis){
    html+=title([420,174,1430,82],'MAIIA is','scanning…');
    html+='<div class="mai-art-progress mai-analysis-progress" style="'+box([427,933,1065,12])+'" aria-hidden="true"><i></i></div>';
   }else if(p==='assisted'){
    html+=patch([701,951,440,68],`${g.selected.length} Selected`,'mai-art-count');
    html+=hit([427,948,250,70],'clear','Clear selected suggestions',{disabled:!g.selected.length});
    html+=hit([1242,948,250,70],'review','Review MAIIA-assisted selections');
   }else if(final){
    html+=patch([421,251,1100,45],esc(t.reviewMapHint),'mai-art-subtitle');
    html+=patch([421,949,810,79],legend(s),'mai-art-final-legend');
    html+=buttonLabel([1242,949,250,68],'Play again')+hit([1242,949,250,68],'replay','Play again');
   }
  }
  return {screen,html,cls};
 }
 function television(s){
  const g=s.game,p=g.phase,t=MAIIA.words.en;
  let screen='tvLanding',html='',cls='';
  if(s.mode==='info')return {screen:'info',html,cls:'mai-infographic'};
  if(s.mode!=='game')return {screen,html:patch([64,257,710,48],'07 MAIIA','mai-art-project-label'),cls:'mai-landing'};
  if(p==='intro')return {screen:'tvIntro',html,cls:'mai-intro'};
  if(p==='activation'){
   screen='tvIntro';cls='mai-activation';
   html+=title([60,217,1790,115],'Activate','MAIIA',92);
   html+=patch([60,345,675,610],`<div class="mai-art-activation-icon">${MAIIA.icon('chip')}</div><p>${esc(t.activationText)}</p><p class="mai-art-activation-cue">${esc(t.activationCue)}</p>`,'mai-art-activation-copy');
   html+=liveMap(s,[785,349,1065,600],{readonly:true});
   return {screen,html,cls};
  }
  if(p==='final'){
   const a=g.manual,b=g.assisted;
   screen='final';cls='mai-final';
   for(const [i,r]of[a,b].entries())html+=patch([i?1066:359,500,500,216],`<strong>${r.score}%</strong><p><b>${r.hits} / ${MAIIA.config.scoring.markerLimit}</b> areas identified<br>${r.errors} Errors</p>`,'mai-scorecard '+(i?'mai-scorecard-assisted':''));
   const message=b.score>a.score?t.improved:b.score===a.score?t.same:t.lower;
   html+=patch([330,757,1280,100],`<h2>${esc(message)}</h2><p>${esc(t.closing)}</p>`,'mai-final-message');
   return {screen,html,cls};
  }
  const easy=p==='easy'||p==='easyResult',analysis=p==='analysis';
  const screens={easy:'tvEasy',easyResult:'tvEasyResult',manual:'tvManual',manualResult:'tvManualResult',analysis:'tvAnalysis',assisted:'tvAssisted'};
  screen=screens[p];cls='mai-game-area';
  const rect=p==='easyResult'||p==='manualResult'?[788,265,1065,600]:tvMap;
  html+=liveMap(s,rect,{kind:easy?'easy':'hard',reference:p==='easyResult',candidates:analysis||p==='assisted',readonly:true,scan:analysis});
  if(p==='easy'){
   html+=title([60,222,1800,110],'Level 1 -','Find informal settlements',86);
   html+=patch([66,598,650,48],`${g.polygons.length} Closed areas`,'mai-art-tv-count');
  }else if(p==='easyResult')html+=patch([60,451,690,222],`${g.easyScore}%`,'mai-big-score');
  else if(p==='manual'){
   html+=title([60,222,1800,110],'Level 2 -','Locate informal settlements',86);
   html+=patch([66,617,650,48],`${g.markers.length} / ${MAIIA.config.scoring.markerLimit} Markers`,'mai-art-tv-count');
  }else if(p==='manualResult'){
   html+=patch([60,451,690,222],`${g.manual.hits} / ${MAIIA.config.scoring.markerLimit}`,'mai-big-score');
   html+=patch([66,725,655,130],`${g.manual.score}% · ${esc(t.metric)}`,'mai-art-manual-metric');
   // The supplied example legend shows reference zones; these stay hidden before AI.
   html+=patch([1093,882,440,63],'','mai-art-hidden-reference-legend');
  }else if(analysis){
   html+=title([60,222,1800,110],'MAIIA is active -','scanning the territory',83);
   html+='<div class="mai-art-patch" style="'+box([66,632,660,24])+'"><div class="mai-art-progress mai-analysis-progress" aria-hidden="true"><i></i></div></div>';
  }else if(p==='assisted')html+=patch([66,623,650,48],`${g.selected.length} Selected`,'mai-art-tv-count');
  return {screen,html,cls};
 }
 function scale(){
  document.querySelectorAll('.mai-branded').forEach(main=>main.style.setProperty('--mai-art-scale',Math.min(main.clientWidth/1920,main.clientHeight/1080)));
 }
 window.addEventListener('resize',scale);
 function renderInto(mount,state,{readonly=false}={}){
  const s={...state,language:'en',game:state.game||MAIIA_STATE.fresh()};
  const art=readonly?television(s):tablet(s),phase=s.mode==='game'?s.game.phase:s.mode==='info'&&readonly?'information':'landing';
  const titles={intro:'Become an urban detective',easy:'Level 1: find informal settlements',easyResult:'Your level 1 result',manual:'Level 2: locate informal settlements',manualResult:'Your observations without MAIIA',activation:'Activate MAIIA',analysis:'MAIIA is active and scanning the territory',assisted:'Select MAIIA suggestions',final:'Your results'};
  const label=s.mode==='game'?titles[s.game.phase]:s.mode==='info'&&readonly?'MAIIA information':'MAIIA main menu';
  document.documentElement.lang='en';
  mount.innerHTML=`<main class="mai-app mai-branded ${readonly?'mai-tv':'mai-tablet'} mai-phase-${phase}" data-language="en" aria-label="${label}"><div class="mai-artboard"><section class="mai-art-content ${art.cls}" aria-label="${label}"><img class="mai-approved-art" src="${asset(art.screen)}" alt="" draggable="false" aria-hidden="true"><p class="mai-art-sr">${label}. ${s.mode==='game'&&s.game.phase==='intro'?esc(MAIIA.words.en.introText):''}</p>${art.html}</section>${readonly?'':navigation(s)}${readonly||s.game.phase==='analysis'&&s.mode==='game'?'':`<small class="mai-art-disclaimer">${esc(MAIIA.words.en.demo)}</small>`}${readonly?'':'<div class="mai-feedback" role="status" aria-live="polite"></div>'}</div></main>`;
  mount.querySelectorAll('.mai-art-map .mai-map').forEach(svg=>svg.setAttribute('preserveAspectRatio','none'));
  if(s.game.phase==='analysis'&&s.game.analysisAt)mount.querySelector('.mai-app').style.setProperty('--elapsed',`-${Math.max(0,AI_SYNC.now()-s.game.analysisAt)}ms`);
  warm(MAIIA.config.image);
  const image=mount.querySelector('.mai-approved-art'),preload=()=>{for(const name of next[art.screen]||[])warm(asset(name));};
  if(image.complete)preload();else image.addEventListener('load',preload,{once:true});
  scale();
 }
 window.MAIIA_ARTWORK={renderInto,files,asset};
})();
