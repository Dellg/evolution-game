function Criatura(x, y){
  // a criatura vai perdendo vida se estiver com fome
  this.vida = 500
  // fome define de quanto em quanto tempo a criatura precisa estar se alimento
  this.fome = 500
  // carnívoros só irão atacar outras criaturas que tem resistência menor que a deles
  this.resistencia = 500
  this.posicao = createVector(x, y)
  this.objetivo = createVector(150, 700)
  this.velocidade = p5.Vector.random2D(5)
  this.maxVelocidade = 5
  this.maxForca = 1
  this.aceleracao = createVector()
  this.raio = 10
}

Criatura.prototype.update = function(){
  this.posicao.add(this.velocidade)
  this.velocidade.add(this.aceleracao)
  this.aceleracao.mult(0)
}

Criatura.prototype.show = function(){
  stroke(255)
  strokeWeight(this.raio)
  point(this.posicao.x, this.posicao.y)
}

Criatura.prototype.comportamentos = function(){
  persegue = this.anda(this.objetivo)
  this.aceleracao.add(persegue)
}

Criatura.prototype.persegue = function(obj){
  var desejo = p5.Vector.sub(obj, this.posicao)
  desejo.setMag(this.maxVelocidade)
  var direcao = p5.Vector.sub(desejo, this.velocidade)
  direcao.limit(this.maxForca)
  return direcao
}

Criatura.prototype.anda = function(obj){
  var desejo = p5.Vector.sub(obj, this.posicao)
  var distancia = desejo.mag()
  var vel = this.maxVelocidade
  if (distancia < 500){
    vel = map(distancia, 0, 500, 0, this.maxVelocidade)
  }
  desejo.setMag(vel)
  direcao = p5.Vector.sub(desejo, this.velocidade)
  direcao.limit(this.maxForca)
  return direcao
}

Criatura.prototype.foge = function(){

}

Criatura.prototype.desvia = function(){

}
