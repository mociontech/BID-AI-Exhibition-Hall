const test=require('node:test'),assert=require('node:assert/strict');
const view=require('../projects/02-bogota-traffic-prediction/view-state.js');

test('camera state preserves the tablet view and is tied to its case',()=>{
 const input={scenarioIndex:1,center:[-74.07782831,4.64573189],zoom:15.123456};
 const original=JSON.stringify(input),clean=view.camera(input,1);
 assert.deepEqual(clean,{scenarioIndex:1,center:[-74.077828,4.645732],zoom:15.1235});
 assert.equal(view.camera(input,2),null);assert.equal(JSON.stringify(input),original);
 const withSize=view.camera({...input,viewport:{width:1024.2,height:415.8}},1);
 assert.deepEqual(withSize.viewport,{width:1024,height:416});
 assert.equal(view.camera({...input,zoom:8.5},1).zoom,8.5);
 assert.equal(view.camera({...input,zoom:9.4},1).zoom,9.4);
 for(const viewport of [{width:Infinity,height:400},{width:20,height:400},{width:800,height:9999}])assert.equal(view.camera({...input,viewport},1),null);
 for(const value of [null,{},'text',{...input,center:[Infinity,4]},{...input,center:[0,100]},{...input,zoom:NaN},{...input,zoom:20},{...input,zoom:8.49},{...input,center:['-74',4]}])assert.equal(view.camera(value,1),null);
});

test('popup state permits only a known corridor in its case and finite coordinates',()=>{
 const input={scenarioIndex:0,corridor:'cali',point:[-74.16,4.637],hotspot:true,html:'<script>ignored</script>'};
 assert.deepEqual(view.popup(input,0),{scenarioIndex:0,corridor:'cali',point:[-74.16,4.637],hotspot:true});
 assert.equal(view.popup(input,1),null);
 for(const value of [null,{},'text',{...input,corridor:'nqs'},{...input,point:[0,Infinity]},{...input,point:[181,0]}])assert.equal(view.popup(value,0),null);
 assert.equal(view.popup({...input,hotspot:'true'},0).hotspot,false);
});
