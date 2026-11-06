const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 await page.goto((process.env.COUNTRY_URL||'http://127.0.0.1:4187')+'/display.html?station=10');
 const result=await page.evaluate(()=>{
  const missing=new Set(),overflow=[],now=AI_SYNC.now();
  for(const language of ['en','es'])for(const sc of ['problem','ficha','sig','m0','m1','m2','loop'])for(const pick of [0,1,2]){
   const state={...COUNTRY_STATE.fresh(now,language),screen:'game',sc,con:[0,1,2,3,4,5,6,7],ph:{0:'done',1:'done',2:'done'},pk:{0:pick,1:pick,2:pick}};
   const original={html:COUNTRY_PROTOTYPE(state,'display').html+COUNTRY_PROTOTYPE(state,'tablet').html};
   const template=document.createElement('template');template.innerHTML=original.html;
   const walker=document.createTreeWalker(template.content,NodeFilter.SHOW_TEXT);let node;
   while(node=walker.nextNode()){
    const value=node.textContent.trim();
    if(/[a-z]{3}/i.test(value)&&!['VPC + TTD · VPC AI Agenda','Country Intelligence'].includes(value)){
     const en=document.createElement('div');en.textContent=value;
     const es=document.createElement('div');es.innerHTML=COUNTRY_TRANSLATE(en.innerHTML,'es');
     if(es.textContent===value)missing.add(value);
    }
   }
   COUNTRY_INTELLIGENCE.renderDisplay(document.getElementById('app'),{game:state});
   for(const element of document.querySelectorAll('.pane .pbody')){
    if(element.scrollHeight>element.clientHeight+2)overflow.push({language,sc,pick,area:element.parentElement.className,height:element.clientHeight,content:element.scrollHeight});
   }
  }
  return {missing:[...missing],overflow};
 });
 console.log(JSON.stringify(result,null,2));
 fs.writeFileSync(path.join(__dirname,'../projects/10-vpc-country-intelligence/verification/layout-audit.json'),JSON.stringify(result,null,2));
 await browser.close();assert.deepEqual(result.overflow,[]);
})().catch(e=>{console.error(e);process.exitCode=1;});
