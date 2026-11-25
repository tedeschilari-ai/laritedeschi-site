/* =========================================================
   Funcionários de IA · laritedeschi.com/funcionariosdeia
   Este arquivo carrega ANTES do escola.js, para o link do checkout
   já estar nos botões quando o escola.js repassa as UTMs e avisa o Pixel.
   ========================================================= */

/* Link do checkout: vem do atributo data-link-checkout do <body> no index.html.
   Vazio = os botões de compra levam para a dobra do preço. */
(function(){
  var url=(document.body.getAttribute('data-link-checkout')||'').trim();
  document.querySelectorAll('a[data-checkout]').forEach(function(a){a.href=url||'#preco'});
})();

/* Funcionários de IA · animações da página
   .anim ganha .on quando entra na tela (as peças .a entram em sequência).
   data-loop="ms" repete a animação enquanto o bloco está visível. */
(function(){
  var d=document.documentElement;
  var parado=d.classList.contains('fim')||matchMedia('(prefers-reduced-motion:reduce)').matches;
  var els=[].slice.call(document.querySelectorAll('.anim'));
  if(parado||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('on')});return}
  var vis=[];
  var io=new IntersectionObserver(function(en){en.forEach(function(e){
    var t=e.target,i=vis.indexOf(t);
    if(e.isIntersecting){if(i<0)vis.push(t);t.classList.add('on')}
    else if(i>=0)vis.splice(i,1);
  })},{threshold:.2});
  els.forEach(function(e){io.observe(e)});

  /* bônus: confetes 2D, uma vez, quando a dobra entra na tela */
  var bonus=document.getElementById('bonus');
  if(bonus){
    var io2=new IntersectionObserver(function(en){en.forEach(function(e){
      if(!e.isIntersecting)return;io2.disconnect();
      var cx=document.createElement('div');cx.className='confete';cx.setAttribute('aria-hidden','true');
      var cores=['#FEB273','#F2B0FF','#CFC9FF','#ffffff'],h=bonus.offsetHeight;
      for(var n=0;n<34;n++){
        var c=document.createElement('i');
        c.style.left=(Math.random()*100)+'%';c.style.background=cores[n%4];
        c.style.setProperty('--d',(Math.random()*.7).toFixed(2)+'s');
        c.style.setProperty('--t',(1.8+Math.random()*1.2).toFixed(2)+'s');
        c.style.setProperty('--y',Math.round(h*(.55+Math.random()*.4))+'px');
        c.style.setProperty('--r',Math.round(360+Math.random()*540)+'deg');
        cx.appendChild(c);
      }
      bonus.appendChild(cx);setTimeout(function(){if(cx.parentNode)cx.parentNode.removeChild(cx)},4200);
    })},{threshold:.35});
    io2.observe(bonus);
  }
})();


/* Vídeos curtos sem som: só carregam e tocam quando estão na tela */
(function(){
  var vs=[].slice.call(document.querySelectorAll('video[data-src]'));
  if(!vs.length||!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var io=new IntersectionObserver(function(en){en.forEach(function(e){
    var v=e.target;
    if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;v.muted=true;var p=v.play();if(p&&p.catch)p.catch(function(){})}
    else if(!v.paused)v.pause();
  })},{rootMargin:'120px'});
  vs.forEach(function(v){io.observe(v)});
})();

/* carrossel da equipe no celular: passa sozinho até a pessoa tocar */
(function(){
  var t=document.getElementById('tour'),p=document.getElementById('pts');if(!t||!p)return;
  var fs=[].slice.call(t.children),k=0,vis=false,para=false;
  fs.forEach(function(_,n){var d=document.createElement('i');if(!n)d.className='on';p.appendChild(d)});
  var cel=function(){return matchMedia('(max-width:640px)').matches};
  var vai=function(n){t.scrollTo({left:fs[n].offsetLeft-(t.clientWidth-fs[n].offsetWidth)/2,behavior:'smooth'})};
  t.addEventListener('scroll',function(){
    var c=t.scrollLeft+t.clientWidth/2,m=0,best=1e9;
    fs.forEach(function(f,n){var x=Math.abs(f.offsetLeft+f.offsetWidth/2-c);if(x<best){best=x;m=n}});
    if(m!==k){k=m;[].forEach.call(p.children,function(d,n){d.className=n===k?'on':''})}
  },{passive:true});
  ['touchstart','pointerdown'].forEach(function(e){t.addEventListener(e,function(){para=true},{passive:true})});
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting},{threshold:.5}).observe(t);
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches)setInterval(function(){if(cel()&&vis&&!para&&!document.hidden)vai((k+1)%fs.length)},3600);
})();
