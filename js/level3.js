var criaturas;
var quantiaEspecie = 25; // variável que controla quantas de cada criatura serão geradas
var tipoCriaturas = [];
var obstaculos = [];
var geracao = 0;
var jaIniciou = false;

// o level 3 a criatura do jogador apenas
function Level3(criaturasAnteriores){
  criaturas = [];
  tipoCriaturas = criaturasAnteriores;
}

//______________________________________________________________________________
// aqui reinicia o jogo com uma nova geração
//______________________________________________________________________________
Level3.prototype.iniciaGeracao = function(){
  // cria quantidades das criaturas pré-definidas
  for (var j = 0; j < quantiaEspecie; j++){
    var x = random(xGame);
    var y = random(yGame);
    var criatura = new Controlavel(x, y, tipoCriaturas[0], true, true);
    criaturas.push(criatura);
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

  // redesenha a tela com a nova geração
  if (jaIniciou){
    alert("Você teve muitas baixas! Por sorte, algumas de suas criaturas já tinha chegado lá!");
    levelnum = 4;
  } else {
    jaIniciou = true;
    redraw();
  }
}

//______________________________________________________________________________
// método que roda o jogo ou os minigames do level
//______________________________________________________________________________
Level3.prototype.rodar = function(){
  var aleatorioX = random(-2, 2);
  var aleatorioY = random(-2, 2);
  image(levelImagens[1], aleatorioX, aleatorioY);
  fill(255);
  if (tempoJogo >= 180){
    alert("Fim do capítulo 3!");
    criaturasSalvas = tipoCriaturas;
    musicas[5].stop();
    musicas[6].loop();
    levelnum = 4;
    botaoCrdts.elt.textContent = 'Galdrar - por Adrian von Ziegler';
    level = new Level4(criaturasSalvas);

  } else {
    text("Salve o máximo de criaturas da sua espécie desviando dos obstáculos!", xGame/2 - 140, 30);
    tempoJogo += 0.05;
    // verifica se não há criaturas vivas para poder iniciar a geração
    if (criaturas.length <= 0){
      geracao += 1;
      this.iniciaGeracao();
    } else {
      if (random(1) < 0.045) {
        obstaculos.push(new Obstaculo(false, 0, 0, 0));
      }
      for (var i = criaturas.length - 1; i >= 0; i--){
        var crtr = criaturas[i];
        if (crtr != undefined){
          crtr.posicao.y += crtr.maxVelocidade - (0.5 * crtr.maxVelocidade);
          crtr.comportamentos(criaturas, obstaculos);
          crtr.limites();
          crtr.update();
          crtr.show();
        }

        // aqui verifica se a criatura morreu, para retirá-la da população
        if (crtr.morreu()){
          criaturas.splice(i, 1);
        }
      }
      image(levelImagens[5], aleatorioX, aleatorioY);

      for (var i = obstaculos.length - 1; i >= 9; i--){
        var obst = obstaculos[i];
        obst.show();
        if (obst.sumiu()){
          obstaculos.splice(i, 1);
        }
      }
      image(menusImagens[10], xGame - 250, 25);
      imgp = menusImagens[5].get(32 * criatura[1], 32, 32, 32);
      image(imgp, xGame - 170, 80);
      fill(255);
      strokeWeight(3);
      stroke(0);
      textFont("Lithos Pro", 16);
      textStyle(BOLD);
      text(criaturas.length, xGame - 130, 100);
    }
  }
}
