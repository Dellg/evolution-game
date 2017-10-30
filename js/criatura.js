function Criatura(x, y, caracteristicas){
  // a criatura vai perdendo vida se estiver com fome
  this.nome = caracteristicas[0];
  // tipo de alimento que a criatura consome: 0 = planta, 1 = carne, 2 = ambos
  switch (caracteristicas[1]) {
  case "Herbívoro":
    this.tipo = 0;
    break;
  case "Carnívoro":
    this.tipo = 1;
    break;
  case "Onívoro":
    this.tipo = 2;
    break;
  }
  this.vida = caracteristicas[2];
  this.maxVida = caracteristicas[2];
  // fome define de quanto em quanto tempo a criatura precisa estar se alimento
  this.fome = caracteristicas[3];
  this.maxFome = caracteristicas[3];
  // carnívoros só irão atacar outras criaturas que tem resistência menor que a deles
  this.velocidade = p5.Vector.random2D(caracteristicas[4]);
  this.maxVelocidade = caracteristicas[4];
  this.resistencia = caracteristicas[5];
  this.cor = caracteristicas[6];

  // dados da criatura
  this.posicao = createVector(x, y);
  this.maxForca = .1;
  this.aceleracao = createVector();
  this.raio = 5;

  // características da IA
  this.geracao = 0;
  this.fitness = 0;

  this.codigoGenetico = [];
  this.codigoGenetico[0] = caracteristicas[7]; // raio de percepção para identificar alimento
  this.codigoGenetico[1] = caracteristicas[8]; // raio de percepção para identificar perigo
  this.codigoGenetico[2] = 1; // capacidade de fuga
  this.codigoGenetico[3] = 1; // capacidade de caça

  this.baseConhecimento = [];
  this.baseConhecimento[0] = []; // índice 0 = comidas que matam a fome
  this.baseConhecimento[1] = []; // índice 1 = comidas que fazem mal
  this.baseConhecimento[2] = []; // índice 2 = predadores

  this.tempo = random(30);
  this.destino = createVector(random(width), random(height));

  // método de atualização
  this.update = function(){
    // a criatura só começara a perder vida se estiver com fome
    if (this.fome <= 0) {
      this.vida -= 0.003;
    } else {
      this.vida -= 0.0015;
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

    fill(lerpColor(color(0,0,0), this.cor, this.vida));
    stroke(lerpColor(color(255,0,0), color(0,255,0), this.fome));

    // desenha a forma da criatura no canvas
    beginShape();
    vertex(0, -this.raio * 2);
    vertex(-this.raio, this.raio);
    if (this.tipo == 0){
      vertex(0, this.raio + 5);
    } else if (this.tipo == 1){
      vertex(0, this.raio - 5);
    }
    vertex(this.raio, this.raio);
    endShape(CLOSE);

    pop();
  }

  // método que define qual comportamento a criatura irá realizar
  this.comportamentos = function(comidas){
    var movimento = this.alimenta(comidas);
    //var foge = this.foge(this.baseConhecimento[3]);

    // andar tem o peso de 1 e fugir tem o peso de 5
    movimento.mult(1);
    //foge.mult(5);

    this.aceleracao.add(movimento);
    //this.aceleracao.add(foge);
  }

  this.alimenta = function(comidas){
    var lembranca = Infinity;
    var maisProximo = null;
    for (var i = comidas.length - 1; i >= 0; i--) {
      var distancia = this.posicao.dist(comidas[i].posicao);

      if (distancia < this.maxVelocidade) {
        var devorado = comidas.splice(i, 1)[0];
        // se for comida ruim, perde vida
        if (devorado.tipo == 2){
          this.vida -= abs(devorado.vida * 3);
        } else {
          if (this.tipo == 2 || this.tipo == devorado.tipo){
            // onívoros comem dos dois tipos de alimento, por isso saciam apenas metade da fome que aquele alimento dá
            this.fome += devorado.fome/2;
            this.vida += devorado.vida/2;
          } else if (this.tipo == devorado.tipo){
            // criaturas que comem alimento do seu tipo apenas, saciam a fome inteira que aquele alimento dá
            this.fome += devorado.fome;
            this.vida += devorado.vida/2;
          } else {
            // se comer um alimento de um tipo diferente perde vida
            this.vida -= devorado.vida;
          }
        }
        // limita a fome e a vida aos seus valores máximos
        if (this.fome > this.maxFome){
          this.fome = this.maxFome;
        }
        if (this.vida > this.maxVida){
          this.vida = this.maxVida;
        }
      } else {
        if (distancia < lembranca){ //&& d < perception) {
          lembranca = distancia;
          maisProximo = comidas[i];
        }
      }
    }

    // aqui define o comportamento da criatura, se irá perseguir ou se irá apenas até o local para comer
    if (maisProximo != null) {
      if (this.fome < this.maxFome / 3) {
        return this.persegue(maisProximo);
      } else if (this.fome < this.maxFome / 1.5) {
        return this.segue(maisProximo);
      }
    }

    // criatura ficará passeando por um tempo se não estiver com fome
    if (this.tempo < 0){
      this.destino = createVector(random(width), random(height));
      this.tempo = random(30);
    } else {
      this.tempo -= .1;
    }
    return this.anda(this.destino);
  }

  // método andar: usado por qualquer criatura quando estão tranquilos
  this.anda = function(obj){
    var desejo = p5.Vector.sub(obj, this.posicao);
    desejo.setMag(1);
    var direcao = p5.Vector.sub(desejo, this.velocidade);
    direcao.limit(this.maxForca);
    return direcao;
  }

  // método seguir: usado por qualquer criatura quando estão com pouca fome
  this.segue = function(obj){
    var desejo = p5.Vector.sub(obj.posicao, this.posicao);
    var distancia = desejo.mag();
    var vel = this.maxVelocidade;
    if (distancia < 500){
      vel = map(distancia, 0, 500, .5, this.maxVelocidade / 2);
    }
    desejo.setMag(vel);
    var direcao = p5.Vector.sub(desejo, this.velocidade);
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
    var desejo = p5.Vector.sub(obj.posicao, this.posicao);
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

  // método pra verificar se a criatura está sem vida
  this.morreu = function(){
    return (this.vida <= 0);
  }
}
