  /* Paired exhibition adapter. Original views and interaction rules above stay intact. */
  var ciRole=document.documentElement.dataset.device,ciBooted=false,ciOffset=0;
  I18N_LANG='en';
  langBtns=function(){return '';};
  S={sc:'intro',cc:null,con:[],last:null,ph:{},pk:{},p:{}};
  var ciPriorScene='',ciPriorPh={},ciOriginalRender=render;
  function ciNow(){return Date.now()+ciOffset;}
  function ciDelay(end){return Math.max(0,end-(ciNow()-(S.sceneAt||ciNow())));}
  function ciPost(type,snapshot){parent.postMessage({type:'country-v51',action:type,snapshot:snapshot},location.origin);}
  function ciNav(){
    if(ciRole!=='tablet')return;
    var band=tab.querySelector('.tband');if(!band)return;
    band.querySelectorAll(':scope > .home').forEach(function(b){b.remove();});
    var nav=document.createElement('nav');nav.className='ci-device-nav';nav.setAttribute('aria-label','Project navigation');
    nav.innerHTML='<button class="home" type="button" data-ci-back>'+IC.back+'Back</button><button class="home" type="button" data-ci-home>'+GRID+'Home</button>';
    band.appendChild(nav);
  }
  render=function(){
    if(!S)return;
    if(ciRole==='tablet'){
      if(ciPriorScene!==S.sc){S.sceneAt=ciNow();ciPriorScene=S.sc;}
      S.phaseAt=S.phaseAt||{};
      for(var k=0;k<3;k++)if(ciPriorPh[k]!==S.ph[k]){S.phaseAt[k]=ciNow();ciPriorPh[k]=S.ph[k];}
    }
    ciOriginalRender();ciNav();
    if(ciBooted&&ciRole==='tablet')ciPost('state',Object.assign({},S,{language:I18N_LANG,at:ciNow()}));
  };
  // The prototype's demonstration project grid is replaced by the real project cover.
  reset=function(){clearInterval(runT);clearTimeout(runT);clearTimeout(dsgT);clearTimeout(idle);if(ciBooted&&ciRole==='tablet')ciPost('back');};
  tab.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-ci-home')||b.hasAttribute('data-ci-back')||b.dataset.go==='menu'){
      e.preventDefault();e.stopImmediatePropagation();clearInterval(runT);clearTimeout(runT);clearTimeout(dsgT);clearTimeout(idle);
      ciPost(b.hasAttribute('data-ci-home')?'home':'back');
    }
  },true);
  // This exhibition experience is English-only, including restored sessions.
  setLang=function(){I18N_LANG='en';};
  function ciResume(){
    var k=Number(S.sc.slice(1));if(!/^m[012]$/.test(S.sc))return;
    var ph=S.ph[k],since=S.phaseAt[k]||ciNow();
    function advance(){
      var elapsed=ciNow()-since;
      if(ph==='run'){
        S.p[k]=Math.min(1,Math.max(0,elapsed/3200));
        if(S.p[k]>=1){clearInterval(runT);S.ph[k]=k===1?'done':'read';S.phaseAt[k]=since+3200;ciPriorPh[k]=S.ph[k];render();ciResume();return;}
        render();
      }else if(ph==='read'){S.ph[k]='done';render();}
    }
    if(ph==='run'){advance();if(S.ph[k]==='run')runT=setInterval(advance,140);}
    else if(ph==='read')runT=setTimeout(advance,Math.max(0,6500-(ciNow()-since)));
  }
  window.addEventListener('message',function(e){
    if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='country-v51-init')return;
    var incoming=e.data.snapshot;if(!incoming)return;
    clearInterval(runT);clearTimeout(runT);clearTimeout(dsgT);clearTimeout(idle);
    ciOffset=e.data.now-Date.now();S=JSON.parse(JSON.stringify(incoming));
    ciPriorScene=S.sc;ciPriorPh=Object.assign({},S.ph);I18N_LANG='en';S.language='en';
    ciBooted=true;render();i18nApply();
    if(ciRole==='tablet'){poke();ciResume();}
  });
  // Activity is reported without changing the prototype's one-minute inactivity timer.
  if(ciRole==='tablet')document.addEventListener('pointerdown',function(){if(ciBooted)ciPost('activity');},true);
  ciPost('ready');
