var criaturas;
var variacaoCriaturas = 1; // variável que controla a quantidade de tipo de criatura
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
  for (var i = 0; i < tipoCriaturas.length; i++){
    for (var j = 0; j < quantiaEspecie; j++){
      var x = random(xGame);
      var y = random(yGame);
      var criatura = new Criatura(x, y, tipoCriaturas[i], null, geracao);
      criaturas.push(criatura);
    }
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
        crtr.comportamentos(alimentosPlanta, alimentosInseto, alimentosVeneno, alimentosCarne, criaturas);
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
          console.log(crtr.nome + " morreu.");
        }
      }
    }
  }
}
