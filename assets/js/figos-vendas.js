/* Black FigOS · página de vendas (pública e de alunas) */
(function(){
  // ====== CONFIGURAÇÃO ======
  var CHECKOUT = {
    black: '#CHECKOUT-PUBLICO',   // link da Kiwify do FigOS a R$397
    aluna: '#CHECKOUT-ALUNA'      // link da Kiwify (ou com cupom) a R$297
  };
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
  var oferta = document.body.getAttribute('data-oferta') || 'black';
  var link = CHECKOUT[oferta];
  var q = location.search;
  document.querySelectorAll('[data-checkout]').forEach(function(a){
    a.href = /^https?:/.test(link) ? link + (q ? (link.indexOf('?') > -1 ? '&' : '?') + q.slice(1) : '') : '#oferta';
    a.addEventListener('click', function(){ try{ if(window.fbq) fbq('track','InitiateCheckout',{value: oferta === 'aluna' ? 297 : 397, currency:'BRL'}); }catch(e){} });
  });

  // fases (para testar: ?fase=antes | aberto | pausa | relampago | fechado)
  var forcada = (q.match(/[?&]fase=(\w+)/) || [])[1];
  var agoraFixo = (q.match(/[?&]agora=([^&]+)/) || [])[1];
  function agora(){ return agoraFixo ? new Date(decodeURIComponent(agoraFixo)) : new Date(); }
  function fase(t){
    if(forcada) return forcada;
    if(t < D.abre) return 'antes';
    if(t < D.fecha) return 'aberto';
    if(t < D.reabre) return 'pausa';
    if(t < D.fechaRe) return 'relampago';
    return 'fechado';
  }
  var TXT = {
    antes:     ['Abre segunda, 09/11, às 8h', D.abre],
    aberto:    ['Modo Black ativado · termina em', D.fecha],
    pausa:     ['Esta versão saiu do ar · reiniciando em', D.reabre],
    relampago: ['Reiniciando… última janela · termina em', D.fechaRe],
    fechado:   ['Esta versão saiu do ar', null]
  };
  var faseTxt = document.querySelector('[data-fase-txt]'), cont = document.querySelector('[data-contador]');
  var aviso = document.querySelector('[data-aviso-guias]'), avisoTxt = document.querySelector('[data-aviso-txt]');

  function dois(n){ return (n < 10 ? '0' : '') + n; }
  function falta(ms){
    if(ms < 0) ms = 0;
    var s = Math.floor(ms/1000), d = Math.floor(s/86400); s -= d*86400;
    var h = Math.floor(s/3600); s -= h*3600; var m = Math.floor(s/60); s -= m*60;
    return (d ? d + 'd ' : '') + dois(h) + ':' + dois(m) + ':' + dois(s);
  }

  function atualiza(){
    var t = agora(), f = fase(t), info = TXT[f] || TXT.aberto;
    document.body.setAttribute('data-fase', f);
    faseTxt.textContent = info[0];
    cont.textContent = info[1] ? falta(info[1] - t) : '';
    cont.hidden = !info[1];

    // guias que saem do pacote
    var saiuG = t >= D.guias || f === 'pausa' || f === 'relampago' || f === 'fechado';
    var saiuB = t >= D.behance || f === 'pausa' || f === 'relampago' || f === 'fechado';
    marcaSaiu('Guia de precificação', saiuG);
    marcaSaiu('Guia de posicionamento', saiuG);
    marcaSaiu('Guia de Behance', saiuB);

    if(aviso){
      var alvo = !saiuG ? D.guias : (!saiuB ? D.behance : null);
      if(f === 'aberto' && alvo){
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
