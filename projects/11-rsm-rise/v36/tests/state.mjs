import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const state=createRequire(import.meta.url)('../../state.js');
test('v36 source flags and clock marks survive validation; old/malformed state is rejected',()=>{
 assert.deepEqual(state.sourceKeys,['sc','deal','p','run','why','dec','t','act','ip','tp','sr']);
 assert.deepEqual(state.sanitize(state.fresh()),state.fresh());
 for(const patch of [{version:3},{version:2},{ip:3},{sr:2},{tp:-1},{p:NaN},{t:1.1},{act:3},{deal:4},{sc:'other'},{introStartedAt:-1},{sc:'read'}])
  assert.equal(state.sanitize({...state.fresh(),...patch}),null,JSON.stringify(patch));
});
test('opening completes in place at 8 seconds; years and reports wait for their original controls',()=>{
 const opening={...state.fresh(),ip:1,introStartedAt:1000};
 assert.equal(state.snapshot(opening,8999).ip,1);
 assert.equal(state.snapshot(opening,9000).ip,2);
 assert.equal(state.snapshot(opening,99999).sc,'intro');
 const reports={...state.fresh(),sc:'sup',deal:0,supStartedAt:1000};
 assert.equal(state.snapshot(reports,99999).t,0,'Read the reports is required');
 assert.equal(state.snapshot({...reports,sr:1},3400).t,.6);
 assert.equal(state.snapshot({...reports,sr:1},5080).t,1);
 assert.equal(state.snapshot({...reports,sc:'time',tp:1},99999).sc,'time','Next remains manual');
});
test('reading recovery keeps the native 0.025 steps every 120ms without mutating state',()=>{
 const reading={...state.fresh(),sc:'read',deal:2,run:1,readStartedAt:1000};
 assert.equal(state.snapshot(reading,1119).p,0);assert.equal(state.snapshot(reading,1120).p,.025);
 assert.equal(state.snapshot(reading,3400).p,.5);assert.equal(state.snapshot(reading,5800).run,2);
 assert.equal(reading.p,0);
});
