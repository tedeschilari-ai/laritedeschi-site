/* Black FigOS · página de vendas (pública e de alunas) */
(function(){
  // ====== CONFIGURAÇÃO ======
  // Um link só: o cupom de aluna é aplicado automaticamente pelo e-mail no checkout.
  var CHECKOUT = '#CHECKOUT';   // link da Kiwify do Black FigOS
  // Datas no horário de Brasília (-03:00)
  var D = {
    abre:      new Date('2026-11-09T08:00:00-03:00'),
    fecha:     new Date('2026-11-11T00:00:00-03:00'),   // fim de 10/11, 23h59
    reabre:    new Date('2026-11-12T00:00:00-03:00'),   // reabertura relâmpago
    fechaRe:   new Date('2026-11-13T00:00:00-03:00'),   // fim de 12/11, 23h59
    guias:     new Date('2026-11-10T00:00:00-03:00'),   // precificação e posicionamento saem (09/11, 23h59)
    behance:   new Date('2026-11-11T00:00:00-03:00')    // Behance sai (10/11, 23h59)
  };
  // ==========================

  // entrada suave
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('vis'); io.unobserve(e.target); } });
  },{threshold:.12}) : null;
  document.querySelectorAll('.rv').forEach(function(el,i){
    if(!io){ el.classList.add('vis'); return; }
    if(el.closest('.hero')) el.style.transitionDelay = (i*0.08)+'s';
    io.observe(el);
  });

  // conversa animada
  var conv = document.getElementById('conversa');
  if(conv){
    if(!('IntersectionObserver' in window)) conv.classList.add('ativa');
    else { var co = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ conv.classList.add('ativa'); co.disconnect(); } }); },{threshold:.55}); co.observe(conv); }
  }

  // ver mais depoimentos
  var vm = document.getElementById('ver-mais');
  if(vm) vm.addEventListener('click', function(){ document.getElementById('depos').classList.add('aberto'); vm.parentNode.hidden = true; });

  // checkout
  var q = location.search;
  document.querySelectorAll('[data-checkout]').forEach(function(a){
    if(/^https?:/.test(CHECKOUT)) a.href = CHECKOUT + (q ? (CHECKOUT.indexOf('?') > -1 ? '&' : '?') + q.slice(1) : '');
    a.addEventListener('click', function(){ try{ if(window.fbq) fbq('track','InitiateCheckout',{value:397, currency:'BRL'}); }catch(e){} });
  });

  // abas da caixa de compra (preço normal / aluna)
  var caixa = document.querySelector('[data-abas]');
  function abre(nome){
    caixa.querySelectorAll('.aba').forEach(function(b){ var on = b.getAttribute('data-aba') === nome; b.classList.toggle('ativa', on); b.setAttribute('aria-selected', on); });
    caixa.querySelectorAll('[data-painel]').forEach(function(p){ p.hidden = p.getAttribute('data-painel') !== nome; });
  }
  if(caixa){
    caixa.querySelectorAll('.aba').forEach(function(b){ b.addEventListener('click', function(){ abre(b.getAttribute('data-aba')); }); });
    caixa.querySelectorAll('[data-ir-aba]').forEach(function(b){ b.addEventListener('click', function(){ abre(b.getAttribute('data-ir-aba')); }); });
  }

  // contagem regressiva (para testar: ?agora=2026-11-09T15:00:00-03:00)
  var agoraFixo = (q.match(/[?&]agora=([^&]+)/) || [])[1];
  var inicio = Date.now();
  function agora(){ return agoraFixo ? new Date(new Date(decodeURIComponent(agoraFixo)).getTime() + (Date.now() - inicio)) : new Date(); }
  var CD = {}; document.querySelectorAll('[data-cd]').forEach(function(el){ CD[el.getAttribute('data-cd')] = el; });
  var aviso = document.querySelector('[data-aviso-guias]'), avisoTxt = document.querySelector('[data-aviso-txt]');
  function dois(n){ return (n < 10 ? '0' : '') + n; }
  function partes(ms){
    if(ms < 0) ms = 0;
    var s = Math.floor(ms/1000), d = Math.floor(s/86400); s -= d*86400;
    var h = Math.floor(s/3600); s -= h*3600; var m = Math.floor(s/60); s -= m*60;
    return {d:d, h:h, m:m, s:s};
  }
  function falta(ms){ var p = partes(ms); return (p.d ? p.d + 'd ' : '') + dois(p.h) + ':' + dois(p.m) + ':' + dois(p.s); }

  function atualiza(){
    var t = agora();
    var alvoFim = (t >= D.reabre && t < D.fechaRe) ? D.fechaRe : D.fecha;
    var p = partes(alvoFim - t);
    CD.d.textContent = dois(p.d); CD.h.textContent = dois(p.h); CD.m.textContent = dois(p.m); CD.s.textContent = dois(p.s);

    var saiuG = t >= D.guias, saiuB = t >= D.behance;
    marcaSaiu('Guia de precificação', saiuG);
    marcaSaiu('Guia de posicionamento', saiuG);
    marcaSaiu('Guia de Behance', saiuB);
    if(aviso){
      var alvo = !saiuG ? D.guias : (!saiuB ? D.behance : null);
      if(alvo){
        aviso.hidden = false;
        avisoTxt.textContent = (!saiuG ? 'Os guias de precificação e de posicionamento' : 'O guia de Behance') + ' saem do pacote em ' + falta(alvo - t) + '.';
      } else aviso.hidden = true;
    }
  }
  function marcaSaiu(nome, saiu){
    document.querySelectorAll('.pc h3, .j-lista li span').forEach(function(el){
      if(el.textContent.indexOf(nome) !== 0) return;
      var item = el.closest('.pc') || el.closest('li');
      if(item) item.classList.toggle('saiu', saiu);
    });
  }
  atualiza(); setInterval(atualiza, 1000);
})();
