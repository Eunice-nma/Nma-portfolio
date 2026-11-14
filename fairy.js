(function(){
  var st={x:Math.round(window.innerWidth*.62),y:240,idle:false,moving:false,left:false,zone:'home',homeCount:0,endCount:0};
  var $=function(id){return document.getElementById(id)};
  var fairy=$('fairy'),face=$('face'),svg=$('fsvg'),wings=$('wings'),bubble=$('bubble'),bursts=$('bursts'),stage=$('stage');
  var timer,moveTimer,raf=null,bid=0;
  function line(){
    if(st.zone==='end')return st.endCount%2===1?'Thank you for staying till the end!':'Got an idea? Let\u2019s make magic.';
    if(st.zone==='work')return 'Everything here started as a wish.';
    return st.homeCount<=1?'Hi, and welcome to my forest!':'The good stuff is just below.';
  }
  function placeBubble(fx,fy){
    var pad=14,vw=document.documentElement.clientWidth,vh=window.innerHeight;
    var w=bubble.offsetWidth,h=bubble.offsetHeight;
    var left=104,top=4,flip=false;
    if(fx+left+w>vw-pad){left=-w-8;flip=true;}
    bubble.style.borderRadius=flip?'999px 999px 6px 999px':'999px 999px 999px 6px';
    left=Math.max(pad-fx,Math.min(left,vw-pad-w-fx));
    top=Math.max(pad-fy,Math.min(top,vh-pad-h-fy));
    bubble.style.left=left+'px';bubble.style.top=top+'px';
  }
  function pos(){
    var size=st.idle?120:96,pad=8,vw=document.documentElement.clientWidth,vh=window.innerHeight;
    var fx=st.x+(st.idle?14:30),fy=st.y-(st.idle?110:88);
    fx=Math.max(pad,Math.min(fx,vw-size-pad));
    fy=Math.max(pad,Math.min(fy,vh-size-pad));
    return {fx:fx,fy:fy,size:size};
  }
  function render(){
    var p=pos(),fx=p.fx,fy=p.fy,size=p.size;
    fairy.style.transform='translate('+fx+'px, '+fy+'px)';
    face.style.transform=st.left?'scaleX(-1)':'none';
    svg.setAttribute('width',size);svg.setAttribute('height',size);
    wings.setAttribute('class',st.moving?'wings flying':'wings');
    bubble.textContent=line();bubble.hidden=!st.idle;
    if(st.idle)placeBubble(fx,fy);
  }
  function flyNow(){clearTimeout(moveTimer);st.moving=true;render();moveTimer=setTimeout(function(){st.moving=false;render()},900)}
  function wake(){
    clearTimeout(timer);st.idle=false;
    timer=setTimeout(function(){
      st.idle=true;
      if(st.zone==='home')st.homeCount++;
      if(st.zone==='end')st.endCount++;
      render();
    },3200);
  }
  window.addEventListener('scroll',function(){wake();flyNow()},{passive:true});
  stage.addEventListener('mousemove',function(e){
    var x=e.clientX,y=e.clientY;
    if(raf)return;
    raf=requestAnimationFrame(function(){
      raf=null;var dx=x-st.x;
      if(Math.abs(dx)>4)st.left=dx<0;
      st.x=x;st.y=y;wake();flyNow();
    });
  });
  stage.addEventListener('click',function(){
    var p=pos(),size=p.size,fx=p.fx,fy=p.fy;
    var bx=fx+(st.left?.18:.82)*size,by=fy+.45*size;
    var colors=['#FFE27A','#FFB0DC','#9FF3E0','#FFFFFF','#C9B8FF','#FFC861'];
    var wrap=document.createElement('div');
    wrap.style.cssText='position:absolute;left:'+Math.round(bx)+'px;top:'+Math.round(by)+'px';
    for(var i=0;i<16;i++){
      var a=(Math.PI*2*i)/16+Math.random()*.4,r=30+Math.random()*60,s=3+Math.round(Math.random()*4);
      var p=document.createElement('span');p.className='dust';
      p.style.cssText='--dx:'+Math.round(Math.cos(a)*r)+'px;--dy:'+Math.round(Math.sin(a)*r+30)+'px;width:'+s+'px;height:'+s+'px;background:'+colors[i%6]+';animation-delay:'+(Math.random()*.12).toFixed(2)+'s';
      wrap.appendChild(p);
    }
    bursts.appendChild(wrap);
    setTimeout(function(){wrap.remove()},1200);
  });
  var io;
  if('IntersectionObserver' in window){
    io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting)return;
        if(e.target.id==='work')st.zone='work';
        else if(e.target.id==='contact'){clearTimeout(timer);st.zone='end';st.idle=true;st.endCount++;}
        else if(e.target.id==='home')st.zone='home';
        render();
      });
    },{threshold:.35});
    setTimeout(function(){['home','work','contact'].forEach(function(id){var el=$(id);if(el)io.observe(el)})},1200);
  }
  window.addEventListener('resize',render);
  render();
  setTimeout(function(){st.idle=true;st.homeCount=1;render()},1400);
})();
