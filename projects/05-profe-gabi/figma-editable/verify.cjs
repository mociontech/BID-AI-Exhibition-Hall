const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[],views=[];
 page.on('pageerror',e=>errors.push(e.message));
 const brief=JSON.parse(fs.readFileSync(path.join(__dirname,'frames.json'),'utf8'));
 try{
  for(let i=0;i<brief.frames.length;i++){
   await page.goto(`http://localhost:4173/projects/05-profe-gabi/figma-editable/preview.html?frame=${i}`);
   await page.waitForFunction(()=>!!window.FIGMA_PREVIEW);await page.evaluate(()=>document.fonts.ready);
   const view=await page.evaluate(()=>({name:FIGMA_PREVIEW.frame.name,width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,text:document.getElementById('app').innerText,buttons:document.querySelectorAll('button').length,images:[...document.images].map(img=>({src:img.getAttribute('src'),loaded:img.complete&&img.naturalWidth>0}))}));
   assert.equal(view.name,brief.frames[i].name);assert.equal(view.scrollWidth,1920);assert.equal(view.scrollHeight,1080,view.name);
   assert.ok(view.images.every(img=>img.loaded));if(brief.frames[i].readonly)assert.equal(view.buttons,0);
   views.push(view);
  }
  assert.deepEqual(errors,[]);
  const report={localViewsPassed:true,frameCount:views.length,figmaPageCreated:false,figmaEditabilityVerified:false,views};
  fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({localViewsPassed:true,frameCount:views.length,figmaPageCreated:false,figmaEditabilityVerified:false}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
