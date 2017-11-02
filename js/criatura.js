function Criatura(x, y, caracteristicas){
  this.nome = caracteristicas[0];
  // tipo de alimento que a criatura consome: 0 = planta, 1 = carne, 2 = ambos
  this.tipo = caracteristicas[1];
  // a criatura vai perdendo vida se estiver com fome
  this.vida = parseFloat(caracteristicas[2]);
  this.maxVida = parseFloat(caracteristicas[2]);
  // fome define de quanto em quanto tempo a criatura precisa estar se alimento
  this.fome = parseFloat(caracteristicas[3]);
  this.maxFome = parseFloat(caracteristicas[3]);
  this.velocidade = p5.Vector.random2D(caracteristicas[4]);
  this.maxVelocidade = parseFloat(caracteristicas[4]);
  // carnívoros só irão atacar outras criaturas que tem resistência menor que a deles
  this.resistencia = parseFloat(caracteristicas[5]);
  this.cor = caracteristicas[6];

  // dados da criatura
  this.posicao = createVector(x, y);
  this.aceleracao = createVector();
  this.maxForca = random(0.1, 0.5);
  this.raio = 5;

  // características da IA
  this.geracao = 0;
  this.fitness = 0;

  this.codigoGenetico = [];
  this.codigoGenetico[0] = random(-1, 1); // peso planta
  this.codigoGenetico[1] = random(-1, 1); // peso carne
  this.codigoGenetico[2] = random(-1, 1); // peso perigo
  this.codigoGenetico[4] = parseFloat(caracteristicas[7]); // raio de percepção para identificar alimento
  this.codigoGenetico[5] = parseFloat(caracteristicas[8]); // raio de percepção para identificar perigo

  this.baseConhecimento = [];
  this.baseConhecimento[0] = []; // índice 0 = comidas que matam a fome
  this.baseConhecimento[1] = []; // índice 1 = comidas que fazem mal
  this.baseConhecimento[2] = []; // índice 2 = predadores

  this.tempo = random(100);
  this.destino = createVector(random(width-5), random(height-5));

  //____________________________________________________________________________
  // método de atualização
  //____________________________________________________________________________
  this.update = function() {
    // a criatura só começara a perder vida se estiver com fome
    if (this.fome <= 0) {
      this.vida -= 0.002;
    } else {
      this.vida -= 0.001;
      this.fome -= 0.0015;
    }
    this.velocidade.add(this.aceleracao);
    this.velocidade.limit(this.maxVelocidade);
    this.posicao.add(this.velocidade);
    this.aceleracao.mult(0);
  }

  //____________________________________________________________________________
  //  método que aplica força na aceleração
  //____________________________________________________________________________
  this.aplicaForca = function(forca) {
    this.aceleracao.add(forca);
  }

  //____________________________________________________________________________
  //  método que define qual comportamento a criatura irá realizar
  //____________________________________________________________________________
  this.comportamentos = function(plantas, carnes, venenos, criaturas) {
    var seguePlanta = this.alimenta(plantas, this.codigoGenetico[4]);
    var segueCarne = this.alimenta(carnes, this.codigoGenetico[4]);
    var segueVeneno = this.alimenta(venenos, this.codigoGenetico[5]);

    seguePlanta.mult(this.codigoGenetico[0]);
    segueCarne.mult(this.codigoGenetico[1]);
    segueVeneno.mult(this.codigoGenetico[2]);

    this.aplicaForca(seguePlanta);
    this.aplicaForca(segueCarne);
    this.aplicaForca(segueVeneno);
  }

  //____________________________________________________________________________
  // método que define a forma como a criatura irá se alimentar, dependendo da fome
  //____________________________________________________________________________
  this.alimenta = function(comidas, percepcao) {
    var lembranca = Infinity;
    var maisProximo = null;

    // a percepção usada ainda é a mesma, independente do tipo de alimento

    for (var i = comidas.length - 1; i >= 0; i--) {
      var distancia = this.posicao.dist(comidas[i].posicao);

      if (distancia < this.maxVelocidade + 2) {
        var devorado = comidas.splice(i, 1)[0];
        // se for comida ruim, perde vida e adiciona aquele tipo à base de conhecimento
        if (devorado.tipo == 2){
          this.vida -= abs(devorado.vida) * 2;
        // onívoros comem dos dois tipos de alimento, por isso saciam pouca fome com cada alimento
        } else if (this.tipo == 2){
          this.vida += abs(devorado.vida)/2;
          this.fome += abs(devorado.fome);
        // criaturas que comem alimento do seu tipo apenas, saciam a fome inteira que aquele alimento dá
        } else if (this.tipo == devorado.tipo){
          this.vida += abs(devorado.vida)/1.5;
          this.fome += abs(devorado.fome) * 1.5;
        // se comer um alimento de um tipo diferente perde vida
        } else {
          this.fome -= abs(devorado.fome);
        }
        // limita a fome e a vida aos seus valores máximos
        if (this.fome > this.maxFome)
          this.fome = this.maxFome;
        if (this.vida > this.maxVida)
          this.vida = this.maxVida;

      } else {
        if (distancia < lembranca && distancia < percepcao) {
          lembranca = distancia;
          maisProximo = comidas[i];
        }
      }
    }

    // aqui define o comportamento da criatura, se irá perseguir ou se irá apenas até o local para comer
    if (maisProximo != null) {
      return this.movimenta(maisProximo);
    }
    return createVector(0, 0);
  }

  //____________________________________________________________________________
  // método de movimento da criatura
  //____________________________________________________________________________
  this.movimenta = function(obj) {

    // adicionar movimentos diferentes, dependendo da necessidade
    // movimento seguir com calma: vel = map(distancia, 0, raioAlimento, .5, this.maxVelocidade / 2);
    // movimento andar aleatorio: com temporizador

    var desejo = p5.Vector.sub(obj.posicao, this.posicao);
    desejo.setMag(this.maxVelocidade);

    var direcao = p5.Vector.sub(desejo, this.velocidade);
    direcao.limit(this.maxForca);
    return direcao;
  }

  //____________________________________________________________________________
  // método pra verificar se a criatura está sem vida
  //____________________________________________________________________________
  this.morreu = function() {
    return (this.vida < 0)
  }

  //____________________________________________________________________________
  // método que desenha a criatura no canvas na direção da velocidade
  //____________________________________________________________________________
  this.show = function(){
    var angulo = this.velocidade.heading() + PI / 2;

    push();
    translate(this.posicao.x, this.posicao.y);
    rotate(angulo);

    //apagar depois
    // noFill();
    // strokeWeight(1);
    // stroke(0, 255, 0);
    // ellipse(0, 0, this.codigoGenetico[4] * 2);
    // line(0, 0, 0, -this.codigoGenetico[0] * 25)
    // stroke(0, 0, 255);
    // line(0, 0, 0, -this.codigoGenetico[1] * 25);
    // stroke(255, 0, 0);
    // ellipse(0, 0, this.codigoGenetico[5] * 2);
    // line(0, 0, 0, -this.codigoGenetico[2] * 25);
    // ^ apagar depois

    fill(lerpColor(color(0,0,0), this.cor, this.vida));
    stroke(lerpColor(color(255,0,0), color(0,255,0), this.fome));

    // desenha a forma da criatura no canvas
    beginShape();
    vertex(0, -this.raio * 2);
    vertex(-this.raio, this.raio);
    if (this.tipo == 0){
      vertex(0, this.raio + this.raio);
    } else if (this.tipo == 1){
      vertex(0, this.raio - this.raio);
    }
    vertex(this.raio, this.raio);
    endShape(CLOSE);

    pop();
  }

  //____________________________________________________________________________
  // método que impede a criatura de sair da tela (comidas não são geradas fora da tela)
  //____________________________________________________________________________
  this.limites = function() {
    var desejo = null;

    if (this.posicao.x < 10) {
      desejo = createVector(this.maxVelocidade, this.velocidade.y);
    } else if (this.posicao.x > width - 10) {
      desejo = createVector(-this.maxVelocidade, this.velocidade.y);
    }

    if (this.posicao.y < 10) {
      desejo = createVector(this.velocidade.x, this.maxVelocidade);
    } else if (this.posicao.y > height - 10) {
      desejo = createVector(this.velocidade.x, -this.maxVelocidade);
    }

    if (desejo !== null) {
      desejo.normalize();
      desejo.mult(this.maxVelocidade);
      var direcao = p5.Vector.sub(desejo, this.velocidade);
      direcao.limit(this.maxForca);
      this.aplicaForca(direcao);
    }
  }

  //____________________________________________________________________________
  // função que adiciona um objeto à uma base de conhecimento
  //____________________________________________________________________________
  function conhecer(base, obj){
    // ainda não está sendo utilizada
    if (!base.contains(obj))
      base.push(obj);
  }
}
