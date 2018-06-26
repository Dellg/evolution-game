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
var criaturaMiniGame;
var moedas;
var miniGameOn = false;
var miniGameCompleto = false;
var miniGamePontos = 0;
var arena2 = false;
var scale1 = 0;
var scale1flag = true;
var espacoRio = 128;
var minigame;
var esperandoClique;

// o level 4 a criatura do jogador e uma nova evolução paralela de sua criatura
function Level4(criaturasAnteriores){
  tempoTexto = 0;
  indexTexto = 0;
  flagTexto = false;
  minigame = -1;
  esperandoClique = false;
  countAlimentos = 80;
  alimentosPlanta = [];
  alimentosInseto = [];
  alimentosVeneno = [];
  alimentosCarne = [];
  criaturas = [];
  moedas = [];
  obstaculos = [];
  tipoCriaturasLevel4 = criaturasAnteriores;
  this.carregarDados();
}

//______________________________________________________________________________
// carrega os dados dos alimentos e inicia o jogo com uma geração
//______________________________________________________________________________
Level4.prototype.carregarDados = function(){
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
Level4.prototype.iniciaGeracao = function(){
  // cria quantidades das criaturas pré-definidas
  for (var i = 0; i < tipoCriaturasLevel4.length; i++){
    for (var j = 0; j < quantiaEspecie/2; j++){
      var x = random(xGame/2 - espacoRio);
      var y = random(yGame);
      var criatura = new Criatura(x, y, tipoCriaturasLevel4[i], null, geracao);
      criaturas.push(criatura);
    }
  }
  // colocando obstáculos em suas posições
    // árvores com flores vermelhas
  r = 35;
  x = 402;
  y = 334;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 28;
  y = 767;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
    // árvores com plantas laranjas
  r = 30;
  x = 636;
  y = 375;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 661;
  y = 658;
  obst = new Obstaculo(true, x, y, 35); // árvore maior
  obstaculos.push(obst);
    // cactos
  r = 50;
  x = 407;
  y = 45;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 439;
  y = 71;
  obst = new Obstaculo(true, x, y, 30); // cacto menor
  obstaculos.push(obst);
  x = 836;
  y = 69;
  obst = new Obstaculo(true, x, y, r + 10); // cacto maior
  obstaculos.push(obst);
  x = 884;
  y = 81;
  obst = new Obstaculo(true, x, y, r - 10); // cacto menor
  obstaculos.push(obst);
    // árvores grandes
  r = 50;
  x = 44;
  y = 210;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 332;
  y = 712;
  obst = new Obstaculo(true, x, y, r + 5);
  obstaculos.push(obst);
    // árvores grandes vermelhas
  r = 50;
  x = 866;
  y = 555;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 650;
  y = 164;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);

  // cria quantidades das criaturas pré-definidas
  for (var i = 0; i < tipoCriaturasLevel4.length; i++){
    for (var j = 0; j < quantiaEspecie/2; j++){
      var x = random(xGame/2 + espacoRio, xGame);
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
  // redesenha a tela com a nova geração
  redraw();
}

//______________________________________________________________________________
// método que adiciona novas comidas nas listas
//______________________________________________________________________________
Level4.prototype.adicionaNovaComida = function(x, y, morto, eraCarn){
  if (x == null || y == null){
    if (random(1) < 0.5){
      x = random(5, xGame/2 - espacoRio);
    } else {
      x = random(xGame/2 + espacoRio, xGame-5);
    }
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
          if (random(1) < 0.5){
            x = random(5, xGame/2 - espacoRio);
          } else {
            x = random(xGame/2 + espacoRio, xGame-5);
          }
          alimentosPlanta.push(new Alimento(x, random(5, yGame-5), tipoAlimentos[r]));
          if (random(1) < 0.5){
            x = random(5, xGame/2 - espacoRio);
          } else {
            x = random(xGame/2 + espacoRio, xGame-5);
          }
          alimentosPlanta.push(new Alimento(x, random(5, yGame-5), tipoAlimentos[r]));
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
Level4.prototype.rodar = function(){
  image(levelImagens[2], 0, 0);
  fill(255);
  if (tempoJogo >= 250){
    criaturasSalvas = tipoCriaturas;
    musicas[6].stop();
    musicas[7].loop();
    levelnum = 5;
    botaoCrdts.elt.textContent = 'Follow the Hunt - por Adrian von Ziegler ft Lukasz Kapuscinski';
    level = new Level5(criaturasSalvas, fossilImagens);

  } else {
    if (miniGameOn){
      l4m1 = true;
      if (esperandoClique){
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
        text('Parabéns! Você acumulou pontos de modificação suficientes', xGame/2 - 200, 100);
        text('para se adaptar ao novo ambiente. Dê uma boa olhada na', xGame/2 - 200, 125);
        text('espécie do outro lado do rio!', xGame/2 - 200, 150);
        text('Vocês agora são espécies diferentes!', xGame/2 - 200, 175);

      } else {
        if (arena2){
          text("Pegue os pontos de modificação que irão cair:", xGame/2 - 100, 100);
          text(miniGamePontos + '/250', xGame/2 - 50, 500);
          // gera novas comidas se tiver menos da quantidade definida de comidas no canvas
          if (moedas.length <= 0 || random(1) < 0.005){
            moedas.push(new Moeda());
          }

          criaturaMiniGame.comportamentos();
          criaturaMiniGame.update();
          criaturaMiniGame.show();

          for (var i = moedas.length - 1; i >= 0; i--){
            var md = moedas[i];
            md.show();
            if (md.sumiu(criaturaMiniGame)){
              moedas.splice(i, 1);

              if (miniGamePontos >= 250){
                for (var i = criaturas.length -1; i >= 0; i--){
                  if (criaturas[i].nome.includes(criatura[0][0]) && criaturas[i].nome != criatura[0][0]){
                    criaturas[i].atualizaImagem(aparenciaFutura);
                  }
                }
                arena2 = false;
                esperandoClique = true;
              }
            }
          }

        } else {
          criaturaMiniGame = new Controlavel2(random(xGame/2 - xGame/2, xGame - xGame/2), yGame - yGame/2, tipoCriaturas[0]);
          arena2 = true;
        }
      }

    } else {
      if (minigame == -1){
        switch (indexTexto) {
          case 0:
            stroke(0, tempoTexto);
            fill(255, tempoTexto);
            textFont(fonte, 40);
            text('Capítulo 4', xGame/2 - 100, 100);
            break;
          case 1:
            stroke(0, tempoTexto);
            fill(255, tempoTexto);
            textFont(fonte, 40);
            text('Deriva genética:', xGame/2 - 210, 100);
            text('Especiação', xGame/2 - 210, 145);
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
            text('Que sufoco, hein?!', xGame/2 - 200, 100);
            break;
          case 3:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text(criatura[0][0] + ' sofreu bastante perdas e o terremoto mudou', xGame/2 - 200, 100);
            text('o ambiente drasticamente, a terra foi separada por um rio.', xGame/2 - 200, 125);
            break;
          case 4:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Alguns indivíduos de ' + criatura[0][0] + ' ficaram separados', xGame/2 - 200, 100);
            text('pelo rio, esses você não terá mais controle! Eles irão evoluir', xGame/2 - 200, 125);
            text('independentemente do outro lado do rio e irão adquirir caraterísticas', xGame/2 - 200, 150);
            text('diferentes das suas, até que em algum momento serão uma espécie', xGame/2 - 200, 175);
            text('diferente.', xGame/2 - 200, 200);
            text('Esse processo é a especiação.', xGame/2 - 200, 225);
            break;
          case 5:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Com toda essa mudança, agora você deve acumular pontos de', xGame/2 - 200, 100);
            text('modificação rapidamente através do minigame para se adaptar', xGame/2 - 200, 125);
            text('ao novo ambiente e seguir para a próxima fase.', xGame/2 - 200, 150);
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
            crtr.limitesLevel4(espacoRio);
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

          image(levelImagens[6], 0, 0);
          image(menusImagens[9], xGame - 250, 25);
          if (miniGameCompleto){
            imgp = menusImagens[7].get(64, 96, 32, 32);
            image(imgp, xGame - 90, 75);
          } else {
            if (tempoJogo >= 220){
              imgp = menusImagens[7].get(32, 96, 32, 32);
              image(imgp, xGame - 90, 75, imgp.width + scale1, imgp.height + scale1);
              if (scale1flag){
                scale1 += 0.25;
                if (scale1 >= 3){
                  scale1flag = false;
                }
              } else {
                scale1 -= 0.25;
                if (scale1 <= 0){
                  scale1flag = true;
                }
              }
            } else {
              imgp = menusImagens[7].get(0, 96, 32, 32);
              image(imgp, xGame - 90, 75);
            }
          }
        }
      }
    }
  }
}

//______________________________________________________________________________
// função que interpreta o valor do botão pressionado
//______________________________________________________________________________
Level4.prototype.keyPressed = function() {
  if (tempoJogo >= 220){
    if (!miniGameCompleto){
      // botões que acessam os minigames
      if (keyCode === 49 || keyCode === 97) {
        if (!miniGameOn){
          miniGameOn = true;
        }
      }
    }
  }
}

//______________________________________________________________________________
// função que interpreta o valor do botão do mouse
//______________________________________________________________________________
Level4.prototype.mousePressed = function() {
  // variável que identifica se terminou algum minigame
  if (esperandoClique){
    minigame = 0;
    miniGameOn = false;
    miniGameCompleto = true;
    esperandoClique = false;
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
