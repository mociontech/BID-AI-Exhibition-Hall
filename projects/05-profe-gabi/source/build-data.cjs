/* Run after editing the scripts: node projects/05-profe-gabi/source/build-data.cjs */
const fs=require('node:fs'),path=require('node:path');
const data={};
for(const language of ['es','en']){
 const topics=JSON.parse(fs.readFileSync(path.join(__dirname,`conversations.${language}.json`),'utf8'));
 if(topics.length!==3||topics.some(t=>t.options.length!==3||t.options.some(o=>o.follow.length!==2)))throw Error('Expected 3 topics × 3 situations × 2 follow-ups');
 for(const topic of topics){
  for(const key of ['title','sub','lead','question'])if(typeof topic[key]!=='string'||!topic[key])throw Error(`Missing ${language} ${key}`);
  for(const situation of topic.options){
   for(const key of ['label','user','gabi'])if(typeof situation[key]!=='string'||!situation[key])throw Error(`Missing ${language} ${key}`);
   for(const follow of situation.follow)for(const key of ['label','user','gabi','take'])if(typeof follow[key]!=='string'||!follow[key])throw Error(`Missing ${language} ${key}`);
  }
 }
 data[language]=topics;
}
fs.writeFileSync(path.join(__dirname,'../conversations.js'),'/* Scripts extracted from the supplied prototype; English translation alongside Spanish. */\nwindow.PROFE_GABI_CONVERSATIONS='+JSON.stringify(data,null,2)+';\n');
console.log('Generated scripts: 3 topics, 9 situations, 18 endings per language.');
