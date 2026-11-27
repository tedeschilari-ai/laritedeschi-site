/* Kit: no celular, os materiais passam sozinhos para o lado. Para quando a pessoa toca. */
(function(){
  var g=document.querySelector('.matgrid');if(!g)return;
  var cs=[].slice.call(g.querySelectorAll('.mat')),mq=window.matchMedia('(max-width:640px)');
  var d=document.createElement('div');d.className='mat-dots';d.setAttribute('aria-hidden','true');
  cs.forEach(function(){d.appendChild(document.createElement('i'))});g.parentNode.insertBefore(d,g.nextSibling);
  var ds=[].slice.call(d.children),at=0,vis=false,pausa=0;
  function pos(i){return cs[i].offsetLeft-g.offsetLeft-(g.clientWidth-cs[i].offsetWidth)/2}
  function mark(){var b=0,m=1e9;cs.forEach(function(c,i){var x=Math.abs(pos(i)-g.scrollLeft);if(x<m){m=x;b=i}});at=b;ds.forEach(function(e,i){e.classList.toggle('on',i===b)})}
  g.addEventListener('scroll',function(){requestAnimationFrame(mark)},{passive:true});
  ['touchstart','pointerdown','wheel'].forEach(function(e){g.addEventListener(e,function(){pausa=Date.now()+6000},{passive:true})});
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting},{threshold:.4}).observe(g);
  var calmo=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!calmo)setInterval(function(){if(!mq.matches||!vis||Date.now()<pausa)return;g.scrollTo({left:pos((at+1)%cs.length),behavior:'smooth'})},2800);
  mark();
})();
/* No celular, o botão do WhatsApp só aparece depois da primeira tela, para não cobrir o botão de compra. */
(function(){var w=document.querySelector('.wa');if(!w)return;function f(){w.classList.toggle('no-topo',scrollY<200)}addEventListener('scroll',f,{passive:true});f()})();
