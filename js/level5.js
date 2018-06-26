var criaturas;
var variacaoCriaturas = 2; // variável que controla a quantidade de tipo de criatura
var quantiaEspecie = 25; // variável que controla quantas de cada criatura serão geradas
var alimentosPlanta;
var alimentosInseto;
var alimentosVeneno;
var alimentosCarne; // apenas quando uma criatura morre
var quantiaObstaculos = 12; // quantidade de árvores para desviar
var obstaculos;
var variacaoAlimentos = 20; // variável que controla quantos tipos de alimentos serão criados
var countAlimentos; // o level 2 terá menos almentos (dificuldade maior)
var tipoCriaturasLevel4 = [];
var tipoAlimentos = [];
var geracao = 0;
var ossos;
// variáveis do puzzle
var pedacos = 0;
var matriz = [];
var indexVazio;
var quantiaCerta = 0;
var flagMontou = false;
var minigame;
var esperandoClique;

// o level 4 a criatura do jogador e uma nova evolução paralela de sua criatura
function Level5(criaturasAnteriores, fossil){
  tempoTexto = 0;
  indexTexto = 0;
  flagTexto = false;
  minigame = -1;
  esperandoClique = false;
  tempoTexto = 0;
  for (var i = 0; i < 8; i++){
    fossilImagens[i].name = (i % 8) + 1;
  }
  for (var i = 8; i < 16; i++){
    fossilImagens[i].name = (i % 8) + 1;
  }
  for (var i = 16; i < fossil.length-1; i++){
    fossilImagens[i].name = (i % 8) + 1;
  }
  fossilImagens[fossil.length-1].name = 9;

  countAlimentos = 80;
  alimentosPlanta = [];
  alimentosInseto = [];
  alimentosVeneno = [];
  alimentosCarne = [];
  criaturas = [];
  ossos = [];
  obstaculos = [];
  for (var i = 1; i < 9; i++){
    matriz.push(fossil.splice(random(8 * criatura[1], 7 * (criatura[1] + 1) - (i-1)), 1)[0]);
  }
  matriz.push(fossil.splice(fossil.length - 1, 1)[0]);
  matriz = embaralha(matriz);
  for (var i = 0; i < matriz.length; i++){
    if (matriz[i].name == 9){
      indexVazio = i;
      break;
    }
  }
  tipoCriaturasLevel4 = criaturasAnteriores;
  this.carregarDados();
  this.serHumano;
}

//______________________________________________________________________________
// carrega os dados dos alimentos e inicia o jogo com uma geração
//______________________________________________________________________________
Level5.prototype.carregarDados = function(){
  // cria tipos de alimentos diferentes
  for (var i = 0; i < variacaoAlimentos; i++){
    var t = i%3;
    var v = random(0.5, 1.5);
    var f = random(0.5, 3);
    tipoAlimentos[i] = [t, v, f, humanoImagem[3]];
  }
  // criatura que morreu
  tipoAlimentos.push([3, random(0.5, 1.5), random(0.5, 3), humanoImagem[3]]);
}

//______________________________________________________________________________
// aqui reinicia o jogo com uma nova geração
//______________________________________________________________________________
Level5.prototype.iniciaGeracao = function(){
  // cria quantidades das criaturas pré-definidas
  for (var i = 0; i < tipoCriaturasLevel4.length; i++){
    for (var j = 0; j < quantiaEspecie/2; j++){
      var x = random(xGame/2);
      var y = random(yGame);
      var criatura = new Criatura(x, y, tipoCriaturasLevel4[i], null, geracao);
      criaturas.push(criatura);
    }
  }
  // colocando obstáculos em suas posições
    // árvores com flores vermelhas
  r = 35;
  x = 893;
  y = 336;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 93;
  y = 764;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
    // cactos
  r = 55;
  x = 887;
  y = 52;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 929;
  y = 65;
  obst = new Obstaculo(true, x, y, 30); // cacto menor
  obstaculos.push(obst);
  x = 523;
  y = 323;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
    // árvores grandes
  r = 50;
  x = 173;
  y = 176;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 401;
  y = 550;
  obst = new Obstaculo(true, x, y, r + 5);
  obstaculos.push(obst);
  x = 826 ;
  y = 705;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);

  // cria quantidades das criaturas pré-definidas
  for (var i = 0; i < tipoCriaturasLevel4.length; i++){
    for (var j = 0; j < quantiaEspecie/2; j++){
      var x = random(xGame/2, xGame);
      var y = random(yGame);
      if (i == 0){
        var criatura = new Criatura(x, y, criaturaFutura, null, geracao);
      } else {
        var criatura = new Criatura(x, y, tipoCriaturasLevel4[i], null, geracao);
      }
      criaturas.push(criatura);
    }
  }
  alimentosPlanta = [];
  alimentosInseto = [];
  alimentosVeneno = [];
  alimentosCarne = [];
  // cria alimentos usando os tipos pré-criados
  for (var i = 0; i < countAlimentos; i++){
    this.adicionaNovaComida(null, null, false);
  }
  // adiciona humano ao level e os ossos que precisa encontrar
  this.serHumano = new Humano(random(xGame), random(yGame), humanoImagem[0], humanoImagem[2]);
  for (var i = 0; i < 8; i++) {
    var osso = new Osso(i, humanoImagem[1]);
    ossos.push(osso);
  }
  // redesenha a tela com a nova geração
  redraw();
}

//______________________________________________________________________________
// método que adiciona novas comidas nas listas
//______________________________________________________________________________
Level5.prototype.adicionaNovaComida = function(x, y, morto, eraCarn){
  if (x == null || y == null){
    x = random(5, xGame-200);
    y = random(5, yGame-5);
  }
  // se foi morto, adiciona uma carne de criatura (último índice), ou um veneno se era carnívoro
  if (morto){
    if (eraCarn){
      alimentosCarne.push(new Alimento(x, y, tipoAlimentos[2]));
    } else {
      alimentosCarne.push(new Alimento(x, y, tipoAlimentos[tipoAlimentos.length-1]));
    }
  // se não foi, adiciona um alimento inseto, planta ou tóxico
  } else {
    var r = round(random(tipoAlimentos.length - 1));
    switch (tipoAlimentos[r][0]) {
      case 0:
        if (alimentosPlanta.length < (countAlimentos - countAlimentos/3)){
          alimentosPlanta.push(new Alimento(x, y, tipoAlimentos[r]));
          alimentosPlanta.push(new Alimento(random(5, xGame-200), random(5, yGame-5), tipoAlimentos[r]));
          alimentosPlanta.push(new Alimento(random(5, xGame-200), random(5, yGame-5), tipoAlimentos[r]));
        }
        break;
      case 1:
        if (alimentosInseto.length < (countAlimentos/2)/1.5){
          alimentosInseto.push(new Alimento(x, y, tipoAlimentos[r]));
        }
        break;
      case 2:
        if (alimentosVeneno.length < (countAlimentos/2)/1.5){
          alimentosVeneno.push(new Alimento(x, y, tipoAlimentos[r]));
        }
        break;
    }
  }
}

//______________________________________________________________________________
// método que roda o jogo ou os minigames do level
//______________________________________________________________________________
Level5.prototype.rodar = function(){
  image(levelImagens[3], 0, 0);
  fill(255);

  if (pedacos == 8){
    if (esperandoClique) {
      if (tempoTexto >= 30){
        if (frameHistoria >= 0 && frameHistoria < 10 || frameHistoria >= 20 && frameHistoria < 30){
          imgm = humanoImagem[2].get(0, 0, 32, 32);
          image(imgm, xGame/2 - 130, 40);
        } else {
          imgm = humanoImagem[2].get(32, 0, 32, 32);
          image(imgm, xGame/2 - 130, 40);
        }
        frameHistoria += 0.4;
        if (frameHistoria >= 40){
          frameHistoria = 0;
        }
      }
      tempoTexto += 0.25;

      stroke(0);
      fill(255);
      textFont(fonte, 18);
      text('Ótimo! Agora ajude o humano a montar o quebra-cabeça', xGame/2 - 200, 100);
      text('do fóssil completo, para que ele retorne à Terra com', xGame/2 - 200, 125);
      text('as informações corretas sobre a evolução de Geb.', xGame/2 - 200, 150);

    } else {
      for (var i = 0; i < matriz.length; i++){
        var x = 127 * (i % 3);
        var y = 127 * floor(i / 3);
        image(matriz[i], xGame/2 - (127 + 127/2) + x, yGame/2 - (127 + 127/2) + y);
      }
      if (flagMontou){
        if (tempoTexto >= 30){
          if (frameHistoria >= 0 && frameHistoria < 10 || frameHistoria >= 20 && frameHistoria < 30){
            imgm = humanoImagem[2].get(0, 0, 32, 32);
            image(imgm, xGame/2 - 130, 40);
          } else {
            imgm = humanoImagem[2].get(32, 0, 32, 32);
            image(imgm, xGame/2 - 130, 40);
          }
          frameHistoria += 0.4;
          if (frameHistoria >= 40){
            frameHistoria = 0;
          }
        }
        tempoTexto += 0.25;

        stroke(0);
        fill(255);
        textFont(fonte, 18);
        text('Enfim, agora o fóssil será levado para a Terra para', xGame/2 - 200, 100);
        text('que os humanos possam estudar mais sobre a evolução', xGame/2 - 200, 125);
        text('de Geb.', xGame/2 - 200, 150);
      } else {
        text("Monte o quebra-cabeça com os pedaços do fóssil encontrado:", xGame/2 - 195, 100);
      }
    }

  } else {
    if (minigame == -1){
      switch (indexTexto) {
        case 0:
          stroke(0, tempoTexto);
          fill(255, tempoTexto);
          textFont(fonte, 40);
          text('Capítulo 5', xGame/2 - 100, 100);
          break;
        case 1:
          stroke(0, tempoTexto);
          fill(255, tempoTexto);
          textFont(fonte, 40);
          text('Evidências da evolução', xGame/2 - 210, 100);
          break;
      }
      if (flagTexto){
        tempoTexto -= 5;
        if (tempoTexto <= 0){
          indexTexto += 1;
          flagTexto = false;
          if (indexTexto == 2){
            minigame = -2;
          }
        }
      } else {
        tempoTexto += 5;
        if (tempoTexto >= 400){
          flagTexto = true;
        }
      }

    } else if (minigame == -2){
      if (tempoTexto >= 30){
        if (frameHistoria >= 0 && frameHistoria < 10 || frameHistoria >= 20 && frameHistoria < 30){
          imgm = humanoImagem[2].get(0, 0, 32, 32);
          image(imgm, xGame/2 - 130, 40);
        } else {
          imgm = humanoImagem[2].get(32, 0, 32, 32);
          image(imgm, xGame/2 - 130, 40);
        }
        frameHistoria += 0.4;
        if (frameHistoria >= 40){
          frameHistoria = 0;
        }
      }
      tempoTexto += 0.25;

      switch (indexTexto) {
        case 2:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('Ora, ora, quem resolveu aparecer?! Os humanos finalmente', xGame/2 - 200, 100);
          text('encontraram o planeta Geb no universo, mas chegaram um', xGame/2 - 200, 125);
          text('pouco tarde para ver o show...', xGame/2 - 200, 150);
          break;
        case 3:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('De toda forma, eles querem saber o que tem acontecido por aqui.', xGame/2 - 200, 100);
          text('Ele precisa de evidências para descobrir como tem sido a história', xGame/2 - 200, 125);
          text('da vida em Geb.', xGame/2 - 200, 150);
          break;
        case 4:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('Uma dessas evidências evolutivas são os registros fósseis, através', xGame/2 - 200, 100);
          text('deles você pode adquirir informações sobre os seres vivos que', xGame/2 - 200, 125);
          text('viveram antes e sobre o ambiente que existia antes.', xGame/2 - 200, 150);
          break;
        case 5:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('Quer ajudá-lo? Procure no ambiente os 8 pedaços fósseis', xGame/2 - 200, 100);
          text('dos ossos da sua espécie quando não haviam todas essas', xGame/2 - 200, 125);
          text('modificações que adquiriu ao longo dos anos...', xGame/2 - 200, 150);
          text('E ajude o humano a escavar.', xGame/2 - 200, 175);
          break;
      }

    } else {
      tempoJogo += velocidadeJogo;
      // verifica se não há criaturas vivas para poder iniciar a geração
      if (criaturas.length <= 0){
        geracao += 1;
        this.iniciaGeracao();
      } else {
        // gera novas comidas se tiver menos da quantidade definida de comidas no canvas
        if ((alimentosPlanta.length + alimentosInseto.length + alimentosVeneno.length) < countAlimentos){
          if (random(1) < 0.2) {
            this.adicionaNovaComida(null, null);
          }
        }
        // informações relacionadas às comidas
        for (var i = 0; i < alimentosPlanta.length; i++){
          var almt = alimentosPlanta[i];
          almt.show();
        }
        for (var i = 0; i < alimentosInseto.length; i++){
          var almt = alimentosInseto[i];
          almt.show();
        }
        for (var i = 0; i < alimentosVeneno.length; i++){
          var almt = alimentosVeneno[i];
          almt.show();
        }
        for (var i = 0; i < alimentosCarne.length; i++){
          var almt = alimentosCarne[i];
          almt.show();
        }
        // informações relacionadas às criaturas
        for (var i = criaturas.length - 1; i >= 0; i--){
          var crtr = criaturas[i];
          crtr.comportamentos(alimentosPlanta, alimentosInseto, alimentosVeneno, alimentosCarne, criaturas, obstaculos);
          crtr.limitesLevel5();
          crtr.update();
          crtr.show();

          // aqui verifica se foi feita reprodução, para adicionar os filhos à população
          if (crtr != undefined){
            // criatura só reproduzirá se for fêmea
            if (crtr.genero == 1){
              var filho = crtr.reproduz();
              if (filho != null) {
                criaturas.push(filho);
              }
            }
          }
          // aqui verifica se a criatura morreu, para retirá-la da população
          if (crtr.morreu()){
            criaturas.splice(i, 1);
            console.log(crtr.nome + " morreu.")
            // se a criatura morta era um carnívoro, aparece um veneno (evitar canibalismo)
            if (crtr.tipo != 1){
              this.adicionaNovaComida(crtr.posicao.x, crtr.posicao.y, true, false);
            } else {
              this.adicionaNovaComida(crtr.posicao.x, crtr.posicao.y, true, true);
            }
          }
        }
        // informações relacionadas ao humano
        this.serHumano.comportamentos(ossos);
        this.serHumano.update();
        this.serHumano.show();

        image(levelImagens[7], 0, 0);
        image(menusImagens[11], xGame - 250, 25);
        imgp = menusImagens[5].get(64, 0, 32, 32);
        image(imgp, xGame - 170, 80);
        fill(255);
        strokeWeight(3);
        stroke(0);
        textFont(fonte);
        textStyle(BOLD);
        text(pedacos, xGame - 130, 100);

        // informações relacionadas aos ossos (ficará por cima de tudo)
        for (var i = ossos.length - 1; i >= 0; i--){
          var ossoMapa = ossos[i];
          ossoMapa.show();
        }
      }
    }
  }
}

//______________________________________________________________________________
// função que interpreta o valor do botão pressionado
//______________________________________________________________________________
Level5.prototype.keyPressed = function() {
  if (pedacos == 8){
    if (!flagMontou){
      if (keyCode === UP_ARROW){
        if (indexVazio >= 3 && indexVazio <= 8){
          var aux = matriz[indexVazio];
          matriz[indexVazio] = matriz[indexVazio - 3];
          matriz[indexVazio - 3] = aux;
          indexVazio -= 3;
        }
      } else if (keyCode === DOWN_ARROW){
        if (indexVazio >= 0 && indexVazio <= 5){
          var aux = matriz[indexVazio];
          matriz[indexVazio] = matriz[indexVazio + 3];
          matriz[indexVazio + 3] = aux;
          indexVazio += 3;
        }
      } else if (keyCode === LEFT_ARROW){
        if (indexVazio != 0 && indexVazio != 3 && indexVazio != 6){
          var aux = matriz[indexVazio];
          matriz[indexVazio] = matriz[indexVazio - 1];
          matriz[indexVazio - 1] = aux;
          indexVazio -= 1;
        }
      } else if (keyCode === RIGHT_ARROW){
        if (indexVazio != 2 && indexVazio != 5 && indexVazio != 8){
          var aux = matriz[indexVazio];
          matriz[indexVazio] = matriz[indexVazio + 1];
          matriz[indexVazio + 1] = aux;
          indexVazio += 1;
        }
      }
      // após o movimento da peça, verifica se a imagem está montada
      for (var i = 0; i < matriz.length; i++){
        if (matriz[i].name == i+1){
          quantiaCerta += 1;
        }
      }
      if (quantiaCerta == 9){
        flagMontou = true;
        return;
      }
      quantiaCerta = 0;
    }
  }
}

// função que embaralha a matriz para ter solução
function embaralha(paraEmbaralhar){
  var bugado = true;
  do {
    for (var i = paraEmbaralhar.length - 1; i > 0; i--) {
      aleatorio = Math.floor(Math.random() * (i + 1));
      // swap
      auxiliar = paraEmbaralhar[i];
      paraEmbaralhar[i] = paraEmbaralhar[aleatorio];
      paraEmbaralhar[aleatorio] = auxiliar;
    }
    var contagemImpares = 0;
    for (var i = 0; i < paraEmbaralhar.length; i++){
      for (var j = i+1; j < paraEmbaralhar.length; j++){
        if (paraEmbaralhar[i].name != 9 && paraEmbaralhar[j].name != 9){
          if (paraEmbaralhar[i].name > paraEmbaralhar[j].name){
            contagemImpares += 1;
          }
        }
      }
    }
    if (contagemImpares % 2 == 0){
      bugado = false;
    }
  } while (bugado);
  return paraEmbaralhar;
}

//______________________________________________________________________________
// função que interpreta o valor do botão do mouse
//______________________________________________________________________________
Level5.prototype.mousePressed = function() {
  // variável que identifica se terminou algum minigame
  if (esperandoClique){
    if (tempoTexto >= 30){
      esperandoClique = false;
      tempoTexto = 0;
    }
  }
  if (flagMontou){
    if (tempoTexto >= 30){
      botaoCrdts.elt.textContent = 'Sacred Earth - por Adrian von Ziegler';
      levelnum = 6;
      menu = 2;
      musicas[7].stop();
      musicas[8].loop();
      imagemAtual = 0;
      tempoImagem = 0;
      flagMontou = false;
    }
  }
  if (minigame == -2){
    if (indexTexto >= 2){
      if (tempoTexto >= 30){
        indexTexto += 1;
        if (indexTexto == 6) {
          minigame = 0;
        }
        tempoTexto = 0;
      }
    }
  }
}
