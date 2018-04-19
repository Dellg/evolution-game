function Obstaculo(){
  this.cor = color(110);
  if (random(1) < 0.1){
    this.raio = random(100, 200);
  } else {
    this.raio = random(10, 100);
  }
  this.velocidade = random(1,2);
  this.posicao = createVector(random(0, width), 0 - (this.raio - 5));
}

Obstaculo.prototype.show = function(){
  noStroke();
  fill(this.cor);
  ellipse(this.posicao.x, this.posicao.y, this.raio);
}

Obstaculo.prototype.sumiu = function() {
  this.posicao.y += this.velocidade;
  return (this.posicao.y > height + (this.raio + 5) * 2);
}
