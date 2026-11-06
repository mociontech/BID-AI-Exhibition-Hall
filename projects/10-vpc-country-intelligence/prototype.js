/* Views and decision rules adapted from the user-supplied HTML. */
(function(){
window.COUNTRY_PROTOTYPE=function(state,role){

  var tv=document.createElement('div'), tab=document.createElement('div'), tvstate=document.createElement('span');
  var SIG=[
    ['Budget','Government','b',[0,2]],['Regulation','Government','b',[1,3]],['Official communications','Government','b',[0,4]],['Citizen interest','Public','b',[2,4]],
    ['Partner activity','Other multilaterals','g',[1,2]],['Portfolio & results data','Bank systems','p',[0,1,3]],['Review findings · PCRs · OVE','Lessons learned','p',[2,3]],['Team expertise','Country office','p',[4,0]]
  ];
  var POS=[[0,26],[0,52],[3,78],[22,84],[66,84],[83,64],[83,38],[66,8]];
  var SECT=['Water & sanitation','Digital government','Energy transition','Fiscal management','Transport'];
  var M=[
    {t:'Design the strategy',q:'Where should the Bank focus in Country A?',man:'~5 weeks',ai:'~3 days',manU:'Week',manN:5,aiU:'Day',aiN:3,
     freedBig:'~4 weeks',freedSmall:'Time freed per strategy',opp:'Evidence-based sector scores and a sharper dialogue with the government on where to focus.',
     ask:'AI ranked the sectors with evidence. As the country team, which one leads the dialogue?',opts:['Water & sanitation','Digital government','Energy transition']},
    {t:'Program the offer',q:'What should we offer now, and with whom?',man:'weeks',ai:'hours',manU:'Week',manN:4,aiU:'Hour',aiN:6,
     freedBig:'Weeks → hours',freedSmall:'To map opportunity areas',opp:'Reform and PBL openings spotted early, while there is still time to act.',
     ask:'AI mapped where to act, partner or build. Which opportunity goes to the next dialogue?',opts:['Fiscal reform (PBL)','Urban mobility, with a partner','Data infrastructure']},
    {t:'Supervise and evaluate',q:'Is the portfolio delivering, and what must change?',man:'~4 days',ai:'~6 hours',manU:'Day',manN:4,aiU:'Hour',aiN:6,
     freedBig:'~3 days',freedSmall:'Time freed per portfolio review',opp:'Less time preparing the dialogue with executing units and authorities, more time having it.',
     ask:'AI grouped risks across the whole portfolio. Which action do you take?',opts:['Reinforce executing units','Fast-track procurement','Adjust the results matrix']}
  ];
  var S=state;
  function trail(i){var n=['Problem','Solution','Signals','Design','Program','Supervise','Loop'];return '<div class="trail">'+n.map(function(x,k){return '<span class="'+(k===i?'on':'')+'">'+x+'</span>';}).join('')+'</div>';}
  function hdr(i){return '<div class="hdr"><span class="pj">AI in Action · VPC Country Intelligence</span>'+(i!=null?trail(i):'')+'</div>';}
  function foot(extra){return '<div class="foot"><span><b>Simulation</b> of how the tool works. Not real data.'+(extra?' '+extra:'')+'</span><span>VPC + TTD · VPC AI Agenda</span></div>';}
  function tsteps(i){var s='<div class="tb-steps">';for(var k=0;k<6;k++)s+='<i class="'+(k<=i?'on':'')+'"></i>';return s+'</div>';}

  function render(){

    var sc=S.sc, h='', t='';
    tv.className='tv';
    if(sc==='problem'){
      tvstate.textContent='0 · El problema';
      h=hdr(0)+'<div class="scene"><div class="ficha"><div class="l"><span class="k in">The problem</span><h2 class="H in d1">Every Country Strategy begins with a hard question</h2><p class="sub in d2" style="font-size:2.3cqw;font-weight:600;color:#89B4FF">Where should the Bank focus in this country, and is that focus still right?</p><p class="sub in d5" style="font-size:1.5cqw">Answering it well needs current, shared knowledge of what the country needs, what the government prioritizes, what the portfolio delivers and where risks emerge.</p></div>'+
        '<div class="stats"><div class="pcard in d2"><b>8–10 months</b><span>to design a Country Strategy</span></div><div class="pcard in d3"><b>~4 days</b><span>to prepare each portfolio review by hand, twice a year in every country</span></div><div class="pcard in d4"><b>Scattered</b><span>signals across systems, documents and people; findings rarely return to strategy</span></div></div></div></div>'+foot();
    }
    else if(sc==='ficha'){
      tv.classList.add('blue'); tvstate.textContent='1 · La solución (ficha)';
      h=hdr(1)+'<div class="scene"><div class="ficha"><div class="l"><span class="k in">The solution · VPC Country Intelligence</span><h2 class="H in d1">From scattered signals to strategic country knowledge</h2><p class="sub in d2">AI agents gather and connect country, portfolio and partner evidence, so IDB country teams can design, program and supervise Country Strategies with current knowledge.</p>'+
        '<div class="gpd in d5"><span><i>G</i>Human in the loop: AI proposes, teams decide</span><span><i>P</i>Co-designed with country teams</span><span><i>D</i>One sector taxonomy for all signals</span></div></div>'+
        '<div class="stats"><div class="stat in d2"><b>8+</b><span>agentic AI experiments across the Country Strategy cycle</span></div><div class="stat in d3"><b>4 regions</b><span>where the experiments were tested</span></div><div class="stat in d4"><b>4 days → 6 hours</b><span>to prepare a country portfolio review</span></div></div></div></div>'+foot();
      t='<div class="tb-h"><span>Country Intelligence</span><span>Start</span></div>'+tsteps(0)+'<div class="tb-b"><h3>Every Country Strategy begins with a hard question</h3><p>Where should the Bank focus in this country, and is that focus still right? Explore how AI helps country teams answer it.</p></div><div class="tb-f"><button class="btn wide" type="button" data-go="sig">Start</button></div>';
    }
    else if(sc==='sig'){
      tvstate.textContent='1 · Señales dispersas';
      var all=S.con.length===SIG.length;
      var lines='',cards='';
      SIG.forEach(function(s,i){var on=S.con.indexOf(i)>-1;var p=POS[i];
        cards+='<div class="card'+(on?' on':'')+'" style="left:'+p[0]+'%;top:'+p[1]+'%"><small>'+s[1]+'</small>'+s[0]+'</div>';
        if(!on)lines+='<line x1="'+(p[0]+8)+'" y1="'+(p[1]+4)+'" x2="50" y2="40"/>';
      });
      var rows=SECT.map(function(name,r){var d='';S.con.forEach(function(i){if(SIG[i][3].indexOf(r)>-1)d+='<i class="'+SIG[i][2]+'"></i>';});return '<div class="trow"><span>'+name+'</span><div class="dots">'+d+'</div></div>';}).join('');
      h=hdr(2)+'<div class="scene"><div class="sigwrap"><svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'+lines+'</svg>'+
        '<div class="sig-title"><span class="k">How it works</span><h3 style="font-weight:900;font-size:2.4cqw;line-height:1.15">'+(all?'One shared view of Country A, on a single sector taxonomy.':'Knowledge is rebuilt by hand at each stage of the cycle.')+'</h3></div>'+
        '<div class="clock'+(all?' ok':'')+'">'+(all?'Review inputs ready in about 6 hours':'Portfolio review in 4 days')+'</div>'+
        cards+'<div class="view'+(all?' full':'')+'"><h4>Country A view <small>'+S.con.length+' of '+SIG.length+' signals connected</small></h4><div class="tax">'+rows+'</div><div class="legend"><span><i style="background:#005CFF"></i>Government & public</span><span><i style="background:#89B4FF"></i>Partners</span><span><i style="background:#141414"></i>Bank & team</span></div></div>'+
        '</div></div>'+foot();
      t='<div class="tb-h"><span>The challenge</span><span>1 of 5</span></div>'+tsteps(1)+'<div class="tb-b"><h3>Connect the signals</h3><p>Signals sit in separate systems, documents and people. Tap each one and watch AI agents place it in one country view.</p><div class="chips">'+
        SIG.map(function(s,i){var on=S.con.indexOf(i)>-1;return '<button class="chip'+(on?' on':'')+'" type="button" data-sig="'+i+'" aria-pressed="'+on+'">'+s[0]+'</button>';}).join('')+
        '</div></div><div class="tb-f"><button class="btn sec" type="button" data-all="1" '+(all?'disabled':'')+'>Connect all</button><button class="btn" type="button" data-go="m0" '+(all?'':'disabled')+'>Next</button></div>';
    }
    else if(sc.charAt(0)==='m'){
      var k=+sc.charAt(1), m=M[k], ph=S.ph[k]||'ready', pk=S.pk[k], p=S.p[k]||0;
      tv.classList.add('light'); tvstate.textContent=(k+2)+' · Momento '+(k+1)+' · '+m.t;
      var aiP=Math.min(1,p*5), manP=p;
      var manT=ph==='ready'?'—':m.manU+' '+Math.max(1,Math.ceil(manP*m.manN))+' of '+m.manN;
      var aiT=ph==='ready'?'—':(aiP<1?m.aiU+' '+Math.max(1,Math.ceil(aiP*m.aiN)):'Done in '+m.ai);
      var manBody=manView(k,manP,ph), aiBody=aiView(k,aiP,ph,pk);
      h=hdr(k+3)+'<div class="scene"><div class="mscene"><div class="mhead"><span class="mnum">'+(k+1)+'</span><div><h2 class="mh">'+m.t+'</h2><p class="mq">'+m.q+'</p></div></div>'+
        '<div class="split"><div class="pane man"><div class="ptop"><span class="tagm">Without AI · manual</span><span class="timer">'+manT+'</span></div><div class="pbody">'+manBody+'</div><div><div class="track"><i style="width:'+(manP*100)+'%"></i></div><p style="font-size:1cqw;margin-top:.5cqw">Typical time: '+m.man+(ph==='done'&&manP>=1?'':'')+'</p></div></div>'+
        '<div class="pane ai"><div class="ptop"><span class="tagm">With AI · agents gather, the team decides</span><span class="timer">'+aiT+'</span></div><div class="pbody">'+aiBody+'</div><div><div class="track"><i style="width:'+(aiP*100)+'%"></i></div><p style="font-size:1cqw;margin-top:.5cqw;color:#6A6B6F">With AI: '+m.ai+'</p></div></div></div>'+
        (ph==='done'?'<div class="freed"><div class="big"><small>'+m.freedSmall+'</small>'+m.freedBig+'</div><div class="opp"><b>What the freed time opens</b>'+m.opp+'</div><div class="note">Illustrative simulation values from the supplied prototype; not validated results.</div></div>':'<div class="freed wait">'+(ph==='run'?'Comparing both processes…':'Run both processes on the tablet to see the time freed and what it opens.')+'</div>')+'</div></div>'+
        foot();
      var tb='';
      if(ph==='ready'){tb='<h3>'+m.q+'</h3><p>Run the same work twice: the manual way and with AI agents. Watch both on the screen.</p>';}
      else if(ph==='run'){tb='<h3>Running…</h3><p class="status">Both processes are running on the screen.</p>';}
      else{tb='<h3>You are the country team</h3><p>'+m.ask+'</p><div style="display:grid;gap:8px">'+m.opts.map(function(o,i){return '<button class="choice'+(pk===i?' on':'')+'" type="button" data-pick="'+i+'" aria-pressed="'+(pk===i)+'">'+o+'</button>';}).join('')+'</div>';}
      var fbtn=ph==='ready'?'<button class="btn" type="button" data-run="1">Run both</button>':'<button class="btn" type="button" data-go="'+(k===2?'loop':'m'+(k+1))+'" '+(pk==null?'disabled':'')+'>'+(k===2?'Close the loop':'Next moment')+'</button>';
      t='<div class="tb-h"><span>Moment '+(k+1)+' · '+m.t+'</span><span>'+(k+2)+' of 5</span></div>'+tsteps(k+2)+'<div class="tb-b">'+tb+'</div><div class="tb-f"><button class="btn sec" type="button" data-go="'+(k===0?'sig':'m'+(k-1))+'">Back</button>'+fbtn+'</div>';
    }
    else if(sc==='loop'){
      tv.classList.add('blue'); tvstate.textContent='5 · Cierre';
      var ch=M.map(function(m,i){return m.opts[S.pk[i]]||'';});
      h=hdr(6)+'<div class="scene"><div class="close"><div class="cyc in">'+
        '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="ring" cx="50" cy="50" r="36"/><circle class="arc" cx="50" cy="50" r="36" stroke-dasharray="226" transform="rotate(-90 50 50)"><animate attributeName="stroke-dashoffset" from="226" to="0" dur="1.6s" fill="freeze"/></circle></svg>'+
        '<div class="ctr"><div><b>Continuous</b><small>country knowledge</small></div></div>'+
        '<div class="node" style="left:50%;top:2%"><b>1 · Design</b><span>'+ch[0]+'</span></div><div class="node" style="left:95%;top:76%"><b>2 · Program</b><span>'+ch[1]+'</span></div><div class="node" style="left:5%;top:76%"><b>3 · Supervise</b><span>'+ch[2]+'</span></div></div>'+
        '<div class="sum"><span class="k in">Findings feed back into strategy</span><div class="srow in d1"><span>Portfolio alignment</span><b>~5 weeks → ~3 days</b></div><div class="srow in d2"><span>Programmatic opportunity areas</span><b>weeks → hours</b></div><div class="srow in d3"><span>Portfolio review presentation</span><b>~4 days → ~6 hours</b></div>'+
        '<p class="msg in d4">AI does the gathering; country teams do the judging.</p><p class="in d5" style="font-size:1.2cqw;opacity:.9">More than eight experiments explore this cycle. This is not a single deployed system.</p></div></div></div>'+foot('Illustrative simulation values; not validated results.');
      t='<div class="tb-h"><span>Close the loop</span><span>5 of 5</span></div>'+tsteps(5)+'<div class="tb-b"><h3>From a periodic exercise to a continuous loop</h3><p>What supervision learns now returns to strategy, so the Bank’s knowledge of each country stays current.</p></div><div class="tb-f"><button class="btn wide" type="button" data-reset="1">Start again</button></div>';
    }
    tv.innerHTML=h; tab.innerHTML=tabView();
  }

  var IC={
    budget:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16" stroke="currentColor"/><path d="M7 16v-5M12 16V7M17 16v-8" stroke="currentColor"/><path d="M17 8v0" stroke="#005CFF"/><circle cx="17" cy="5" r="1.6" stroke="#005CFF"/></svg>',
    reg:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l3 3v15H6z" stroke="currentColor"/><path d="M9 10h6M9 14h6" stroke="#005CFF"/></svg>',
    comms:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h3l6 4V6L7 10z" stroke="currentColor"/><path d="M17 9a4 4 0 0 1 0 6" stroke="#005CFF"/></svg>',
    people:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3" stroke="currentColor"/><path d="M3 20a6 6 0 0 1 12 0" stroke="currentColor"/><path d="M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 6" stroke="#005CFF"/></svg>',
    partner:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="5" stroke="currentColor"/><circle cx="15" cy="12" r="5" stroke="#005CFF"/></svg>',
    data:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16h16" stroke="currentColor"/><path d="M7 15l4-4 3 3 5-6" stroke="#005CFF"/></svg>',
    review:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="6" stroke="currentColor"/><path d="M20 20l-5.5-5.5" stroke="currentColor"/><path d="M7.5 10l2 2 3-3.5" stroke="#005CFF"/></svg>',
    team:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5" stroke="currentColor"/><path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor"/><path d="M12 15v3" stroke="#005CFF"/></svg>',
    link:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1" stroke="currentColor"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" stroke="#005CFF"/></svg>',
    split:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="8" height="14" rx="2" stroke="currentColor"/><rect x="13" y="5" width="8" height="14" rx="2" stroke="#005CFF"/></svg>',
    decide:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8" stroke="currentColor"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke="#005CFF"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    redo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4"/></svg>'
  };
  var SIGIC=['budget','reg','comms','people','partner','data','review','team'];
  var SUBS=[['Ranked #1 · 12 sources','Ranked #2 · 9 sources','Ranked #3 · 8 sources'],['Act · reform window open','Partner · with other multilaterals','Build · grow capacity'],['High · 4 operations','High · 3 sectors','Medium · 2 operations']];
  function stepIdx(){var sc=S.sc;if(sc==='problem')return 0;if(sc==='ficha')return 1;if(sc==='sig')return 2;if(sc==='loop')return 6;return +sc.charAt(1)+3;}
  function tabView(){
    var sc=S.sc,cur=stepIdx(),names=['Problem','Solution','Signals','Design','Program','Supervise','Loop'];
    var stp='<nav class="stp" aria-label="Progress">'+names.map(function(n,i){var c=i<cur?'done':(i===cur?'cur':'');return '<div class="'+c+'"><b>'+(i<cur?'✓':i+1)+'</b>'+n+'</div>';}).join('')+'</nav>';
    var ab='<header class="ab"><div class="ab-top"><span>AI in Action · VPC + TTD</span><span class="live"><i></i>On screen</span></div><div class="ab-t">Country Intelligence</div></header>';
    var ct='',bb='';
    if(sc==='problem'){
      return '<div class="app solo"><div class="solo-h"><span>AI in Action · Country Intelligence</span><span class="live"><i></i>On screen</span></div>'+
        '<main class="ct"><div class="pq"><span class="lbl">Explore the project</span><h3>Every Country Strategy begins with a hard question</h3><p>Where should the Bank focus in this country, and is that focus still right?</p></div>'+
        '<div class="pains grow"><div class="pain"><span class="ico">'+IC.redo+'</span><b>Rebuilt by hand at every stage</b><span>Signals sit in separate systems, documents and people.</span></div>'+
        '<div class="pain"><span class="ico">'+IC.data+'</span><b>Findings rarely return to strategy</b><span>Lessons from reviews and evaluations are not reused.</span></div>'+
        '<div class="pain"><span class="ico">'+IC.people+'</span><b>Little time for the dialogue</b><span>Each portfolio review takes about 4 days to prepare.</span></div></div></main>'+
        '<footer class="bb one"><button class="cta" type="button" data-go="ficha">See the solution '+IC.next+'</button></footer></div>';
      ct='<div class="hero"><span class="lbl">Explore the project</span><div class="ttl">Every Country Strategy begins with a hard question</div><p class="txt">Where should the Bank focus in this country, and is that focus still right?</p></div>'+
        '<div class="steps3 grow"><div class="s3"><span class="ico">'+IC.redo+'</span><div><b>Rebuilt by hand at every stage</b><span>Signals sit in systems, documents and people</span></div></div>'+
        '<div class="s3"><span class="ico">'+IC.data+'</span><div><b>Findings rarely return to strategy</b><span>Lessons are not reused</span></div></div>'+
        '<div class="s3"><span class="ico">'+IC.people+'</span><div><b>Little time for the dialogue</b><span>Preparing each review takes about 4 days</span></div></div></div>';
      bb='<footer class="bb one"><button class="cta" type="button" data-go="ficha">See the solution '+IC.next+'</button></footer>';
    }
    else if(sc==='ficha'){
      ct='<div class="hero"><span class="lbl">The solution</span><div class="ttl">AI agents that gather and connect the evidence</div><p class="txt">AI does the gathering; country teams do the judging. Here is how it works:</p></div>'+
        '<div class="steps3 grow"><div class="s3"><span class="ico">'+IC.link+'</span><div><b>Connect scattered signals</b><span>8 sources into one country view</span></div></div>'+
        '<div class="s3"><span class="ico">'+IC.split+'</span><div><b>Compare without and with AI</b><span>3 moments of the cycle</span></div></div>'+
        '<div class="s3"><span class="ico">'+IC.decide+'</span><div><b>Decide as the country team</b><span>AI proposes, you judge</span></div></div></div>';
      bb='<footer class="bb"><button class="ib" type="button" aria-label="Back" data-go="problem">'+IC.back+'</button><button class="cta" type="button" data-go="sig">Start exploring '+IC.next+'</button></footer>';
    }
    else if(sc==='sig'){
      var n=S.con.length,all=n===SIG.length,C=2*Math.PI*21;
      ct='<div class="cardx"><div class="sghead"><div><span class="lbl">Step 3 · How it works</span><div class="ttl">Connect the signals</div></div><div class="ring"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="21" fill="none" stroke="#EBEDF7" stroke-width="6"/><circle cx="26" cy="26" r="21" fill="none" stroke="#005CFF" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+(C*(1-n/SIG.length))+'"/></svg><b>'+n+'/'+SIG.length+'</b></div></div><p class="txt">'+(all?'All signals are in one country view.':'Tap each source to connect it.')+'</p></div>'+
        '<div class="tiles grow">'+SIG.map(function(s,i){var on=S.con.indexOf(i)>-1;return '<button class="tile2'+(on?' on':'')+'" type="button" data-sig="'+i+'" aria-pressed="'+on+'"><span class="ico">'+IC[SIGIC[i]]+'</span><span>'+s[0]+'<small>'+s[1]+'</small></span></button>';}).join('')+'</div>';
      bb='<footer class="bb"><button class="cta sec" type="button" data-all="1" '+(all?'disabled':'')+'>Connect all</button><button class="cta" type="button" data-go="m0" '+(all?'':'disabled')+'>Next '+IC.next+'</button></footer>';
    }
    else if(sc.charAt(0)==='m'){
      var k=+sc.charAt(1),m=M[k],ph=S.ph[k]||'ready',pk=S.pk[k],p=S.p[k]||0,aiP=Math.min(1,p*5);
      var back='<button class="ib" type="button" aria-label="Back" data-go="'+(k===0?'sig':'m'+(k-1))+'">'+IC.back+'</button>';
      var cmp='<div class="cmp'+(ph==='ready'?'':' grow')+'"><div class="a"><span class="lbl">Without AI</span><strong>'+m.man+'</strong><div class="mini"><i style="width:'+(p*100)+'%"></i></div><small>'+(ph==='ready'?'Manual process':(p<1?m.manU+' '+Math.max(1,Math.ceil(p*m.manN))+' of '+m.manN:'Finished'))+'</small></div>'+
        '<div class="b"><span class="lbl">With AI</span><strong>'+m.ai+'</strong><div class="mini"><i style="width:'+(aiP*100)+'%"></i></div><small>'+(ph==='ready'?'Agents gather evidence':(aiP<1?'Gathering…':'Done ✓'))+'</small></div></div>';
      if(ph==='ready'){
        ct='<div class="cardx"><span class="lbl">Moment '+(k+1)+' of 3</span><div class="ttl">'+m.t+'</div><p class="txt">'+m.q+'</p></div>'+cmp+
          '<div class="grow" style="display:grid;place-items:center"><button class="play" type="button" data-run="1">'+IC.play+'Run both</button></div>';
        bb='<footer class="bb">'+back+'<button class="cta" type="button" disabled>Next '+IC.next+'</button></footer>';
      } else if(ph==='run'){
        ct='<div class="cardx"><span class="lbl">Moment '+(k+1)+' of 3</span><div class="ttl">'+m.t+'</div><p class="txt">Same work, two ways. Watch the screen.</p></div>'+cmp+'<div class="runn"><i></i>Running on the screen</div>';
        bb='<footer class="bb">'+back+'<button class="cta" type="button" disabled>Next '+IC.next+'</button></footer>';
      } else {
        ct='<div class="freedc"><strong>'+m.freedBig+'</strong><span>'+m.freedSmall+'<small>Illustrative simulation values</small></span></div>'+
          '<div class="cardx" style="padding:10px 14px;gap:2px"><span class="lbl">You are the country team</span><p class="txt" style="color:#141414">'+m.ask+'</p></div>'+
          '<div class="opts2 grow">'+m.opts.map(function(o,i){return '<button class="opt2'+(pk===i?' on':'')+'" type="button" data-pick="'+i+'" aria-pressed="'+(pk===i)+'"><span>'+o+'<small>'+SUBS[k][i]+'</small></span><span class="rd">'+(pk===i?'✓':'')+'</span></button>';}).join('')+'</div>';
        bb='<footer class="bb">'+back+'<button class="cta" type="button" data-go="'+(k===2?'loop':'m'+(k+1))+'" '+(pk==null?'disabled':'')+'>'+(pk==null?'Choose one':(k===2?'Close the loop':'Next moment'))+' '+IC.next+'</button></footer>';
      }
    }
    else if(sc==='loop'){
      ct='<div class="cardx"><span class="lbl">Step 7 · The loop</span><div class="ttl">From a periodic exercise to a continuous loop</div></div>'+
        '<div class="cardx grow" style="grid-template-rows:auto 1fr"><span class="lbl">Your decisions</span><div class="dl grow">'+M.map(function(m,i){return '<div><b>'+(i+1)+'</b><span>'+(m.opts[S.pk[i]]||'—')+'<small>'+m.t+'</small></span></div>';}).join('')+'</div></div>'+
        '<div class="freedc"><strong>Days, not weeks</strong><span>to design, program and supervise<small>Illustrative simulation values</small></span></div>';
      bb='<footer class="bb"><button class="ib" type="button" aria-label="Back" data-go="m2">'+IC.back+'</button><button class="cta" type="button" data-reset="1">Start again '+IC.redo+'</button></footer>';
    }
    var nav=stp;
    return '<div class="app"><aside class="side">'+ab+nav+'<p class="side-f">Simulation of how the tool works. Not real data.</p></aside><main class="ct">'+ct+'</main>'+bb+'</div>';
  }

  function manView(k,p,ph){
    if(k===0){var n=16,r=Math.floor(p*n),s='<div class="docs">';for(var i=0;i<n;i++)s+='<div class="doc'+(i<r?' r':'')+'"></div>';
      return s+'</div><p style="font-size:1.15cqw">Diagnostics, government plans and Bank priorities compiled by hand. Alignment checked one operation at a time, with each team’s own criteria.</p>';}
    if(k===1){var cols=['Budget','Regulation','Official comms','Citizen interest','Partners'],rr=Math.floor(p*5);
      return '<div class="cols">'+cols.map(function(c,i){return '<div class="col'+(i<rr?' r':'')+'"><b>'+c+'</b>'+(i<rr?'read':'')+'</div>';}).join('')+'</div><p style="font-size:1.15cqw">Signals tracked informally and seldom read together.</p>'+(ph==='done'?'<span class="wait-chip">Reform opportunity spotted late</span>':'');}
    var x=Math.min(p,1);
    return '<div class="tl"><div class="axis"></div>'+[0,3,6,9,12].map(function(mo){return '<span class="m" style="left:'+(mo/12*100)+'%">M'+mo+'</span>';}).join('')+'<div class="rev" style="left:50%"><span>Semiannual review</span></div>'+(x>.55?'<div class="alert late" style="left:50%">!<small>Risk found at M6</small></div>':'')+'</div><p style="font-size:1.15cqw">Evaluability analysis on every operation, then about 4 days to assemble the review by hand.</p>';
  }
  function aiView(k,p,ph,pk){
    var shown=ph!=='ready';
    if(k===0){var data=[['Water & sanitation',86,12],['Digital government',74,9],['Energy transition',69,8],['Transport',52,6],['Health',47,5]],opt=M[0].opts;
      var s='<div class="rank">'+data.map(function(d,i){var w=shown?Math.min(1,p*1.2)*d[1]:0;var pick=pk!=null&&opt[pk]===d[0];return '<div class="rk'+(i===0?' top':'')+(pick?' pick':'')+'"><b>'+(i+1)+'</b><span>'+d[0]+'</span><div class="bar"><i style="width:'+w+'%"></i></div><em>'+(shown&&p>=1?d[2]+' sources':'')+'</em></div>';}).join('')+'</div>';
      if(shown&&p>=1)s+='<div class="ev"><span>Country priorities</span><span>Bank strategy</span><span>Diagnostics</span><span>Other multilaterals</span></div><div class="gap"><b>Alignment gap:</b> 2 of 24 operations miss expected results.</div>';
      if(pk!=null)s+='<span class="done-chip">✓ Country team chose '+opt[pk]+'</span>';
      return s;}
    if(k===1){var z=[['Act','Bank leads',['Fiscal reform (PBL)','Water utilities']],['Partner','With others',['Urban mobility, with a partner','Health systems']],['Build','Grow capacity',['Data infrastructure','Skills for the AI economy']]],o1=M[1].opts;
      var s2='<div class="map">'+z.map(function(x){return '<div class="zone"><h5>'+x[0]+'<small>'+x[1]+'</small></h5>'+(shown&&p>=.4?x[2].map(function(t){var pick=pk!=null&&o1[pk]===t;return '<span class="tile'+(pick?' pick':'')+'">'+t+'</span>';}).join(''):'')+'</div>';}).join('')+'</div>';
      if(shown&&p>=1)s2+='<div class="flag">Early signal: new fiscal regulation opens a window for a reform operation.</div>';
      if(pk!=null)s2+='<span class="done-chip">✓ '+o1[pk]+' goes to the next dialogue</span>';
      return s2;}
    var o2=M[2].opts,x=shown?p:0;
    var s3='<div class="tl"><div class="axis"></div><div class="pulse" style="left:0;width:'+(x*100)+'%"></div>'+[0,3,6,9,12].map(function(mo){return '<span class="m" style="left:'+(mo/12*100)+'%">M'+mo+'</span>';}).join('')+(x>.2?'<div class="alert early" style="left:16.7%">!<small>Early warning at M2</small></div>':'')+'</div>';
    if(shown&&p>=1){var th=[['Executing units need support in 4 operations','High','h',0],['Procurement delays across 3 sectors','High','h',1],['Critical outputs at risk in 2 operations','Medium','m',2]];
      s3+='<div class="themes">'+th.map(function(t){return '<div class="th'+(pk===t[3]?' pick':'')+'"><span>'+t[0]+'</span><em class="'+t[2]+'">'+t[1]+'</em></div>';}).join('')+'</div>';}
    if(pk!=null)s3+='<span class="done-chip">✓ '+o2[pk]+'. Findings return to strategy.</span>';
    return s3;
  }


render();return role==='display'?{html:tv.innerHTML,className:tv.className}:{html:tab.innerHTML,className:'tab'};
};
})();
