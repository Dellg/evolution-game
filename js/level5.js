var criaturas;
var variacaoCriaturas = 2; // variável que controla a quantidade de tipo de criatura
var quantiaEspecie = 25; // variável que controla quantas de cada criatura serão geradas
var alimentosPlanta;
var alimentosInseto;
var alimentosVeneno;
var alimentosCarne; // apenas quando uma criatura morre
var variacaoAlimentos = 20; // variável que controla quantos tipos de alimentos serão criados
var countAlimentos; // o level 2 terá menos almentos (dificuldade maior)
var tipoCriaturasLevel4 = [];
var tipoAlimentos = [];
var geracao = 0;

// o level 4 a criatura do jogador e uma nova evolução paralela de sua criatura
function Level5(criaturasAnteriores){
  countAlimentos = 80;
  alimentosPlanta = [];
  alimentosInseto = [];
  alimentosVeneno = [];
  alimentosCarne = [];
  criaturas = [];
  tipoCriaturasLevel4 = criaturasAnteriores;
  this.carregarDados();
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
    var r;
    var g;
    var b;
    switch (t) {
      // planta
      case 0:
        r = random(0, 126);
        g = random(177, 255);
        b = 0;
        break;
      // inseto
      case 1:
        r = random(177, 255);
        g = random(0, 126);
        b = 0;
        break;
      // veneno
      case 2:
        r = random(0, 80);
        g = random(0, 80);
        b = random(126, 255);
        break;
    }
    tipoAlimentos[i] = [t, v, f, r, g, b];
  }
  // criatura que morreu
  tipoAlimentos.push([3, random(0.5, 1.5), random(0.5, 3), 255, 255, 255]);
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
  // redesenha a tela com a nova geração
  redraw();
}

//______________________________________________________________________________
// método que adiciona novas comidas nas listas
//______________________________________________________________________________
Level5.prototype.adicionaNovaComida = function(x, y, morto, eraCarn){
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
Level5.prototype.rodar = function(){
  background(15);
  fill(255);
  if (tempoJogo >= 800){
    alert("Fim do capítulo 4!");
    criaturasSalvas = tipoCriaturas;
    levelnum = 5;

  } else {
    tempoJogo += 0.1;
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
      for (var i = criaturas.length - 1; i >= 0; i--){
        var crtr = criaturas[i];
        crtr.comportamentos(alimentosPlanta, alimentosInseto, alimentosVeneno, alimentosCarne, criaturas);
        crtr.limitesLevel4();
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
    }
  }
}
