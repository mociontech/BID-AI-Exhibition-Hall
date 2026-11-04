const fs=require('fs'),vm=require('vm');
const folder='projects/06-reglac/',source=fs.readFileSync(folder+'experience.js','utf8').replace('window.REGLAC={renderInto,words,documents,format,now};','window.REGLAC={renderInto,words,documents,format,now,paths};');
const ctx={window:{AI_SYNC:{now:()=>Date.now()}},document:{currentScript:{src:'http://localhost:4186/projects/06-reglac/experience.js'}},URL};vm.runInNewContext(source,ctx);
const {words,documents,paths}=ctx.window.REGLAC;
fs.writeFileSync(folder+'figma-editable/content.json',JSON.stringify({words,documents,paths,sessionTimes:JSON.parse(fs.readFileSync(folder+'verification/report.json','utf8')).sessionTimes,illustration:fs.readFileSync(folder+'assets/regulatory-analysis.svg','utf8')},null,2));
