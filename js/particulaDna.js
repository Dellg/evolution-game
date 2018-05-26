function Particula(x, y, cor, i){
  this.posicao = createVector(x, y);
  this.cor = cor;
  this.raio = 12;
  this.contador = i/5;
}

Particula.prototype.animar = function(){
  alphaDna = 520 - abs(520 - this.posicao.x);
  this.contador += 0.05;
  if (this.cor == 0){
    fill(0, 120, 0, alphaDna);
    ellipse(this.posicao.x, this.posicao.y + sin(this.contador) * 50, this.raio + sin(this.contador) * 5);
  } else {
    fill(255, 100, 0, alphaDna);
    ellipse(this.posicao.x, this.posicao.y - sin(this.contador) * 50, this.raio - sin(this.contador) * 5);
  }
}
