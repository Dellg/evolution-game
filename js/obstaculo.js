var frame = 0;
var fps = 0.02;

function Obstaculo(arvore, x, y, raio){
  this.imagem = menusImagens[5];
  if (arvore){
    this.raio = raio;
    this.posicao = createVector(x, y);
  } else {
    this.raio = 55;
    this.velocidade = random(1,2);
    this.posicao = createVector(random(0, width), 0 - (this.raio - 5));
  }
}

Obstaculo.prototype.show = function(){
  var animFrame = 0;
  var animDirecao = 0;

  // pegar coluna do gráfico para a animação dependendo do frame
  if (frame >= 0 && frame < 5){
    animFrame = 0;
    animDirecao = 0;
    frame += fps;
  } else if (frame >= 5 && frame < 10){
    animFrame = 64;
    animDirecao = 0;
    frame += fps;
  } else if (frame >= 10 && frame < 15){
    animFrame = 0;
    animDirecao = 64;
    frame += fps;
  } else if (frame >= 15 && frame < 20){
    animFrame = 64;
    animDirecao = 64;
    frame += fps;
  } else {
    frame = 0;
  }
  imgp = this.imagem.get(animFrame, animDirecao, 64, 64);
  image(imgp, this.posicao.x - 32, this.posicao.y - 32); // desenhar a imagem no canvas
}

Obstaculo.prototype.sumiu = function() {
  this.posicao.y += this.velocidade;
  return (this.posicao.y > height + (this.raio + 5) * 2);
}
