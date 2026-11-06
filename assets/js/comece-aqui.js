/* Comece aqui · monta a trilha de quem já comprou algum curso.
   As respostas só saem da página por enviarRespostas(), o único ponto de envio. */
(function(){
  'use strict';

  // ====== CONFIGURAÇÃO ======
  // Endereço da planilha: é só colar aqui, entre as aspas. Vazio = não envia nada e não dá erro.
  var ENDERECO_PLANILHA = 'https://script.google.com/macros/s/AKfycbz_cLHASwFVBTpEqpQd7egdCZOHh8tElBfYbRhHC-MCQOQdpGJdvuetyiLdC2gj_5CtrA/exec';

  var ABRIR_CURSO = 'https://figclub.laritedeschi.com';
  var UTM = '?utm_source=comece_aqui';
  var CARRINHO = [[1794222000000, 1794366000000], [1794452400000, 1794538800000]];
  // Funcionários de IA: bônus surpresa da Black, só aparece na lista depois da revelação (09/11, 8h).
  var REVELA_IA = 1794222000000;
  var WHATS_DEPOIMENTO = 'https://wa.me/5541999401055?text=Ol%C3%A1%2C%20vim%20dar%20meu%20depoimento%20do%20Kit%20Design%20Studio%20para%20desbloquear%20o%20curso%20de%20Figma%20do%20zero%21';

  function enviarRespostas(dados){
    if(!ENDERECO_PLANILHA) return;
    // Falha no envio nunca pode travar nem mudar o que a pessoa vê.
    try {
      var envio = fetch(ENDERECO_PLANILHA, {
        method:'POST',
        mode:'no-cors',
        keepalive:true,
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body:JSON.stringify(dados)
      });
      if(envio && envio.catch) envio.catch(function(){});
    } catch(erro) {}
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
    {id:'p3', t:'O que você mais quer criar (ou o que mais te pedem)?', multi:true, apoio:'Pode marcar mais de um.', ops:[['posts','Posts e social media'],['logos','Logotipos'],['identidade','Identidade visual completa'],['naosei','Ainda não sei']]},
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
  function marcou(r, opcao){ return (r.p3 || []).indexOf(opcao) > -1; }
  function ordemPrincipal(r){
    var posts = marcou(r, 'posts'), logos = marcou(r, 'logos'), identidade = marcou(r, 'identidade');
    if(!logos && !identidade) return ['figpost','figlogo','figbrand'];
    if(!posts) return ['figlogo','figbrand','figpost'];
    if(r.p2 !== 'dia') return ['figpost','figlogo','figbrand'];
    return identidade ? ['figlogo','figbrand','figpost'] : ['figlogo','figpost','figbrand'];
  }
  function trilhaIdeal(r){
    var lista = [];
    if(posicaoKit(r) === 'primeiro') lista.push('kit');
    if(r.p2 !== 'dia') lista.push('figlab');
    return lista.concat(ordemPrincipal(r));
  }

  var OUTROS_MODULOS = 'Os outros módulos do curso';
  function aula(nome){ return {nome:nome, aula:true}; }
  function nomePasso(p){ return typeof p === 'string' ? p : p.nome; }
  function inserirAntes(passos, referencia, novos){
    var i = passos.map(nomePasso).indexOf(referencia);
    return passos.slice(0, i).concat(novos, passos.slice(i));
  }

  // Cada curso devolve: porque, passos, consulta, pular, notaCrono, notaPular, dicas (e posicao, aviso).
  var COMO_FAZER = {
    figlab: function(r){
      if(r.p2 === 'nunca') return {
        porque:'Como você ainda não usou o Figma, o melhor é ir do básico para o avançado: primeiro a conta pronta e as Ferramentas essenciais, e só depois as avançadas. Vai fazendo as atividades práticas junto.',
        passos:['Bem-vindos','Preparando a conta','Ferramentas essenciais','Finalização e exportação','Ferramentas avançadas','Atualizações do Figma','Biblioteca de ferramentas']
      };
      if(r.p2 === 'mexi') return {
        porque:'Você já conhece o Figma, então dá pra deixar a conta pronta, com a licença educacional, e ir direto para as Ferramentas avançadas. Se bater insegurança em alguma coisa básica, ela tá logo abaixo, no que fica para consulta.',
        passos:['Bem-vindos','Preparando a conta','Ferramentas avançadas'],
        consulta:['Ferramentas essenciais','Finalização e exportação','Atualizações do Figma','Biblioteca de ferramentas']
      };
      return {
        porque:'Como você já domina o Figma, você pode usar este curso para complementar os seus conhecimentos no Figma, com ferramentas novas e com as atualizações.',
        passos:['Ferramentas avançadas','Atualizações do Figma','Biblioteca de ferramentas'],
        consulta:['Bem-vindos','Preparando a conta','Ferramentas essenciais','Finalização e exportação'],
        dicas:['Se ainda não pediu a licença educacional, ela tá em Preparando a conta.']
      };
    },
    figlogo: function(r, tem){
      var c, temCriando = true, pular = [], notaCrono = '', notaPular = '';
      if(r.p5 === 'agora') c = {
        porque:'Com projeto pra entregar, a sua ordem segue o caminho desse projeto: entender o passo a passo, fazer o briefing, criar e apresentar para o cliente. O resto do curso fica para consulta, e você volta nele com calma depois da entrega.',
        passos:['Comece por aqui',aula('Passo a passo para a criação'),aula('Como fazer um bom briefing?'),'Criando na prática',aula('Apresentação para o cliente')],
        consulta:[OUTROS_MODULOS]
      };
      else if(r.p6 === 'semmetodo') c = {
        porque:'Você já cria, e o que falta é um método, então a sua ordem começa no processo criativo e nas técnicas de construção, pra depois aplicar tudo em Criando na prática. O refinamento fica por último porque aí você já tem um logo pra refinar.',
        passos:['Comece por aqui','Entendendo o processo criativo','Técnicas de construção','Criando na prática','Sistema de refinamento'],
        consulta:['A base de tudo','Desafios para evoluir','Plano de evolução','Bônus']
      };
      else if(r.p6 === 'frequente'){ temCriando = false; c = {
        porque:'Com a frequência com que você já cria, faz mais sentido ir direto na técnica: primeiro Técnicas de construção, depois Sistema de refinamento. Os Desafios para evoluir vêm no fim, pra você praticar o que acabou de ver.',
        passos:['Comece por aqui','Técnicas de construção','Sistema de refinamento','Desafios para evoluir'],
        consulta:['A base de tudo','Entendendo o processo criativo','Criando na prática','Plano de evolução','Bônus']
      }; }
      else c = {
        porque:'Você ainda não criou nenhum logo, então essa ordem vai construindo aos poucos: primeiro a base e o processo criativo, depois as técnicas, e aí você vai criar na prática já sabendo o que tá fazendo. Os desafios e o plano de evolução vêm no fim, pra você seguir evoluindo.',
        passos:['Comece por aqui','A base de tudo','Entendendo o processo criativo','Técnicas de construção','Criando na prática','Sistema de refinamento','Desafios para evoluir','Plano de evolução'],
        consulta:['Bônus']
      };
      if(temCriando){
        if(r.p4 === 'tudo'){
          pular.push('Fechamento e contrato');
          notaPular = 'Com o seu estúdio estruturado, dá pra ir direto para Criando na prática.';
        } else {
          c.passos = inserirAntes(c.passos, 'Criando na prática', [aula('Fechamento e contrato')]);
          notaCrono = tem.kit
            ? 'A aula Fechamento e contrato entrou antes de Criando na prática pra você não começar a criar sem contrato. Se você já tem o seu, pode pular, e se não tem, também dá pra usar os Modelos de Contrato do Kit Design Studio.'
            : 'A aula Fechamento e contrato entrou antes de Criando na prática pra você não começar a criar sem contrato. Se você já tem o seu, pode pular.';
        }
      }
      c.pular = pular; c.notaCrono = notaCrono; c.notaPular = notaPular;
      return c;
    },
    figpost: function(r, tem){
      var NEGOCIO = 'Seu negócio de design', AULAS = [aula('Posicionamento'), aula('Prospecção e primeiros clientes')];
      var semCliente = r.p5 === 'nao', dispensa = r.p4 === 'tudo' && !semCliente;
      var c, dicas = [];
      if(r.p6 === 'semmetodo'){
        c = {
          porque:'Como você já cria, mas sem método, o melhor começo é o Passo a passo do carrossel perfeito. Aí você aplica esse passo a passo em Criando na prática e treina nos Desafios para evoluir.',
          passos:['Onboarding','Passo a passo do carrossel perfeito','Criando na prática','Desafios para evoluir'],
          consulta:['Fundamentos do design',NEGOCIO,'Bônus']
        };
        if(semCliente){
          c.passos = inserirAntes(c.passos, 'Desafios para evoluir', AULAS);
          c.consulta = c.consulta.filter(function(m){ return m !== NEGOCIO; });
        }
      } else if(r.p6 === 'frequente'){
        c = {
          porque:'Você já cria com frequência e quer melhorar a técnica, então as aulas de Efeitos e iluminação e Correção de imagens vêm antes de tudo. Depois disso, os Desafios para evoluir são onde você coloca em prática.',
          passos:['Onboarding',aula('Efeitos e iluminação'),aula('Correção de imagens'),'Desafios para evoluir'],
          consulta:[OUTROS_MODULOS]
        };
        if(semCliente) c.passos = c.passos.concat(AULAS);
      } else {
        c = {
          porque:'Você tá começando, então primeiro vêm os Fundamentos do design e o Passo a passo do carrossel perfeito, pra quando chegar em Criando na prática você já saber o que fazer. Os Desafios para evoluir ficam pra depois de você ter praticado.',
          passos:['Onboarding','Fundamentos do design','Passo a passo do carrossel perfeito','Criando na prática'].concat(semCliente ? AULAS : (dispensa ? [] : [NEGOCIO]), ['Desafios para evoluir']),
          consulta:['Bônus']
        };
      }
      if(semCliente) c.notaCrono = 'Como você ainda não tem cliente, entraram no cronograma essas duas aulas do módulo Seu negócio de design.';
      if(dispensa){
        c.pular = [NEGOCIO];
        c.consulta = c.consulta.filter(function(m){ return m !== NEGOCIO; });
        c.notaPular = 'Com o seu estúdio estruturado e já tendo cliente, esse módulo não precisa entrar agora.';
      }
      if(tem.kit) dicas.push('Quando fizer a aula Contrato e proposta, deixa os modelos do Kit Design Studio abertos ao lado.');
      dicas.push('Se quiser vender melhor os seus carrosséis, tem o bônus Como escrever carrosséis que vendem, com Vinny Reis.');
      c.dicas = dicas;
      return c;
    },
    kit: function(r, tem, temOutro){
      var pos = posicaoKit(r), c;
      var dicas = ['Se a sua dificuldade é cobrar, olha a Tabela de Serviços e Preços.'];
      if(r.p2 === 'nunca') dicas.push('E se você ainda não usa Figma, o Kit também funciona em Canva, Word, Google Docs, PowerPoint e Notion.');
      if(pos === 'consulta') return {
        posicao:{t:'Como o seu estúdio já tá estruturado, o Kit Design Studio fica aqui para você consultar quando precisar.'},
        passos:[],
        dicas:dicas
      };
      if(pos === 'primeiro') c = {
        posicao:{t: temOutro ? 'Esse vem primeiro porque você tem projeto pra entregar e o seu estúdio ainda não tá pronto.' : 'Como você tem projeto pra entregar e o seu estúdio ainda não tá pronto, esse é o seu foco agora.'},
        porque:'As aulas estão na ordem em que você vai usar cada uma nesse projeto: primeiro como falar com o cliente, depois o briefing, a proposta e o contrato. O resto do Kit Design Studio fica para consulta por enquanto.',
        passos:['Bem-vindos',aula('Scripts de WhatsApp e e-mail'),aula('Roteiros de Briefing'),aula('Modelos de Proposta'),aula('Modelos de Contrato')],
        consulta:[OUTROS_MODULOS]
      };
      else c = {
        posicao: temOutro ? {forte:'Em paralelo:', t:' vai fazendo ao lado do curso principal, pra deixar o seu estúdio organizado.'} : {t:'Vai usando no dia a dia, pra deixar o seu estúdio organizado.'},
        porque: r.p4 === 'nada'
          ? 'Essa ordem segue o caminho de um cliente: primeiro o Processo Comercial, depois os Documentos Profissionais e a Gestão de Projetos. Como você tá montando tudo do começo, vai personalizando cada documento conforme avança.'
          : 'Essa ordem segue o caminho de um cliente: primeiro o Processo Comercial, depois os Documentos Profissionais e a Gestão de Projetos. Marca o que você já tem e personaliza só o que falta.',
        passos:['Bem-vindos','Processo Comercial','Documentos Profissionais','Gestão de Projetos','Próximos passos'],
        consulta:['Bônus']
      };
      c.dicas = dicas;
      return c;
    },
    figbrand: function(r, tem){
      var estruturado = r.p4 === 'tudo', dicas = [];
      if(!estruturado && !tem.kit) dicas.push('Pra proposta, contrato e briefing, usa a Fantástica Caixa de Ferramentas, que já tem os modelos.');
      if(r.p5 === 'nao') dicas.push('Quando terminar o curso, vale ver os bônus de criação de conteúdo e de posicionamento.');
      dicas.push('Se quiser anunciar, tem o bônus de tráfego pago.');
      dicas.push('E se quiser ir além da entrega, olha os bônus de landing page e de Framer.');
      return {
        aviso: tem.figlogo ? '' : 'Pode começar o FigBrand tranquilamente! Só fica sabendo que o FigLogo aprofunda a parte de logo.',
        porque:'O FigBrand vai sempre nessa ordem, em qualquer momento que você esteja, porque cada módulo prepara para o próximo.',
        passos:['Bem-vindos','Fundamentos da marca', estruturado ? {nome:'Etapa Inicial', rapido:true} : 'Etapa Inicial','Estratégia de marca','Criação da Identidade Visual','Fechamento e entrega','Estudos de caso'],
        consulta:['Hotseats ao vivo','Fantástica Caixa de Ferramentas','Bônus'],
        notaCrono: estruturado ? 'Como o seu estúdio já tá estruturado, a Etapa Inicial pode ser mais rápida, só pra comparar com o que você já faz.' : '',
        dicas:dicas
      };
    }
  };

  var FRASE_FIGLAB = 'E o FigLab vem junto, que é o curso de Figma do zero.';

  function textoProximo(id, r, tem){
    var t = [];
    if(id === 'figbrand'){
      t.push(marcou(r, 'identidade')
        ? 'Você me contou que quer criar identidade visual completa, e com o FigLogo você já vai ter a base de logo. O FigBrand é o que vem depois, com estratégia.'
        : 'Você já vai ter a base de logo com o FigLogo. O FigBrand é o que vem depois, para criar a identidade visual completa com estratégia.');
    } else if(id === 'figlogo'){
      if(tem.figbrand) t.push('Como você já tem o FigBrand, o FigLogo é o que aprofunda a parte de logo.');
      else if(marcou(r, 'identidade')) t.push('Você me contou que quer criar identidade visual completa, e o FigLogo vem antes disso, porque é a base para o FigBrand lá na frente.');
      else if(marcou(r, 'logos')) t.push('Você me contou que quer criar logotipos, então é o FigLogo que vem agora. Ele também é a base para o FigBrand lá na frente.');
      else t.push('Os posts você já tem com o FigPost, então o próximo da sua trilha é o FigLogo, pra criar logotipos com método.');
      if(!tem.figlab) t.push(FRASE_FIGLAB);
    } else if(id === 'figpost'){
      if(marcou(r, 'posts') && (marcou(r, 'logos') || marcou(r, 'identidade')) && !tem.figlogo) t.push('Você marcou mais de uma coisa, e como ainda tá pegando a mão no Figma, eu começaria pelo FigPost.');
      else if(marcou(r, 'posts')) t.push('Você me contou que quer criar posts, então o FigPost é o que faz mais sentido agora.');
      else if(marcou(r, 'naosei')) t.push('Como você ainda tá descobrindo o que mais quer criar, eu seguiria pelo FigPost, que é o próximo da sua trilha.');
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
        textos:['Como você tem o Kit Design Studio, dá pra liberar o FigLab de graça: é só me mandar o seu depoimento no WhatsApp. Ele é o próximo da sua trilha, então eu começaria por aí.'],
        fraseDepois:depois ? 'Depois disso, o próximo é o ' + CURSOS[depois].nome + '.' : '',
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

  // "Depois, pelo que você marcou": o que ela ainda não tem e combina com o que marcou, sem repetir o principal.
  function depoisDoProximo(r, tem, proximo){
    if(!proximo || proximo.tipo === 'tudo') return [];
    var combina = {
      figpost: marcou(r, 'posts'),
      figlogo: marcou(r, 'logos') || marcou(r, 'identidade'),
      figbrand: marcou(r, 'identidade')
    };
    var noFigos = {figpost:true, figlogo:true};
    return ordemPrincipal(r).filter(function(c){
      if(!combina[c] || tem[c] || c === proximo.tipo) return false;
      return !(proximo.tipo === 'figos' && noFigos[c]);
    });
  }

  // r: respostas · tem: {id:true} · agora: milissegundos
  function montar(r, tem, agora){
    var pos = posicaoKit(r);
    var ordem = trilhaIdeal(r).filter(function(id){ return tem[id]; });
    var temOutro = ordem.some(function(id){ return id !== 'kit'; });
    function cartao(id, numero, grupo){
      var t = COMO_FAZER[id](r, tem, temOutro);
      return {id:id, nome:CURSOS[id].nome, c:CURSOS[id].c, c2:CURSOS[id].c2, numero:numero, grupo:grupo, cinza:grupo === 'complemento' && id === 'kit',
        posicao:t.posicao || null, aviso:t.aviso || '', porque:t.porque || '', passos:t.passos,
        consulta:t.consulta || [], pular:t.pular || [], notaCrono:t.notaCrono || '', notaPular:t.notaPular || '', dicas:t.dicas || []};
    }
    var cartoes = ordem.map(function(id, i){ return cartao(id, i + 1, 'ordem'); });
    // Em paralelo: nunca antes dos numerados. Se for o único da ordem, ele é o 1.
    if(tem.kit && pos === 'paralelo') cartoes.push(temOutro ? cartao('kit', 0, 'paralelo') : cartao('kit', 1, 'ordem'));
    // Complemento: sempre por último, depois de tudo o que tem ordem.
    if(tem.figlab && r.p2 === 'dia') cartoes.push(cartao('figlab', 0, 'complemento'));
    if(tem.kit && pos === 'consulta') cartoes.push(cartao('kit', 0, 'complemento'));
    var proximo = proximoPasso(r, tem, agora);
    var depois = depoisDoProximo(r, tem, proximo);
    if(proximo){
      proximo.depois = depois.map(function(c){ return {id:c, nome:CURSOS[c].nome, url:CURSOS[c].url + UTM}; });
      if(proximo.fraseDepois && !depois.length) proximo.textos.push(proximo.fraseDepois);
    }
    return {
      cartoes:cartoes,
      quandoPrecisar:QUANDO_PRECISAR.filter(function(q){ return tem[q[0]]; }),
      proximo:proximo
    };
  }

  // O que vai para a planilha, em texto legível.
  function rotuloMomento(id, valor){
    var q = Q_MOMENTO.filter(function(x){ return x.id === id; })[0];
    var o = q.ops.filter(function(x){ return x[0] === valor; })[0];
    return o ? o[1] : '';
  }
  function dadosDoEnvio(id, e, tem, m, host, armadilha){
    var soPrimeira = e.primeira !== 'nao';
    function sobre(k){ return soPrimeira ? (e[k] || '').trim() : ''; }
    var px = m.proximo, proximoTexto = '';
    if(px) proximoTexto = px.tipo === 'tudo' ? px.titulo : px.titulo.replace('Seu próximo passo: ', '');
    return {
      id:id,
      primeira_vez: e.primeira === 'nao' ? 'Não, já respondi antes' : 'Sim, é a primeira vez',
      cursos: ITENS.filter(function(i){ return tem[i[0]]; }).map(function(i){ return i[1]; }).join(', '),
      figma: rotuloMomento('p2', e.p2),
      quer_criar: (e.p3 || []).map(function(v){ return rotuloMomento('p3', v); }).join(', '),
      estudio: rotuloMomento('p4', e.p4),
      cliente: rotuloMomento('p5', e.p5),
      experiencia: (tem.figlogo || tem.figpost) ? rotuloMomento('p6', e.p6) : '',
      idade: sobre('p7'),
      trabalho: sobre('p8'),
      renda: sobre('p9'),
      dor: sobre('p10'),
      sonho: sobre('p11'),
      um_ano: sobre('p12'),
      trilha: m.cartoes.map(function(c){ return c.nome; }).join(', '),
      proximo_passo: proximoTexto,
      origem: (host === 'laritedeschi.com' || host === 'www.laritedeschi.com') ? 'site' : 'previa',
      site: armadilha || ''
    };
  }
  function novoId(){
    var hex = '';
    try {
      var b = new Uint8Array(9);
      crypto.getRandomValues(b);
      b.forEach(function(x){ hex += ('0' + x.toString(16)).slice(-2); });
    } catch(erro) {
      while(hex.length < 18) hex += Math.floor(Math.random() * 16).toString(16);
    }
    return hex.slice(0, 8) + '-' + hex.slice(8, 13) + '-' + hex.slice(13);
  }

  window.ComeceAqui = {montar:montar, carrinhoAberto:carrinhoAberto, ordemPrincipal:ordemPrincipal, posicaoKit:posicaoKit, dadosDoEnvio:dadosDoEnvio, novoId:novoId};

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

  var e = {}, tem = {}, labAuto = false, avisoLab = false, tela = 'abertura', idResposta = novoId();
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
  function ir(nome, guardarNoHistorico){
    tela = nome;
    var lista = telas(), i = lista.indexOf(nome), pct = Math.round(i / (lista.length - 1) * 100);
    fill.style.width = pct + '%';
    barra.setAttribute('aria-valuenow', pct);
    voltar.hidden = (i === 0);
    if(guardarNoHistorico) historico('pushState', nome);
    app.textContent = '';
    app.style.animation = 'none'; void app.offsetWidth; app.style.animation = '';
    ({abertura:tAbertura, primeira:tPrimeira, cursos:tCursos, momento:tMomento, sobre:tSobre, resultado:tResultado})[nome]();
    window.scrollTo(0, 0);
    app.focus({preventScroll:true});
  }
  function avancar(){ var l = telas(); ir(l[l.indexOf(tela) + 1], true); }

  // Voltar do celular: cada etapa entra no histórico do navegador, sem mudar o endereço.
  function historico(metodo, nome){
    try { history[metodo]({comeceAqui:nome}, ''); } catch(erro) {}
  }
  function voltarEtapa(){
    var l = telas(), anterior = l[l.indexOf(tela) - 1];
    if(!anterior) return;
    ir(anterior);
    try { history.back(); } catch(erro) {}
  }
  voltar.addEventListener('click', voltarEtapa);

  function momentoCompleto(){
    return !!(e.p2 && e.p3 && e.p3.length && e.p4 && e.p5 && (!(tem.figlogo || tem.figpost) || e.p6));
  }
  function sobreCompleto(){
    return !!(e.p7 && e.p8 && Q_ABERTAS.every(function(q){ return (e[q.id] || '').trim(); }));
  }
  function podeAbrir(nome){
    if(nome === 'abertura') return true;
    if(nome === 'primeira') return true;
    if(!e.primeira) return false;
    if(nome === 'cursos') return true;
    if(!Object.keys(tem).length) return false;
    if(nome === 'momento') return true;
    if(!momentoCompleto()) return false;
    if(nome === 'sobre') return e.primeira !== 'nao';
    return e.primeira === 'nao' || sobreCompleto();
  }
  window.addEventListener('popstate', function(ev){
    var nome = ev.state && ev.state.comeceAqui;
    if(!nome || nome === tela) return;
    ir(podeAbrir(nome) ? nome : 'abertura');
  });

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
    var jaRespondeu = !!e.primeira;
    [['sim','Sim, é a primeira vez'],['nao','Não, já respondi antes']].forEach(function(o){
      ops.appendChild(opcao('radio', 'primeira', o[0], o[1], e.primeira === o[0], function(){
        e.primeira = o[0];
        avancar();
      }));
    });
    f.appendChild(ops);
    app.appendChild(f);
    // Quem voltou até aqui já tem a resposta marcada: precisa de um botão para seguir sem mudar.
    if(jaRespondeu) app.appendChild(acao(botao('Continuar', '', avancar)));
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

    var f = el('fieldset', 'ca-grupo'), ops = el('div', 'ca-opcoes');
    ITENS.filter(function(it){ return it[0] !== 'ia' || agoraMs() >= REVELA_IA; }).forEach(function(it){
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

  function grupoMultiplo(q, aoMudar){
    var f = el('fieldset', 'ca-grupo'), ops = el('div', 'ca-opcoes'), inputs = {};
    var TODAS = q.ops.map(function(o){ return o[0]; }), EXCLUSIVA = 'naosei';
    f.appendChild(el('legend', '', q.t));
    if(q.apoio) f.appendChild(el('p', 'ca-apoio', q.apoio));
    q.ops.forEach(function(o){
      var l = opcao('checkbox', q.id, o[0], o[1], (e[q.id] || []).indexOf(o[0]) > -1, function(i){
        var atual = e[q.id] || [];
        if(!i.checked) atual = atual.filter(function(v){ return v !== o[0]; });
        else if(o[0] === EXCLUSIVA) atual = [EXCLUSIVA];
        else atual = atual.filter(function(v){ return v !== EXCLUSIVA; }).concat(o[0]);
        e[q.id] = TODAS.filter(function(v){ return atual.indexOf(v) > -1; });
        TODAS.forEach(function(v){ inputs[v].checked = e[q.id].indexOf(v) > -1; });
        aoMudar();
      });
      inputs[o[0]] = l.querySelector('input');
      ops.appendChild(l);
    });
    f.appendChild(ops);
    return f;
  }

  function tMomento(){
    var comP6 = !!(tem.figlogo || tem.figpost);
    var ultimo = e.primeira === 'nao';
    var seguir = botao(ultimo ? 'Ver minha trilha' : 'Continuar', '', avancar);
    function checar(){ seguir.disabled = !momentoCompleto(); }
    app.appendChild(el('p', 'ca-texto', 'Agora me conta um pouquinho de como as coisas estão hoje, porque é isso que define a sua ordem.'));
    Q_MOMENTO.forEach(function(q){
      if(q.id === 'p6' && !comP6) return;
      app.appendChild(q.multi ? grupoMultiplo(q, checar) : grupoRadio(q, checar));
    });
    app.appendChild(acao(seguir));
    checar();
  }

  function tSobre(){
    var seguir = botao('Ver minha trilha', '', avancar);
    function checar(){ seguir.disabled = !sobreCompleto(); }
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

  function listaModulos(titulo, itens){
    var p = el('p', 'ca-lista');
    p.appendChild(el('b', '', titulo));
    p.appendChild(document.createElement('br'));
    p.append(itens.join(' · '));
    return p;
  }

  function cronograma(passos){
    var ol = el('ol', 'ca-crono');
    passos.forEach(function(passo, i){
      var p = typeof passo === 'string' ? {nome:passo} : passo;
      var li = el('li'), corpo = el('div', 'ca-passo');
      li.appendChild(el('span', 'ca-bola', String(i + 1)));
      corpo.appendChild(el('span', 'ca-modulo', p.nome));
      if(p.aula) corpo.appendChild(el('span', 'ca-tag', 'aula'));
      if(p.rapido) corpo.appendChild(el('span', 'ca-tag ca-tag-rapido', 'mais rápido'));
      if(p.nota) corpo.appendChild(el('span', 'ca-nota', p.nota));
      li.appendChild(corpo);
      ol.appendChild(li);
    });
    return ol;
  }

  function cartaoCurso(c){
    var li = el('li', 'ca-curso' + (c.cinza ? ' ca-curso-cinza' : ''));
    li.style.setProperty('--c', c.c);
    var topo = el('div', 'ca-curso-topo');
    if(c.numero) topo.appendChild(el('span', 'ca-num', String(c.numero)));
    if(c.grupo === 'paralelo'){
      var par = el('span', 'ca-num ca-num-paralelo');
      par.setAttribute('aria-hidden', 'true');
      topo.appendChild(par);
    }
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
    if(c.porque){
      li.appendChild(el('h4', 'ca-rot', 'Por que essa ordem'));
      li.appendChild(el('p', 'ca-principal', c.porque));
    }
    if(c.passos.length){
      li.appendChild(el('h4', 'ca-rot ca-rot-crono', 'Siga este cronograma'));
      li.appendChild(cronograma(c.passos));
    }
    if(c.notaCrono) li.appendChild(el('p', 'ca-nota-ajuste', c.notaCrono));
    if(c.consulta.length || c.pular.length || c.notaPular || c.dicas.length){
      var extra = el('div', 'ca-extra');
      if(c.consulta.length) extra.appendChild(listaModulos('Fica para consulta', c.consulta));
      if(c.pular.length) extra.appendChild(listaModulos('Pode pular', c.pular));
      if(c.notaPular) extra.appendChild(el('p', 'ca-nota-ajuste', c.notaPular));
      if(c.dicas.length){
        var d = el('ul', 'ca-comp');
        c.dicas.forEach(function(t){ d.appendChild(el('li', '', t)); });
        extra.appendChild(d);
      }
      li.appendChild(extra);
    }
    var a = el('a', 'ca-bt ca-sec', 'Abrir o curso');
    a.href = ABRIR_CURSO; a.target = '_blank'; a.rel = 'noopener';
    li.appendChild(a);
    return li;
  }

  function tResultado(){
    var m = montar(e, tem, agoraMs());
    app.appendChild(el('h1', '', 'Sua trilha tá pronta!'));
    app.appendChild(el('p', 'ca-texto', 'Montei essa ordem com o que você já tem e com o seu momento de agora. O que ficar de fora do cronograma continua lá no curso, caso você queira consultar depois.'));

    if(m.cartoes.length > 1){
      var resumo = el('ol', 'ca-resumo');
      m.cartoes.forEach(function(c){
        var r = el('li', c.cinza ? 'ca-resumo-cinza' : (c.grupo === 'complemento' ? 'ca-resumo-semnum' : ''));
        if(c.numero) r.appendChild(el('span', 'ca-resumo-num', String(c.numero)));
        else if(c.grupo === 'paralelo'){ var pr = el('span', 'ca-resumo-num ca-num-paralelo'); pr.setAttribute('aria-hidden', 'true'); r.appendChild(pr); }
        r.append(c.nome);
        resumo.appendChild(r);
      });
      app.appendChild(resumo);
    }

    var comOrdem = m.cartoes.filter(function(c){ return c.grupo !== 'complemento'; });
    var complementos = m.cartoes.filter(function(c){ return c.grupo === 'complemento'; });
    if(comOrdem.length){
      var ul = el('ol', 'ca-trilha');
      comOrdem.forEach(function(c){ ul.appendChild(cartaoCurso(c)); });
      app.appendChild(ul);
    }
    if(complementos.length){
      var bc = el('div', 'ca-bloco ca-complementar');
      bc.appendChild(el('h2', '', 'Para complementar'));
      var uc = el('ul', 'ca-trilha');
      complementos.forEach(function(c){ uc.appendChild(cartaoCurso(c)); });
      bc.appendChild(uc);
      app.appendChild(bc);
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
      if(m.proximo.depois.length){
        var dp = el('p', 'ca-depois');
        dp.append('Depois, pelo que você marcou: ');
        m.proximo.depois.forEach(function(c, i){
          if(i) dp.append(' · ');
          var a = el('a', '', c.nome);
          a.href = c.url; a.target = '_blank'; a.rel = 'noopener';
          dp.appendChild(a);
        });
        px.appendChild(dp);
      }
      app.appendChild(px);
    }

    var rf = el('div', 'ca-refazer');
    rf.appendChild(el('p', 'ca-texto', 'Quando comprar algo novo ou mudar de momento, é só refazer o formulário que a sua trilha se atualiza.'));
    var fim = el('div', 'ca-fim');
    fim.appendChild(botao('Voltar', 'ca-sec', voltarEtapa));
    fim.appendChild(botao('Refazer', 'ca-sec', function(){
      e = {}; tem = {}; labAuto = false; avisoLab = false;
      idResposta = novoId();
      ir('abertura', true);
    }));
    rf.appendChild(fim);
    app.appendChild(rf);

    // Toda vez que chega aqui envia de novo, com o mesmo id: a linha da planilha é atualizada.
    try {
      var armadilha = document.getElementById('ca-site');
      enviarRespostas(dadosDoEnvio(idResposta, e, tem, m, location.hostname, armadilha ? armadilha.value : ''));
    } catch(erro) {}
  }

  if(location.hostname !== 'laritedeschi.com' && location.hostname !== 'www.laritedeschi.com'){
    window.addEventListener('hashchange', function(){ location.reload(); });
  }
  if(simulada !== null){
    document.body.appendChild(el('div', 'ca-teste', 'Modo de teste · data simulada: ' + new Date(simulada).toLocaleString('pt-BR', {timeZone:'America/Sao_Paulo', dateStyle:'short', timeStyle:'short'})));
  }
  try { history.scrollRestoration = 'manual'; } catch(erro) {}
  historico('replaceState', 'abertura');
  ir('abertura');
})();
