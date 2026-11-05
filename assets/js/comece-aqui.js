/* Comece aqui · monta a trilha de quem já comprou algum curso.
   Nada é gravado: as respostas passam só por enviarRespostas(), o único ponto de envio. */
(function(){
  'use strict';

  // ====== CONFIGURAÇÃO ======
  var ABRIR_CURSO = 'https://figclub.laritedeschi.com';
  var UTM = '?utm_source=comece_aqui';
  var CARRINHO = [[1794222000000, 1794366000000], [1794452400000, 1794538800000]];
  var WHATS_DEPOIMENTO = 'https://wa.me/5541999401055?text=Ol%C3%A1%2C%20vim%20dar%20meu%20depoimento%20do%20Kit%20Design%20Studio%20para%20desbloquear%20o%20curso%20de%20Figma%20do%20zero%21';

  function enviarRespostas(respostas){
    // Para gravar de verdade, a chamada ao serviço escolhido entra aqui.
    console.log('[comece-aqui] respostas', respostas);
  }
  // ==========================

  var CURSOS = {
    figlab:   {nome:'FigLab',            c:'#ffb48f', c2:'#f6935f', url:''},
    figpost:  {nome:'FigPost',           c:'#b7a3ff', c2:'#9378f5', url:'https://laritedeschi.com/figpost'},
    figlogo:  {nome:'FigLogo',           c:'#ff9fcf', c2:'#f077b2', url:'https://laritedeschi.com/figlogo'},
    kit:      {nome:'Kit Design Studio', c:'#4aa3ff', c2:'#2f86ee', url:'https://laritedeschi.com/kitdesignstudio'},
    figbrand: {nome:'FigBrand',          c:'#a35cf5', c2:'#7f35d6', url:'https://laritedeschi.com/figbrand'}
  };

  var ITENS = [
    ['figlab','FigLab'],['figpost','FigPost'],['figlogo','FigLogo'],['kit','Kit Design Studio'],['figbrand','FigBrand'],
    ['impressao','Workshop de impressão no Figma'],['mockups','Workshop de mockups com Figma e IA'],['fotografia','Workshop de fotografia com IA'],
    ['precificacao','Guia de precificação'],['posicionamento','Guia de posicionamento para designers'],['behance','Guia de Behance'],
    ['ia','Funcionários de IA'],['dashboard','Dashboard Financeiro']
  ];
  var NO_ATALHO = ITENS.map(function(i){return i[0];}).filter(function(id){return id !== 'figbrand' && id !== 'dashboard';});

  var QUANDO_PRECISAR = [
    ['impressao','Workshop de impressão no Figma','Pra quando um cliente pedir material impresso.'],
    ['mockups','Workshop de mockups com Figma e IA','Esse é pra quando você for apresentar uma marca.'],
    ['fotografia','Workshop de fotografia com IA','Precisando de fotos, é só abrir esse.'],
    ['precificacao','Guia de precificação','Se você não sabe quanto cobrar, começa por aqui.'],
    ['posicionamento','Guia de posicionamento para designers','Pra quando você sentir que não tá atraindo o cliente que quer.'],
    ['behance','Guia de Behance','Esse aqui é pra hora de montar o seu portfólio.'],
    ['dashboard','Dashboard Financeiro','Quando quiser organizar as suas finanças.'],
    ['ia','Funcionários de IA','Pra quando você quiser ajuda de IA no estúdio. Eles já vêm prontos e a aula mostra como instalar e treinar no seu Claude, que precisa ser o Claude Pro.']
  ];

  var Q_MOMENTO = [
    {id:'p2', t:'Como é a sua relação com o Figma?', ops:[['nunca','Nunca usei'],['mexi','Já mexi, mas sem segurança'],['dia','Uso no dia a dia']]},
    {id:'p3', t:'O que você mais quer criar (ou o que mais te pedem)?', ops:[['posts','Posts e social media'],['logos','Logotipos'],['identidade','Identidade visual completa'],['naosei','Ainda não sei']]},
    {id:'p4', t:'Como está o seu estúdio hoje (proposta, contrato, briefing, processo)?', ops:[['nada','Não tenho nada'],['algumas','Tenho algumas coisas'],['tudo','Já tenho tudo estruturado']]},
    {id:'p5', t:'Você tem cliente hoje?', ops:[['nao','Ainda não'],['vezes','De vez em quando'],['agora','Tenho cliente agora, com projeto para entregar']]},
    {id:'p6', t:'Você já criou logos ou posts para alguém?', ops:[['nunca','Nunca criei'],['semmetodo','Já criei, mas sem método'],['frequente','Crio com frequência e quero melhorar a técnica']]}
  ];

  var Q_SOBRE = [
    {id:'p7', t:'Sua idade', ops:['Menos de 20 anos','20 a 23 anos','24 a 29 anos','30 a 34 anos','35 a 40 anos','Mais de 40 anos']},
    {id:'p8', t:'Com o que você trabalha hoje?', ops:['Só com design, por conta própria','Com design, em uma empresa','Tenho outro trabalho e faço freelas de design','Tô mudando de área para o design','Ainda estou estudando','Outra coisa']},
    {id:'p9', t:'Quanto você ganha por mês com design?', opcional:true, ops:['Ainda não ganho com design','Até R$500','De R$501 a R$1.000','De R$1.001 a R$2.000','De R$2.001 a R$5.000','Mais de R$5.000']}
  ];
  var Q_ABERTAS = [
    {id:'p10', t:'Qual é a sua maior dor hoje?'},
    {id:'p11', t:'Qual é o seu maior sonho com o design?'},
    {id:'p12', t:'Onde você quer chegar em 1 ano?'}
  ];

  /* ---------- lógica (sem tela) ---------- */

  function carrinhoAberto(agora){
    return CARRINHO.some(function(j){ return agora >= j[0] && agora < j[1]; });
  }
  function posicaoKit(r){
    if(r.p4 === 'tudo') return 'consulta';
    return r.p5 === 'agora' ? 'primeiro' : 'paralelo';
  }
  function ordemPrincipal(r){
    return (r.p3 === 'logos' || r.p3 === 'identidade') ? ['figlogo','figbrand','figpost'] : ['figpost','figlogo','figbrand'];
  }
  function trilhaIdeal(r){
    var lista = [];
    if(posicaoKit(r) === 'primeiro') lista.push('kit');
    if(r.p2 !== 'dia') lista.push('figlab');
    return lista.concat(ordemPrincipal(r));
  }

  var TEXTOS = {
    figlab: function(r){
      if(r.p2 === 'nunca') return {principal:'Aqui vale fazer tudo na ordem, com as atividades práticas junto.'};
      if(r.p2 === 'mexi')  return {principal:'Vai em Preparando a conta, por causa da licença educacional, e depois direto para Ferramentas avançadas. A Biblioteca de ferramentas fica para consultar quando precisar.'};
      return {principal:'Você não precisa do curso, pode ir direto para o próximo. Só passa em Preparando a conta para pegar a licença educacional, se ainda não pediu.'};
    },
    figlogo: function(r, tem){
      var principal, comp = [];
      if(r.p5 === 'agora') principal = 'Com projeto pra entregar, a sua ordem é Passo a passo para a criação, Como fazer um bom briefing?, Criando na prática e Apresentação para o cliente.';
      else if(r.p6 === 'semmetodo') principal = 'Começa em Entendendo o processo criativo e segue para Técnicas de construção, Criando na prática e Sistema de refinamento. A base de tudo fica para consulta.';
      else if(r.p6 === 'frequente') principal = 'Como você já cria bastante, vai direto em Técnicas de construção, depois Sistema de refinamento e Desafios para evoluir.';
      else principal = 'Faz tudo na ordem, começando em A base de tudo.';
      if(r.p4 === 'tudo') comp.push('A aula Fechamento e contrato você pode pular e ir direto para Criando na prática.');
      else if(tem.kit) comp.push('Se ainda não tem contrato, resolve isso antes de criar: faz a aula Fechamento e contrato ou usa o Kit Design Studio.');
      else comp.push('Se ainda não tem contrato, faz a aula Fechamento e contrato antes de criar.');
      comp.push('Se o que mais te trava é cobrar, abre a Calculadora de Precificação logo no início.');
      return {principal:principal, comp:comp};
    },
    figpost: function(r, tem){
      var principal, comp = [];
      if(r.p6 === 'semmetodo') principal = 'Começa em Passo a passo do carrossel perfeito, depois Criando na prática e Desafios para evoluir. Fundamentos do design fica para consulta.';
      else if(r.p6 === 'frequente') principal = 'Pra você, o melhor começo são as aulas Efeitos e iluminação e Correção de imagens, e depois Desafios para evoluir.';
      else principal = 'Faz tudo na ordem, começando em Fundamentos do design.';
      if(r.p5 === 'nao') comp.push('Depois de Criando na prática, faz Seu negócio de design, nas aulas Posicionamento e Prospecção e primeiros clientes.');
      else if(r.p4 === 'tudo') comp.push('Seu negócio de design você pode pular, já que o seu estúdio tá estruturado.');
      if(tem.kit) comp.push('Na aula Contrato e proposta, deixa os modelos do Kit Design Studio abertos ao lado.');
      comp.push('Se quiser vender melhor os seus carrosséis, tem o bônus Como escrever carrosséis que vendem, com Vinny Reis.');
      return {principal:principal, comp:comp};
    },
    kit: function(r){
      var pos = posicaoKit(r), posicao, principal = '', comp = [];
      if(pos === 'paralelo') posicao = {forte:'Em paralelo:', t:' vai fazendo ao lado do curso principal, pra deixar o seu estúdio organizado.'};
      else if(pos === 'primeiro') posicao = {t:'Esse vem primeiro porque você tem projeto pra entregar e o seu estúdio ainda não tá pronto.'};
      else posicao = {t:'Seu estúdio já tá estruturado, então o Kit fica só para consulta.'};
      if(pos === 'primeiro') principal = 'Vai direto em Scripts de WhatsApp e e-mail, depois Roteiros de Briefing, Modelos de Proposta e Modelos de Contrato.';
      else if(r.p4 === 'nada') principal = 'Faz tudo na ordem, começando em Processo Comercial, e vai personalizando cada documento.';
      else if(r.p4 === 'algumas') principal = 'Marca o que você já tem e personaliza só o que falta.';
      comp.push('Se a sua dificuldade é cobrar, começa pela Calculadora de Precificação e depois olha a Tabela de Serviços e Preços.');
      if(r.p2 === 'nunca') comp.push('E se você ainda não usa Figma, o Kit também funciona em Canva, Word, Google Docs, PowerPoint e Notion.');
      return {posicao:posicao, principal:principal, comp:comp};
    },
    figbrand: function(r, tem){
      var comp = [];
      if(r.p4 === 'tudo') comp.push('Na Etapa Inicial você pode ir mais rápido, só pra comparar com o que já faz.');
      else if(!tem.kit) comp.push('Pra proposta, contrato e briefing, usa a Fantástica Caixa de Ferramentas, que já tem os modelos.');
      if(r.p5 === 'nao') comp.push('Quando terminar o curso, vale ver os bônus de criação de conteúdo e de posicionamento.');
      comp.push('Se quiser anunciar, tem o bônus de tráfego pago.');
      comp.push('E se quiser ir além da entrega, olha os bônus de landing page e de Framer.');
      return {
        aviso: tem.figlogo ? '' : 'Pode começar o FigBrand tranquilamente! Só fica sabendo que o FigLogo aprofunda a parte de logo.',
        principal:'Aqui é sempre na ordem, porque cada módulo prepara para o próximo. Depois de Bem-vindos, começa em Fundamentos da marca.',
        comp:comp
      };
    }
  };

  var FRASE_FIGLAB = 'E o FigLab vem junto, que é o curso de Figma do zero.';

  function textoProximo(id, r, tem){
    var t = [];
    if(id === 'figbrand'){
      t.push(r.p3 === 'identidade'
        ? 'Você me contou que quer criar identidade visual completa, e com o FigLogo você já vai ter a base de logo. O FigBrand é o que vem depois, com estratégia.'
        : 'Você já vai ter a base de logo com o FigLogo. O FigBrand é o que vem depois, para criar a identidade visual completa com estratégia.');
    } else if(id === 'figlogo'){
      if(tem.figbrand) t.push('Como você já tem o FigBrand, o FigLogo é o que aprofunda a parte de logo.');
      else if(r.p3 === 'logos' || r.p3 === 'identidade') t.push('Pelo que você quer criar, é o FigLogo que vem agora. Ele também é a base para o FigBrand lá na frente.');
      else t.push('Os posts você já tem com o FigPost, então o próximo da sua trilha é o FigLogo, pra criar logotipos com método.');
      if(!tem.figlab) t.push(FRASE_FIGLAB);
    } else if(id === 'figpost'){
      if(r.p3 === 'posts') t.push('Você me contou que quer criar posts, então o FigPost é o que faz mais sentido agora.');
      else if(r.p3 === 'naosei') t.push('Como você ainda tá descobrindo o que mais quer criar, eu seguiria pelo FigPost, que é o próximo da sua trilha.');
      else t.push('A parte de logo você já tem com o FigLogo, e o próximo da sua trilha é o FigPost, pra criar posts também.');
      if(!tem.figlab) t.push(FRASE_FIGLAB);
    } else if(id === 'kit'){
      t.push(r.p5 === 'agora'
        ? 'Você tem projeto pra entregar e o seu estúdio ainda não tá estruturado, então eu iria de Kit Design Studio. Ele já traz modelos de proposta, contrato e briefing pra você personalizar.'
        : 'Como o seu estúdio ainda não tá estruturado, o próximo é o Kit Design Studio. Com os modelos de proposta, contrato e briefing, você só personaliza o que falta.');
    }
    return t;
  }

  function blocoCurso(id, r, tem){
    return {
      tipo:id,
      titulo:'Seu próximo passo: ' + CURSOS[id].nome,
      textos:textoProximo(id, r, tem),
      botao:'Conhecer o ' + CURSOS[id].nome,
      url:CURSOS[id].url + UTM
    };
  }

  function proximoPasso(r, tem, agora){
    var pos = posicaoKit(r), ordem = ordemPrincipal(r);
    var ideal = trilhaIdeal(r);
    if(pos === 'paralelo') ideal = ideal.concat('kit');
    var faltam = ideal.filter(function(c){ return !tem[c]; });

    if(carrinhoAberto(agora) && faltam.some(function(c){ return c !== 'figbrand'; })){
      return {
        tipo:'figos',
        titulo:'Seu próximo passo: FigOS',
        textos:['Como ainda faltam cursos na sua trilha, eu olharia o FigOS agora. Ele junta todos os cursos, menos o FigBrand, com acesso vitalício, e aí você não precisa comprar um por um.'],
        botao:'Conhecer o FigOS',
        url:'https://laritedeschi.com/figos' + UTM
      };
    }
    if(!faltam.length){
      var temOsCinco = Object.keys(CURSOS).every(function(c){ return tem[c]; });
      return temOsCinco ? {
        tipo:'tudo',
        titulo:'Você já tem tudo!',
        textos:['Agora é só seguir a sua trilha com calma. Se o seu momento mudar, volta aqui e refaz, que a ordem muda junto.']
      } : null;
    }
    var primeiroFalta = ordem.filter(function(c){ return c !== 'figbrand' && !tem[c]; })[0];
    if(faltam.indexOf('figlab') > -1 && tem.kit){
      var depois = tem.figbrand ? 'figlogo' : primeiroFalta;
      return {
        tipo:'depoimento',
        titulo:'Seu próximo passo: FigLab',
        textos:['Como você tem o Kit Design Studio, dá pra liberar o FigLab de graça: é só me mandar o seu depoimento no WhatsApp. Ele é o próximo da sua trilha, então eu começaria por aí.']
          .concat(depois ? ['Depois disso, o próximo é o ' + CURSOS[depois].nome + '.'] : []),
        botao:'Mandar meu depoimento',
        url:WHATS_DEPOIMENTO
      };
    }
    if(tem.figbrand && !tem.figlogo) return blocoCurso('figlogo', r, tem);
    if(pos === 'primeiro' && !tem.kit) return blocoCurso('kit', r, tem);
    if(faltam.indexOf('figlab') > -1) return blocoCurso(primeiroFalta, r, tem);
    if(pos === 'paralelo' && !tem.kit) return blocoCurso('kit', r, tem);
    return blocoCurso(ordem.filter(function(c){ return !tem[c]; })[0], r, tem);
  }

  // r: respostas · tem: {id:true} · agora: milissegundos
  function montar(r, tem, agora){
    var pos = posicaoKit(r);
    function cartao(id, numero){
      var t = TEXTOS[id](r, tem);
      return {id:id, nome:CURSOS[id].nome, c:CURSOS[id].c, c2:CURSOS[id].c2, numero:numero || 0,
        posicao:t.posicao || null, aviso:t.aviso || '', principal:t.principal || '', comp:t.comp || []};
    }
    var cartoes = [];
    if(tem.figlab && r.p2 === 'dia') cartoes.push(cartao('figlab'));
    var n = 0;
    trilhaIdeal(r).forEach(function(id){ if(tem[id]) cartoes.push(cartao(id, ++n)); });
    if(tem.kit && pos !== 'primeiro') cartoes.push(cartao('kit'));
    return {
      cartoes:cartoes,
      quandoPrecisar:QUANDO_PRECISAR.filter(function(q){ return tem[q[0]]; }),
      proximo:proximoPasso(r, tem, agora)
    };
  }

  window.ComeceAqui = {montar:montar, carrinhoAberto:carrinhoAberto, NO_ATALHO:NO_ATALHO};

  /* ---------- tela ---------- */

  var app = document.getElementById('app');
  if(!app) return;

  // Modo de teste: só fora do endereço oficial. Ex.: ?agora=2026-11-09T10:00 ou #agora-20261109-1000
  function dataSimulada(){
    var host = location.hostname;
    if(host === 'laritedeschi.com' || host === 'www.laritedeschi.com') return null;
    var m = location.search.match(/[?&]agora=([^&]+)/) || location.hash.match(/^#agora-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})$/);
    if(!m) return null;
    var txt = m.length > 2 ? m[1]+'-'+m[2]+'-'+m[3]+'T'+m[4]+':'+m[5] : decodeURIComponent(m[1]);
    if(!/(Z|[+-]\d{2}:?\d{2})$/.test(txt)) txt += (txt.length <= 10 ? 'T12:00' : '') + '-03:00';
    var t = new Date(txt).getTime();
    return isNaN(t) ? null : t;
  }
  var simulada = dataSimulada();
  function agoraMs(){ return simulada === null ? Date.now() : simulada; }

  var e = {}, tem = {}, labAuto = false, avisoLab = false, tela = 'abertura', enviado = false;
  var barra = document.getElementById('barra'), fill = document.getElementById('barra-fill'), voltar = document.getElementById('voltar');

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  function el(tag, cls, txt){
    var n = document.createElement(tag);
    if(cls) n.className = cls;
    if(txt !== undefined) n.textContent = txt;
    return n;
  }
  function pasta(c, c2){
    var ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg'), u = document.createElementNS(ns, 'use');
    s.setAttribute('aria-hidden', 'true');
    s.style.setProperty('--c', c); s.style.setProperty('--c2', c2);
    u.setAttribute('href', '#pasta');
    s.appendChild(u);
    return s;
  }
  function opcao(tipo, nome, valor, rotulo, marcado, aoMudar){
    var l = el('label', 'ca-op'), i = el('input');
    i.type = tipo; i.name = nome; i.value = valor; i.checked = !!marcado;
    i.addEventListener('change', function(){ aoMudar(i); });
    var m = el('span', 'ca-marca'); m.innerHTML = CHECK;
    l.appendChild(i); l.appendChild(m); l.appendChild(el('span', '', rotulo));
    return l;
  }
  function botao(txt, cls, aoClicar){
    var b = el('button', 'ca-bt' + (cls ? ' ' + cls : ''), txt);
    b.type = 'button';
    b.addEventListener('click', aoClicar);
    return b;
  }
  function acao(b){ var d = el('div', 'ca-acao'); d.appendChild(b); return d; }

  function telas(){
    var lista = ['abertura','primeira','cursos','momento'];
    if(e.primeira !== 'nao') lista.push('sobre');
    lista.push('resultado');
    return lista;
  }
  function ir(nome){
    tela = nome;
    var lista = telas(), i = lista.indexOf(nome), pct = Math.round(i / (lista.length - 1) * 100);
    fill.style.width = pct + '%';
    barra.setAttribute('aria-valuenow', pct);
    voltar.hidden = (i === 0 || nome === 'resultado');
    app.textContent = '';
    app.style.animation = 'none'; void app.offsetWidth; app.style.animation = '';
    ({abertura:tAbertura, primeira:tPrimeira, cursos:tCursos, momento:tMomento, sobre:tSobre, resultado:tResultado})[nome]();
    window.scrollTo(0, 0);
    app.focus({preventScroll:true});
  }
  function avancar(){ var l = telas(); ir(l[l.indexOf(tela) + 1]); }
  voltar.addEventListener('click', function(){ var l = telas(); ir(l[l.indexOf(tela) - 1]); });

  function tAbertura(){
    var h = el('h1');
    h.append('Vamos montar a sua ');
    var s = el('span', 'ca-sel');
    s.appendChild(el('i')); s.append('trilha'); s.appendChild(el('i'));
    h.appendChild(s); h.append('!');
    app.appendChild(h);
    app.appendChild(el('p', 'ca-texto', 'Me conta o que você já tem e como tá o seu momento, que eu te mostro qual curso fazer primeiro, por qual módulo começar em cada um e o que vem depois.'));
    app.appendChild(el('p', 'ca-texto', 'Leva poucos minutos, e quando você comprar algo novo é só voltar aqui e refazer.'));
    app.appendChild(acao(botao('Começar', '', avancar)));
  }

  function tPrimeira(){
    var f = el('fieldset', 'ca-grupo'), ops = el('div', 'ca-opcoes');
    var titulo = el('legend'); titulo.appendChild(el('h2', '', 'É a primeira vez que você responde?'));
    f.appendChild(titulo);
    [['sim','Sim, é a primeira vez'],['nao','Não, já respondi antes']].forEach(function(o){
      ops.appendChild(opcao('radio', 'primeira', o[0], o[1], false, function(){
        e.primeira = o[0];
        if(o[0] === 'nao') ['p7','p8','p9','p10','p11','p12'].forEach(function(k){ delete e[k]; });
        avancar();
      }));
    });
    f.appendChild(ops);
    app.appendChild(f);
  }

  function tCursos(){
    var inputs = {}, aviso = el('p', 'ca-aviso', 'O FigLab vem junto com o FigLogo e com o FigPost, então já deixei marcado pra você.');
    var seguir = botao('Continuar', '', avancar);
    function atualizar(){
      Object.keys(inputs).forEach(function(k){ inputs[k].checked = !!tem[k]; });
      aviso.hidden = !(avisoLab && (tem.figlogo || tem.figpost));
      seguir.disabled = !Object.keys(tem).some(function(k){ return tem[k]; });
    }
    function regraFiglab(id){
      var fonte = tem.figlogo || tem.figpost;
      if((id === 'figlogo' || id === 'figpost') && tem[id]){
        if(!tem.figlab) labAuto = true;
        tem.figlab = true;
        avisoLab = true;
      }
      if((id === 'figlogo' || id === 'figpost') && !tem[id] && !fonte && labAuto){
        delete tem.figlab; labAuto = false;
      }
      if(id === 'figlab'){
        labAuto = false;
        if(!tem.figlab && fonte){ tem.figlab = true; labAuto = true; avisoLab = true; }
      }
    }

    app.appendChild(el('h2', '', 'Quais destes você já tem?'));
    app.appendChild(el('p', 'ca-apoio', 'Pode marcar vários.'));

    var at = el('div', 'ca-atalho');
    at.appendChild(botao('Comprei o FigOS', 'ca-sec', function(){
      var todos = NO_ATALHO.every(function(id){ return tem[id]; });
      NO_ATALHO.forEach(function(id){ if(todos) delete tem[id]; else tem[id] = true; });
      labAuto = false; avisoLab = false;
      atualizar();
    }));
    at.appendChild(el('p', 'ca-apoio', 'Esse botão já marca tudo o que vem no FigOS. O FigBrand e o Dashboard Financeiro são separados, então se você tiver, marca eles também.'));
    app.appendChild(at);

    var f = el('fieldset', 'ca-grupo'), ops = el('div', 'ca-opcoes');
    ITENS.forEach(function(it){
      var l = opcao('checkbox', 'tem', it[0], it[1], tem[it[0]], function(i){
        if(i.checked) tem[it[0]] = true; else delete tem[it[0]];
        regraFiglab(it[0]);
        atualizar();
      });
      inputs[it[0]] = l.querySelector('input');
      ops.appendChild(l);
    });
    f.appendChild(ops);
    f.appendChild(aviso);
    app.appendChild(f);
    app.appendChild(acao(seguir));
    atualizar();
  }

  function grupoRadio(q, aoMudar){
    var f = el('fieldset', 'ca-grupo'), ops = el('div', 'ca-opcoes');
    var titulo = el('legend', '', q.t);
    f.appendChild(titulo);
    if(q.opcional) titulo.appendChild(el('span', 'ca-apoio', ' (opcional)'));
    q.ops.forEach(function(o){
      var val = Array.isArray(o) ? o[0] : o, rot = Array.isArray(o) ? o[1] : o;
      ops.appendChild(opcao('radio', q.id, val, rot, e[q.id] === val, function(){
        e[q.id] = val;
        aoMudar();
      }));
    });
    f.appendChild(ops);
    return f;
  }

  function tMomento(){
    var comP6 = !!(tem.figlogo || tem.figpost);
    if(!comP6) delete e.p6;
    var ultimo = e.primeira === 'nao';
    var seguir = botao(ultimo ? 'Ver minha trilha' : 'Continuar', '', avancar);
    function checar(){
      seguir.disabled = !(e.p2 && e.p3 && e.p4 && e.p5 && (!comP6 || e.p6));
    }
    app.appendChild(el('p', 'ca-texto', 'Agora me conta um pouquinho de como as coisas estão hoje, porque é isso que define a sua ordem.'));
    Q_MOMENTO.forEach(function(q){
      if(q.id === 'p6' && !comP6) return;
      app.appendChild(grupoRadio(q, checar));
    });
    app.appendChild(acao(seguir));
    checar();
  }

  function tSobre(){
    var seguir = botao('Ver minha trilha', '', avancar);
    function checar(){
      var abertas = Q_ABERTAS.every(function(q){ return (e[q.id] || '').trim(); });
      seguir.disabled = !(e.p7 && e.p8 && abertas);
    }
    app.appendChild(el('p', 'ca-texto', 'Essas últimas são sobre você. As respostas são anônimas e me ajudam a criar conteúdos e cursos melhores.'));
    Q_SOBRE.forEach(function(q){ app.appendChild(grupoRadio(q, checar)); });
    Q_ABERTAS.forEach(function(q, i){
      var w = el('div', 'ca-grupo'), id = 'campo-' + q.id, l = el('label', '', q.t), t = el('textarea', 'ca-campo');
      l.htmlFor = id; l.style.cssText = 'display:block;font-size:19px;line-height:1.28;font-weight:500;letter-spacing:-.02em;margin-bottom:12px;text-wrap:balance';
      w.appendChild(l);
      if(i === 0) w.appendChild(el('p', 'ca-apoio', 'Pode escrever do seu jeito, uma frase já tá ótimo.')).style.margin = '-6px 0 12px';
      t.id = id; t.maxLength = 500; t.rows = 3; t.value = e[q.id] || ''; t.autocomplete = 'off';
      t.addEventListener('input', function(){ e[q.id] = t.value; checar(); });
      w.appendChild(t);
      app.appendChild(w);
    });
    app.appendChild(acao(seguir));
    checar();
  }

  function tResultado(){
    var m = montar(e, tem, agoraMs());
    app.appendChild(el('h1', '', 'Sua trilha tá pronta!'));
    app.appendChild(el('p', 'ca-texto', 'Montei essa ordem com o que você já tem e com o seu momento de agora. Todo curso começa pelo módulo de boas-vindas, e o que eu falar pra pular continua lá, caso você queira consultar depois.'));

    if(m.cartoes.length){
      var ul = el('ol', 'ca-trilha');
      m.cartoes.forEach(function(c){
        var li = el('li', 'ca-curso'), topo = el('div', 'ca-curso-topo');
        if(c.numero) topo.appendChild(el('span', 'ca-num', String(c.numero)));
        topo.appendChild(pasta(c.c, c.c2));
        topo.appendChild(el('h3', '', c.nome));
        li.appendChild(topo);
        if(c.posicao){
          var p = el('p', 'ca-pos');
          if(c.posicao.forte) p.appendChild(el('b', '', c.posicao.forte));
          p.append(c.posicao.t);
          li.appendChild(p);
        }
        if(c.aviso) li.appendChild(el('p', 'ca-pos', c.aviso));
        if(c.principal) li.appendChild(el('p', 'ca-principal', c.principal));
        if(c.comp.length){
          var cp = el('ul', 'ca-comp');
          c.comp.forEach(function(t){ cp.appendChild(el('li', '', t)); });
          li.appendChild(cp);
        }
        var a = el('a', 'ca-bt ca-sec', 'Abrir o curso');
        a.href = ABRIR_CURSO; a.target = '_blank'; a.rel = 'noopener';
        li.appendChild(a);
        ul.appendChild(li);
      });
      app.appendChild(ul);
    }

    if(m.quandoPrecisar.length){
      var b = el('div', 'ca-bloco');
      b.appendChild(el('h2', '', 'Quando precisar'));
      b.appendChild(el('p', 'ca-texto', 'Esses aqui não têm ordem, você abre na hora em que fizer sentido.'));
      var q = el('ul', 'ca-precisar');
      m.quandoPrecisar.forEach(function(it){
        var li = el('li');
        li.appendChild(el('b', '', it[1]));
        li.append(it[2]);
        q.appendChild(li);
      });
      b.appendChild(q);
      app.appendChild(b);
    }

    if(m.proximo){
      var px = el('div', 'ca-prox');
      px.appendChild(el('h2', '', m.proximo.titulo));
      m.proximo.textos.forEach(function(t){ px.appendChild(el('p', '', t)); });
      if(m.proximo.url){
        var go = el('a', 'ca-bt ca-oferta', m.proximo.botao);
        go.href = m.proximo.url; go.target = '_blank'; go.rel = 'noopener';
        px.appendChild(go);
      }
      app.appendChild(px);
    }

    var rf = el('div', 'ca-refazer');
    rf.appendChild(el('p', 'ca-texto', 'Quando comprar algo novo ou mudar de momento, é só refazer o formulário que a sua trilha se atualiza.'));
    rf.appendChild(botao('Refazer', 'ca-sec', function(){
      e = {}; tem = {}; labAuto = false; avisoLab = false; enviado = false;
      ir('abertura');
    }));
    app.appendChild(rf);

    if(!enviado){
      enviado = true;
      var resp = {};
      Object.keys(e).forEach(function(k){ resp[k] = typeof e[k] === 'string' ? e[k].trim() : e[k]; });
      enviarRespostas({
        respostas:resp,
        tem:Object.keys(tem).filter(function(k){ return tem[k]; }),
        trilha:m.cartoes.map(function(c){ return c.id; }),
        proximo:m.proximo ? m.proximo.tipo : null
      });
    }
  }

  if(location.hostname !== 'laritedeschi.com' && location.hostname !== 'www.laritedeschi.com'){
    window.addEventListener('hashchange', function(){ location.reload(); });
  }
  if(simulada !== null){
    document.body.appendChild(el('div', 'ca-teste', 'Modo de teste · data simulada: ' + new Date(simulada).toLocaleString('pt-BR', {timeZone:'America/Sao_Paulo', dateStyle:'short', timeStyle:'short'})));
  }
  ir('abertura');
})();
