function Criatura(x, y, t){
  // a criatura vai perdendo vida se estiver com fome
  this.vida = 1;
  this.maxVida = 1;
  // fome define de quanto em quanto tempo a criatura precisa estar se alimento
  this.fome = 1;
  this.maxFome = 1;
  // carnívoros só irão atacar outras criaturas que tem resistência menor que a deles
  this.resistencia = 500;
  // tipo de alimento que a criatura consome: 0 = planta, 1 = carne, 2 = ambos
  this.tipo = t;

  // dados da criatura
  this.posicao = createVector(x, y);
  this.objetivo = createVector(150, 700);
  this.velocidade = p5.Vector.random2D(5);
  this.maxVelocidade = 5;
  this.maxForca = .2;
  this.aceleracao = createVector();
  this.raio = 5;

  // características da IA
  this.baseConhecimento = [];
  this.fitness = 0;
  this.codigoGenetico = [];

  // método de atualização
  this.update = function(){
    // a criatura só começara a perder vida se estiver com fome
    if (this.fome <= 0) {
      this.vida -= 0.0025;
    } else {
      this.fome -= 0.0025;
    }
    this.velocidade.add(this.aceleracao);
    this.velocidade.limit(this.maxVelocidade);
    this.posicao.add(this.velocidade);
    this.aceleracao.mult(0);
  }

  // método que desenha a criatura no canvas na direção da velocidade
  this.show = function(){
    var angulo = this.velocidade.heading() + PI / 2;

    push();
    translate(this.posicao.x, this.posicao.y);
    rotate(angulo);

    fill(lerpColor(color(255,0,0), color(0,255,0), this.vida));
    stroke(lerpColor(color(255,0,0), color(0,255,0), this.fome));

    // desenha a forma da criatura no canvas
    beginShape();
    vertex(0, -this.raio * 2);
    vertex(-this.raio, this.raio * 2);
    vertex(this.raio, this.raio * 2);
    endShape(CLOSE);

    pop();
  }

  // método que define qual comportamento a criatura irá realizar
  this.comportamentos = function(comidas){
    var movimento = this.alimenta(comidas);
    var mouse = createVector(mouseX, mouseY);
    var foge = this.foge(mouse);

    // andar tem o peso de 1 e fugir tem o peso de 5
    movimento.mult(1);
    foge.mult(5);

    this.aceleracao.add(movimento);
    this.aceleracao.add(foge);
  }

  this.alimenta = function(comidas){
    var lembranca = Infinity;
    var maisProximo = null;
    for (var i = comidas.length - 1; i >= 0; i--) {
      var distancia = this.posicao.dist(comidas[i].posicao);

      if (distancia < this.maxVelocidade) {
        comidas.splice(i, 1);
        this.fome += 1; //nutrition;
      } else {
        if (distancia < lembranca){ //&& d < perception) {
          lembranca = distancia;
          maisProximo = comidas[i];
        }
      }
    }

    // This is the moment of eating!
    if (maisProximo != null) {
      if (this.fome < this.maxFome / 2) {
        return this.persegue(maisProximo);
      } else {
        return this.anda(maisProximo);
      }
    }
    return createVector(0, 0);
  }

  // método andar: usado por qualquer criatura quando estão tranquilos
  this.anda = function(obj){
    var desejo = p5.Vector.sub(obj.posicao, this.posicao);
    var distancia = desejo.mag();
    var vel = this.maxVelocidade;
    if (distancia < 500){
      vel = map(distancia, 0, 500, .5, this.maxVelocidade);
    }
    desejo.setMag(vel);
    direcao = p5.Vector.sub(desejo, this.velocidade);
    direcao.limit(this.maxForca);
    return direcao;
  }

  // método perseguir: usado por carnívoros quando estão caçando ou herbívoros com muita fome
  this.persegue = function(obj){
    var desejo = p5.Vector.sub(obj.posicao, this.posicao);
    desejo.setMag(this.maxVelocidade);
    var direcao = p5.Vector.sub(desejo, this.velocidade);
    direcao.limit(this.maxForca);
    return direcao;
  }

  // método fugir: usado por criaturas que estão sendo perseguidas por predadores
  this.foge = function(obj){
    var desejo = p5.Vector.sub(obj, this.posicao);
    var distancia = desejo.mag();
    if (distancia < 100){
      desejo.setMag(this.maxVelocidade);
      desejo.mult(-1);
      var direcao = p5.Vector.sub(desejo, this.velocidade);
      direcao.limit(this.maxForca);
      return direcao;
    } else {
      return createVector(0, 0);
    }
  }
}
