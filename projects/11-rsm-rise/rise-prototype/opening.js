/* Original wall animation, started explicitly on the tablet and clock-aligned
   between devices. infoStartedAt is the existing station timestamp envelope. */
(function(){
 const baseReset=reset;
 window.RISE_INTRO={startedAt:0,now:()=>Date.now(),start(){
  if(!S||S.sc!=='intro'||this.startedAt)return;
  this.startedAt=Math.round(this.now());render();
 }};
 reset=function(){RISE_INTRO.startedAt=0;baseReset();};
  startIntro=function(){
    stopIntro();
    tv.classList.add('rise-client-intro');
    tv.classList.toggle('rise-intro-running',RISE_INTRO.startedAt>0);
    if(!RISE_INTRO.startedAt)return;
    var cv=tv.querySelector('canvas.iwall'), txt=document.getElementById('opnt'), num=document.getElementById('opnn'); if(!cv)return;
    var r=cv.getBoundingClientRect(), dpr=Math.min(2,window.devicePixelRatio||1), W=Math.max(10,r.width), H=Math.max(10,r.height);
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    var x=cv.getContext('2d'); x.scale(dpr,dpr);
    var N=8200, cell=Math.sqrt(W*H/N), cols=Math.max(1,Math.floor(W/cell)), rows=Math.ceil(N/cols);
    cell=Math.min(W/cols,H/rows);
    var g=Math.max(.5,cell*.2), sz=Math.max(.6,cell-g), ox=(W-cols*cell)/2, oy=(H-rows*cell)/2;
    var FIN=[[0,92,255],[47,120,255],[92,149,255],[137,180,255],[207,225,255]], WGT=[.34,.3,.2,.12,.04];
    var ta=new Float32Array(N), tl=new Float32Array(N), bc=new Array(N), fc=new Array(N);
    for(var i=0;i<N;i++){
      var c=i%cols, rr=Math.floor(i/cols), v=hsh(i), d=Math.sqrt(Math.pow((c-cols/2)/cols,2)+Math.pow((rr-rows/2)/rows,2))*2;
      ta[i]=200+Math.pow(hsh(i+7),1.4)*3000;
      tl[i]=Math.max(ta[i]+350,2800+d*1600+hsh(i+99)*700);
      bc[i]=v<.75?[230,234,242]:(v<.93?[211,226,251]:[169,198,255]);
      var q=hsh(i+31),acc=0,k=0; for(;k<WGT.length-1;k++){acc+=WGT[k]; if(q<acc)break;} fc[i]=FIN[k];
    }
    var T0=performance.now()-Math.max(0,RISE_INTRO.now()-RISE_INTRO.startedAt), LIGHT_END=6500, TXT_AT=6000, END=11500, shown=false;
    function ez(t){return 1-Math.pow(1-t,3);}
    function frame(now){
      var t=now-T0;
      if(t<LIGHT_END+200){
        x.clearRect(0,0,W,H);
        for(var i=0;i<N;i++){
          var a=t-ta[i]; if(a<0)continue;
          var ap=Math.min(1,a/350), s=.35+.65*ez(ap), col, al=ap;
          if(t<tl[i]){col=bc[i];}
          else{
            var u=Math.min(1,(t-tl[i])/650), w=Math.pow(1-u,2), f=fc[i];
            col=[f[0]+(58-f[0])*w,f[1]+(60-f[1])*w,f[2]+(68-f[2])*w]; s*=1+.3*(1-u)*(1-u); al=1;
          }
          x.globalAlpha=al; x.fillStyle='rgb('+(col[0]|0)+','+(col[1]|0)+','+(col[2]|0)+')';
          var w2=sz*s, off=(sz-w2)/2, c=i%cols, rr=(i/cols)|0;
          x.fillRect(ox+c*cell+off,oy+rr*cell+off,w2,w2);
        }
        x.globalAlpha=1;
      }
      if(t>=TXT_AT){
        if(!shown){shown=true;cv.classList.add('dim');txt.classList.add('on');}
        var p=Math.min(1,(t-TXT_AT)/1600); num.textContent=Math.round(8200*ez(p)).toLocaleString('en-US');
      }
      if(t>=END){raf=0;if(S.sc==='intro')go('problem');return;}
      raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);
  };
})();
