/* Run after editing the scripts: node projects/05-profe-gabi/source/build-data.cjs */
const fs=require('node:fs'),path=require('node:path');
const data={};
for(const language of ['es','en']){
 const topics=JSON.parse(fs.readFileSync(path.join(__dirname,`conversations.${language}.json`),'utf8'));
 if(topics.length!==4||topics.some(t=>t.options.length!==1||t.options.some(o=>o.follow.length!==2)))throw Error('Expected 4 documented cases × 1 initial exchange × 2 follow-up choices');
 for(const topic of topics){
  for(const key of ['title','sub','lead','question','icon','source'])if(typeof topic[key]!=='string'||!topic[key])throw Error(`Missing ${language} ${key}`);
  for(const situation of topic.options){
   for(const key of ['label','user','gabi'])if(typeof situation[key]!=='string'||!situation[key])throw Error(`Missing ${language} ${key}`);
   for(const follow of situation.follow)for(const key of ['label','user','gabi','take'])if(typeof follow[key]!=='string'||!follow[key])throw Error(`Missing ${language} ${key}`);
  }
 }
 data[language]=topics;
 const schema=require('../state.js');
 const normal=text=>text.replace(/\s+/g,' ').trim();
 topics.forEach((topic,i)=>[topic.options[0],...topic.options[0].follow].forEach((pair,j)=>{
  if(!Array.isArray(pair.gabiParts)||pair.gabiParts.some(p=>typeof p!=='string'||!p.trim())||normal(pair.gabiParts.join(' '))!==normal(pair.gabi))throw Error('Response parts must preserve all script text');
  if(pair.gabiParts.length!==schema.partCount(i,j?'follow':'situation',j-1))throw Error('Response parts do not match shared state schema');
 }));
}
fs.writeFileSync(path.join(__dirname,'../conversations.js'),'/* LOCAL REVIEW DRAFT 2026-11-09. Based on PROFE GABI textos.docx; original extracts and editorial adaptations are identified per exchange. English is a translation for review. */\nwindow.PROFE_GABI_CONVERSATIONS='+JSON.stringify(data,null,2)+';\n');
console.log('Generated scripts: 4 documented cases, 8 endings per language, one follow-up decision.');
