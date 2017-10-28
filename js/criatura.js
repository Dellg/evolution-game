function Criatura(x, y){
  // a criatura vai perdendo vida se estiver com fome
  this.vida = 1
  // fome define de quanto em quanto tempo a criatura precisa estar se alimento
  this.fome = 1
  // carnívoros só irão atacar outras criaturas que tem resistência menor que a deles
  this.resistencia = 500
  // tipo de alimento que a criatura consome: 0 = planta, 1 = carne, 2 = ambos
  this.tipo = 0

  this.posicao = createVector(x, y)
  this.objetivo = createVector(150, 700)
  this.velocidade = p5.Vector.random2D(5)
  this.maxVelocidade = 5
  this.maxForca = 1
  this.aceleracao = createVector()
  this.raio = 10

  // método de atualização
  this.update = function(){

    this.velocidade.add(this.aceleracao)
    this.velocidade.limit(this.maxVelocidade)
    this.posicao.add(this.velocidade)
    this.aceleracao.mult(0)
  }

  // método que desenha a criatura no canvas
  this.show = function(){
    stroke(255)
    strokeWeight(this.raio)
    point(this.posicao.x, this.posicao.y)
  }

  // método que define qual comportamento a criatura irá realizar
  this.comportamentos = function(){
    anda = this.anda(this.objetivo)
    mouse = createVector(mouseX, mouseY)
    foge = this.foge(mouse)

    // andar tem o peso de 1 e fugir tem o peso de 5
    anda.mult(1)
    foge.mult(5)

    this.aceleracao.add(anda)
    this.aceleracao.add(foge)
  }

  // método perseguir: usado por carnívoros quando estão caçando ou herbívoros com muita fome
  this.persegue = function(obj){
    var desejo = p5.Vector.sub(obj, this.posicao)
    desejo.setMag(this.maxVelocidade)
    var direcao = p5.Vector.sub(desejo, this.velocidade)
    direcao.limit(this.maxForca)
    return direcao
  }

  // método andar: usado por qualquer criatura quando estão tranquilos
  this.anda = function(obj){
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

  // método fugir: usado por criaturas que estão sendo perseguidas por predadores
  this.foge = function(obj){
    var desejo = p5.Vector.sub(obj, this.posicao)
    var distancia = desejo.mag()
    if (distancia < 100){
      desejo.setMag(this.maxVelocidade)
      desejo.mult(-1)
      var direcao = p5.Vector.sub(desejo, this.velocidade)
      direcao.limit(this.maxForca)
      return direcao
    } else {
      return createVector(0, 0)
    }
  }

  // método desviar: usado por qualquer criatura para desviar de algum obstáculo
  this.desvia = function(obj){
    var desejo = p5.Vector.sub(obj, this.posicao)
    var distancia = desejo.mag()
    if (distancia < 100){
      desejo.setMag(this.maxVelocidade)
      desejo.mult(-1)
      var direcao = p5.Vector.sub(desejo, this.velocidade)
      direcao.limit(this.maxForca)
      return direcao
    } else {
      return createVector(0, 0)
    }
  }
}
