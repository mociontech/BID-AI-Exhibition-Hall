/* Layout audit of every bilingual state at both landscape tablet sizes and TV. */
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const S=require('./state.js'),C=require('./data/demo-maps.json');
(async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 const findings=[],errors=[],checked=[],out=path.join(__dirname,'verification');
 try{
  for(const [name,width,height,readonly] of [['tablet',1024,768,false],['tablet-large',1180,820,false],['tablet-fullscreen',1920,1200,false],['tablet-small',800,600,false],['tablet-portrait',768,1024,false],['tablet-split',764,830,false],['tablet-split-large',955,1038,false],['tv',1920,1080,true],['tv-small',1280,720,true]]){
   const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/api/state?*',r=>r.fulfill({json:{view:'home',projectId:null}}));
   await page.goto((process.env.TEST_URL||'http://localhost:4197')+'/display.html?station=7');
   await page.waitForTimeout(400);
   await page.evaluate(()=>MAIIA.ready);
   for(const language of ['es','en'])for(const phase of ['landing','info',...S.phases]){
    const markers=C.hard.reference.slice(0,2).map(z=>[0,1].map(i=>z.points.reduce((n,p)=>n+p[i],0)/z.points.length));
    const g={...S.fresh(true),phase:S.phases.includes(phase)?phase:'intro',polygons:C.easy.reference.map(z=>z.points),draft:[],markers,selected:['C1','C3','C6'],easyScore:100,manual:S.manual(markers,C),assisted:S.assisted(['C1','C3','C6'],C),analysisAt:Date.now()-1500};
    const state={view:'game',projectId:'07',language,mode:phase==='landing'?'landing':phase==='info'?'info':'game',game:g};
    await page.evaluate(({state,readonly})=>MAIIA.renderInto(document.getElementById('app'),state,{readonly}),{state,readonly});
    await page.evaluate(()=>document.fonts.ready);
    const result=await page.evaluate(()=>{
     const rect=n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};},main=rect(document.querySelector('.mai-main'));
     const selectors='.mai-copy,.mai-map-column,.mai-info-overview>article,.mai-info-map,.mai-workflow,.mai-benefits,.mai-human,.mai-scorecard,.mai-final-message,.mai-options,.mai-landing-copy,.mai-controller-heading,.mai-controller-canvas,.mai-controller-canvas .mai-map-frame,.mai-controller-toolbar,.mai-controller-wait,.mai-controller-intro,.mai-controller-summary';
     const clipped=[...document.querySelectorAll(selectors)].filter(n=>{const r=rect(n);return r.top<main.top-2||r.bottom>main.bottom+2||r.left<main.left-2||r.right>main.right+2;}).map(n=>({class:n.className,...rect(n)}));
     const overlap=[];
     const upper=document.querySelector('.mai-info-overview'),lower=document.querySelector('.mai-info-lower');
     if(upper&&lower)for(const n of upper.children)if(rect(n).bottom>rect(lower).top)overlap.push(n.className||n.tagName);
     const canvas=document.querySelector('.mai-controller-canvas'),toolbar=document.querySelector('.mai-controller-toolbar');
     if(canvas&&toolbar&&rect(canvas).bottom>rect(toolbar).top)overlap.push('controller canvas/toolbar');
     if(canvas){const image=document.querySelector('.mai-controller-canvas .mai-map');if(!image||image.getBoundingClientRect().height<160)overlap.push('map collapsed or absent');}
     return {sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,main,clipped,overlap};
    });
    if(result.sw>width+1||result.sh>height+1||result.clipped.length||result.overlap.length)findings.push({name,language,phase,...result});
    checked.push(`${name}/${language}/${phase}`);
    if((name==='tv'&&['info','easyResult','final','assisted','analysis'].includes(phase))||(['tablet','tablet-split'].includes(name)&&language==='es'&&['intro','easy','manual','assisted','final'].includes(phase)))await page.screenshot({path:path.join(out,`audit-${name}-${phase}-${language}.png`),fullPage:true});
   }
   await page.close();
  }
 }finally{await browser.close();}
 const report={passed:findings.length===0&&errors.length===0,statesChecked:checked.length,findings,errors};
 fs.writeFileSync(path.join(out,'visual-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
