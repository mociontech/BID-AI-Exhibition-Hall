/* Offline editorial packing against the actual HD TV layout. No runtime dependency. */
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const folder=__dirname,base=process.env.TEST_URL||'http://localhost:4173';
const read=lang=>JSON.parse(fs.readFileSync(path.join(folder,`conversations.${lang}.json`),'utf8'));
const normal=t=>t.replace(/\s+/g,' ').trim();
function units(text){
 const result=[];
 for(const block of text.split(/\n\s*\n/)){
  const lines=block.split('\n').map(s=>s.trim()).filter(Boolean);
  for(let i=0;i<lines.length;i++){
   let line=lines[i];const heading=/^\d+[.)]\s/.test(line)||/^(Objetivo|Inicio|Desarrollo|Cierre|Evaluación|Recursos|Objective|Opening|Main activities|Metacognitive|Formative assessment|Resources)\b/.test(line);
   if((heading||/:$/.test(line))&&line.length<100&&!/[.!?]$/.test(line)&&i+1<lines.length)line+=' '+lines[++i];
   result.push({text:line,breakBefore:heading||i===0&&result.length>0});
  }
 }
 return result;
}
function format(list){return list.map((u,i)=>(i?(u.breakBefore?'\n':' '):'')+u.text).join('');}
function referenceParts(text,count){
 const list=units(text),result=[];let start=0;
 for(let n=0;n<count;n++){
  if(n===count-1){result.push(format(list.slice(start)));break;}
  const target=normal(format(list.slice(start))).length/(count-n);let end=start+1;
  while(end<list.length-(count-n-1)&&Math.abs(format(list.slice(start,end+1)).length-target)<Math.abs(format(list.slice(start,end)).length-target))end++;
  result.push(format(list.slice(start,end)));start=end;
 }
 return result;
}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const es=read('es'),en=read('en'),counts=[],report=[];
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});await page.goto(base+'/display.html?station=5');
  await page.evaluate(()=>PROFE_GABI.renderInto(document.querySelector('#app'),{projectId:'05',view:'game',mode:'game',language:'en',game:{...PROFE_GABI_STATE.fresh(),phase:'reading',topic:0,situation:0,turn:'situation',part:0}},{readonly:true}));
  await page.evaluate(()=>document.fonts.ready);
  for(let topic=0;topic<4;topic++){
   counts[topic]=[];
   const pairs=[es[topic].options[0],...es[topic].options[0].follow],translations=[en[topic].options[0],...en[topic].options[0].follow];
   for(let turn=0;turn<3;turn++){
    const pair=pairs[turn],list=units(pair.gabi),parts=[];let start=0;
    const old=pair.gabiParts.length;
    while(start<list.length){
     let best=0;
     for(let end=list.length;end>start;end--){
      const text=format(list.slice(start,end));
      const result=await page.evaluate(({topic,turn,text})=>{
       const source=PROFE_GABI_CONVERSATIONS.es[topic].options[0],pair=turn?source.follow[turn-1]:source;pair.gabiParts=[text];
       const game={...PROFE_GABI_STATE.fresh(),phase:'reading',topic,situation:0,follow:turn?turn-1:null,turn:turn?'follow':'situation',part:0};
       PROFE_GABI.renderInto(document.querySelector('#app'),{projectId:'05',view:'game',mode:'game',language:'en',game},{readonly:true});
       const log=document.querySelector('.gabi-messages'),u=log.querySelector('.gabi-message-user').getBoundingClientRect(),g=log.querySelector('.gabi-message-gabi').getBoundingClientRect(),r=log.getBoundingClientRect(),style=getComputedStyle(log);
       const top=r.top+parseFloat(style.paddingTop),bottom=r.bottom-parseFloat(style.paddingBottom);
       return {fits:u.top>=top-1&&g.bottom<=bottom+1&&g.bottom-u.top<=bottom-top-8,plain:log.querySelector('.gabi-message-gabi p').style.whiteSpace==='normal'};
      },{topic,turn,text});
      // Avoid silently flattening all paragraphs merely to make a long candidate fit.
      if(result.fits&&!result.plain){best=end;break;}
     }
     assert.ok(best>start,'A complete idea does not fit at 22px: '+JSON.stringify({topic,turn,start}));
     parts.push(format(list.slice(start,best)));start=best;
    }
    assert.ok(parts.length<=old,'Packing must not add reading steps');
    assert.equal(normal(parts.join(' ')),normal(pair.gabi));
    pair.gabiParts=parts;translations[turn].gabiParts=referenceParts(translations[turn].gabi,parts.length);
    assert.equal(normal(translations[turn].gabiParts.join(' ')),normal(translations[turn].gabi));
    counts[topic][turn]=parts.length;report.push({topic,turn,before:old,after:parts.length});
   }
  }
 }finally{await browser.close();}
 for(const [lang,data] of [['es',es],['en',en]])fs.writeFileSync(path.join(folder,`conversations.${lang}.json`),JSON.stringify(data,null,2)+'\n');
 const schemaFile=path.join(folder,'../state.js');let schema=fs.readFileSync(schemaFile,'utf8');
 schema=schema.replace(/const replyCounts=.*?;/,`const replyCounts=${JSON.stringify(counts)};`);
 schema=schema.replaceAll('version:4','version:5').replace('value.version!==4','value.version!==5');fs.writeFileSync(schemaFile,schema);
 fs.writeFileSync(path.join(folder,'../review/2026-11-09/packed-replies-report.json'),JSON.stringify({font:'22px',preservesAllText:true,userAndReplyFitTogether:true,counts,report},null,2));
 console.log(JSON.stringify({counts,report}));
})().catch(e=>{console.error(e);process.exitCode=1;});
