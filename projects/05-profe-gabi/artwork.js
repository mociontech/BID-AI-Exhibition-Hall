/* Approved PNGs + proportional HTML hit areas; current dialogue stays live. */
(function(){
 const observers=new WeakMap();
 const R={info:[68,554,853,345],game:[964,554,853,345],topics:[[140,588,449,101],[670,588,443,99],[142,712,443,97],[670,712,443,97]],follow:[[140,586,619,102],[142,712,615,96]],back:[142,889,249,69],skip:[436,889,321,70],resultBack:[142,743,249,69],again:[436,743,321,69]};
 const rect=r=>`left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px`;
 function dispose(mount){observers.get(mount)?.disconnect();observers.delete(mount);}
 function paint(mount,state,api){
  const image=mount.querySelector('[data-art-initial]');
  if(image){const a=api.animation(state),file=a?.sent?'tablet-cases-thinking-en.png':'tablet-cases-wait-en.png';if(image.dataset.file!==file){image.src=api.assets('branded/'+file)+'?v=20261109-event-en-chat-es';image.dataset.file=file;}}
 }
 function render({mount,state,readonly,api}){
  if(state.language!=='en')return false;
  const {assets,escape,icon,avatar,chat,words:t,scripts,header,footer,content,connectionLabel}=api;
  const g=state.game,isGame=state.mode==='game'||state.mode==='results',isInfo=['info','cta'].includes(state.mode),busy=isGame&&g.phase==='animating',complete=isGame&&g.phase==='complete';
  const topic=scripts.en[g.topic],branch=topic?.options[0],follow=branch?.follow[g.follow];
  const path=name=>assets('branded/'+name)+'?v=20261109-event-en-chat-es';
  const hot=(r,label,attrs,disabled=false)=>`<button type="button" class="gabi-art-hotspot" style="${rect(r)}" aria-label="${escape(label)}" ${attrs} ${disabled?'disabled aria-disabled="true"':''}><span class="gabi-artwork-accessible">${escape(label)}</span></button>`;
  const crop=(file,r,cls='')=>`<div class="gabi-art-crop ${cls}" style="${rect(r)}"><img src="${path(file)}" alt="" style="left:${-r[0]}px;top:${-r[1]}px"></div>`;
  const mask=(r,html,cls='')=>`<div class="gabi-art-mask ${cls}" style="${rect(r)}">${html}</div>`;
  const outline=(r,selected,disabled=false)=>`<span class="gabi-art-outline ${selected?'is-selected':''} ${disabled?'is-disabled':''}" style="${rect(r)}" aria-hidden="true"></span>`;
  const toolbar=readonly?'':`<div class="gabi-art-toolbar"><div class="gabi-language" aria-label="Interface language"><span class="is-active">EN</span></div><button type="button" class="gabi-button gabi-icon" data-action="home" aria-label="${t.home}" title="${t.home}">${icon('home')}</button><button type="button" class="gabi-button" data-action="menu">${t.menu}</button><button type="button" class="gabi-button gabi-icon" data-action="fullscreen" aria-label="${t.fullscreen}" title="${t.fullscreen}">${icon('expand')}</button><span class="gabi-art-connection" data-gabi-connection data-status="connected" role="status">${connectionLabel('en')}</span></div>`;
  let file,overlays='',semantic='',marker='',initial=false;
  if(readonly&&isInfo){file='tv-information-en.png';semantic=`<section class="gabi-artwork-accessible">${header}${content}${footer}</section>`;}
  else if(!readonly&&!isGame){
   file='tablet-cover-en.png';marker='gabi-hero';
   overlays+=mask([64,262,850,165],'<p class="gabi-art-kicker">05 / AI in Action</p><h1>Profe <em>Gabi</em></h1>','gabi-art-cover-title');
   if(!g.ready)overlays+=crop(file,R.game,'is-locked');
   overlays+=hot(R.info,t.info,'data-action="information"');
   const game=hot(R.game,g.ready?t.start:t.game,'data-action="game"',!g.ready);
   overlays+=isInfo&&g.ready?`<div class="gabi-info-controls gabi-art-cta">${game}</div>`:game;
   // Keep the newly supplied English card title and description visible.
   overlays+=mask([70,930,1745,70],`<p>${isInfo?(g.ready?t.ready:t.watch):g.ready?'':t.locked}</p>`,'gabi-art-status');
   semantic=`<section class="gabi-artwork-accessible"><h1>Profe Gabi</h1><p>${t.description}</p></section>`;
  }else if(!readonly){
   const cases=g.phase==='topics'||busy&&g.turn==='situation';
   if(g.phase==='reading'||busy&&g.part>0){
    file='tablet-follow-en.png';marker='gabi-reading';
    overlays+=mask([130,260,1000,567],api.readingPanel(),'gabi-art-reading');
    overlays+=hot(R.back,t.back,'data-action="back"');
   }else if(cases){
    initial=busy;file=busy?(api.animation(state)?.sent?'tablet-cases-thinking-en.png':'tablet-cases-wait-en.png'):'tablet-cases-en.png';
    for(let i=0;i<4;i++){
     const r=R.topics[i];
     overlays+=mask([r[0]+14,r[1]+10,r[2]-28,r[3]-20],`<b>${String(i+1).padStart(2,'0')}</b><span>${escape(scripts.en[i].title)}</span>`,'gabi-art-topic-label');
     overlays+=outline(r,busy&&g.topic===i,busy&&g.topic!==i);overlays+=hot(r,scripts.en[i].title,`data-topic="${i}"`,busy);
    }
    if(busy){overlays+=crop('tablet-cases-thinking-en.png',R.back)+crop('tablet-cases-thinking-en.png',R.skip);overlays+=hot(R.back,t.back,'data-action="back"')+hot(R.skip,t.skip,'data-action="skip"');}
   }else if(complete){
    file='tablet-result-en.png';marker='gabi-summary';
    overlays+=mask([135,400,990,310],`<h1>Conversation <em>completed!</em></h1><p>${escape(follow.take)}</p>`,'gabi-art-result-copy');
    overlays+=hot(R.resultBack,t.back,'data-action="back"')+hot(R.again,t.again,'data-action="restart"');
   }else{
    file='tablet-follow-en.png';
    overlays+=mask([135,272,990,285],`<h1>${busy?'Your conversation <em>is underway</em>':'What would you <em>like to focus on now?</em>'}</h1><p>${busy?t.busyBody:t.followBody}</p>`,'gabi-art-question');
    for(let i=0;i<2;i++){overlays+=outline(R.follow[i],busy&&g.follow===i,busy&&g.follow!==i);overlays+=mask([218,R.follow[i][1]+17,510,72],`<span>${escape(branch.follow[i].label)}</span>`,'gabi-art-follow-label');overlays+=hot(R.follow[i],branch.follow[i].label,`data-follow="${i}"`,busy);}
    overlays+=hot(R.back,t.back,'data-action="back"');
    if(busy){overlays+=crop('tablet-cases-thinking-en.png',R.skip);overlays+=hot(R.skip,t.skip,'data-action="skip"');}
   }
   if(!complete)overlays+=mask([140,829,990,47],`<p ${busy?'data-animation-status':''}>${busy?t.writing:t.controlHint}</p>`,'gabi-art-status');
   overlays+=mask([1237,540,521,138],`<p>${topic?t.selectedTopic:'PROFE GABI'}</p><h2>${escape(topic?.title||t.subtitle)}</h2>`,'gabi-art-context');
   overlays+=mask([1240,744,510,35],`<p>${t.tag}</p>`,'gabi-art-tag');
  }else{
   file=complete?'tv-result-en.png':busy?'tv-chat-en.png':'tv-situation-en.png';
   if(complete){overlays+=mask([135,790,655,180],`<p>${escape(follow.take)}</p>`,'gabi-art-takeaway');}
   else overlays+=mask([135,265,655,435],`<h1>${!isGame?'Profe <em>Gabi</em>':g.phase==='topics'?'What do you <em>need today?</em>':'<span class="gabi-heading-line">Virtual</span><span class="gabi-heading-line">assistant</span><em class="gabi-heading-name">Profe Gabi</em>'}</h1><p>${topic?`${t.selectedTopic}: ${escape(topic.title)}`:t.inviteAction}</p>`,'gabi-art-tv-heading');
   const r=[860,206,920,778];
   if(!isGame||g.phase==='topics'){
    overlays+=`<section class="gabi-art-welcome ${isGame?'gabi-game-welcome':'gabi-tv-invite'}" style="${rect(r)}">${avatar()}<h2>${isGame?t.topicTitle:t.invite}</h2><p>${isGame?t.topicBody:t.inviteAction}</p>${isGame?`<div class="gabi-art-case-list">${scripts.en.map(c=>`<p><strong>${escape(c.title)}</strong><small>${escape(c.sub)}</small></p>`).join('')}</div>`:''}</section>`;
   }else overlays+=`<div class="gabi-art-live-chat ${complete?'is-complete':''}" style="${rect(r)}">${chat()}</div>`;
  }
  mount.innerHTML=`<main class="gabi-app gabi-approved-screen ${readonly?'gabi-display':'gabi-tablet'}" aria-label="Profe Gabi"><div class="gabi-artwork-canvas"><img class="gabi-approved-artwork" ${initial?'data-art-initial':''} data-file="${file}" src="${path(file)}" alt="" width="1920" height="1080" decoding="sync" fetchpriority="high"><div class="gabi-artboard ${marker}">${overlays}${toolbar}</div></div>${semantic}<p class="gabi-artwork-accessible" data-status role="status"></p></main>`;
  const canvas=mount.querySelector('.gabi-artwork-canvas');const size=()=>canvas.style.setProperty('--gabi-art-scale',canvas.clientWidth/1920);size();const observer=new ResizeObserver(size);observer.observe(canvas);observers.set(mount,observer);
  return true;
 }
 window.PROFE_GABI_ARTWORK={render,paint,dispose,regions:R};
})();
