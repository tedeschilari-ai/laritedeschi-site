/* Black FigOS · página de vendas (pública e de alunas) */
(function(){
  // ====== CONFIGURAÇÃO ======
  // Um link só: o cupom de aluna é aplicado automaticamente pelo e-mail no checkout.
  var CHECKOUT = 'https://pay.kiwify.com.br/nMhMQ2M';   // link da Kiwify do Black FigOS
  // Datas no horário de Brasília (-03:00). A abertura (09/11, 8h) fica na trava do início do <head> da página.
  var D = {
    fecha:     new Date('2026-11-11T00:00:00-03:00'),   // fim de 10/11, 23h59
    reabre:    new Date('2026-11-12T00:00:00-03:00'),   // reabertura relâmpago
    fechaRe:   new Date('2026-11-13T00:00:00-03:00')    // fim de 12/11, 23h59
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

  // ver mais depoimentos
  var vm = document.getElementById('ver-mais');
  if(vm) vm.addEventListener('click', function(){ document.getElementById('depos').classList.add('aberto'); vm.parentNode.hidden = true; });

  // checkout: repassa as UTMs da página para a Kiwify. O parâmetro de teste "agora" nunca vai junto.
  var q = location.search;
  var repasse = new URLSearchParams(q); repasse.delete('agora'); repasse = repasse.toString();
  var HREF = CHECKOUT + (repasse ? (CHECKOUT.indexOf('?') > -1 ? '&' : '?') + repasse : '');
  var botoes = document.querySelectorAll('[data-checkout]');
  botoes.forEach(function(a){
    a.href = HREF;
    a.addEventListener('click', function(){
      if(a.getAttribute('aria-disabled') === 'true') return;
      try{ if(window.fbq) fbq('track','InitiateCheckout',{value:397, currency:'BRL'}); }catch(e){}
    });
  });

  // contagem regressiva (para testar: ?agora=2026-11-09T15:00:00-03:00)
  var agoraFixo = (q.match(/[?&]agora=([^&]+)/) || [])[1];
  var inicio = Date.now(), agoraBase = NaN;
  if(agoraFixo){ try{ agoraBase = new Date(decodeURIComponent(agoraFixo)).getTime(); }catch(e){} }
  function agora(){ return isNaN(agoraBase) ? new Date() : new Date(agoraBase + (Date.now() - inicio)); }
  var CD = {}; document.querySelectorAll('[data-cd]').forEach(function(el){ CD[el.getAttribute('data-cd')] = el; });
  function dois(n){ return (n < 10 ? '0' : '') + n; }
  function partes(ms){
    if(ms < 0) ms = 0;
    var s = Math.floor(ms/1000), d = Math.floor(s/86400); s -= d*86400;
    var h = Math.floor(s/3600); s -= h*3600; var m = Math.floor(s/60); s -= m*60;
    return {d:d, h:h, m:m, s:s};
  }
  function falta(ms){ var p = partes(ms); return (p.d ? p.d + 'd ' : '') + dois(p.h) + ':' + dois(p.m) + ':' + dois(p.s); }

  // estados: aberto (09 e 10/11) · pausa (11/11) · reaberto (12/11) · fechado (depois de 12/11, 23h59)
  var telaOff = document.querySelector('[data-tela-off]'), offTxt = document.querySelector('[data-off-txt]'), offPeq = document.querySelector('[data-off-peq]');
  var faixaRe = document.querySelector('[data-reabertura]'), rotCd = document.querySelector('[data-cd-rot]'), faqPrazo = document.querySelector('[data-faq-prazo]');
  var faqOriginal = faqPrazo ? faqPrazo.textContent : '', estadoAtual = '';
  function estado(t){
    if(t >= D.fechaRe) return 'fechado';
    if(t >= D.reabre) return 'reaberto';
    if(t >= D.fecha) return 'pausa';
    return 'aberto';
  }
  function aplicaEstado(e){
    if(e === estadoAtual) return; estadoAtual = e;
    var off = (e === 'pausa' || e === 'fechado');
    if(telaOff) telaOff.hidden = !off;
    document.body.classList.toggle('off', off);
    if(e === 'fechado'){
      if(offTxt) offTxt.textContent = 'O FigOS fechou. Obrigada a todo mundo que instalou 💖 Se você comprou, o acesso está no seu e-mail.';
      if(offPeq) offPeq.hidden = true;
    }
    botoes.forEach(function(a){
      if(off){ a.removeAttribute('href'); a.setAttribute('aria-disabled','true'); a.style.pointerEvents = 'none'; }
      else { a.href = HREF; a.removeAttribute('aria-disabled'); a.style.pointerEvents = ''; }
    });
    if(faixaRe) faixaRe.hidden = (e !== 'reaberto');
    if(faqPrazo) faqPrazo.textContent = (e === 'reaberto') ? 'Só até hoje, quinta, 12/11, às 23h59.' : faqOriginal;
  }

  function atualiza(){
    var t = agora(), e = estado(t);
    aplicaEstado(e);
    var alvoFim = (e === 'reaberto') ? D.fechaRe : D.fecha;
    var p = partes(alvoFim - t);
    CD.d.textContent = dois(p.d); CD.h.textContent = dois(p.h); CD.m.textContent = dois(p.m); CD.s.textContent = dois(p.s);
    if(rotCd){
      var ultimas = (e === 'aberto' && D.fecha - t <= 6*3600*1000);
      rotCd.textContent = e === 'reaberto' ? 'Reiniciando… fecha em' : (ultimas ? 'Últimas horas · o FigOS fecha em' : 'O FigOS fecha em');
    }
  }
  atualiza(); setInterval(atualiza, 1000);
})();
