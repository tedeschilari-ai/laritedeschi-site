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

  /* repete a animação dos blocos que estão na tela */
  els.forEach(function(el){
    var ms=parseInt(el.getAttribute('data-loop'),10);if(!ms)return;
    setInterval(function(){
      if(vis.indexOf(el)<0||document.hidden)return;
      el.classList.add('sai');
      setTimeout(function(){el.classList.remove('on','sai');void el.offsetWidth;el.classList.add('on')},420);
    },ms);
  });

  /* bônus: confetes 2D, uma vez, quando a dobra entra na tela */
  var bonus=document.getElementById('bonus');
  if(bonus){
    var io2=new IntersectionObserver(function(en){en.forEach(function(e){
      if(!e.isIntersecting)return;io2.disconnect();
      var cx=document.createElement('div');cx.className='confete';cx.setAttribute('aria-hidden','true');
      var cores=['#d97757','#aaff5b','#c7bcff','#ffffff'],h=bonus.offsetHeight;
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
  /* ciclo da IA genérica: o destaque gira de ponto em ponto e volta ao começo */
  var c=document.querySelector('.giro');
  if(c){
    var it=[].slice.call(c.querySelectorAll('li:not(.eixo)')),k=-1;
    setInterval(function(){
      if(vis.indexOf(c)<0||document.hidden)return;
      it.forEach(function(x){x.classList.remove('at')});
      k=(k+1)%it.length;it[k].classList.add('at');
    },1200);
  }
})();

/* Preço: a contagem de R$ 197 até R$ 97 quando o preço aparece na tela */
(function(){
  var el=document.querySelector('.price .conta'); if(!el) return;
  var de=+el.dataset.de, ate=+el.dataset.ate;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=ate;return;}
  el.textContent=de;
  var foi=false;
  function roda(){
    if(foi) return; foi=true;
    var t0=null, dur=1600;
    function passo(t){
      if(!t0) t0=t;
      var p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent=Math.round(de-(de-ate)*e);
      if(p<1) requestAnimationFrame(passo); else {el.textContent=ate; el.classList.add('pisca');}
    }
    requestAnimationFrame(passo);
  }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es,o){es.forEach(function(x){if(x.isIntersecting){roda();o.disconnect();}});},{threshold:.6}).observe(el);
  } else roda();
})();
