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

// o level 2 receberá as criaturas do level 1, ao invés de criar novas
function Level2(criaturasAnteriores){
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
  if (tempoJogo >= 130){
    alert("Fim do capítulo 2!");
    criaturasSalvas = tipoCriaturas;
    musicas[4].stop();
    musicas[5].loop();
    levelnum = 3;
    botaoCrdts.elt.textContent = 'Fable - por Adrian von Ziegler';
    level = new Level3(criaturasSalvas);

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
  image(levelImagens[5], 0, 0);
}
