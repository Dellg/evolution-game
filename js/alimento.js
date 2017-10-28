function Alimento(x, y, t){
  // tipo do alimento: 0 = planta, 1 = carne, 2 = toxico
  this.tipo = t;
  this.vida = 500;
  this.fome = 500;
  this.posicao = createVector(x, y);
  this.raio = 5;
}

Alimento.prototype.show = function(){
  noStroke();
  if (this.tipo == 0){
    fill(0,255,0);
  } else if (this.tipo == 1){
    fill(255,0,0);
  } else if (this.tipo == 2){
    fill(0,0,255);
  }
  ellipse(this.posicao.x, this.posicao.y, this.raio);
}
