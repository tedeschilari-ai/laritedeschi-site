/* FigOS · página de captura (Black Friday 2026) */
(function(){
  // ====== CONFIGURAÇÃO ======
  var CONFIG = {
    grupo: '#LINK-DO-GRUPO',   // link do grupo de WhatsApp (chat.whatsapp.com/...)
    envio: ''                  // endereço que recebe os cadastros (planilha/ferramenta). Vazio = não envia.
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

  var form = document.getElementById('form');
  if(!form) return;
  document.querySelectorAll('a.cta').forEach(function(a){
    a.addEventListener('click', function(ev){
      ev.preventDefault();
      form.scrollIntoView({behavior:'smooth', block:'center'});
      setTimeout(function(){ form.nome.focus({preventScroll:true}); }, 600);
    });
  });
  var nome = form.nome, zap = form.whatsapp, email = form.email, aceite = form.aceite;
  var erro = document.getElementById('erro'), nota = document.getElementById('nota');

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

  document.getElementById('recusar').addEventListener('click', function(){
    form.classList.remove('treme'); void form.offsetWidth; form.classList.add('treme');
    nota.textContent = 'Tudo bem! Mas a condição só aparece no grupo, na noite de 08/11 😉';
    nota.classList.add('aviso');
  });

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

    var q = new URLSearchParams(location.search), dados = new FormData();
    dados.append('nome', nome.value.trim());
    dados.append('whatsapp', '+55' + zap.value.replace(/\D/g,''));
    dados.append('email', email.value.trim().toLowerCase());
    dados.append('aceite', 'sim');
    dados.append('pagina', location.pathname);
    dados.append('data', new Date().toISOString());
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){ dados.append(k, q.get(k) || ''); });

    try{ if(window.fbq) fbq('track','Lead',{content_name:'Black FigOS lista de espera'}); }catch(e){}
    var envio = CONFIG.envio ? Promise.race([
      fetch(CONFIG.envio,{method:'POST',mode:'no-cors',body:dados}).catch(function(){}),
      new Promise(function(r){ setTimeout(r, 4000); })
    ]) : Promise.resolve();

    var tela = document.getElementById('instalando');
    document.getElementById('link-grupo').href = CONFIG.grupo;
    tela.hidden = false;
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ document.getElementById('progresso').style.width = '100%'; }); });

    var espera = new Promise(function(r){ setTimeout(r, 1800); });
    Promise.all([envio, espera]).then(function(){ location.href = CONFIG.grupo; });
  });
})();
