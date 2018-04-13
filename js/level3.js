var criaturas;
var quantiaEspecie = 25; // variável que controla quantas de cada criatura serão geradas
var tipoCriaturas = [];
var geracao = 0;

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
  redraw();
}

//______________________________________________________________________________
// método que roda o jogo ou os minigames do level
//______________________________________________________________________________
Level3.prototype.rodar = function(){
  background(15);
  fill(255);
  if (tempoJogo >= 100){
    alert("Fim do capítulo 3!");
    criaturasSalvas = tipoCriaturas;
    levelnum = 4;

  } else {
    tempoJogo += 0.01;
    // verifica se não há criaturas vivas para poder iniciar a geração
    if (criaturas.length <= 0){
      geracao += 1;
      this.iniciaGeracao();
    } else {
      for (var i = criaturas.length - 1; i >= 0; i--){
        var crtr = criaturas[i];
        crtr.comportamentos(criaturas);
        crtr.limites();
        crtr.update();
        crtr.show();
      }
    }
  }
}
