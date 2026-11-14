/* Audit source fidelity before asking the Profe Gabi team to approve this draft. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=name=>JSON.parse(fs.readFileSync(path.join(__dirname,name),'utf8'));
const original=read('real-messages-2026-11-09.json');
const source=new Map(original.messages.map(m=>[m.id,m]));
const es=read('conversations.es.json'),en=read('conversations.en.json');
assert.equal(source.size,10);assert.equal(es.length,4);assert.equal(en.length,4);
const used=new Set();let literalQuestions=0,literalResponses=0;
for(let i=0;i<4;i++){
 assert.equal(es[i].options.length,i===3?2:1);
 for(let option=0;option<es[i].options.length;option++){
 const a=es[i].options[option],b=en[i].options[option];
 assert.equal(a.follow.length,i<2?2:0);assert.equal(b.follow.length,a.follow.length);
 for(const [p,q] of [[a,b],...a.follow.map((f,j)=>[f,b.follow[j]])]){
  const meta=p.provenance;
  assert.deepEqual(meta.sourceIds,q.provenance.sourceIds);
  assert.equal(p.gabiParts.length,q.gabiParts.length,'Language changes preserve the current part');
  for(const item of [p,q]){
   assert.ok(item.gabiParts.length>=1&&item.gabiParts.length<=3);
   assert.equal(item.gabiParts.join(' ').replace(/\s+/g,' ').trim(),item.gabi.replace(/\s+/g,' ').trim(),'Pagination must preserve all text');
  }
  const originals=meta.sourceIds.map(id=>{assert.ok(source.has(id));used.add(id);return source.get(id);});
  if(meta.userTreatment==='Literal'){
   assert.ok(originals.some(m=>m.user===p.user),'A claimed real question was changed');literalQuestions++;
  }
  if(meta.responseTreatment.startsWith('Extracto literal')){
   const lines=originals.flatMap(m=>m.paragraphs);
   for(const line of p.gabi.split('\n').filter(Boolean))assert.ok(lines.includes(line),'A claimed verbatim excerpt was rewritten: '+line);
   literalResponses++;
  }
  for(const item of [p,q])assert.ok(!/https?:\/\/|www\./.test(item.gabi),'Runtime reply should not redirect visitors');
 }
 }
}
assert.equal(used.size,9);assert.ok(!used.has('M09'));
assert.match(es[1].options[0].follow[1].provenance.responseTreatment,/Adaptación editorial/);
assert.ok(!/música|music|flauta|met[aá]l[oó]fono/i.test(es[1].options[0].follow[1].gabi));
console.log(JSON.stringify({passed:true,sourceMessages:10,represented:used.size,retired:['M09'],literalQuestions,literalResponses,editorialQuestions:9-literalQuestions,endingsPerLanguage:7}));
