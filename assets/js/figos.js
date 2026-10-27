/* FigOS · página de captura (Black Friday 2026) */
(function(){
  // ====== CONFIGURAÇÃO ======
  var CONFIG = {
    grupo: 'https://chat.whatsapp.com/DkxE6vZTGekGDeehm1a86Q?mode=gi_t',   // link do grupo de WhatsApp (chat.whatsapp.com/...)
    envio: 'https://script.google.com/macros/s/AKfycbywHMAP7sfjolv_SzIlHtDPYPpzLmvP3hKTEDaacgrTXzZ72u5BcU5YaTbvp2gIq-xQeA/exec'                  // endereço que recebe os cadastros (planilha/ferramenta). Vazio = não envia.
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

  var conv = document.getElementById('conversa');
  if(conv){
    if(!('IntersectionObserver' in window)) conv.classList.add('ativa');
    else { var co = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ conv.classList.add('ativa'); co.disconnect(); } }); },{threshold:.55}); co.observe(conv); }
  }

  var vm = document.getElementById('ver-mais');
  if(vm) vm.addEventListener('click', function(){ document.getElementById('depos').classList.add('aberto'); vm.parentNode.hidden = true; });

  var form = document.getElementById('form');
  if(!form) return;
  var modal = document.getElementById('modal'), quemAbriu = null;
  function abrir(ev){
    if(ev) ev.preventDefault();
    quemAbriu = document.activeElement;
    modal.hidden = false; document.body.classList.add('travado');
    try{ if(window.fbq) fbq('trackCustom','AbriuFormulario'); }catch(e){}
    setTimeout(function(){ form.nome.focus(); }, 60);
  }
  function fechar(){
    if(document.getElementById('instalando').hidden === false && /^https?:/.test(CONFIG.grupo)) return;
    modal.hidden = true; document.body.classList.remove('travado');
    if(quemAbriu && quemAbriu.focus) quemAbriu.focus();
  }
  document.querySelectorAll('a.cta, .abrir-form').forEach(function(b){ b.addEventListener('click', abrir); });
  modal.querySelectorAll('.fechar').forEach(function(b){ b.addEventListener('click', fechar); });
  document.addEventListener('keydown', function(e){
    if(modal.hidden) return;
    if(e.key === 'Escape') fechar();
    if(e.key === 'Tab'){
      var f = [].slice.call(form.querySelectorAll('button,input,a[href]')).filter(function(x){ return x.offsetParent !== null; });
      if(!f.length) return;
      if(e.shiftKey && document.activeElement === f[0]){ e.preventDefault(); f[f.length-1].focus(); }
      else if(!e.shiftKey && document.activeElement === f[f.length-1]){ e.preventDefault(); f[0].focus(); }
    }
  });
  var nome = form.nome, zap = form.whatsapp, email = form.email, aceite = form.aceite;
  var erro = document.getElementById('erro');

  // máscara do WhatsApp: (41) 99999-9999
  zap.addEventListener('input', function(){
    var d = zap.value.replace(/\D/g,'').replace(/^55(?=\d{10,11}$)/,'').slice(0,11), v = '';
    if(d.length > 0) v = '(' + d.slice(0,2);
    if(d.length >= 3) v += ') ' + d.slice(2, d.length > 10 ? 7 : 6);
    if(d.length >= 7) v += '-' + d.slice(d.length > 10 ? 7 : 6);
    zap.value = v;
  });

  [nome,zap,email].forEach(function(i){ i.addEventListener('input', function(){ i.classList.remove('invalido'); erro.textContent=''; }); });
  aceite.addEventListener('change', function(){ aceite.closest('.check').classList.remove('invalido'); erro.textContent=''; });


  function falha(campo, msg){
    if(campo.type === 'checkbox') campo.closest('.check').classList.add('invalido');
    else campo.classList.add('invalido');
    erro.textContent = msg; campo.focus(); return false;
  }

  function valido(){
    var dig = zap.value.replace(/\D/g,'');
    if(nome.value.trim().length < 2) return falha(nome, 'Me conta seu nome para eu te chamar no grupo.');
    if(dig.length < 10 || dig.length > 11) return falha(zap, 'Confere o WhatsApp com DDD, tipo (41) 99999-9999.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) return falha(email, 'Confere o e-mail, parece que falta alguma coisa.');
    if(!aceite.checked) return falha(aceite, 'Marque a caixinha para receber as informações da Black.');
    return true;
  }

  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    if(!valido()) return;
    form.querySelector('.b-aceitar').disabled = true;

    var q = new URLSearchParams(location.search), dados = new URLSearchParams();
    dados.append('nome', nome.value.trim());
    dados.append('whatsapp', '+55' + zap.value.replace(/\D/g,''));
    dados.append('email', email.value.trim().toLowerCase());
    dados.append('aceite', 'sim');
    dados.append('pagina', location.pathname);
    dados.append('data', new Date().toISOString());
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){ dados.append(k, q.get(k) || ''); });

    try{ if(window.fbq) fbq('track','Lead',{content_name:'Black FigOS lista de espera'}); }catch(e){}
    var envio = CONFIG.envio ? Promise.race([
      fetch(CONFIG.envio,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:dados.toString()}).catch(function(){}),
      new Promise(function(r){ setTimeout(r, 4000); })
    ]) : Promise.resolve();

    var tela = document.getElementById('instalando');
    document.getElementById('link-grupo').href = CONFIG.grupo;
    tela.hidden = false;
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ document.getElementById('progresso').style.width = '100%'; }); });

    var espera = new Promise(function(r){ setTimeout(r, 1800); });
    var temGrupo = /^https?:/.test(CONFIG.grupo);
    if(!temGrupo){
      tela.querySelector('p').textContent = 'Cadastro feito! O link do grupo chega no seu WhatsApp e no seu e-mail.';
      tela.querySelector('b').textContent = 'FigOS recebido ✓';
    }
    Promise.all([envio, espera]).then(function(){ if(temGrupo) location.href = CONFIG.grupo; });
  });
})();
