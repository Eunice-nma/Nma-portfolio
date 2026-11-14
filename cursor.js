(function(){
  if(!window.matchMedia||!window.matchMedia('(hover: hover) and (pointer: fine)').matches)return;
  var css=document.createElement('style');
  css.textContent='*,*::before,*::after{cursor:none!important}'
  +'.lightcur{position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:2147483647;opacity:0;transition:opacity .25s}'
  +'.lightcur.on{opacity:1}'
  +'.lightcur .halo{position:absolute;left:-28px;top:-28px;width:56px;height:56px;border-radius:50%;background:radial-gradient(circle,rgba(255,214,130,.38) 0%,rgba(255,190,90,.16) 45%,rgba(255,190,90,0) 70%);transition:transform .25s cubic-bezier(.2,.8,.2,1)}'
  +'.lightcur .core{position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:50%;background:#FFF6DC;box-shadow:0 0 8px 2px rgba(255,226,150,.95),0 0 22px 7px rgba(255,190,90,.55);transition:transform .2s}'
  +'.lightcur.hot .halo{transform:scale(1.7)}'
  +'.lightcur.hot .core{transform:scale(1.35)}';
  document.head.appendChild(css);
  var el=document.createElement('div');el.className='lightcur';el.setAttribute('aria-hidden','true');
  el.innerHTML='<div class="halo"></div><div class="core"></div>';
  document.body.appendChild(el);
  var halo=el.firstChild,core=el.lastChild,mx=-100,my=-100,hx=-100,hy=-100,run=false;
  function loop(){
    hx+=(mx-hx)*.22;hy+=(my-hy)*.22;
    halo.style.left=(hx-28)+'px';halo.style.top=(hy-28)+'px';
    core.style.left=(mx-4)+'px';core.style.top=(my-4)+'px';
    if(Math.abs(mx-hx)>.3||Math.abs(my-hy)>.3)requestAnimationFrame(loop);else run=false;
  }
  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    if(!el.classList.contains('on')){hx=mx;hy=my;el.classList.add('on')}
    var t=e.target;el.classList.toggle('hot',!!(t.closest&&t.closest('a,button,[role="button"]')));
    if(!run){run=true;requestAnimationFrame(loop)}
  },{passive:true});
  document.addEventListener('mouseleave',function(){el.classList.remove('on')});
  document.addEventListener('mouseenter',function(){el.classList.add('on')});
})();
