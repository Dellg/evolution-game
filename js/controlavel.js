var frame = 0;
var fps = 0.03;

function Controlavel(x, y, caracteristicas, player, cacador){
  this.nome = caracteristicas[0][0];
  this.vida = 1;
  this.velocidade = p5.Vector.random2D(caracteristicas[4]);
  if (cacador){
    this.maxVelocidade = parseFloat(caracteristicas[4]);
  } else {
    this.maxVelocidade = 0.5;
  }
  this.imagem = caracteristicas[6];
  this.player = player; // booleano que identifica se é jogador
  this.cacador = cacador; // booleano que identifica se ataca ou se foge
  this.terminou = false;
  this.venceu = false;

  // dados da criatura
  this.posicao = createVector(x, y);
  this.aceleracao = createVector();
  this.maxForca = 0.05;
  this.raio = 5;
}

//____________________________________________________________________________
//  método que define qual comportamento a criatura irá realizar
//____________________________________________________________________________
Controlavel.prototype.comportamentos = function(criaturas) {
  var predador, presa;
  if (this.cacador){
    if (this.player){
      predador = this.persegue(criaturas);
    } else {
      predador = this.persegue(criaturas);
    }
    if (!this.terminou){
      predador.mult(1.5);
      this.aplicaForca(predador);
    }
  } else {
    presa = this.fugir(criaturas);
    presa.mult(-3.5);
    this.aplicaForca(presa);
  }
}

//____________________________________________________________________________
// método de atualização
//____________________________________________________________________________
Controlavel.prototype.update = function() {
  this.velocidade.add(this.aceleracao);
  this.velocidade.limit(this.maxVelocidade);
  this.posicao.add(this.velocidade);
  this.aceleracao.mult(0);
}

//____________________________________________________________________________
//  método que aplica força na aceleração
//____________________________________________________________________________
Controlavel.prototype.aplicaForca = function(forca) {
  this.aceleracao.add(forca);
}

//____________________________________________________________________________
// método que define se a criatura irá perseguir outra criatura
//____________________________________________________________________________
Controlavel.prototype.persegue = function(presas) {
  var lembranca = Infinity;
  var maisProximo = null;

  if (this.player){
    var distancia = this.posicao.dist(presas[3].posicao);
    if (distancia < this.maxVelocidade + this.raio * 2){
      this.terminou = true;
      this.venceu = true;
    }
    return this.movimenta(createVector(mouseX, mouseY), false);
  } else {
    var distancia = this.posicao.dist(presas[1].posicao);
    if (distancia < this.maxVelocidade + this.raio * 2) {
      this.terminou = true;
    } else {
      if (distancia < lembranca) {
        lembranca = distancia;
        maisProximo = presas[1];
      }
    }
    return this.movimenta(maisProximo, false);
  }
}

//____________________________________________________________________________
// método que define se a criatura irá fugir de algum predador
//____________________________________________________________________________
Controlavel.prototype.fugir = function(predadores) {
  var lembranca = Infinity;
  var maisProximo = null;

  for (var i = predadores.length - 1; i >= 0; i--) {
    if (predadores[i].nome != this.nome && predadores[i].cacador){
      var distancia = this.posicao.dist(predadores[i].posicao);
      if (distancia < lembranca && distancia < 100) {
        lembranca = distancia;
        maisProximo = predadores[i];
      }
    }
  }

  if (maisProximo != null){
    return this.movimenta(maisProximo, true);
  }
  return createVector(0, 0);
}

//____________________________________________________________________________
// método de movimento da criatura
//____________________________________________________________________________
Controlavel.prototype.movimenta = function(obj, fugindo) {
  var desejo;
  if (obj == null){
    return false;
  } else {
    // verifica se o objeto recebido é um vetor ou uma criatura
    if (obj.name == "p5.Vector"){
      desejo = p5.Vector.sub(obj, this.posicao);
    } else {
      desejo = p5.Vector.sub(obj.posicao, this.posicao);
    }
    desejo.setMag(this.maxVelocidade);
    var direcao;
    if (fugindo){
      direcao = p5.Vector.sub(desejo, -this.velocidade);
      direcao.limit(this.maxForca * 3);
    } else {
      direcao = p5.Vector.sub(desejo, -this.velocidade);
      direcao.limit(this.maxForca);
    }

    return direcao;
  }
}

//____________________________________________________________________________
// método que desenha a criatura no canvas na direção da velocidade
//____________________________________________________________________________
Controlavel.prototype.show = function(){
  var direcao = this.velocidade.heading();
  var angulo = direcao + PI / 2;
  var animFrame = 0;
  var animDirecao = 0;

  // pegar linha do gráfico para a animação dependendo da direção
  if (direcao >= -0.3875 && direcao < 0.3875){
    animDirecao = 96; // direita
  } else if (direcao >= 1.1625 && direcao < 1.9375){
    animDirecao = 64; // baixo
  } else if (direcao >= -1.9375 && direcao < -1.1625){
    animDirecao = 0;  // cima
  } else if (direcao >= -2.7125 && direcao < -1.9375){
    animDirecao = 128; // esquerda-cima
  } else if (direcao >= -1.1625 && direcao < -0.3875){
    animDirecao = 160; // direita-cima
  } else if (direcao >= 1.9375 && direcao < 2.7125){
    animDirecao = 192; // esquerda-baixo
  } else if (direcao >= 0.3875 && direcao < 1.1625){
    animDirecao = 224; // direita-baixo
  } else {
    animDirecao = 32; // esquerda
  }

  // pegar coluna do gráfico para a animação dependendo do frame
  if (frame >= 0 && frame < 10 || frame >= 20 && frame < 30){
    animFrame = 32;
    frame += fps;
  } else if (frame >= 10 && frame < 20){
    animFrame = 0;
    frame += fps;
  } else if (frame >= 30 && frame < 40){
    animFrame = 64;
    frame += fps;
  } else {
    frame = 0;
  }
  imgp = this.imagem.get(animFrame, animDirecao, 32, 32);
  image(imgp, this.posicao.x - 16, this.posicao.y - 16); // desenhar a imagem no canvas

  push();
  translate(this.posicao.x, this.posicao.y);
  strokeWeight(2);
  if (this.player){
    stroke(0, 0, 200);
  } else if (this.cacador){
    stroke(200, 0, 0);
  } else {
    stroke(0, 200, 0);
  }
  noFill();
  ellipse(0, 0, 40, 40);
  rotate(angulo);

  pop();
}

//____________________________________________________________________________
// método que faz a criatura dar volta ao mundo quando chega ao limite da tela
//____________________________________________________________________________
Controlavel.prototype.limites = function() {
  var tamanho = 28;

  if (this.posicao.x < -tamanho) {
    this.posicao.x = width + tamanho;
  } else if (this.posicao.x > width + tamanho) {
    this.posicao.x = -tamanho;
  }

  if (this.posicao.y < -tamanho) {
    this.posicao.y = height + tamanho;
  } else if (this.posicao.y > height + tamanho) {
    this.posicao.y = -tamanho;
  }
}

//____________________________________________________________________________
// verifica se o jogo acabou
//____________________________________________________________________________
Controlavel.prototype.acabou = function() {
  if (this.terminou){
    if (this.venceu){
      alert("Muito bem! Você manteve sua criatura viva e recebeu 100 pontos.");
      pontuacao += 100;
    } else {
      alert("Que pena! Sua criatura foi devorada pela criatura adversária.");
    }
  }
  return this.terminou;
}
