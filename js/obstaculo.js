var frame = 0;
var fps = 0.03;

function Obstaculo(arvore, x, y, raio){
  if (arvore){
    this.raio = raio;
    this.posicao = createVector(x, y);
  } else {
    this.imagem = menusImagens[5];
    this.raio = 55;
    this.velocidade = random(1,2);
    this.posicao = createVector(random(0, width), 0 - (this.raio - 5));
  }
}

Obstaculo.prototype.show = function(){
  // pegar coluna do gráfico para a animação dependendo do frame
  if (frame >= 0 && frame < 10){
    animFrame = 0;
    animDirecao = 0;
    frame += fps;
  } else if (frame >= 10 && frame < 20){
    animFrame = 64;
    frame += fps;
  } else if (frame >= 20 && frame < 30){
    animFrame = 0;
    animDirecao = 64;
    frame += fps;
  } else if (frame >= 30 && frame < 40){
    animFrame = 64;
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
