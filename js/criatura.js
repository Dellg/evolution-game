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
  this.maxForca = random(0.1, 0.5);
  this.aceleracao = createVector();
  this.raio = 5;

  // características da IA
  this.geracao = 0;
  this.fitness = 0;

  this.codigoGenetico = [];
  this.codigoGenetico[0] = parseFloat(caracteristicas[7]); // raio de percepção para identificar alimento
  this.codigoGenetico[1] = parseFloat(caracteristicas[8]); // raio de percepção para identificar perigo
  this.codigoGenetico[2] = random(-1, 0); // capacidade de fuga
  this.codigoGenetico[3] = random(0, 1); // capacidade de caça

  this.baseConhecimento = [];
  this.baseConhecimento[0] = []; // índice 0 = comidas que matam a fome
  this.baseConhecimento[1] = []; // índice 1 = comidas que fazem mal
  this.baseConhecimento[2] = []; // índice 2 = predadores

  this.tempo = random(30);
  this.destino = createVector(random(width), random(height));

  //____________________________________________________________________________
  // método de atualização
  //____________________________________________________________________________
  this.update = function(){
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
  // método que desenha a criatura no canvas na direção da velocidade
  //____________________________________________________________________________
  this.show = function(){
    var angulo = this.velocidade.heading() + PI / 2;

    push();
    translate(this.posicao.x, this.posicao.y);
    rotate(angulo);

    //apagar depois
    noFill();
    strokeWeight(2);
    stroke(0, 255, 0);
    ellipse(0, 0, this.codigoGenetico[0] * 2);
    line(0, 0, 0, -this.codigoGenetico[2] * 100);
    stroke(255, 0, 0);
    ellipse(0, 0, this.codigoGenetico[1] * 2);
    line(0, 0, 0, -this.codigoGenetico[3] * 100)
    // ^ apagar depois

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

  //____________________________________________________________________________
  //  método que define qual comportamento a criatura irá realizar
  //____________________________________________________________________________
  this.comportamentos = function(comidas){
    var movimento = this.alimenta(comidas);

    for (var i = this.baseConhecimento[2].length - 1; i >= 0; i--){
      var distancia = this.posicao.dist(this.baseConhecimento[2][i].posicao);
      if (distancia < this.codigoGenetico[1]){
        movimento = this.movimenta(this.baseConhecimento[2][i], 3);
        movimento.mult(this.codigoGenetico[2]);
      }
    }
    movimento.mult(this.codigoGenetico[3]);
    this.aceleracao.add(movimento);
  }

  //____________________________________________________________________________
  // método que define a forma como a criatura irá se alimentar, dependendo da fome
  //____________________________________________________________________________
  this.alimenta = function(comidas){
    var lembranca = Infinity;
    var maisProximo = null;

    for (var i = comidas.length - 1; i >= 0; i--) {
      var distancia = this.posicao.dist(comidas[i].posicao);

      if (distancia < this.maxVelocidade) {
        var devorado = comidas.splice(i, 1)[0];
        // se for comida ruim, perde vida e adiciona aquele tipo à base de conhecimento
        if (devorado.tipo == 2){
          this.vida -= abs(devorado.vida * 2);
          conhecer(this.baseConhecimento[1], devorado.tipo);
        } else {
          if (this.tipo == 2){
            // onívoros comem dos dois tipos de alimento, por isso saciam pouca fome com cada alimento
            this.fome += abs(devorado.fome)/1.5;
            this.vida += abs(devorado.vida)/2;
            conhecer(this.baseConhecimento[0], devorado.tipo);
          } else if (this.tipo == devorado.tipo){
            // criaturas que comem alimento do seu tipo apenas, saciam a fome inteira que aquele alimento dá
            this.fome += abs(devorado.fome);
            this.vida += abs(devorado.vida)/1.5;
            conhecer(this.baseConhecimento[0], devorado.tipo);
          } else {
            // se comer um alimento de um tipo diferente perde vida
            this.vida -= abs(devorado.vida);
            conhecer(this.baseConhecimento[1], devorado.tipo);
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
        // essa variável identifica se está perseguindo uma comida boa ou ruim
        var percepcaoUsada;
        if (this.baseConhecimento[1].contains(comidas[i].tipo)){
          percepcaoUsada = this.codigoGenetico[1];
        } else {
          percepcaoUsada = this.codigoGenetico[0];
        }
        if (distancia < lembranca && distancia < percepcaoUsada) {
          lembranca = distancia;
          maisProximo = comidas[i];
        }
      }
    }

    // aqui define o comportamento da criatura, se irá perseguir ou se irá apenas até o local para comer
    if (maisProximo != null) {
      if (this.fome < this.maxFome / 4 || this.vida < this.maxVida / 3) {
        // com muita fome, persegue
        return this.movimenta(maisProximo, 2);
      } else if (this.fome < this.maxFome / 1.5 || this.vida < this.maxVida / 2) {
        // com pouca fome, só segue
        return this.movimenta(maisProximo, 1);
      }
    }

    // criatura ficará passeando por um tempo se não estiver com fome
    if (this.tempo < 0){
      this.destino = createVector(random(width), random(height));
      this.tempo = random(30);
    } else {
      this.tempo -= .1;
    }
    return this.movimenta(this.destino, 0);
  }

  //____________________________________________________________________________
  // método de movimento da criatura
  //____________________________________________________________________________
  this.movimenta = function(obj, nivelFome){
    var desejo;
    // nível 0 = andar = só passeando
    if (nivelFome == 0){
      desejo = p5.Vector.sub(obj, this.posicao);
      desejo.setMag(0.5);

    // nível 1 = segue = pouca fome
    } else if (nivelFome == 1){
      desejo = p5.Vector.sub(obj.posicao, this.posicao);
      var distancia = desejo.mag();
      var vel = this.maxVelocidade;
      var raioAlimento = this.codigoGenetico[0];
      if (distancia < raioAlimento)
        vel = map(distancia, 0, raioAlimento, .5, this.maxVelocidade / 2);
      desejo.setMag(vel);

    // nível 2 = persegue = muita fome = velocidade máxima
    } else if (nivelFome == 2){
      desejo = p5.Vector.sub(obj.posicao, this.posicao);
      desejo.setMag(this.maxVelocidade);

    // nível 3 = foge = sendo caçado = velocidade máxima ao contrário
    } else if (nivelFome == 3){
      var distancia = desejo.mag();
      var raioPerigo = this.codigoGenetico[1];
      if (distancia < raioPerigo){
        desejo.setMag(this.maxVelocidade);
        desejo.mult(-1);
      }
    }

    var direcao = p5.Vector.sub(desejo, this.velocidade);
    direcao.limit(this.maxForca);
    return direcao;
  }

  //____________________________________________________________________________
  // método pra verificar se a criatura está sem vida
  //____________________________________________________________________________
  this.morreu = function(){
    return (this.vida <= 0);
  }

  //____________________________________________________________________________
  // método que impede a criatura de sair da tela (comidas não são geradas fora da tela)
  //____________________________________________________________________________
  this.limites = function() {
    var desejo = null;

    if (this.posicao.x < 0) {
      desejo = createVector(this.maxVelocidade, this.velocidade.y);
    }
    else if (this.posicao.x > width) {
      desejo = createVector(-this.maxVelocidade, this.velocidade.y);
    }
    if (this.posicao.y < 0) {
      desejo = createVector(this.velocidade.x, this.maxVelocidade);
    }
    else if (this.posicao.y > height) {
      desejo = createVector(this.velocidade.x, -this.maxVelocidade);
    }
    if (desejo !== null) {
      desejo.normalize();
      desejo.mult(this.maxVelocidade);
      var direcao = p5.Vector.sub(desejo, this.velocidade);
      direcao.limit(this.maxForca);
      this.aceleracao.add(direcao);
    }
  }

  //____________________________________________________________________________
  // função que adiciona um objeto à uma base de conhecimento
  //____________________________________________________________________________
  function conhecer(base, obj){
    if (!base.contains(obj))
      base.push(obj);
  }
}
