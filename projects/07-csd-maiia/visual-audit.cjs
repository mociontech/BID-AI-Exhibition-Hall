/* Approved artwork alignment, live data and touch targets at nine sizes. */
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const S=require('./state.js'),C=require('./data/demo-maps.json');
(async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 const findings=[],errors=[];let checked=0;
 try{
  for(const [width,height,readonly] of [[1024,768,false],[1180,820,false],[1920,1200,false],[800,600,false],[768,1024,false],[764,830,false],[955,1038,false],[1920,1080,true],[1280,720,true]]){
   const page=await browser.newPage({viewport:{width,height}});
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/api/state?*',r=>r.fulfill({json:{view:'home',projectId:null}}));
   await page.goto((process.env.TEST_URL||'http://localhost:4199')+'/display.html?station=7');
   await page.evaluate(()=>MAIIA.ready);await page.waitForTimeout(500);
   for(const phase of ['landing','info',...S.phases]){
    const markers=C.hard.reference.slice(0,2).map(z=>[0,1].map(i=>z.points.reduce((n,p)=>n+p[i],0)/z.points.length));
    const game={...S.fresh(true),phase:S.phases.includes(phase)?phase:'intro',polygons:C.easy.reference.map(z=>z.points),markers,selected:['C1','C3','C6'],easyScore:100,manual:S.manual(markers,C),assisted:S.assisted(['C1','C3','C6'],C),analysisAt:Date.now()-1500};
    if(['landing','info','intro','easy','easyResult','manual'].includes(phase))game.manual=null;
    if(phase!=='final')game.assisted=null;
    await page.evaluate(({game,phase,readonly})=>MAIIA.renderInto(document.getElementById('app'),{projectId:'07',language:'es',mode:['landing','info'].includes(phase)?phase:'game',game},{readonly}),{game,phase,readonly});
    await page.locator('.mai-approved-art').evaluate(img=>img.decode());await page.evaluate(()=>document.fonts.ready);
    const issues=await page.evaluate(({width,height,readonly})=>{
     const issues=[],scale=Math.min(width/1920,height/1080),board=document.querySelector('.mai-artboard').getBoundingClientRect();
     const img=document.querySelector('.mai-approved-art');
     if(img.naturalWidth!==1920||img.naturalHeight!==1080)issues.push('original artwork dimensions');
     if(Math.abs(board.width-1920*scale)>1||Math.abs(board.height-1080*scale)>1||board.left<-.5||board.top<-.5)issues.push('proportional board bounds');
     if(document.documentElement.scrollWidth>width||document.documentElement.scrollHeight>height)issues.push('page overflow');
     if(document.documentElement.lang!=='en'||document.querySelector('button[data-language]'))issues.push('English production language');
     for(const n of document.querySelectorAll('.mai-art-hit')){
      const r=n.getBoundingClientRect();if(r.width<44||r.height<44)issues.push('touch target '+n.dataset.action);
      if(r.left<0||r.top<0||r.right>width+1||r.bottom>height+1)issues.push('clipped target '+n.dataset.action);
     }
     if(readonly&&document.querySelector('[data-action],[data-map],[data-candidate]'))issues.push('TV must stay passive');
     for(const n of document.querySelectorAll('.mai-art-patch,.mai-tv-copy'))if(n.scrollWidth>n.clientWidth+1||n.scrollHeight>n.clientHeight+1)issues.push('clipped live data '+n.className);
     const map=document.querySelector('.mai-art-map');
     if(map){const r=map.getBoundingClientRect(),svg=map.querySelector('svg.mai-map').getBoundingClientRect();if(Math.abs(r.width-svg.width)>1||Math.abs(r.height-svg.height)>1)issues.push('map and input bounds diverge');
      if(Math.abs(r.width/r.height-16/9)>.003)issues.push('map aspect ratio changed');
      const copy=document.querySelector('.mai-tv-copy');
      if(copy){const c=copy.getBoundingClientRect();if(r.right>c.left||r.width/board.width<.67)issues.push('TV map must be large and left of the text');}
      for(const n of document.querySelectorAll('.mai-art-hit')){const c=n.getBoundingClientRect();if(c.left<r.right&&c.right>r.left&&c.top<r.bottom&&c.bottom>r.top)issues.push('control overlaps map '+n.dataset.action);}
     }
     return issues;
    },{width,height,readonly});
    if(issues.length)findings.push({width,height,readonly,phase,issues});checked++;
   }
   await page.close();
  }
 }finally{await browser.close();}
 console.log(JSON.stringify({passed:!findings.length&&!errors.length,statesChecked:checked,findings,errors},null,2));
 assert.deepEqual(findings,[]);assert.deepEqual(errors,[]);
})().catch(e=>{console.error(e);process.exitCode=1;});
