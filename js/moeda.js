var frame = 0;
var fps = 0.03;

function Moeda(){
  this.pontos = int(random(1,4));
  this.velocidade = random(1,2) + this.pontos/2;
  this.posicao = createVector(random(100, width - 100), -32);
  this.imagem = menusImagens[4];
  this.animFrame = 0;
  this.animDirecao = 0;
}

Moeda.prototype.show = function(){

  if (frame >= 0 && frame < 0.2){
    this.animDirecao = 64 * this.pontos;
    this.animFrame = 0;
  } else if (frame >= 0.2 && frame < 0.4){
    this.animFrame = 32;
  } else if (frame >= 0.4 && frame < 0.6){
    this.animFrame = 64;
  } else if (frame >= 0.6 && frame < 0.8){
    this.animFrame = 96;
  } else if (frame >= 0.8 && frame < 1){
    this.animDirecao = 96 + (64 * (this.pontos - 1));
    this.animFrame = 0;
  } else if (frame >= 1 && frame < 1.2){
    this.animFrame = 32;
  } else if (frame >= 1.2 && frame < 1.4){
    this.animFrame = 64;
  } else if (frame >= 1.4 && frame < 1.6){
    this.animFrame = 96;
  } else if (frame >= 1.6 && frame < 1.8){
    this.animFrame = 64;
  } else if (frame >= 1.8 && frame < 2){
    this.animFrame = 32;
  } else if (frame >= 2 && frame < 2.2){
    this.animFrame = 0;
  } else if (frame >= 2.2 && frame < 2.4){
    this.animDirecao = 64 * this.pontos;
    this.animFrame = 96;
  } else if (frame >= 2.4 && frame < 2.6){
    this.animFrame = 64;
  } else if (frame >= 2.6 && frame < 2.8){
    this.animFrame = 32;
  } else {
    frame = 0;
  }

  frame += fps;
  imgp = this.imagem.get(this.animFrame, this.animDirecao, 32, 32);
  image(imgp, this.posicao.x - 16, this.posicao.y - 16); // desenhar a imagem no canvas
}

Moeda.prototype.sumiu = function(pegandoMoeda) {

  var distancia = this.posicao.dist(pegandoMoeda.posicao);
  if (distancia < this.velocidade + 16){
    pontuacao += this.pontos;
    return true;
  }

  this.posicao.y += this.velocidade;
  return (this.posicao.y > height + 32);
}
