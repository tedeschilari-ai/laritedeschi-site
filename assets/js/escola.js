/* =========================================================
   Escola Lari Tedeschi · efeitos e comportamentos comuns
   Cada bloco só roda se o elemento existir na página.
   ========================================================= */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  document.documentElement.classList.add('js');

  /* rolagem suave */
  try{ if(window.Lenis && !reduce){
    var lenis=new Lenis({lerp:.1});document.documentElement.classList.add('lenis');
    (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(0);
    document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){
      var id=a.getAttribute('href');if(id.length<2)return;var el=document.querySelector(id);
      if(el){e.preventDefault();lenis.scrollTo(el,{offset:-70})}
    })});
  }}catch(e){}

  /* menu fica sólido ao rolar */
  var nav=document.getElementById('nav');
  if(nav){var f=function(){nav.classList.toggle('solid',scrollY>40)};addEventListener('scroll',f,{passive:true});f()}

  /* título do hero: palavra por palavra */
  var h=document.getElementById('h1');
  if(h){
    var k=0;
    [].slice.call(h.childNodes).forEach(function(node){
      var wrapIn=node.nodeType===1?node:null,frag=document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function(part){
        if(!part)return;
        if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return}
        var s=document.createElement('span');s.className=(wrapIn&&wrapIn.classList.contains('grad'))?'w grad':'w';s.textContent=part;s.style.transitionDelay=(k++*55)+'ms';frag.appendChild(s);
      });
      if(wrapIn){wrapIn.textContent='';wrapIn.classList.remove('grad');wrapIn.appendChild(frag)}else{h.replaceChild(frag,node)}
    });
    requestAnimationFrame(function(){setTimeout(function(){h.classList.add('go')},120)});
  }

  /* céu estrelado do hero */
  var c=document.getElementById('stars');
  if(c && !reduce){
    var x=c.getContext('2d'),st=[],W,H,d=Math.min(devicePixelRatio||1,2);
    var col=(getComputedStyle(document.documentElement).getPropertyValue('--star')||'#fff').trim()||'#fff';
    var size=function(){W=c.offsetWidth;H=c.offsetHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);st=[];for(var i=0;i<Math.round(W*H/9000);i++)st.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+.2,p:Math.random()*6.28,s:Math.random()*.02+.005})};
    var draw=function(){x.clearRect(0,0,W,H);st.forEach(function(s){s.p+=s.s;x.globalAlpha=.25+Math.abs(Math.sin(s.p))*.6;x.fillStyle=col;x.beginPath();x.arc(s.x,s.y,s.r,0,6.28);x.fill()});requestAnimationFrame(draw)};
    size();draw();addEventListener('resize',size);
  }

  /* carrosséis: duplica os cards para o loop contínuo */
  document.querySelectorAll('.car .ct').forEach(function(t){
    [].slice.call(t.children).forEach(function(f){var cl=f.cloneNode(true);cl.setAttribute('aria-hidden','true');t.appendChild(cl)});
  });

  /* galeria: loop no computador, uma imagem por vez no celular */
  var g=document.getElementById('gallery');
  if(g){
    var m=g.parentElement,dots=document.querySelector('.dots'),imgs=[].slice.call(g.querySelectorAll('img'));
    imgs.forEach(function(im){var cl=im.cloneNode();cl.setAttribute('aria-hidden','true');g.appendChild(cl)});
    if(dots)imgs.forEach(function(){dots.appendChild(document.createElement('i'))});
    var ds=dots?dots.children:[],i=0,timer;
    var mobile=function(){return matchMedia('(max-width:640px)').matches};
    var mark=function(n){for(var j=0;j<ds.length;j++)ds[j].className=j===n?'on':''};
    var go=function(n){i=(n+imgs.length)%imgs.length;m.scrollTo({left:imgs[i].offsetLeft-20,behavior:'smooth'});mark(i)};
    var start=function(){clearInterval(timer);if(mobile())timer=setInterval(function(){go(i+1)},3000)};
    m.addEventListener('scroll',function(){if(!mobile())return;var n=Math.round(m.scrollLeft/(imgs[0].offsetWidth+12));if(n!==i){i=n;mark(i)}},{passive:true});
    m.addEventListener('touchstart',function(){clearInterval(timer)},{passive:true});
    m.addEventListener('touchend',function(){setTimeout(start,4000)},{passive:true});
    mark(0);start();addEventListener('resize',start);
  }

  /* entrada dos blocos ao rolar */
  var els=document.querySelectorAll('.rv');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')})}
  else{
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){
      var sib=[].slice.call(e.target.parentElement.children).filter(function(x){return x.classList.contains('rv')});
      e.target.style.transitionDelay=Math.min(sib.indexOf(e.target),6)*70+'ms';
      e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});
    els.forEach(function(e){io.observe(e)});
  }

  /* área de membros: começa inclinada e endireita ao rolar */
  var tp=document.querySelector('.tiltp');
  if(tp && !reduce){
    var u=function(){var r=tp.getBoundingClientRect(),p=Math.min(Math.max((innerHeight-r.top)/(innerHeight*.85),0),1);tp.style.transform='perspective(1600px) rotateX('+(22*(1-p)).toFixed(2)+'deg) scale('+(.9+.1*p).toFixed(3)+')'};
    addEventListener('scroll',u,{passive:true});u();
  }

  /* hero: o notebook abre conforme a rolagem */
  var stg=document.querySelector('.stage-hero'),lid=document.querySelector('.laptop .lid');
  if(lid){
    if(reduce){lid.style.transform='none'}
    else{
      var cur=-82,target=-82;
      var calc=function(){var r=stg.getBoundingClientRect(),p=(innerHeight*.98-r.top)/(innerHeight*.55);p=Math.min(Math.max(p,0),1);target=-82*(1-p)};
      var loop=function(){cur+=(target-cur)*.12;lid.style.transform='rotateX('+cur.toFixed(2)+'deg)';lid.style.filter='brightness('+(.35+.65*(1-Math.abs(cur)/82)).toFixed(3)+')';requestAnimationFrame(loop)};
      addEventListener('scroll',calc,{passive:true});addEventListener('resize',calc);calc();loop();
    }
  }

  /* checkout: leva as UTMs da página para a Kiwify e avisa o pixel */
  var params=new URLSearchParams(location.search);
  document.querySelectorAll('a[href*="pay.kiwify.com.br"]').forEach(function(a){
    try{
      var url=new URL(a.href);
      params.forEach(function(v,key){if(/^(utm_|src|sck|fbclid)/.test(key)&&!url.searchParams.has(key))url.searchParams.set(key,v)});
      a.href=url.toString();
    }catch(e){}
    a.addEventListener('click',function(){try{if(window.fbq)fbq('track','InitiateCheckout',{content_name:document.body.dataset.curso||''})}catch(e){}});
  });
})();
