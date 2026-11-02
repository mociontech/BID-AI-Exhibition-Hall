/* Browser QA for every bilingual screen. Run with the same NODE_PATH as verify.cjs. */
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const S=require('./state.js');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const base=process.env.TEST_URL||'http://localhost:4186',out=path.join(__dirname,'verification','redesign');fs.mkdirSync(out,{recursive:true});
 const findings=[],errors=[];
 let sessionTimes=[null,null];try{sessionTimes=JSON.parse(fs.readFileSync(path.join(__dirname,'verification','report.json'),'utf8')).sessionTimes;}catch{}
 try{
  for(const [name,width,height,readonly] of [['tablet',1024,768,false],['tablet-large',1180,820,false],['tv',1920,1080,true]]){
   const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/display.html?station=6');await page.waitForTimeout(400);
   // Freeze the display receiver while exercising the real renderer in isolation.
   await page.route('**/api/state?*',r=>r.abort());
   for(const language of ['es','en'])for(const phase of ['landing','info',...S.phases]){
    const state={view:'game',projectId:'06',language,mode:phase==='landing'?'landing':phase==='info'?'info':'game',game:{...S.fresh(true),phase:S.phases.includes(phase)?phase:'intro',elapsed:sessionTimes,outcomes:[true,true],selected:['manual','confirm'].includes(phase)?['A']:[],startedAt:0,animationAt:Date.now()-2500}};
    await page.evaluate(({state,readonly})=>window.REGLAC.renderInto(document.getElementById('app'),state,{readonly}),{state,readonly});
    await page.evaluate(()=>document.fonts.ready);
    const data=await page.evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,overflow:[...document.querySelectorAll('.rl-control-panel,.rl-doc,.rl-information-columns article')].filter(n=>n.scrollHeight>n.clientHeight+2).map(n=>({class:n.className,sh:n.scrollHeight,h:n.clientHeight}))}));
    if(data.sh>height+1||data.sw>width+1||data.overflow.length)findings.push({name,language,phase,...data});
    if((name!=='tablet-large'&&language==='es'&&['landing','info','intro','manual','confirm','results','manualReveal','assist','transition'].includes(phase))||(name==='tv'&&language==='en'&&phase==='info'))await page.screenshot({path:path.join(out,`${name}-${phase}-${language}.png`),fullPage:true});
   }
   await page.close();
  }
 }finally{await browser.close();}
 const report={screens:(S.phases.length+2)*2*3,findings,errors};fs.writeFileSync(path.join(out,'visual-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(findings.length||errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
