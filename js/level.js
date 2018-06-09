var criaturas = [];
var variacaoCriaturas = 3; // variável que controla a quantidade de tipo de criatura
var quantiaEspecie = 25; // variável que controla quantas de cada criatura serão geradas
var alimentosPlanta;
var alimentosInseto;
var alimentosVeneno;
var alimentosCarne; // apenas quando uma criatura morre
var quantiaObstaculos = 12; // quantidade de árvores para desviar
var obstaculos = [];
var variacaoAlimentos = 20; // variável que controla quantos tipos de alimentos serão criados
var countAlimentos; // será para cada tipo de alimento
var tipoCriaturas = [];
var tipoAlimentos = [];
var geracao = 0;
var taxaMutacao = 0.01;
var minigameEsperando = false;
var minigame = -1;
var minig1 = false, minig2 = false, minig3 = false; // flag que verifica completude dos minigames
var esperando = false; // flag para o jogador não poder pressionar
var ordem = [], ordemAux = [];
var contador = 0; // contador usando no minigame 1
var roleta = 0; // variável de controle da velocidade da roleta
var roletaPara = 0;
var criaturasMiniGame = [];
var arena = false;
var scale1 = 0;
var scale2 = 0;
var scale3 = 0;
var scale1flag = true;
var scale2flag = true;
var scale3flag = true;
var ultimoPressionado = 0;
var esperandoClique = false;
var perdeu;

function Level(criatura){
  tempoTexto = 0;
  indexTexto = 0;
  flagTexto = false;
  countAlimentos = 80;
  if (criatura != null){
    tipoCriaturas.push(criatura);
  }
  this.adicionarAleatorios();
  this.carregarDados();
}

//______________________________________________________________________________
// adicionar criaturas aleatoriamente
//______________________________________________________________________________
Level.prototype.adicionarAleatorios = function() {
  // Nalulóbulis herb 0, Kunglob carn 1, Cacoglobius oni 2
  // nome, tipo, vida, fome, velocidade, resistência, cor
  var tipoJogador = -1;
  if (tipoCriaturas.length > 0) {
    tipoJogador = tipoCriaturas[0][1];
  }
  // rebalanceado usando fórmula (prévia para jogador)
  if (tipoJogador != 0)
    tipoCriaturas.push([["Nalulóbulis", "Casco", "Grande", "Chifre"],       0,   2, 1.5,    1, 1.5, imagens[0]]);
  if (tipoJogador != 1)
    tipoCriaturas.push([["Kunglob", "Garra", "Pequeno", "Orelhas Grandes"], 1,   1,   6, 1.25, 2.5, imagens[1]]);
  if (tipoJogador != 2)
    tipoCriaturas.push([["Cacoglobius", "Mão", "Médio", "Duas Caudas"],     2, 1.5,   3,  1.1, 1.9, imagens[2]]);
}

//______________________________________________________________________________
// carrega os dados dos alimentos e inicia o jogo com uma geração
//______________________________________________________________________________
Level.prototype.carregarDados = function(){
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
Level.prototype.iniciaGeracao = function(){
  var x, y, obst, r;
  // cria quantidades das criaturas pré-definidas
  for (var i = 0; i < tipoCriaturas.length; i++){
    for (var j = 0; j < quantiaEspecie; j++){
      x = random(xGame);
      y = random(yGame);
      var criatura = new Criatura(x, y, tipoCriaturas[i], null, geracao);
      criaturas.push(criatura);
    }
  }
  // colocando obstáculos em suas posições
    // árvores com flores vermelhas
  r = 35;
  x = 77;
  y = 152;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 150;
  y = 186;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 810;
  y = 110;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 567;
  y = 766;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
    // árvores com plantas laranjas
  r = 30;
  x = 15;
  y = 306;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 834;
  y = 766;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
    // árvores grandes
  r = 60;
  x = 203;
  y = 440;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 648;
  y = 324;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 962;
  y = 120;
  obst = new Obstaculo(true, x, y, 50); // essa é menor
  obstaculos.push(obst);
  x = 915;
  y = 687;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
    // cactos
  r = 55;
  x = 448;
  y = 298;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);
  x = 1004;
  y = 285;
  obst = new Obstaculo(true, x, y, r);
  obstaculos.push(obst);

  // iniciando vetores dos alimentos
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
Level.prototype.adicionaNovaComida = function(x, y, morto, eraCarn){
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
Level.prototype.rodar = function(){
  image(levelImagens[0], 0, 0);
  fill(255);
  if (tempoJogo >= 80){
    alert("Fim do capítulo 1!");
    criaturasSalvas = tipoCriaturas;
    indexTexto = 0;
    tempoTexto = 0;
    flagTexto = false;
    musicas[3].stop();
    musicas[4].loop();
    botaoUpgrade1.show();
    botaoUpgrade2.show();
    botaoUpgrade3.show();
    botaoUpgrade4.show();
    botaoUpgrade5.show();
    botaoUpgrade6.show();
    botaoUpgrade7.show();
    botaoUpgrade8.show();
    botaoCancelar.show();
    botaoConfirmar.show();
    levelnum = 1.5;
    botaoCrdts.elt.textContent = 'Origins - por Adrian von Ziegler';

  } else {
    if (minigame == 1){ // minigame reprodução
      if (minigameEsperando){
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
          case 0:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('A reprodução sexuada traz variabilidade genética para uma', xGame/2 - 200, 100);
            text('população, na medida em que os descendentes nascem com', xGame/2 - 200, 125);
            text('informações genéticas misturadas dos pais, ou seja, há uma', xGame/2 - 200, 150);
            text('recombinação gênica.', xGame/2 - 200, 175);
            break;
          case 1:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Faça a dança do acasalamento para atrair parceiros e deixar', xGame/2 - 200, 100);
            text('descendentes férteis na população.', xGame/2 - 200, 125);
            break;
          case 2:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Você deve repetir a sequência de passos da dança que', xGame/2 - 200, 100);
            text('aparecerão na tela. Preparado?', xGame/2 - 200, 125);
            break;
          }
      } else {
        if (esperando){
          text("Decore a ordem:", xGame/2 - 100, 30);
          if (contador < 1.5){
            textFont(fonte, 22);
            switch (ordem[0]) {
              case 37:
                image(imagens[30 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
                text("Esquerda", xGame/2 - 100, 60);
                break;
              case 38:
                image(imagens[31 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
                text("Cima", xGame/2 - 100, 60);
                break;
              case 39:
                image(imagens[28 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
                text("Direita", xGame/2 - 100, 60);
                break;
              case 40:
                image(imagens[29 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
                text("Baixo", xGame/2 - 100, 60);
                break;
              default:
                image(imagens[27 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
                break;
            }
            contador += 0.03;
          } else if (contador >= 1.5){
            contador = 0;
            if (ordem.length){
              ordem.splice(0, 1);
            } else {
              esperando = false;
            }
          }
        } else {
          switch (ultimoPressionado) {
            case 37:
              image(imagens[30 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
              break;
            case 38:
              image(imagens[31 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
              break;
            case 39:
              image(imagens[28 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
              break;
            case 40:
              image(imagens[29 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
              break;
            default:
              image(imagens[27 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
              break;
          }
          if (contador < 4){
            text("Aperte na ordem:", xGame/2 - 100, 30);
            text("Valendo...", xGame/2 - 100, 60);
          }
        }
        if (contador == 4){
          switch (ultimoPressionado) {
            case 37:
              image(imagens[30 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
              break;
            case 38:
              image(imagens[31 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
              break;
            case 39:
              image(imagens[28 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
              break;
            case 40:
              image(imagens[29 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
              break;
            default:
              image(imagens[27 + criatura[1] * 5], xGame/2 - 200, yGame/2 - 200);
              break;
          }

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

          perdeu = false;
          for (var i = 0; i < 4; i++){
            if (ordem[i] != ordemAux[i]){
              stroke(0);
              fill(255);
              textFont(fonte, 18);
              text('Infelizmente não foi dessa vez que você conseguiu deixar', xGame/2 - 200, 100);
              text('descendente.', xGame/2 - 200, 125);
              perdeu = true;
              break;
            }
          }
          if (!perdeu){
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Parabéns! Você atraiu parceiros e deixou descendentes,', xGame/2 - 200, 100);
            text('gerando maior riqueza genética na sua espécie.', xGame/2 - 200, 125);
          }
        }
      }

    } else if (minigame == 2){ // minigame arena
      if (minigameEsperando){
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
          case 0:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Aqui não está sendo gerada variabilidade genética, mas no', xGame/2 - 200, 100);
            text('ambiente natural a competição é uma realidade constante,', xGame/2 - 200, 125);
            text('onde muitas vezes é preciso atacar ou fugir.', xGame/2 - 200, 150);
            break;
          case 1:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Você controla a criatura circulada de azul, siga o', xGame/2 - 200, 100);
            text('indivíduo circulado de verde da espécie oposta com o', xGame/2 - 200, 125);
            text('mouse e torça para não ser encontrado primeiro.', xGame/2 - 200, 150);
            break;
          case 2:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Preparado? Não se deixe ser atacado e não deixe a vítima', xGame/2 - 200, 100);
            text('fugir!', xGame/2 - 200, 125);
            break;
          }
      } else {
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

          if (perdeu){
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Você foi atacado! Que pena!', xGame/2 - 200, 100);

          } else {
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Parabéns! Mostrou que saber a hora certa de atacar e de', xGame/2 - 200, 100);
            text('fugir é importante para a sobrevivência dos indivíduos.', xGame/2 - 200, 125);
          }

        } else {
          if (arena){
            for (var i = criaturasMiniGame.length - 1; i >= 0; i--){
              var crtr = criaturasMiniGame[i];
              if (crtr.acabou()){
                esperandoClique = true;
              }
              crtr.comportamentos(criaturasMiniGame);
              crtr.update();
              crtr.limites();
              crtr.show();
            }
          } else {
            var player = new Controlavel(random(100,150), random(100, yGame - 132), tipoCriaturas[0], true, true);
            criaturasMiniGame.push(player);
            player = new Controlavel(random(100,150), random(100, yGame - 132), tipoCriaturas[0], false, false);
            criaturasMiniGame.push(player);
            player = new Controlavel(random(xGame - 182, xGame - 132), random(100, yGame - 132), tipoCriaturas[1], false, true);
            criaturasMiniGame.push(player);
            player = new Controlavel(random(xGame - 182, xGame - 132), random(100, yGame - 132), tipoCriaturas[1], false, false);
            criaturasMiniGame.push(player);
            arena = true;
          }
        }
      }

    } else if (minigame == 3){ // roleta sorte
      if (minigameEsperando){

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
          case 0:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('As mutações podem introduzir, remover, ou modificar genes,', xGame/2 - 200, 100);
            text('sendo assim, matéria prima para a variabilidade genética.', xGame/2 - 200, 125);
            text('São totalmente aleatórias, significando que podem ou não', xGame/2 - 200, 150);
            text('trazer benefícios para uma espécie, e podem ou não serem', xGame/2 - 200, 175);
            text('selecionadas pelo processo de seleção natural.', xGame/2 - 200, 200);
            break;
          case 1:
            stroke(0);
            fill(255);
            textFont(fonte, 18);
            text('Gire a roleta e veremos quantos pontos de modificação', xGame/2 - 200, 100);
            text('vai receber ao acaso!', xGame/2 - 200, 125);
            break;
          }

      } else {
        strokeWeight(3);
        stroke(0);
        fill(92, 64, 51);
        ellipse(xGame/2, yGame/2, 300, 300);
        fill(200, 0, 0);
        line(xGame/2 - 106, yGame/2 - 106, xGame/2 + 106, yGame/2 + 106);
        line(xGame/2 + 106, yGame/2 - 106, xGame/2 - 106, yGame/2 + 106);
        textFont(fonte, 16);
        noStroke();
        fill(255);
        text("50 pontos", xGame/2 - 140, yGame/2);
        text("0 pontos", xGame/2 + 60, yGame/2);
        text("150 pontos", xGame/2 - 45, yGame/2 + 110);
        text("300 pontos", xGame/2 - 45, yGame/2 - 110);

        push();

        fill(255, 0, 0);
        translate(xGame/2, yGame/2);
        stroke(24);
        angleMode(DEGREES);
        strokeWeight(3);
        rotate(contador);
        contador += roleta;
        if (roletaPara == 2){
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

            if (contador >= 45 && contador < 135){
              stroke(0);
              fill(255);
              textFont(fonte, 18);
              text('Você não ganhou nenhum ponto de modificação dessa vez!', xGame/2 - 200, 100);
            } else if (contador >= 135 && contador < 225){
              stroke(0);
              fill(255);
              textFont(fonte, 18);
              text('Ótimo! Você ganhou 150 pontos de modificação!', xGame/2 - 200, 100);
              pontuacao += 150;
            } else if (contador >= 225 && contador < 315){
              stroke(0);
              fill(255);
              textFont(fonte, 18);
              text('Muito bom! Você ganhou 50 pontos de modificação!', xGame/2 - 200, 100);
            } else {
              stroke(0);
              fill(255);
              textFont(fonte, 18);
              text('Perfeito! Você ganhou 300 pontos de modificação!', xGame/2 - 200, 100);
            }
          }
        } else if (roletaPara == 1){
          if (roleta > 0){
            roleta -= 0.2;
          } else if (roleta < 0){
            roleta = 0;
            roletaPara = 2;
            esperandoClique = true;
          }
        } else {
          if (roleta < 40){
            roleta += 0.1;
          } else {
            fill(0, 255, 0);
          }
        }
        if (contador >= 360){
          contador -= 360;
        }
        triangle(0, -80, 30, 30, -30, 30);
        pop();
      }

    } else if (minigame == -1){
      switch (indexTexto) {
        case 0:
          stroke(0, tempoTexto);
          fill(255, tempoTexto);
          textFont(fonte, 40);
          text('Capítulo 1', xGame/2 - 100, 100);
          break;
        case 1:
          stroke(0, tempoTexto);
          fill(255, tempoTexto);
          textFont(fonte, 40);
          text('Variabilidade Genética', xGame/2 - 170, 100);
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
          text('Bem-vindo(a) à Geb! Aqui começa a aventura, ' + nomeJogador + '!', xGame/2 - 200, 100);
          break;
        case 3:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('A variabilidade genética é um pré-requisito para a evolução', xGame/2 - 200, 100);
          text('acontecer, os mecanismos que trazem variabilidade genética', xGame/2 - 200, 125);
          text('para uma espécie são as mutações e a recombinação gênica.', xGame/2 - 200, 150);
          break;
        case 4:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('Você precisa acumular pontos de modificação do DNA para', xGame/2 - 200, 100);
          text('poder adquirir novas mutações e deixar sua população mais', xGame/2 - 200, 125);
          text('rica geneticamente.', xGame/2 - 200, 150);
          break;
        case 5:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('Os pontos se encontram na tela do lado esquerdo, junto com', xGame/2 - 200, 100);
          text('a contagem de quanto tempo está se passando enquanto sua', xGame/2 - 200, 125);
          text('espécie está evoluindo.', xGame/2 - 200, 150);
          break;
        case 6:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('À medida que a população se alimenta e se reproduz, ela ganha', xGame/2 - 200, 100);
          text('alguns pontos de modificação. Logo você encontrará 3 minigames', xGame/2 - 200, 125);
          text('do lado direito da tela que você precisará realizar com sucesso', xGame/2 - 200, 150);
          text('para acumular pontos suficientes para ir à próxima fase.', xGame/2 - 200, 175);
          break;
        case 7:
          stroke(0);
          fill(255);
          textFont(fonte, 18);
          text('A aventura de ' + criatura[0][0] + ' é seguir o curso natural da evolução.', xGame/2 - 200, 100);
          text('Boa sorte!', xGame/2 - 200, 125);
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
      image(levelImagens[4], 0, 0);
      image(menusImagens[9], xGame - 250, 25);
      // ícones
      if (minig1){
        imgp = menusImagens[7].get(64, 0, 32, 32);
        image(imgp, xGame - 230, 75);
      } else {
        if (tempoJogo >= 20){
          imgp = menusImagens[7].get(32, 0, 32, 32);
          image(imgp, xGame - 230, 75, imgp.width + scale1, imgp.height + scale1);
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
          imgp = menusImagens[7].get(0, 0, 32, 32);
          image(imgp, xGame - 230, 75);
        }
      }
      if (minig2){
        imgp = menusImagens[7].get(64, 32, 32, 32);
        image(imgp, xGame - 160, 75);
      } else {
        if (tempoJogo >= 40){
          imgp = menusImagens[7].get(32, 32, 32, 32);
          image(imgp, xGame - 160, 75, imgp.width + scale2, imgp.height + scale2);
          if (scale2flag){
            scale2 += 0.25;
            if (scale2 >= 3){
              scale2flag = false;
            }
          } else {
            scale2 -= 0.25;
            if (scale2 <= 0){
              scale2flag = true;
            }
          }
        } else {
          imgp = menusImagens[7].get(0, 32, 32, 32);
          image(imgp, xGame - 160, 75);
        }
      }
      if (minig3){
        imgp = menusImagens[7].get(64, 64, 32, 32);
        image(imgp, xGame - 90, 75);
      } else {
        if (tempoJogo >= 60){
          imgp = menusImagens[7].get(32, 64, 32, 32);
          image(imgp, xGame - 90, 75, imgp.width + scale3, imgp.height + scale3);
          if (scale3flag){
            scale3 += 0.25;
            if (scale3 >= 3){
              scale3flag = false;
            }
          } else {
            scale3 -= 0.25;
            if (scale3 <= 0){
              scale3flag = true;
            }
          }
        } else {
          imgp = menusImagens[7].get(0, 64, 32, 32);
          image(imgp, xGame - 90, 75);
        }
      }
    }
  }
}

//______________________________________________________________________________
// função que interpreta o valor do botão do mouse
//______________________________________________________________________________
Level.prototype.mousePressed = function() {
  if (minigame == -2){
    if (indexTexto >= 2){
      if (tempoTexto >= 30){
        indexTexto += 1;
        if (indexTexto == 8) {
          minigame = 0;
        }
        tempoTexto = 0;
      }
    }
  }
  if (minigame == 1 || minigame == 2){
    if (indexTexto >= 0){
      if (tempoTexto >= 30){
        indexTexto += 1;
        if (indexTexto == 3) {
          minigameEsperando = false;
        }
        tempoTexto = 0;
      }
    }
  } else if (minigame == 3){
    if (indexTexto >= 0){
      if (tempoTexto >= 30){
        indexTexto += 1;
        if (indexTexto == 2) {
          minigameEsperando = false;
        }
        tempoTexto = 0;
      }
    }
  }
  // variável que identifica se terminou algum minigame
  if (esperandoClique){
    if (!perdeu){
      if (minigame == 1){
        pontuacao += 150;
      } else if (minigame == 2){
        pontuacao += 100;
      }
    }
    if (minigame == 3){
      if (contador >= 45 && contador < 135){
        // faz nada
      } else if (contador >= 135 && contador < 225){
        pontuacao += 150;
      } else if (contador >= 225 && contador < 315){
        pontuacao += 50;
      } else {
        pontuacao += 300;
      }
    }
    minigame = 0;
    esperandoClique = false;
  }
  // minigame 3 ativo
  if (minig3){
    if (roleta >= 40){
      roletaPara = 1;
    }
  }
}

//______________________________________________________________________________
// função que interpreta o valor do botão pressionado
//______________________________________________________________________________
Level.prototype.keyPressed = function() {
  if (!esperando){
    // minigame 1 ativo
    if (minig1){
      if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW){
        ultimoPressionado = keyCode;
        ordem.push(keyCode);
        contador += 1;
        esperandoClique = true;
      }
    }
    // minigame 3 ativo
    if (minig3){
      if (roleta >= 40){
        roletaPara = 1;
      }
    }
    if (tempoJogo >= 20){
      // botões que acessam os minigames
      if (keyCode === 49 || keyCode === 97) {
        if (!minig1 && minigame == 0){
          minigame = 1;
          esperando = true;
          for (var i = 0; i < 4; i++){
            ordem.push(parseInt(round(random(36.51, 40.49))));
            ordemAux.push(ordem[i]);
          }
          minig1 = true;
          indexTexto = 0;
          minigameEsperando = true;
        }
      }
    }
    if (tempoJogo >= 40){
      if (keyCode === 50 || keyCode === 98) {
        if (!minig2 && minigame == 0){
          minigame = 2;
          minig2 = true;
          indexTexto = 0;
          minigameEsperando = true;
        }
      }
    }
    if (tempoJogo >= 60){
      if (keyCode === 51 || keyCode === 99) {
        if (!minig3 && minigame == 0){
          minigame = 3;
          minig3 = true;
          indexTexto = 0;
          minigameEsperando = true;
        }
      }
    }
  }
}
