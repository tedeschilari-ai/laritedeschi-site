/* Confete colorido na abertura da página de obrigado */
(function(){
  var c=document.querySelector('.confete');if(!c||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var cores=(c.dataset.cores||'#ff58fc,#a6f35b,#ffffff').split(',');
  for(var i=0;i<46;i++){var e=document.createElement('i');e.style.left=Math.random()*100+'%';e.style.background=cores[i%cores.length];e.style.animationDelay=(Math.random()*.9)+'s';e.style.animationDuration=(2.4+Math.random()*1.8)+'s';e.style.transform='rotate('+(Math.random()*180)+'deg)';c.appendChild(e)}
})();
