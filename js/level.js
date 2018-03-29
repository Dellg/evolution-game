var criaturas = [];
var variacaoCriaturas = 3; // variável que controla a quantidade de tipo de criatura
var quantiaEspecie = 25; // variável que controla quantas de cada criatura serão geradas
var alimentosPlanta;
var alimentosInseto;
var alimentosVeneno;
var alimentosCarne; // apenas quando uma criatura morre
var variacaoAlimentos = 20; // variável que controla quantos tipos de alimentos serão criados
var countAlimentos; // será para cada tipo de alimento
var tipoCriaturas = [];
var tipoAlimentos = [];
var geracao = 0;
var taxaMutacao = 0.01;
var minigame = 0;
var minig1 = false, minig2 = false, minig3 = false; // flag que verifica completude dos minigames
var esperando = false; // flag para o jogador não poder pressionar
var ordem = [], ordemAux = [];
var contador = 0; // contador usando no minigame 1
var roleta = 0; // variável de controle da velocidade da roleta
var roletaPara = 0;
var criaturasMiniGame = [];
var arena = false;

function Level(criatura){
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
  background(15);
  fill(255);
  if (tempoJogo >= 30){
    alert("Fim do capítulo 1!");
    criaturasSalvas = tipoCriaturas;
    levelnum = 1.5;

  } else {
    if (minigame == 1){ // minigame reprodução
      if (contador == 4){
        var perdeu = false;
        for (var i = 0; i < 4; i++){
          if (ordem[i] != ordemAux[i]){
            alert("Que pena! Você não conseguiu acertar.");
            minigame = 0;
            perdeu = true;
            break;
          }
        }
        if (!perdeu){
          alert("Muito bem! Você conseguiu realizar a dança do acasalamento! Você recebeu 150 pontos.");
          pontuacao += 150;
          minigame = 0;
        }
      }
      if (esperando){
        text("Decore a ordem:", xGame/2 - 100, 30);
        if (contador < 1){
          switch (ordem[0]) {
            case 37:
              text("Esquerda", xGame/2 - 100, 60);
              break;
            case 38:
              text("Cima", xGame/2 - 100, 60);
              break;
            case 39:
              text("Direita", xGame/2 - 100, 60);
              break;
            case 40:
              text("Baixo", xGame/2 - 100, 60);
              break;
          }
          contador += 0.03;
        } else if (contador < 1.4){
          contador += 0.03;
        } else {
          contador = 0;
          if (ordem.length){
            ordem.splice(0, 1);
          } else {
            esperando = false;
          }
        }
      } else {
        text("Aperte na ordem:", xGame/2 - 100, 30);
        text("Valendo...", xGame/2 - 100, 60);
      }

    } else if (minigame == 2){ // minigame arena
      if (arena){
        text("Você controla a criatura circulada de azul com o mouse", xGame/2 - 100, 30);
        text("Cace a criatura verde adversária antes que a criatura vermelha cace sua criatura verde", xGame/2 - 100, 60);
        for (var i = criaturasMiniGame.length - 1; i >= 0; i--){
          var crtr = criaturasMiniGame[i];
          if (crtr.acabou()){
            minigame = 0;
            break;
          }
          crtr.comportamentos(criaturasMiniGame);
          crtr.limites();
          crtr.update();
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

    } else if (minigame == 3){ // roleta sorte
      ellipse(xGame/2, yGame/2, 300, 300);
      fill(200, 0, 0);
      strokeWeight(3);
      stroke(0);
      line(xGame/2 - 108, yGame/2 - 108, xGame/2 + 108, yGame/2 + 108);
      line(xGame/2 + 108, yGame/2 - 108, xGame/2 - 108, yGame/2 + 108);
      noStroke();
      text("50 pontos", xGame/2 - 130, yGame/2);
      text("0 pontos", xGame/2 + 70, yGame/2);
      text("150 pontos", xGame/2 - 30, yGame/2 + 110);
      text("300 pontos", xGame/2 - 30, yGame/2 - 110);

      push();

      translate(xGame/2, yGame/2);
      stroke(24);
      angleMode(DEGREES);
      strokeWeight(3);
      rotate(contador);
      contador += roleta;
      if (roletaPara == 2){
        if (contador >= 45 && contador < 135){
          alert("Que pena! Você não conseguiu pegar nenhum ponto.");
          minigame = 0;
        } else if (contador >= 135 && contador < 225){
          alert("Muito bem! Você conseguiu 150 pontos.");
          pontuacao += 150;
          minigame = 0;
        } else if (contador >= 225 && contador < 315){
          alert("Bom! Você conseguiu 50 pontos.");
          pontuacao += 50;
          minigame = 0;
        } else {
          alert("Incrível! Você conseguiu 300 pontos.");
          pontuacao += 300;
          minigame = 0;
        }
      } else if (roletaPara == 1){
        if (roleta > 0){
          roleta -= 0.2;
        } else if (roleta < 0){
          roleta = 0;
          roletaPara = 2;
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

    } else {
      tempoJogo += 0.01;
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
        text("Aperte 1 para jogar o MiniGame da dança de acasalamento", xGame - 400, 20);
        text("Aperte 2 para jogar o MiniGame da arena", xGame - 400, 45);
        text("Aperte 3 para jogar o MiniGame da roleta da sorte", xGame - 400, 70);
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
}

//______________________________________________________________________________
// função que interpreta o valor do botão pressionado
//______________________________________________________________________________
function keyPressed() {
  if (!esperando){
    // minigame 1 ativo
    if (minig1){
      if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW){
        ordem.push(keyCode);
        contador += 1;
      }
    }
    // minigame 3 ativo
    if (minig3){
      if (roleta >= 40){
        roletaPara = 1;
      }
    }
    // botões que acessam os minigames
    if (keyCode === 49 || keyCode === 97) {
      if (!minig1){
        minigame = 1;
        esperando = true;
        for (var i = 0; i < 4; i++){
          ordem.push(parseInt(round(random(36.51, 40.49))));
          ordemAux.push(ordem[i]);
        }
        minig1 = true;
      }
    } else if (keyCode === 50 || keyCode === 98) {
      if (!minig2){
        minigame = 2;
        minig2 = true;
      }
    } else if (keyCode === 51 || keyCode === 99) {
      if (!minig3){
        minigame = 3;
        minig3 = true;
      }
    }
  }
}
