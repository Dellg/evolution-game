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
  background(15);
  fill(255);
  if (tempoJogo >= 60){
    alert("Fim do capítulo 3!");
    criaturasSalvas = tipoCriaturas;
    levelnum = 4;

  } else {
    text("Salve o máximo de criaturas da sua espécie desviando dos obstáculos!", xGame/2 - 140, 30);
    text("Quantidade de Criaturas: " + criaturas.length, 10, 60);
    tempoJogo += 0.01;
    // verifica se não há criaturas vivas para poder iniciar a geração
    if (criaturas.length <= 0){
      geracao += 1;
      this.iniciaGeracao();
    } else {
      if (random(1) < 0.045) {
        obstaculos.push(new Obstaculo());
      }
      for (var i = criaturas.length - 1; i >= 0; i--){
        var crtr = criaturas[i];
        crtr.posicao.y += crtr.maxVelocidade - (0.5 * crtr.maxVelocidade);
        crtr.comportamentos(criaturas, obstaculos);
        crtr.limites();
        crtr.update();
        crtr.show();

        // aqui verifica se a criatura morreu, para retirá-la da população
        if (crtr.morreu()){
          criaturas.splice(i, 1);
        }
      }

      for (var i = obstaculos.length - 1; i >= 0; i--){
        var obst = obstaculos[i];
        obst.show();
        if (obst.sumiu()){
          obstaculos.splice(i, 1);
        }
      }
    }
  }
}
