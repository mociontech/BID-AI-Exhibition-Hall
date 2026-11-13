/* Approved PNGs + proportional HTML hit areas; current dialogue stays live. */
(function(){
 const observers=new WeakMap();
 const R={info:[68,618,853,265],game:[1001,618,853,265],topics:[[140,588,449,101],[670,588,443,99],[142,712,443,97],[670,712,443,97]],follow:[[140,586,619,102],[142,712,615,96]],back:[142,889,249,69],skip:[436,889,321,70],resultBack:[142,743,249,69],again:[436,743,321,69]};
 const rect=r=>`left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px`;
 function dispose(mount){observers.get(mount)?.disconnect();observers.delete(mount);}
 function paint(mount,state,api){
  const image=mount.querySelector('[data-art-initial]');
  if(image){const a=api.animation(state),file=a?.sent?'tablet-cases-thinking-en.png':'tablet-cases-wait-en.png';if(image.dataset.file!==file){image.src=api.assets('branded/'+file)+'?v=20261113-home-label';image.dataset.file=file;}}
 }
 function render({mount,state,readonly,api}){
  if(state.language!=='en')return false;
  const {assets,escape,icon,avatar,chat,words:t,scripts,header,footer,content,connectionLabel}=api;
  const g=state.game,isGame=state.mode==='game'||state.mode==='results',isInfo=['info','cta'].includes(state.mode),busy=isGame&&g.phase==='animating',complete=isGame&&g.phase==='complete';
  const legacyCases=isGame&&(g.phase==='topics'||busy&&g.turn==='situation'&&g.part===0);
  const topic=scripts.en[g.topic],branch=topic?.options[0],follow=branch?.follow[g.follow];
  const path=name=>assets('branded/'+name)+'?v=20261113-home-label';
  const hot=(r,label,attrs,disabled=false)=>`<button type="button" class="gabi-art-hotspot" style="${rect(r)}" aria-label="${escape(label)}" ${attrs} ${disabled?'disabled aria-disabled="true"':''}><span class="gabi-artwork-accessible">${escape(label)}</span></button>`;
  const crop=(file,r,cls='')=>`<div class="gabi-art-crop ${cls}" style="${rect(r)}"><img src="${path(file)}" alt="" style="left:${-r[0]}px;top:${-r[1]}px"></div>`;
  const mask=(r,html,cls='')=>`<div class="gabi-art-mask ${cls}" style="${rect(r)}">${html}</div>`;
  const outline=(r,selected,disabled=false)=>`<span class="gabi-art-outline ${selected?'is-selected':''} ${disabled?'is-disabled':''}" style="${rect(r)}" aria-hidden="true"></span>`;
  const toolbar=readonly?'':`<span class="gabi-art-home-label" aria-hidden="true">Home</span>`+hot([1720,38,132,50],t.home,'data-action="home" title="Home"');
  let file,overlays='',semantic='',marker='',initial=false;
  if(!readonly&&isGame)overlays+=crop('tablet-follow-en.png',[0,0,1920,126],'gabi-art-header');
  if(readonly&&isInfo){file='tv-information-en.png';semantic=`<section class="gabi-artwork-accessible"><h1>Profe Gabi — Mentoring Novice Teachers</h1><p>VPS · SCL</p><h2>THE CHALLENGE</h2><p>Limited Access to Mentorship. Less than 1% of new teachers in Chile receive formal mentoring, leaving thousands without support.</p><h2>THE SOLUTION</h2><p>AI-Powered Teacher Support. Profe Gabi offers 24/7 guidance via WhatsApp on teaching, well-being, and professional growth.</p><h2>IMPACT TO DATE</h2><p>4,181 teachers with access. 85% of novice teachers satisfied. In 2027 it was escalated with Ministry of Education.</p></section>`;}
  else if(!readonly&&!isGame){
   file='tablet-cover-en.png';marker='gabi-hero';
   overlays+=hot(R.info,'About the project','data-action="information"');
   const game=hot(R.game,'Interactive Experience','data-action="game"');
   overlays+=isInfo?`<div class="gabi-info-controls gabi-art-cta">${game}</div>`:game;
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
    semantic=`<section class="gabi-artwork-accessible"><h1>Conversation completed!</h1><p>Profe Gabi supports planning while the teacher adapts and decides, complementing mentors and colleagues without replacing professional judgment.</p></section>`;
    overlays+=hot(R.resultBack,t.back,'data-action="back"')+hot(R.again,t.again,'data-action="restart"');
   }else{
    file='tablet-follow-en.png';
    overlays+=mask([135,272,990,285],`<h1>${busy?'Your conversation <em>is underway</em>':'What would you <em>like to focus on now?</em>'}</h1><p>${busy?t.busyBody:t.followBody}</p>`,'gabi-art-question');
    for(let i=0;i<2;i++){overlays+=outline(R.follow[i],busy&&g.follow===i,busy&&g.follow!==i);overlays+=mask([218,R.follow[i][1]+17,510,72],`<span>${escape(branch.follow[i].label)}</span>`,'gabi-art-follow-label');overlays+=hot(R.follow[i],branch.follow[i].label,`data-follow="${i}"`,busy);}
    overlays+=hot(R.back,t.back,'data-action="back"');
    if(busy){overlays+=crop('tablet-cases-thinking-en.png',R.skip);overlays+=hot(R.skip,t.skip,'data-action="skip"');}
   }
   if(!complete)overlays+=mask([140,829,990,47],`<p ${busy?'data-animation-status':''}>${busy?t.writing:t.controlHint}</p>`,'gabi-art-status');
   if(legacyCases){
    overlays+=mask([1237,540,521,138],`<p>${topic?t.selectedTopic:'PROFE GABI'}</p><h2>${escape(topic?.title||t.subtitle)}</h2>`,'gabi-art-context');
    overlays+=mask([1240,744,510,35],`<p>${t.tag}</p>`,'gabi-art-tag');
   }else{
   overlays+=mask([1248,540,505,134],`<p>SELECTED TOPIC</p><h2>${escape(topic?.title||'Profe Gabi')}</h2><div>You choose on the tablet. The conversation comes to life on the main display.</div>`,'gabi-art-context is-updated');
   const step=complete?3:g.turn==='follow'||g.phase==='follow'?2:1;
   overlays+=mask([1248,681,400,54],`<div class="gabi-art-steps" aria-label="Step ${step} of 3">${[1,2,3].map(i=>`<span class="${i<=step?'is-active':''}">${String(i).padStart(2,'0')}</span>`).join('')}</div>`,'gabi-art-progress');
   }
  }else{
   file=complete?'tv-result-en.png':busy?'tv-chat-en.png':'tv-situation-en.png';
   if(complete){semantic=`<section class="gabi-artwork-accessible gabi-art-takeaway"><h1>Conversation completed!</h1><p>What you learned with Profe Gabi</p>${t.lessons.map(l=>`<p>${escape(l)}</p>`).join('')}<p>Useful guidance starts with describing the class, the content and what you want to achieve.</p></section>`;}
   else if(!isGame||g.phase==='topics')overlays+=mask([135,265,655,435],`<h1>${!isGame?'Profe <em>Gabi</em>':'What do you <em>need today?</em>'}</h1><p>${t.inviteAction}</p>`,'gabi-art-tv-heading');
   else overlays+=mask([136,574,660,90],`<p>${t.selectedTopic}: ${escape(topic.title)}</p>`,'gabi-art-tv-selected');
   const r=[860,206,920,778];
   if(!isGame||g.phase==='topics'){
    overlays+=`<section class="gabi-art-welcome ${isGame?'gabi-game-welcome':'gabi-tv-invite'}" style="${rect(r)}">${avatar()}<h2>${isGame?t.topicTitle:t.invite}</h2><p>${isGame?t.topicBody:t.inviteAction}</p>${isGame?`<div class="gabi-art-case-list">${scripts.en.map(c=>`<p><strong>${escape(c.title)}</strong><small>${escape(c.sub)}</small></p>`).join('')}</div>`:''}</section>`;
   }else overlays+=`<div class="gabi-art-live-chat ${complete?'is-complete':''}" style="${rect(r)}">${chat()}</div>`;
  }
  if(readonly&&isInfo){
   const fragments=[['logo',[64,64,310,82],.55],['title',[62,450,655,113],.95],['subtitle',[64,570,650,145],1.2],['challenge',[839,201,483,395],1.65],['solution',[1367,201,483,395],2.05],['impact',[870,638,440,45],2.65],['metric-one',[839,696,332,183],2.95],['metric-two',[1171,696,328,183],3.25],['metric-three',[1499,696,346,183],3.55]];
   overlays=`<div class="gabi-info-motion" aria-hidden="true"><div class="gabi-info-blue-panel"></div>${fragments.map(([name,r,delay])=>`<div class="gabi-info-fragment" data-info-fragment="${name}" style="${rect(r)};--gabi-info-delay:${delay}s"><img src="${path(file)}" alt="" width="1920" height="1080" style="left:${-r[0]}px;top:${-r[1]}px"></div>`).join('')}</div><aside class="gabi-info-tablet-hint" role="note"><svg viewBox="0 0 32 28" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="28" height="22" rx="2"/></svg><span>When you are ready, tap “Interactive experience” on the tablet</span><svg class="gabi-info-hint-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></aside>`;
  }
  mount.innerHTML=`<main class="gabi-app gabi-approved-screen ${readonly?'gabi-display':'gabi-tablet'}" aria-label="Profe Gabi"><div class="gabi-artwork-canvas ${readonly&&isInfo?'gabi-info-animated':''}"><img class="gabi-approved-artwork" ${initial?'data-art-initial':''} data-file="${file}" src="${path(file)}" alt="" width="1920" height="1080" decoding="sync" fetchpriority="high"><div class="gabi-artboard ${marker}">${overlays}${toolbar}</div></div>${semantic}<p class="gabi-artwork-accessible" data-status role="status"></p></main>`;
  const canvas=mount.querySelector('.gabi-artwork-canvas');const size=()=>canvas.style.setProperty('--gabi-art-scale',canvas.clientWidth/1920);size();const observer=new ResizeObserver(size);observer.observe(canvas);observers.set(mount,observer);
  if(readonly&&isInfo)Promise.all([...canvas.querySelectorAll('img')].map(img=>img.decode())).then(()=>{
   if(canvas.isConnected&&mount.querySelector('.gabi-artwork-canvas')===canvas)canvas.classList.add('is-info-ready');
  }).catch(()=>{if(canvas.isConnected)canvas.classList.add('is-info-fallback');});
  return true;
 }
 window.PROFE_GABI_ARTWORK={render,paint,dispose,regions:R};
})();
