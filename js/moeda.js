var frame = 0;
var fps = 0.03;

function Moeda(){
  this.velocidade = 1;
  this.pontos = int(random(1,4));
  this.posicao = createVector(random(100, width - 100), -32));
  this.imagem = menusImagens[4];
}

Moeda.prototype.show = function(){
  var animFrame = 0;
  var animDirecao = 0;

  if (frame >= 0 && frame < 5){
    animDirecao = 64 * pontos;
    animFrame = 0;
    frame += fps;
  } else if (frame >= 5 && frame < 10){
    animDirecao = 64 * pontos;
    animFrame = 32;
    frame += fps;
  } else if (frame >= 10 && frame < 15){
    animDirecao = 64 * pontos;
    animFrame = 64;
    frame += fps;
  } else if (frame >= 15 && frame < 20){
    animDirecao = 64 * pontos;
    animFrame = 96;
    frame += fps;
  } else if (frame >= 20 && frame < 25){
    animDirecao = 96 * pontos;
    animFrame = 0;
    frame += fps;
  } else if (frame >= 25 && frame < 30){
    animDirecao = 96 * pontos;
    animFrame = 32;
    frame += fps;
  } else if (frame >= 30 && frame < 35){
    animDirecao = 96 * pontos;
    animFrame = 64;
    frame += fps;
  } else if (frame >= 35 && frame < 40){
    animDirecao = 96 * pontos;
    animFrame = 96;
    frame += fps;
  } else {
    frame = 0;
  }

  imgp = this.imagem.get(animFrame, animDirecao, 32, 32);
  image(imgp, this.posicao.x - 16, this.posicao.y - 16); // desenhar a imagem no canvas
}

Moeda.prototype.sumiu = function() {
  this.posicao.y += this.velocidade;
  return (this.posicao.y > height + 32);
}
