function Criatura(x, y, caracteristicas, heranca, geracao){
  this.nome = caracteristicas[0];
  // tipo de alimento que a criatura consome: 0 = planta, 1 = carne, 2 = ambos
  this.tipo = caracteristicas[1];
  // a criatura vai perdendo vida se estiver com fome
  this.vida = parseFloat(caracteristicas[2]);
  this.maxVida = parseFloat(caracteristicas[2]);
  // fome define de quanto em quanto tempo a criatura precisa estar se alimento
  this.fome = random(caracteristicas[3]/2, caracteristicas[3]);
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
  this.geracao = geracao;
  this.reproducao = 0;
  this.fitness = 0;

  // criatura nova gera o código genético aleatório
  this.codigoGenetico = [];
  if (heranca === null){
    this.codigoGenetico[0] = random(-1, 1); // peso comida boa
    this.codigoGenetico[1] = random(-1, 1); // peso comida ruim
    this.codigoGenetico[2] = random(-1, 1); // peso predadores
    this.codigoGenetico[3] = random(20, 100); // raio de percepção para detectar alimento desconhecido
    this.codigoGenetico[4] = random(20, 100); // raio de percepção para detectar alimento bom
    this.codigoGenetico[5] = random(20, 100); // raio de percepção para detectar alimento ruim
    this.codigoGenetico[6] = random(20, 100); // raio de percepção para detectar predadores
    this.codigoGenetico[7] = random(0.001, 0.01); // taxa de reprodução
  // filho de alguma criatura - chances de mutação
  } else {
    for (var i = 0; i < this.codigoGenetico.length; i++){
      this.codigoGenetico[i] = heranca[i];
      switch (i) {
        case 0:
        case 1:
        case 2:
          if (random(1) < taxaMutacao)
            this.codigoGenetico[i] += random(-0.1, 0.1);
          break;
        case 3:
        case 4:
        case 5:
        case 6:
          if (random(1) < taxaMutacao)
            this.codigoGenetico[i] += random(-10, 10);
          break;
        case 7:
          if (random(1) < taxaMutacao){
            this.codigoGenetico[i] += random(-0.001, 0.001);
            // limita a taxa de reprodução para ficar entre 0.001 e 0.01
            if (this.codigoGenetico[i] > 0.01)
              this.codigoGenetico[i] = 0.01;
            else if (this.codigoGenetico[i] < 0.001)
              this.codigoGenetico[i] = 0.001;
          }
          break;
      }
    }
  }

  this.baseConhecimento = [];
  this.baseConhecimento[0] = []; // índice 0 = comidas boas
  this.baseConhecimento[1] = []; // índice 1 = comidas ruins
  this.baseConhecimento[2] = []; // índice 2 = predadores

  this.tempo = random(100);
  this.destino = createVector(random(width-5), random(height-5));
}

//____________________________________________________________________________
// método de atualização
//____________________________________________________________________________
Criatura.prototype.update = function() {
  // fitness vai subindo com o tempo, se comer o tipo de comida errada, perde um pouco
  this.reproducao += this.codigoGenetico[7];
  this.fitness += 0.01;

  // a criatura começará a perder muita vida se estiver com fome
  if (this.fome <= 0) {
    this.vida -= 0.001;
  } else {
    this.vida -= 0.00025;
    this.fome -= 0.001;
  }
  this.velocidade.add(this.aceleracao);
  this.velocidade.limit(this.maxVelocidade);
  this.posicao.add(this.velocidade);
  this.aceleracao.mult(0);
}

//____________________________________________________________________________
//  método que aplica força na aceleração
//____________________________________________________________________________
Criatura.prototype.aplicaForca = function(forca) {
  this.aceleracao.add(forca);
}

//____________________________________________________________________________
//  método que define qual comportamento a criatura irá realizar
//____________________________________________________________________________
Criatura.prototype.comportamentos = function(comidas, criaturas) {
  var desconhecido = this.alimenta(comidas, null, this.codigoGenetico[3]);
  desconhecido.mult(1);
  this.aplicaForca(desconhecido);
  // desviará das comidas que a criatura já sabe que é ruim
  if (this.baseConhecimento[1].length > 0){
    var desvia = this.alimenta(comidas, this.baseConhecimento[1], this.codigoGenetico[5]);
    desvia.mult(this.codigoGenetico[1]);
    this.aplicaForca(desvia);
  }
  // dará preferência às comidas que a criatura já sabe que é boa
  if (this.baseConhecimento[0].length > 0){
    var preferencia = this.alimenta(comidas, this.baseConhecimento[0], this.codigoGenetico[4]);
    preferencia.mult(this.codigoGenetico[0]);
    this.aplicaForca(preferencia);
  }
  // fugirá das criaturas que já sabe que são predadores
  if (this.baseConhecimento[2].length > 0){
    var foge = this.alimenta(criaturas, this.baseConhecimento[2], this.codigoGenetico[6]);
    foge.mult(this.codigoGenetico[2]);
    this.aplicaForca(foge);
  }

  // var seguePlanta = this.alimenta(plantas, this.codigoGenetico[3]);
  // var segueCarne = this.alimenta(carnes, this.codigoGenetico[4]);
  // var segueVeneno = this.alimenta(venenos, this.codigoGenetico[5]);
  //
  // seguePlanta.mult(this.codigoGenetico[0]);
  // segueCarne.mult(this.codigoGenetico[1]);
  // segueVeneno.mult(this.codigoGenetico[2]);
  //
  // this.aplicaForca(seguePlanta);
  // this.aplicaForca(segueCarne);
  // this.aplicaForca(segueVeneno);
}

//____________________________________________________________________________
// método que define a forma como a criatura irá se alimentar, dependendo da fome
//____________________________________________________________________________
Criatura.prototype.alimenta = function(comidas, base, percepcao) {
  var lembranca = Infinity;
  var maisProximo = null;
  var usandoBase = false;
  // verifica se está usando alguma base de conhecimento
  if (base != null)
    usandoBase = true;

  for (var i = comidas.length - 1; i >= 0; i--) {
    // verifica se a comida está na base de conhecimento, caso esteja usando
    if (usandoBase){
      if (!base.contains(comidas[i]))
        continue;
    }

    var distancia = this.posicao.dist(comidas[i].posicao);
    if (distancia < this.maxVelocidade + 2) {
      var devorado = comidas.splice(i, 1)[0];
      this.conhecer(devorado);

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
Criatura.prototype.movimenta = function(obj) {

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
// método onde as duas melhores criaturas da espécie gerará um filho
//____________________________________________________________________________
Criatura.prototype.reproduz = function() {
  // para reproduzir, precisa estar com, pelo menos, 2/3 da saúde máxima
  if (this.vida >= (this.maxVida - this.maxVida/3) && this.reproducao > 15){
    if (random(1) < 0.1){
      var melhorParceiro = null;
      // vai procurar o melhor parceiro para gerar um filho
      for (var i = 0; i < criaturas.length; i++){
        if ((criaturas[i] != this) && (criaturas[i].nome == this.nome)){
          if (melhorParceiro == null){
            melhorParceiro = criaturas[i];
          } else {
            if (criaturas[i].fitness > melhorParceiro.fitness){
              melhorParceiro = criaturas[i];
            }
          }
        }
      }
      if (melhorParceiro == null){
        return null;
      } else {
        // aqui cruza o código genético dos pais para criar o do filho
        var codigoGeneticoFilho = [];
        for (var j = 0; j < this.codigoGenetico.length; j++){
          if (random(1) > 0.5){
            codigoGeneticoFilho[j] = this.codigoGenetico[j];
          } else {
            codigoGeneticoFilho[j] = melhorParceiro.codigoGenetico[j];
          }
        }
        this.reproducao = 0;
        melhorParceiro.reproducao = 0;
        var novasCaracteristicas = [];
        // pegando características da espécie para passar para o filho
        novasCaracteristicas.push(this.nome);
        novasCaracteristicas.push(this.tipo);
        novasCaracteristicas.push(this.maxVida);
        novasCaracteristicas.push(this.maxFome);
        novasCaracteristicas.push(this.maxVelocidade);
        novasCaracteristicas.push(this.resistencia);
        novasCaracteristicas.push(this.cor);
        // criando nova criatura com novas características e código genético herdado dos pais
        return new Criatura(this.posicao.x, this.posicao.y, novasCaracteristicas, codigoGeneticoFilho, this.geracao + 1);
      }
    }
  }
}

//____________________________________________________________________________
// método pra verificar se a criatura está sem vida
//____________________________________________________________________________
Criatura.prototype.morreu = function() {
  return (this.vida < 0)
}

//____________________________________________________________________________
// método que desenha a criatura no canvas na direção da velocidade
//____________________________________________________________________________
Criatura.prototype.show = function(){
  var angulo = this.velocidade.heading() + PI / 2;

  push();
  translate(this.posicao.x, this.posicao.y);
  rotate(angulo);

  // se debug estiver ativo, desenha percepções
  if (debug){
    noFill();
    strokeWeight(3);
    stroke(0, 255, 0);
    ellipse(0, 0, this.codigoGenetico[4] * 2); // aura para comida boa
    line(0, 0, 0, -this.codigoGenetico[0] * 50);
    strokeWeight(2);
    stroke(0, 0, 255);
    ellipse(0, 0, this.codigoGenetico[5] * 2); // aura para comida ruim
    line(0, 0, 0, -this.codigoGenetico[1] * 50);
    strokeWeight(1);
    stroke(255, 0, 0);
    ellipse(0, 0, this.codigoGenetico[6] * 2); // aura para predadores
    line(0, 0, 0, -this.codigoGenetico[2] * 50);
    // aqui mostra um contorno na criatura significando sua fome
    strokeWeight(2);
    stroke(lerpColor(color(255,0,0), color(0,255,0), this.fome));
  }

  // cor da criatura vai desaparecendo dependendo da vida
  fill(lerpColor(color(0,0,0), this.cor, this.vida));

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
Criatura.prototype.limites = function() {
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
Criatura.prototype.conhecer = function(devorado){
  var base = null;
  // se for comida ruim, perde vida e adiciona aquele tipo à base de conhecimento
  if (devorado.tipo == 2){
    this.vida -= devorado.vida;
    this.fitness -= 5;
    base = this.baseConhecimento[1];

  // onívoros comem dos dois tipos de alimento, por isso saciam pouca fome com cada alimento
  } else if (this.tipo == 2){
    this.vida += devorado.vida/1.5;
    this.fome += devorado.fome;
    this.fitness += 1;
    base = this.baseConhecimento[0];

  // criaturas que comem alimento do seu tipo apenas, saciam mais a fome com cada alimento
  } else if (this.tipo == devorado.tipo){
    this.vida += devorado.vida/1.25;
    this.fome += devorado.fome * 1.25;
    this.fitness += 1;
    base = this.baseConhecimento[0];

  // se comer um alimento de um tipo diferente perde vida e fica com um pouco mais de fome
  } else {
    this.fome -= devorado.fome/2;
    this.vida -= devorado.vida/2;
    this.fitness -= 2;
    base = this.baseConhecimento[1];
  }

  // chance de pequena melhoria na percepção com base na taxa de mutação após se alimentar
  if (random(1) < taxaMutacao){
    // verifica se é alimento bom ou ruim pra poder incrementar ou decrementar, respectivamente
    if (devorado.tipo == 2)
      this.codigoGenetico[devorado.tipo] -= random(0.1);
    else
      this.codigoGenetico[devorado.tipo] += random(0.1);
  }

  // após selecionar a base de conhecimento apropriada, adiciona o alimento se ainda não estiver lá
  if (!base.contains(devorado))
    base.push(devorado);
}
