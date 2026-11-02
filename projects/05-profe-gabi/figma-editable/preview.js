/* Static source views; no controller, sync writes or changes to live sessions. */
(async()=>{
 const response=await fetch('./frames.json',{cache:'no-store'});if(!response.ok)throw Error('Missing prepared frames');
 const brief=await response.json();
 const index=Number(new URLSearchParams(location.search).get('frame')||0);
 const frame=brief.frames[Number.isInteger(index)&&index>=0&&index<brief.frames.length?index:0];
 document.title=frame.name;
 window.PROFE_GABI.renderInto(document.getElementById('app'),frame.state,{readonly:frame.readonly});
 // Photographs remain discrete image fills for the Figma import.
 for(const svg of document.querySelectorAll('svg.gabi-photo')){
  const vb=svg.viewBox.baseVal, image=svg.querySelector('image');
  if(!image)continue;
  const box=document.createElement('div');box.className='gabi-photo';
  box.style.backgroundImage=`url("${image.getAttribute('href')}")`;
  box.style.backgroundSize=`${1600/vb.width*100}% ${900/vb.height*100}%`;
  box.style.backgroundPosition=`${vb.x/(1600-vb.width)*100}% ${vb.y/(900-vb.height)*100}%`;
  svg.replaceWith(box);
 }
 document.documentElement.dataset.designFrame=frame.name;
 window.FIGMA_PREVIEW={brief,frame};
})();
