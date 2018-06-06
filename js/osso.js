function Osso(id, imagem){
  this.id = id;
  this.imagem = imagem;
  this.posicao = createVector(random(50, xGame-180), random(180, yGame-90));
}

//____________________________________________________________________________
// método que desenha a criatura no canvas na direção da velocidade
//____________________________________________________________________________
Osso.prototype.show = function(){
  var animFrame;
  var animDirecao;

  switch (this.id) {
    case 0:
      animFrame = 0;
      animDirecao = 0;
      break;
    case 1:
      animFrame = 32;
      animDirecao = 0;
      break;
    case 2:
      animFrame = 0;
      animDirecao = 32;
      break;
    case 3:
      animFrame = 32;
      animDirecao = 32;
      break;
    case 4:
      animFrame = 0;
      animDirecao = 64;
      break;
    case 5:
      animFrame = 32;
      animDirecao = 64;
      break;
    case 6:
      animFrame = 0;
      animDirecao = 96;
      break;
    case 7:
      animFrame = 32;
      animDirecao = 96;
      break;
  }

  imgp = this.imagem.get(animFrame, animDirecao, 32, 32);
  image(imgp, this.posicao.x - 16, this.posicao.y - 16); // desenhar a imagem no canvas

  push();
  translate(this.posicao.x, this.posicao.y);

  pop();
}
