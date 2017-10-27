function Criatura(x, y){
  this.vida = 500
  this.fome = 500
  this.posicao = createVector(x, y)
  this.objetivo = createVector(x, y)
  this.velocidade = createVector()
  this.maxVelocidade = 500
  this.aceleracao = createVector()
  this.raio = 10
}

Criatura.prototype.update = function(){
  this.posicao.add(this.velocidade)
  this.velocidade.add(this.aceleracao)
}

Criatura.prototype.show = function(){
  stroke(255)
  strokeWeight(this.raio)
  point(this.posicao.x, this.posicao.y)
}
