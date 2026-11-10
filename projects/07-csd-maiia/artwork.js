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
  const kind=options.kind||'hard',level=MAIIA.config[kind],ratio=level.width/level.height;
  const [x,y,w,h]=rect,fitW=Math.min(w,h*ratio),fitH=fitW/ratio,pad=options.decorative?14:0;
  // Keep the entire approved image visible at its original aspect ratio.
  return `<div class="mai-art-map-slot" style="${box([x-pad,y-pad,w+pad*2,h+pad*2])}"><div class="mai-art-map mai-controller-canvas ${cls}" style="${box([pad+(w-fitW)/2,pad+(h-fitH)/2,fitW,fitH])}">${MAIIA.map(s,options)}</div></div>`;
 }
 function navigation(s){
  const back=[1492,28,250,70],full=[1790,34,58,58];
  return `<nav class="mai-art-navigation" aria-label="Exhibition navigation"><a class="mai-art-hit" style="${box([56,20,710,84])}" href="/index.html${esc(AI_SYNC.stationQuery)}&amp;projects=1" data-action="home" aria-label="Home: back to all projects"></a>${fragment('intro',[1316,915,250,70],back)}${hit(back,'menu','Back to MAIIA menu')}${fragment('final',[1789,37,52,52],full)}${patch([1800,43,38,39],MAIIA.icon('expand'),'mai-art-fullscreen-symbol')}${hit([1778,23,82,82],'fullscreen','Full screen')}</nav>`;
 }
 function legend(s){
  const t=MAIIA.words.en;
  return MAIIA.legend(t,[['mai-approved-key',t.correctAreas],['mai-kept-key',t.assistedAnswers]])+MAIIA.markerLegend(s);
 }
 function tablet(s){
  const g=s.game,p=g.phase,t=MAIIA.words.en;
  let screen=p,html='',cls='';
  if(s.mode!=='game'){
   screen='landing';cls='mai-landing';
   html+=patch([64,257,710,48],'07 MAIIA','mai-art-project-label');
   html+=patch([64,418,665,112],esc(t.landingInvite),'mai-conversation-landing');
   html+=patch([160,585,330,44],esc(t.info),'mai-conversation-menu-label');
   html+=patch([160,702,330,44],esc(t.game),'mai-conversation-menu-label');
   html+=hit([66,560,512,85],'information',t.info);
   html+=hit([66,677,512,85],'game',t.game);
   html+=liveMap(s,[788,257,1065,600],{kind:'easy',decorative:true,readonly:true});
   if(s.mode==='info')html+='<span class="mai-art-information-selected" aria-hidden="true"></span>';
  }else if(p==='intro'){
   cls='mai-intro';
   html+=patch([60,249,675,620],`<h1>${esc(t.introTitle)}</h1><p>${esc(t.introText)}</p><ol>${t.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`,'mai-art-activation-copy mai-conversation-intro');
   html+=hit([1316,915,250,70],'menu','Back to MAIIA menu');
   html+=buttonLabel([1603,915,250,70],"Let's try")+hit([1603,915,250,70],'start',"Let's try finding informal settlements");
   html+=liveMap(s,[788,257,1065,600],{kind:'easy',decorative:true,readonly:true});
  }else if(p==='activation'){
   screen='intro';cls='mai-activation';
   html+=patch([60,249,675,620],`<div class="mai-art-activation-icon">${MAIIA.icon('chip')}</div><h1>${esc(t.activationTitle)}</h1><p>${esc(t.activationText)}</p>`,'mai-art-activation-copy');
   html+=liveMap(s,[788,257,1065,600],{readonly:true});
   html+=hit([1316,915,250,70],'menu','Back to MAIIA menu');
   html+=buttonLabel([1603,915,250,70],t.activate)+hit([1603,915,250,70],'activate',t.activate);
  }else{
   const easy=p==='easy'||p==='easyResult',review=p==='easyResult'||p==='manualResult',analysis=p==='analysis',final=p==='final';
   if(final){screen='easyResult';cls='mai-final-map';}else cls='mai-controller';
   html+=patch([0,126,1920,954],'','mai-art-body-mask');
   const headings={easy:['Can you spot','informal settlements?'],easyResult:["Let's look",'at your outline.'],manual:['Can you find','more informal settlements?'],manualResult:["Here's what",'you spotted.'],analysis:["Let's see what",'MAIIA finds.'],assisted:['Which suggestions','would you keep?'],final:["Let's compare",'your choices.']};
   const hints={easy:t.drawHint,easyResult:`${g.easyScore}% overlap with the approved areas`,manual:t.markHint,manualResult:MAIIA.markerHint(s),analysis:t.analysisShort,assisted:t.selectHint,final:t.finalMapHint};
   html+=title([340,148,1500,76],...headings[p],64);
   html+=patch([340,218,1300,33],esc(hints[p]),'mai-art-subtitle mai-tablet-map-hint');
   html+=liveMap(s,mapRect,{kind:easy?'easy':'hard',reference:final||p==='easyResult',candidates:analysis||p==='assisted',answers:final,readonly:review||analysis||final,scan:analysis});
   const reviewButton=[1330,960,250,70],clearButton=[340,960,250,70];
   const approvedButton=(source,rect,action,label,options={})=>fragment(screen,source,rect)+hit(rect,action,label,options);
   if(p==='easy'){
    html+=approvedButton([427,948,250,70],clearButton,'undo','Undo last area',{disabled:!g.polygons.length&&!g.draft.length});
    html+=approvedButton([710,948,250,70],[622,960,250,70],'clear','Clear all drawn areas',{disabled:!g.polygons.length&&!g.draft.length});
    html+=approvedButton([1242,948,250,70],reviewButton,'review','Check my map')+buttonLabel(reviewButton,'Check my map');
   }else if(p==='manual'||p==='assisted'){
    html+=approvedButton([427,948,250,70],clearButton,'clear',p==='manual'?'Clear all markers':'Clear selected suggestions',{disabled:p==='manual'?!g.markers.length:!g.selected.length});
    html+=patch([622,960,650,70],p==='manual'?`${g.markers.length} pins placed`:`${g.selected.length} ${g.selected.length===1?'suggestion kept':'suggestions kept'}`,'mai-art-count');
    const label=p==='manual'?"I'm ready":'Compare';
    html+=approvedButton([1242,948,250,70],reviewButton,'review',label)+buttonLabel(reviewButton,label);
   }else if(p==='easyResult'||final){
    html+=patch([340,960,950,80],final?legend(s):MAIIA.legend(t,[['mai-reference-key',t.reference],['mai-user-key',t.your]]),'mai-art-final-legend');
    html+=fragment(screen,[1242,948,250,70],reviewButton)+buttonLabel(reviewButton,final?t.replay:'Zoom out')+hit(reviewButton,final?'replay':'next',final?t.replay:'Zoom out to explore more');
   }else if(p==='manualResult'){
    html+=patch([340,960,810,70],MAIIA.markerLegend(s),'mai-art-final-legend mai-manual-review-legend');
    const nextButton=[1185,960,395,70];
    html+=fragment(screen,[1097,949,395,68],nextButton)+buttonLabel(nextButton,'Try MAIIA')+hit(nextButton,'next','Try MAIIA');
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
  if(s.mode==='info')return {screen:'info',html:liveMap(s,[1476,314,404,228],{kind:'hard',decorative:true,readonly:true}),cls:'mai-infographic'};
  if(s.mode!=='game')return televisionMap(s);
  if(p==='final'){
   const a=g.manual,b=g.assisted;
   html+=title([330,230,1280,82],"Let's",'compare.');
   html+=patch([330,313,1280,55],esc(t.finalSubtitle),'mai-conversation-final-subtitle');
   html+=patch([355,410,500,54],esc(t.without),'mai-conversation-score-label');
   html+=patch([1060,410,500,54],esc(t.with),'mai-conversation-score-label mai-conversation-with-ai');
   html+=patch([330,880,1280,66],esc(t.metric),'mai-conversation-metric');
   screen='final';cls='mai-final';
   for(const [i,r]of[a,b].entries())html+=patch([i?1066:359,500,500,216],`<strong>${r.score}%</strong><p><b>${r.hits} / ${MAIIA.config.hard.reference.length}</b> areas found<br>${r.errors} ${r.errors===1?'pick did not count':'picks did not count'}</p>`,'mai-scorecard '+(i?'mai-scorecard-assisted':''));
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
   easy:{stage:'LEVEL 1 / DRAW',heading:t.easyTitle,body:t.easyInstruction,help:t.drawingHelp+' '+t.clues,count:`${g.polygons.length} ${g.polygons.length===1?'area outlined':'areas outlined'}`},
   easyResult:{stage:'LEVEL 1 / RESULT',heading:t.easyResult,body:t.match,help:t.iou,score:`${g.easyScore}%`},
   manual:{stage:'LEVEL 2 / LOCATE',heading:t.manualTitle,body:t.manualInstruction,help:t.markerHelp,count:`${g.markers.length} pins placed`},
   manualResult:{stage:'LEVEL 2 / RESULT',heading:t.manualResult,body:`${g.manual?.hits} of ${MAIIA.config.hard.reference.length} areas found`,help:MAIIA.markerHint(s),score:`${g.manual?.hits} / ${MAIIA.config.hard.reference.length}`},
   activation:{stage:'ACTIVATE MAIIA',heading:t.activationTitle,body:t.activationText,help:t.activationCue},
   analysis:{stage:'MAIIA / ANALYSIS',heading:t.analysisTitle,body:t.analysisText,help:t.analysisDetail},
   assisted:{stage:'MAIIA / REVIEW',heading:t.assistedTitle,body:t.assistedInstruction,help:t.assistedHelp,count:`${g.selected.length} ${g.selected.length===1?'suggestion kept':'suggestions kept'}`}
  };
  const c=landing?{stage:'07 / MAIIA',heading:'MAIIA',body:t.landingInvite,help:t.tvInvite}:content[p];
  let html=patch([0,126,1920,954],'','mai-art-body-mask');
  html+=liveMap(s,tvMap,{kind:easy?'easy':'hard',decorative:landing||p==='intro',reference:p==='easyResult'&&!landing,candidates:!landing&&(analysis||p==='assisted'),readonly:true,scan:analysis});
  html+=patch([48,170,1296,36],'MAIIA / TERRITORY & ARTIFICIAL INTELLIGENCE','mai-tv-map-kicker');
  html+=`<span class="mai-tv-map-label" style="left:100px;top:248px">${esc(easy?t.closeMap:t.wideMap)}</span>`;
  html+=`<aside class="mai-tv-copy mai-art-title" style="${box([1392,224,480,729])}"><p class="mai-tv-stage">${esc(c.stage)}</p><h1>${esc(c.heading)}</h1>${c.score?`<strong class="mai-big-score">${esc(c.score)}</strong>`:''}<p class="mai-tv-instruction">${esc(c.body)}</p><p class="mai-tv-detail">${esc(c.help)}</p>${c.count?`<p class="mai-art-tv-count">${esc(c.count)}</p>`:''}${analysis?'<div class="mai-art-progress mai-analysis-progress" aria-hidden="true"><i></i></div>':''}</aside>`;
  const keys=p==='easyResult'?[['mai-reference-key',t.reference],['mai-user-key',t.your]]:analysis||p==='assisted'?[['mai-reference-key',t.suggested],['mai-selected-key',t.selected]]:[];
  if(!landing&&keys.length)html+=patch([48,976,1296,58],MAIIA.legend(t,keys),'mai-art-final-legend');
  if(!landing&&p==='manualResult')html+=patch([48,976,1296,58],MAIIA.markerLegend(s),'mai-art-final-legend mai-manual-review-legend');
  html+=patch([48,1040,1824,28],esc(t.demo),'mai-tv-map-disclaimer');
  return {screen:landing?'tvLanding':screens[p],html,cls:'mai-tv-map-layout '+(landing?'mai-landing':p==='intro'?'mai-intro':p==='activation'?'mai-activation':'mai-game-area')};
 }

 // Animate the SVG camera, including its overlays, in the same coordinate system
 // used by pointer input. TV playback starts on receipt so network delay cannot
 // consume its transition; subsequent snapshots preserve that local playback.
 const cameras=new WeakMap(),tvCameras=new WeakMap();
 function territoryCamera(mount,s,{readonly,wasCloseUp}){
  cancelAnimationFrame(cameras.get(mount));cameras.delete(mount);
  const svg=mount.querySelector('.mai-art-map .mai-map'),at=s.game.territoryAt;
  if(s.mode!=='game'||s.game.phase!=='manual'){tvCameras.delete(mount);return;}
  if(!svg||!at||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let playback=tvCameras.get(mount);
  if(readonly&&wasCloseUp&&playback?.at!==at){
   playback={at,started:performance.now()};tvCameras.set(mount,playback);
  }
  const elapsed=readonly&&playback?.at===at?()=>performance.now()-playback.started:()=>AI_SYNC.now()-at;
  const territoryDuration=MAIIA.config.timing.territoryMs;
  if(elapsed()>=territoryDuration)return;
  const [ex,ey,ew,eh]=MAIIA.config.easy.territoryCrop,[hx,hy,hw,hh]=MAIIA.config.hard.crop;
  const from=[(ex-hx)/hw*1000,(ey-hy)/hh*562.5,ew/hw*1000,eh/hh*562.5],to=[0,0,1000,562.5];
  // Fade the higher-resolution close-up over the corresponding wide-map crop.
  const close=document.createElementNS('http://www.w3.org/2000/svg','image');
  close.setAttribute('href',MAIIA.config.easy.image);close.setAttribute('x',from[0]);close.setAttribute('y',from[1]);close.setAttribute('width',from[2]);close.setAttribute('height',from[3]);close.setAttribute('preserveAspectRatio','none');close.style.pointerEvents='none';
  svg.insertBefore(close,svg.querySelector('image').nextSibling);
  svg.classList.add('mai-territory-zoom');
  function frame(){
   if(!svg.isConnected){cameras.delete(mount);return;}
   const progress=Math.max(0,Math.min(1,elapsed()/territoryDuration)),ease=1-Math.pow(1-progress,3);
   svg.setAttribute('viewBox',from.map((v,i)=>v+(to[i]-v)*ease).join(' '));
   close.style.opacity=String(Math.max(0,1-progress*1.6));MAIIA.updateMapScales(mount);
   if(progress<1)cameras.set(mount,requestAnimationFrame(frame));
   else{svg.setAttribute('viewBox','0 0 1000 562.5');close.remove();svg.classList.remove('mai-territory-zoom');cameras.delete(mount);MAIIA.updateMapScales(mount);}
  }
  frame();
 }
 function scale(){
  document.querySelectorAll('.mai-branded').forEach(main=>{main.style.setProperty('--mai-art-scale',Math.min(main.clientWidth/1920,main.clientHeight/1080));MAIIA.updateMapScales(main);});
 }
 window.addEventListener('resize',scale);
 function renderInto(mount,state,{readonly=false}={}){
  const s={...state,language:'en',game:state.game||MAIIA_STATE.fresh()};
  const art=readonly?television(s):tablet(s),phase=s.mode==='game'?s.game.phase:s.mode==='info'&&readonly?'information':'landing';
  const t=MAIIA.words.en,titles={intro:t.introTitle,easy:t.easyTitle,easyResult:t.easyResult,manual:t.manualTitle,manualResult:t.manualResult,activation:t.activationTitle,analysis:t.analysisTitle,assisted:t.assistedTitle,final:t.finalTitle};
  const label=s.mode==='game'?titles[s.game.phase]:s.mode==='info'&&readonly?'MAIIA information':'MAIIA main menu';
  const wasCloseUp=!!mount.querySelector('.mai-phase-intro,.mai-phase-easy,.mai-phase-easyResult');
  document.documentElement.lang='en';
  mount.innerHTML=`<main class="mai-app mai-branded ${readonly?'mai-tv':'mai-tablet'} mai-phase-${phase}" data-language="en" aria-label="${label}"><div class="mai-artboard"><section class="mai-art-content ${art.cls}" aria-label="${label}"><img class="mai-approved-art" src="${asset(art.screen)}" alt="" draggable="false" aria-hidden="true"><p class="mai-art-sr">${label}. ${s.mode==='game'&&s.game.phase==='intro'?esc(MAIIA.words.en.introText):''}</p>${art.html}</section>${readonly?'':navigation(s)}${readonly||s.game.phase==='analysis'&&s.mode==='game'?'':`<small class="mai-art-disclaimer">${esc(MAIIA.words.en.demo)}</small>`}${readonly?'':'<div class="mai-feedback" role="status" aria-live="polite"></div>'}</div></main>`;
  mount.querySelectorAll('.mai-art-map .mai-map').forEach(svg=>svg.setAttribute('preserveAspectRatio','none'));
  if(s.game.phase==='analysis'&&s.game.analysisAt)mount.querySelector('.mai-app').style.setProperty('--elapsed',`-${Math.max(0,AI_SYNC.now()-s.game.analysisAt)}ms`);
  territoryCamera(mount,s,{readonly,wasCloseUp});
  warm(MAIIA.config.easy.image);warm(MAIIA.config.hard.image);
  const image=mount.querySelector('.mai-approved-art'),preload=()=>{for(const name of next[art.screen]||[])warm(asset(name));};
  if(image.complete)preload();else image.addEventListener('load',preload,{once:true});
  scale();
 }
 window.MAIIA_ARTWORK={renderInto,files,asset};
})();
