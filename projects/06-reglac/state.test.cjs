const test=require('node:test'),assert=require('node:assert/strict');
const S=require('./state.js');
test('selection is limited to two, can be changed, and premature checks are ignored',()=>{
 let g=S.reduce(S.fresh(true),'start',1000);
 assert.equal(S.reduce(g,'check',2000),g);
 g=S.reduce(g,'select',2000,'A');g=S.reduce(g,'select',2000,'B');
 assert.deepEqual(S.reduce(g,'select',2000,'C').selected,['A','B']);
 g=S.reduce(g,'select',2000,'B');g=S.reduce(g,'select',2000,'C');
 assert.deepEqual(g.selected,['A','C']);
 g=S.reduce(g,'check',182000);
 assert.equal(g.elapsed[0],181000);assert.equal(g.outcomes[0],true);assert.equal(g.startedAt,0);
});
test('incorrect answers reveal without a penalty, animation gates input, real times and complete reset',()=>{
 let g=S.reduce(S.fresh(true),'start',1000);
 for(const id of ['B','E'])g=S.reduce(g,'select',2000,id);
 g=S.reduce(g,'check',6000);assert.equal(g.outcomes[0],false);
 g=S.reduce(g,'next',7000);assert.equal(g.phase,'transition');
 g=S.reduce(g,'next',8000);assert.equal(g.phase,'assist');
 g=S.reduce(g,'activate',9000);
 for(const phase of ['organize','scan','identify']){
  assert.equal(g.phase,phase);assert.equal(S.reduce(g,'select',10000,'B'),g);
  g=S.reduce(g,'advance',15000);
 }
 assert.equal(g.phase,'confirm');
 for(const id of ['B','D'])g=S.reduce(g,'select',16000,id);
 g=S.reduce(g,'check',18000);
 assert.equal(g.elapsed[1],9000);assert.equal(g.outcomes[1],true);
 g=S.reduce(g,'next',20000);assert.equal(g.phase,'results');
 assert.deepEqual(S.reduce(g,'restart',21000),S.fresh(true));
});
test('server schema rejects malformed state and keeps only known fields',()=>{
 const g=S.fresh();assert.deepEqual(S.sanitize(g),g);
 for(const patch of [{selected:['A','A']},{selected:['A','B','C']},{phase:'bogus'},{elapsed:[-1,null]},{startedAt:Infinity},{ready:'yes'},{outcomes:[1,null]}])assert.equal(S.sanitize({...g,...patch}),null);
 assert.equal(S.sanitize({...g,unsafe:'ignored'}).unsafe,undefined);
});
