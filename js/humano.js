var frame = 0;
var fps = 0.03;
var carga = 0;
var cavando = false;

function Humano(x, y, imagem){
  this.nome = "Humano";
  this.velocidade = p5.Vector.random2D(1);
  this.maxVelocidade = 1;
  this.imagem = imagem;

  // dados da criatura
  this.posicao = createVector(x, y);
  this.aceleracao = createVector();
  this.maxForca = 0.1;
  this.raio = 5;
}

//____________________________________________________________________________
//  método que define qual comportamento a criatura irá realizar
//____________________________________________________________________________
Humano.prototype.comportamentos = function(ossos) {
  for (var i = ossos.length - 1; i >= 0; i--) {
    var distancia = this.posicao.dist(ossos[i].posicao);
    if (distancia < this.maxVelocidade + this.raio) {
      cavando = true;
      ossos.splice(i, 1);
      this.aceleracao.mult(0);
      this.velocidade.mult(0);
    }
  }

  if (cavando) {

  } else {
    var busca = this.movimenta();
    busca.mult(1);
    this.aplicaForca(busca);
  }
}

//____________________________________________________________________________
// método de atualização
//____________________________________________________________________________
Humano.prototype.update = function() {
  this.velocidade.add(this.aceleracao);
  this.velocidade.limit(this.maxVelocidade);
  this.posicao.add(this.velocidade);
  this.aceleracao.mult(0);
}

//____________________________________________________________________________
//  método que aplica força na aceleração
//____________________________________________________________________________
Humano.prototype.aplicaForca = function(forca) {
  this.aceleracao.add(forca);
}

//____________________________________________________________________________
// método de movimento da criatura
//____________________________________________________________________________
Humano.prototype.movimenta = function() {
  var desejo = p5.Vector.sub(createVector(mouseX, mouseY), this.posicao);
  desejo.setMag(this.maxVelocidade);
  var direcao = p5.Vector.sub(desejo, -this.velocidade);
  direcao.limit(this.maxForca);
  return direcao;
}

//____________________________________________________________________________
// método que desenha a criatura no canvas na direção da velocidade
//____________________________________________________________________________
Humano.prototype.show = function(){
  var angulo = direcao + PI / 2;
  var animFrame = 0;
  var animDirecao = 0;

  if (cavando){
    animDirecao = 256; // cavando

  } else {
    var direcao = this.velocidade.heading();

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
  stroke(0, 200, 0);
  noFill();
  ellipse(0, 0, 40, 40);
  rotate(angulo);

  pop();
}
