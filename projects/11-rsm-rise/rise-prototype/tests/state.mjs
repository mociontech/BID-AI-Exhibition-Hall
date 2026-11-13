import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const state=require('../../state.js');
test('source scenes and station schema reject incompatible or invalid state',()=>{
 assert.deepEqual(state.stages,['intro','problem','ficha','deal','read','decide','time','sup','loop']);
 assert(state.sanitize(state.fresh()));
 for(const value of [{version:2},{sc:'other'},{sc:'read'},{p:NaN},{t:1.1},{act:3},{deal:-1},{run:3},{unlocked:1},{sceneStartedAt:-1}])
  assert.equal(state.sanitize({...state.fresh(),...value}),null,JSON.stringify(value));
});
test('late receivers recover the original discrete reading and supervision timelines',()=>{
 const reading={...state.fresh(),sc:'read',deal:2,run:1,readStartedAt:1000};
 assert.equal(state.snapshot(reading,999).p,0);
 assert.equal(state.snapshot(reading,1119).p,0);
 assert.equal(state.snapshot(reading,1120).p,.025);
 assert.equal(state.snapshot(reading,3400).p,.5);
 assert.equal(state.snapshot(reading,5800).run,2);
 assert.equal(state.snapshot(reading,99999).p,1);
 const supervision={...reading,sc:'sup',supStartedAt:1000};
 assert.equal(state.snapshot(supervision,3400).t,.6);
 assert.equal(state.snapshot(supervision,5080).t,1);
 assert.equal(reading.p,0,'Computing a receiver snapshot must not mutate station state');
});
