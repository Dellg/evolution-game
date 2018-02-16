var criaturas = [];
var variacaoCriaturas = 3; // variável que controla a quantidade de tipo de criatura
var quantiaEspecie = 20; // variável que controla quantas de cada criatura serão geradas
var alimentosPlanta;
var alimentosInseto;
var alimentosVeneno;
var alimentosCarne; // apenas quando uma criatura morre
var variacaoAlimentos = 20; // variável que controla quantos tipos de alimentos serão criados
var countAlimentos = 80; // será para cada tipo de alimento
var tipoCriaturas = [];
var tipoAlimentos = [];
var geracao = 0;
var taxaMutacao = 0.01;

function Level(criatura){
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
  if (tipoJogador != 0)
    tipoCriaturas.push(["Nalulóbulis", 0, 2, 1.5,   1, 1.8 + random(0.5), color(random(255), random(255), random(255))]);
  if (tipoJogador != 1)
    tipoCriaturas.push(["Kunglob"    , 1, 2,   4, 1.2, 2.1 + random(0.5), color(random(255), random(255), random(255))]);
  if (tipoJogador != 2)
    tipoCriaturas.push(["Cacoglobius", 2, 2,   2, 1.1, 1.5 + random(0.5), color(random(255), random(255), random(255))]);

  // código antigo para quando o jogo tiver mais de 3 tipos de criaturas
  // for (var i = 0; i < variacaoCriaturas; i++){
  //   var t = i%3;
  //   if (t == 0){
  //     tipoCriaturas.push(["Nalulóbulis" + i, t, 2, 1.5,   1,   2 + random(0.5), color(random(255), random(255), random(255))]);
  //   } else if (t == 1){
  //     tipoCriaturas.push(["Kunglob"     + i, t, 2,   5, 1.2, 2.4 + random(0.5), color(random(255), random(255), random(255))]);
  //   } else if (t == 2){
  //     tipoCriaturas.push(["Cacoglobius" + i, t, 2,   3, 1.1, 1.5 + random(0.5), color(random(255), random(255), random(255))]);
  //   }
  // }
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
Level.prototype.iniciaGeracao = function(){
  // cria quantidades das criaturas pré-definidas
  for (var i = 0; i < tipoCriaturas.length; i++){
    for (var j = 0; j < quantiaEspecie; j++){
      var x = random(xGame);
      var y = random(yGame);
      var criatura = new Criatura(x, y, tipoCriaturas[i], null, geracao);
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
Level.prototype.adicionaNovaComida = function(x, y, morto){
  if (x == null || y == null){
    x = random(5, xGame-5);
    y = random(5, yGame-5);
  }
  // se foi morto, adiciona uma carne de criatura (último índice)
  if (morto){
    alimentosCarne.push(new Alimento(x, y, tipoAlimentos[tipoAlimentos.length-1]));
  // se não foi, adiciona um alimento inseto, planta ou tóxico
  } else {
    var r = round(random(tipoAlimentos.length - 1));
    switch (tipoAlimentos[r][0]) {
      case 0:
        if (alimentosPlanta.length < (countAlimentos - countAlimentos/3)){
          alimentosPlanta.push(new Alimento(x, y, tipoAlimentos[r]));
          alimentosPlanta.push(new Alimento(x, y, tipoAlimentos[r]));
          alimentosPlanta.push(new Alimento(x, y, tipoAlimentos[r]));
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
// onde o jogo acontece, de fato
//______________________________________________________________________________
Level.prototype.rodar = function(){
  // menu principal de entrada de dados
  if (menu == 0){
    col = color(corR.value(), corG.value(), corB.value());
    fill(col);
    rect(195,362,58,58);
  // interface do jogo
  } else if (menu == 1){
    background(15);
    fill(255);
    if (criaturas.length <= 0){
      geracao += 1;
      this.iniciaGeracao();
    } else {
      // gera novas comidas se tiver menos da quantidade definida comidas no canvas
      if ((alimentosPlanta.length + alimentosInseto.length + alimentosVeneno.length) < countAlimentos){
        if (random(1) < 0.2) {
          this.adicionaNovaComida(null, null);
        }
      }
      for (var i = criaturas.length - 1; i >= 0; i--){
        var crtr = criaturas[i];
        crtr.comportamentos(alimentosPlanta, alimentosInseto, alimentosVeneno, alimentosCarne, criaturas);
        crtr.limites();
        crtr.update();
        crtr.show();

        // aqui verifica se foi feita reprodução, para adicionar os filhos à população
        if (crtr != undefined){
          var filho = crtr.reproduz();
          if (filho != null) {
            criaturas.push(filho);
          }
        }
        // aqui verifica se a criatura morreu, para retirá-la da população
        if (crtr.morreu()){
          criaturas.splice(i, 1);
          console.log(crtr.nome + " morreu.")
          this.adicionaNovaComida(crtr.posicao.x, crtr.posicao.y, true);
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
