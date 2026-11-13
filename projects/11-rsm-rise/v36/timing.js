/* Original v36 wall algorithm, with elapsed-clock recovery for paired devices. */
(function(){
 window.RISE_V36_CLOCK={introStartedAt:0,now:()=>Date.now()};
  startIntro=function(){
    stopIntro();
    var cv=tv.querySelector('canvas.iwall'), txt=document.getElementById('opnt'), num=document.getElementById('opnn'), sim=document.getElementById('opsim'); if(!cv)return;
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
    var T0=0, LIGHT_END=6500, TXT_AT=6000, END=8000, shown=false;
    function ez(t){return 1-Math.pow(1-t,3);}
    function paint(t){
      if(t>=LIGHT_END+200)return;
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
    function frame(now){
      var t=now-T0;
      paint(t);
      if(t>=TXT_AT){
        if(!shown){shown=true;cv.classList.add('dim');txt.classList.add('on');}
        var p=Math.min(1,(t-TXT_AT)/1600); num.textContent=Math.round(8200*ez(p)).toLocaleString('en-US');
      }
      if(t>=END){raf=0;S.ip=2;updIntro();return;}
      raf=requestAnimationFrame(frame);
    }
    function begin(fast){
      if(sim)sim.classList.add('off');
      if(fast){paint(LIGHT_END+100);shown=true;cv.classList.add('dim');txt.classList.add('on');num.textContent='8,200';return;}
      var elapsed=RISE_V36_CLOCK.introStartedAt?Math.max(0,RISE_V36_CLOCK.now()-RISE_V36_CLOCK.introStartedAt):0;
      T0=performance.now()-elapsed;if(elapsed>0)paint(Math.min(elapsed,LIGHT_END+100));raf=requestAnimationFrame(frame);
    }
    introGo=function(){S.ip=1;updIntro();begin(false);};
    introSkip=function(){stopIntro();S.ip=2;updIntro();begin(true);};
    if(S.ip===0){paint(2900);if(sim)setTimeout(function(){if(sim.isConnected&&S.ip===0)sim.classList.add('on');},350);}
    else if(S.ip===1){begin(false);}
    else{begin(true);}
  };
})();
