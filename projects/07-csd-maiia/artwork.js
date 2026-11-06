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
 const mapRect=[340,254,1240,697.5],tvMap=[48,224,1296,729];
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
   if(final){screen='easyResult';cls='mai-final-map';}else cls='mai-controller';
   html+=patch([0,126,1920,954],'','mai-art-body-mask');
   const headings={easy:['Outline','informal settlements'],easyResult:['Your','results'],manual:['Mark','informal settlements'],manualResult:['Your observations,','without MAIIA'],analysis:['MAIIA is','scanning...'],assisted:['Review','MAIIA suggestions'],final:['Your','results']};
   const hints={easy:t.drawHint,easyResult:`${g.easyScore}% overlap with the reference areas`,manual:t.markerHelp,manualResult:`${g.manual?.hits} / ${MAIIA.config.scoring.markerLimit} areas identified \u00b7 ${g.manual?.score}%`,analysis:t.analysisShort,assisted:t.selectHint,final:t.reviewMapHint};
   html+=title([340,148,1500,76],...headings[p],64);
   html+=patch([340,218,1300,33],esc(hints[p]),'mai-art-subtitle mai-tablet-map-hint');
   html+=liveMap(s,mapRect,{kind:easy?'easy':'hard',reference:final||p==='easyResult',candidates:analysis||p==='assisted',answers:final,readonly:review||analysis||final,scan:analysis});
   const reviewButton=[1330,960,250,70],clearButton=[340,960,250,70];
   const approvedButton=(source,rect,action,label,options={})=>fragment(screen,source,rect)+hit(rect,action,label,options);
   if(p==='easy'){
    html+=approvedButton([427,948,250,70],clearButton,'undo','Undo last area',{disabled:!g.polygons.length&&!g.draft.length});
    html+=approvedButton([710,948,250,70],[622,960,250,70],'clear','Clear all drawn areas',{disabled:!g.polygons.length&&!g.draft.length});
    html+=approvedButton([1242,948,250,70],reviewButton,'review','Review drawn areas');
   }else if(p==='manual'||p==='assisted'){
    html+=approvedButton([427,948,250,70],clearButton,'clear',p==='manual'?'Clear all markers':'Clear selected suggestions',{disabled:p==='manual'?!g.markers.length:!g.selected.length});
    html+=patch([622,960,650,70],p==='manual'?`${g.markers.length} / ${MAIIA.config.scoring.markerLimit} Markers`:`${g.selected.length} Selected`,'mai-art-count');
    html+=approvedButton([1242,948,250,70],reviewButton,'review',p==='manual'?'Review marked settlements':'Review MAIIA-assisted selections');
   }else if(p==='easyResult'||final){
    html+=patch([340,960,950,80],final?legend(s):MAIIA.legend(t,[['mai-reference-key',t.reference],['mai-user-key',t.your]]),'mai-art-final-legend');
    html+=fragment(screen,[1242,948,250,70],reviewButton)+buttonLabel(reviewButton,final?'Play again':'Continue')+hit(reviewButton,final?'replay':'next',final?'Play again':'Continue to level 2');
   }else if(p==='manualResult'){
    const nextButton=[1185,960,395,70];
    html+=fragment(screen,[1097,949,395,68],nextButton)+buttonLabel(nextButton,'Continue')+hit(nextButton,'next','Continue to Activate MAIIA');
   }else if(analysis){
    html+='<div class="mai-art-progress mai-analysis-progress" style="'+box([340,961,1240,8])+'" aria-hidden="true"><i></i></div>';
    html+=patch([340,987,1240,40],esc(t.demo),'mai-tablet-scan-note');
   }
  }
  return {screen,html,cls};
 }
 function television(s){
  const g=s.game,p=g.phase,t=MAIIA.words.en;
  let screen='tvLanding',html='',cls='';
  if(s.mode==='info')return {screen:'info',html,cls:'mai-infographic'};
  if(s.mode!=='game')return televisionMap(s);
  if(p==='final'){
   const a=g.manual,b=g.assisted;
   screen='final';cls='mai-final';
   for(const [i,r]of[a,b].entries())html+=patch([i?1066:359,500,500,216],`<strong>${r.score}%</strong><p><b>${r.hits} / ${MAIIA.config.scoring.markerLimit}</b> areas identified<br>${r.errors} Errors</p>`,'mai-scorecard '+(i?'mai-scorecard-assisted':''));
   const message=b.score>a.score?t.improved:b.score===a.score?t.same:t.lower;
   html+=patch([330,757,1280,100],`<h2>${esc(message)}</h2><p>${esc(t.closing)}</p>`,'mai-final-message');
   return {screen,html,cls};
  }
  return televisionMap(s);
 }
 function televisionMap(s){
  const g=s.game,p=g.phase,t=MAIIA.words.en,landing=s.mode!=='game';
  const easy=landing||['intro','easy','easyResult'].includes(p),analysis=p==='analysis'&&!landing;
  const screens={intro:'tvIntro',easy:'tvEasy',easyResult:'tvEasyResult',manual:'tvManual',manualResult:'tvManualResult',activation:'tvIntro',analysis:'tvAnalysis',assisted:'tvAssisted'};
  const content={
   intro:{stage:'MAIIA / SIMULATION',heading:t.introTitle,body:t.introText,help:t.duration},
   easy:{stage:'LEVEL 1 / DRAW',heading:'Find informal settlements',body:t.easyInstruction,help:t.drawingHelp,count:`${g.polygons.length} Closed areas`},
   easyResult:{stage:'LEVEL 1 / RESULT',heading:t.easyResult,body:t.match,help:t.iou,score:`${g.easyScore}%`},
   manual:{stage:'LEVEL 2 / LOCATE',heading:'Locate informal settlements',body:t.manualInstruction,help:t.markerHelp,count:`${g.markers.length} / ${MAIIA.config.scoring.markerLimit} Markers`},
   manualResult:{stage:'LEVEL 2 / RESULT',heading:t.manualResult,body:`${g.manual?.hits} / ${MAIIA.config.scoring.markerLimit} areas identified`,help:`${g.manual?.score}% \u00b7 ${t.metric}`,score:`${g.manual?.hits} / ${MAIIA.config.scoring.markerLimit}`},
   activation:{stage:'ACTIVATE MAIIA',heading:t.activationTitle,body:t.activationText,help:t.activationCue},
   analysis:{stage:'MAIIA / ANALYSIS',heading:'MAIIA is active',body:t.analysisText,help:'Scanning the territory...'},
   assisted:{stage:'MAIIA / REVIEW',heading:t.assistedTitle,body:t.assistedInstruction,help:t.assistedHelp,count:`${g.selected.length} Selected`}
  };
  const c=landing?{stage:'07 / MAIIA',heading:'MAIIA',body:t.subtitle,help:t.tvInvite}:content[p];
  let html=patch([0,126,1920,954],'','mai-art-body-mask');
  html+=liveMap(s,tvMap,{kind:easy?'easy':'hard',decorative:landing||p==='intro',reference:p==='easyResult'&&!landing,candidates:!landing&&(analysis||p==='assisted'),readonly:true,scan:analysis});
  html+=patch([48,170,1296,36],'MAIIA / TERRITORY & ARTIFICIAL INTELLIGENCE','mai-tv-map-kicker');
  html+=`<span class="mai-tv-map-label" style="left:72px;top:248px">${esc(easy?t.closeMap:t.wideMap)}</span>`;
  html+=`<aside class="mai-tv-copy mai-art-title" style="${box([1392,224,480,729])}"><p class="mai-tv-stage">${esc(c.stage)}</p><h1>${esc(c.heading)}</h1>${c.score?`<strong class="mai-big-score">${esc(c.score)}</strong>`:''}<p class="mai-tv-instruction">${esc(c.body)}</p><p class="mai-tv-detail">${esc(c.help)}</p>${c.count?`<p class="mai-art-tv-count">${esc(c.count)}</p>`:''}${analysis?'<div class="mai-art-progress mai-analysis-progress" aria-hidden="true"><i></i></div>':''}</aside>`;
  const keys=p==='easyResult'?[['mai-reference-key',t.reference],['mai-user-key',t.your]]:analysis||p==='assisted'?[['mai-reference-key',t.suggested],['mai-selected-key',t.selected]]:[];
  if(!landing&&keys.length)html+=patch([48,976,1296,58],MAIIA.legend(t,keys),'mai-art-final-legend');
  html+=patch([48,1040,1824,28],esc(t.demo),'mai-tv-map-disclaimer');
  return {screen:landing?'tvLanding':screens[p],html,cls:'mai-tv-map-layout '+(landing?'mai-landing':p==='intro'?'mai-intro':p==='activation'?'mai-activation':'mai-game-area')};
 }

 // Animate the SVG camera, including its overlays, in the same coordinate system
 // used by pointer input. The shared deadline survives renders and late TV joins.
 const cameras=new WeakMap(),territoryDuration=2200;
 function territoryCamera(mount,s){
  cancelAnimationFrame(cameras.get(mount));cameras.delete(mount);
  const svg=mount.querySelector('.mai-art-map .mai-map'),at=s.game.territoryAt;
  if(!svg||s.mode!=='game'||s.game.phase!=='manual'||!at||matchMedia('(prefers-reduced-motion: reduce)').matches||AI_SYNC.now()-at>=territoryDuration)return;
  const [ex,ey,ew,eh]=MAIIA.config.easy.crop,[hx,hy,hw,hh]=MAIIA.config.hard.crop;
  const from=[(ex-hx)/hw*1000,(ey-hy)/hh*562.5,ew/hw*1000,eh/hh*562.5],to=[0,0,1000,562.5];
  svg.classList.add('mai-territory-zoom');
  function frame(){
   if(!svg.isConnected){cameras.delete(mount);return;}
   const progress=Math.max(0,Math.min(1,(AI_SYNC.now()-at)/territoryDuration)),ease=1-Math.pow(1-progress,3);
   svg.setAttribute('viewBox',from.map((v,i)=>v+(to[i]-v)*ease).join(' '));
   if(progress<1)cameras.set(mount,requestAnimationFrame(frame));
   else{svg.setAttribute('viewBox','0 0 1000 562.5');svg.classList.remove('mai-territory-zoom');cameras.delete(mount);}
  }
  frame();
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
  territoryCamera(mount,s);
  warm(MAIIA.config.image);
  const image=mount.querySelector('.mai-approved-art'),preload=()=>{for(const name of next[art.screen]||[])warm(asset(name));};
  if(image.complete)preload();else image.addEventListener('load',preload,{once:true});
  scale();
 }
 window.MAIIA_ARTWORK={renderInto,files,asset};
})();
