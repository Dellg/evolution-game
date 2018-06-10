var criaturas;
var variacaoCriaturas = 3; // variável que controla a quantidade de tipo de criatura
var quantiaEspecie = 25; // variável que controla quantas de cada criatura serão geradas
var alimentosPlanta;
var alimentosInseto;
var alimentosVeneno;
var alimentosCarne; // apenas quando uma criatura morre
var quantiaObstaculos = 10; // quantidade de árvores para desviar
var obstaculos;
var variacaoAlimentos = 20; // variável que controla quantos tipos de alimentos serão criados
var countAlimentos; // o level 2 terá menos almentos (dificuldade maior)
var tipoCriaturas = [];
var tipoAlimentos = [];
var geracao = 0;
var minigame;

// o level 2 receberá as criaturas do level 1, ao invés de criar novas
function Level2(criaturasAnteriores){
  tempoTexto = 0;
  indexTexto = 0;
  flagTexto = false;
  minigame = -1;
  countAlimentos = 20;
  alimentosPlanta = [];
  alimentosInseto = [];
  alimentosVeneno = [];
  alimentosCarne = [];
  criaturas = [];
  obstaculos = [];
  tipoCriaturas = criaturasAnteriores;
  this.carregarDados();
}

//______________________________________________________________________________
// carrega os dados dos alimentos e inicia o jogo com uma geração
//______________________________________________________________________________
Level2.prototype.carregarDados = function(){
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
Level2.prototype.iniciaGeracao = function(){
  // cria quantidades das criaturas pré-definidas
  for (var i = 0; i < tipoCriaturas.length; i++){
    for (var j = 0; j < quantiaEspecie; j++){
      var x = random(xGame);
      var y = random(yGame);
      var criatura = new Criatura(x, y, tipoCriaturas[i], null, geracao);
      criaturas.push(criatura);
    }
  }
  // colocando obstáculos em suas posições
    // árvores com flores vermelhas
  r = 35;
  x = 772;
  y = 226;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
    // árvores com plantas laranjas
  r = 30;
  x = 348;
  y = 176;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 81;
  y = 770;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
    // cactos
  r = 50;
  x = 79;
  y = 320;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 365;
  y = 388;
  obst = new Obstaculo(true, x, y, 70); // cacto maior
  obstaculos.push(obst);
  x = 973;
  y = 572;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 1010;
  y = 579;
  obst = new Obstaculo(true, x, y, 33); // cacto menor
  obstaculos.push(obst);
    // árvores grandes
  r = 55;
  x = 125;
  y = 320;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 505;
  y = 764;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 921;
  y = 545;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);

  alimentosPlanta = [];
  alimentosInseto = [];
  alimentosVeneno = [];
  alimentosCarne = [];
  // cria alimentos usando os tipos pré-criados
  for (var i = 0; i < countAlimentos; i++){
    this.adicionaNovaComida(null, null, false);
  }
  // redesenha a tela com a nova geração
  redraw();
}

//______________________________________________________________________________
// método que adiciona novas comidas nas listas
//______________________________________________________________________________
Level2.prototype.adicionaNovaComida = function(x, y, morto, eraCarn){
  if (x == null || y == null){
    x = random(5, xGame-5);
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
          alimentosPlanta.push(new Alimento(random(5, xGame-5), random(5, yGame-5), tipoAlimentos[r]));
          alimentosPlanta.push(new Alimento(random(5, xGame-5), random(5, yGame-5), tipoAlimentos[r]));
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
Level2.prototype.rodar = function(){
  image(levelImagens[1], 0, 0);
  fill(255);
  if (tempoJogo >= 110){
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
    text('Parabéns! A nova estrutura se mostrou favorável no ambiente e', xGame/2 - 200, 100);
    text('foi adicionada à espécie pela seleção natural!', xGame/2 - 200, 125);

  } else {
    if (minigame == -1){
      switch (indexTexto) {
        case 0:
          stroke(0, tempoTexto);
          fill(255, tempoTexto);
          textFont(fonte, 40);
          text('Capítulo 2', xGame/2 - 100, 100);
          break;
        case 1:
          stroke(0, tempoTexto);
          fill(255, tempoTexto);
          textFont(fonte, 40);
          text('Seleção natural e Adaptação', xGame/2 - 210, 100);
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
          text('Veja quanto tempo já se passou, o ambiente não é mais o mesmo,', xGame/2 - 200, 100);
          text('está mudando, isso quer dizer que há novas pressões seletivas', xGame/2 - 200, 125);
          text('e essas pressões originam a seleção natural.', xGame/2 - 200, 150);
          break;
        case 3:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('No geral, a seleção natural vai, ao longo das gerações,', xGame/2 - 200, 100);
          text('selecionar as mutações e características favoráveis ao', xGame/2 - 200, 125);
          text('ambiente e eliminar as não favoráveis', xGame/2 - 200, 150);
          break;
        case 4:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('Será que a nova estrutura que você escolheu irá permanecer', xGame/2 - 200, 100);
          text('na sua espécie ou será eliminada? Observe um pouco...', xGame/2 - 200, 125);
          break;
      }

    } else {
      tempoJogo += 0.05;
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
        for (var i = criaturas.length - 1; i >= 0; i--){
          var crtr = criaturas[i];
          crtr.comportamentos(alimentosPlanta, alimentosInseto, alimentosVeneno, alimentosCarne, criaturas, obstaculos);
          crtr.limites();
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
      }
      image(levelImagens[5], 0, 0);
    }
  }
}

//______________________________________________________________________________
// função que interpreta o valor do botão do mouse
//______________________________________________________________________________
Level2.prototype.mousePressed = function() {
  if (tempoJogo >= 110 && tempoTexto >= 30) {
    criaturasSalvas = tipoCriaturas;
    musicas[4].stop();
    musicas[5].loop();
    levelnum = 3;
    botaoCrdts.elt.textContent = 'Fable - por Adrian von Ziegler';
    level = new Level3(criaturasSalvas);
  }
  if (minigame == -2){
    if (indexTexto >= 2){
      if (tempoTexto >= 30){
        indexTexto += 1;
        if (indexTexto == 5) {
          minigame = 0;
        }
        tempoTexto = 0;
      }
    }
  }
}
