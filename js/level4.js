var criaturas;
var quantiaEspecie = 25; // variável que controla quantas de cada criatura serão geradas
var tipoCriaturas = [];
var geracao = 0;

// o level 4 a criatura do jogador e uma nova evolução paralela de sua criatura
function Level4(criaturasAnteriores){
  criaturas = [];
  tipoCriaturas = criaturasAnteriores;
}

//______________________________________________________________________________
// aqui reinicia o jogo com uma nova geração
//______________________________________________________________________________
Level4.prototype.iniciaGeracao = function(){
  // cria quantidades das criaturas pré-definidas
  for (var j = 0; j < quantiaEspecie; j++){
    var x = random(xGame);
    var y = random(yGame);
    var criatura = new Controlavel(x, y, tipoCriaturas[0], true, true);
    criaturas.push(criatura);
  }
  redraw();
}

//______________________________________________________________________________
// método que roda o jogo ou os minigames do level
//______________________________________________________________________________
Level4.prototype.rodar = function(){
  background(15);
  fill(255);
  if (tempoJogo >= 90){
    alert("Fim do capítulo 4!");
    criaturasSalvas = tipoCriaturas;
    levelnum = 5;

  } else {
    tempoJogo += 0.01;
    // verifica se não há criaturas vivas para poder iniciar a geração
    if (criaturas.length <= 0){
      geracao += 1;
      this.iniciaGeracao();
    } else {
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
    }
  }
}
