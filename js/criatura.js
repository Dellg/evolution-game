function Criatura(x, y, caracteristicas, heranca, geracao){
  // nome da criatura para identificação
  this.nome = caracteristicas[0];
  this.codigo = this.nome;
  // tipo de alimento que a criatura consome: 0 = planta, 1 = inseto, 2 = ambos
  this.tipo = caracteristicas[1];
  // a criatura vai perdendo vida se estiver com fome
  this.vida = random(caracteristicas[2]/3, caracteristicas[2]);
  this.maxVida = parseFloat(caracteristicas[2]);
  // fome define de quanto em quanto tempo a criatura precisa estar se alimento
  this.fome = random(caracteristicas[3]/3, caracteristicas[3]);
  this.maxFome = parseFloat(caracteristicas[3]);
  this.faminto = false;
  this.velocidade = p5.Vector.random2D(caracteristicas[4]);
  this.maxVelocidade = parseFloat(caracteristicas[4]);
  // carnívoros só irão atacar outras criaturas que tem resistência menor que a deles
  this.resistencia = parseFloat(caracteristicas[5]) + random(0.5);
  this.cor = caracteristicas[6];

  // dados da criatura
  this.posicao = createVector(x, y);
  this.aceleracao = createVector();
  this.maxForca = random(0.01, 0.05);
  this.raio = 5;

  // características da IA
  this.geracao = geracao;
  this.intervaloReproducao = random(15, 25);
  this.reproducao = 0;
  this.fitness = 0;

  // criatura nova gera o código genético aleatório
  this.codigoGenetico = [];
  if (heranca === null){
    // não faz parte do código genético, criatura sem parente terá reprodução aleatória
    this.reproducao = random(0, this.intervaloReproducao);
    // código genético herbívoro
    if (this.tipo == 0){
      this.codigoGenetico[0] = random(-0.1, 1.5); // peso comida planta
      this.codigoGenetico[1] = random(-1.5, 0.1); // peso comida inseto
      this.codigoGenetico[3] = random(70, 120); // raio de percepção para detectar planta
      this.codigoGenetico[4] = random(20, 70); // raio de percepção para detectar inseto
      this.codigoGenetico[7] = random(-1.5, 0.1); // peso predador/presa
      this.codigoGenetico[8] = random(20, 70); // raio de percepção para detectar predadores/presa
      this.codigoGenetico[9] = random(-1.5, 0.1); // peso comida carne (criatura)
      this.codigoGenetico[10] = random(20, 70); // raio de percepção para detectar carne (criatura)
    // código genético carnívoro
    } else if (this.tipo == 1){
      this.codigoGenetico[0] = random(-1.5, 0.1); // peso comida planta
      this.codigoGenetico[1] = random(-1.5, 0.1); // peso comida inseto
      this.codigoGenetico[3] = random(20, 70); // raio de percepção para detectar planta
      this.codigoGenetico[4] = random(20, 70); // raio de percepção para detectar inseto
      this.codigoGenetico[7] = random(-0.1, 1.5); // peso predador/presa
      this.codigoGenetico[8] = random(70, 120); // raio de percepção para detectar predadores/presa
      this.codigoGenetico[9] = random(-0.1, 1.5); // peso comida carne (criatura)
      this.codigoGenetico[10] = random(70, 120); // raio de percepção para detectar carne (criatura)
    // código genético onívoro
    } else if (this.tipo == 2){
      this.codigoGenetico[0] = random(-1.5, 0.1); // peso comida planta
      this.codigoGenetico[1] = random(-0.1, 1.5); // peso comida inseto
      this.codigoGenetico[3] = random(20, 70); // raio de percepção para detectar planta
      this.codigoGenetico[4] = random(70, 120); // raio de percepção para detectar inseto
      this.codigoGenetico[7] = random(-1.5, 0.1); // peso predador/presa
      this.codigoGenetico[8] = random(20, 70); // raio de percepção para detectar predadores/presa
      this.codigoGenetico[9] = random(-1.5, 0.1); // peso comida carne (criatura)
      this.codigoGenetico[10] = random(20, 70); // raio de percepção para detectar carne (criatura)
    }
    this.codigoGenetico[2] = random(-0.5, 1); // peso perigo
    this.codigoGenetico[5] = random(20, 100); // raio de percepção para detectar veneno
    this.codigoGenetico[6] = random(0.005, 0.01); // taxa de reprodução
  // filho de alguma criatura - chances de mutação
  } else {
    for (var i = 0; i < heranca.length; i++){
      this.codigoGenetico[i] = heranca[i];
      switch (i) {
        case 0:
        case 1:
        case 2:
        case 7:
        case 9:
          if (random(1) < taxaMutacao){
            this.codigoGenetico[i] += random(-0.1, 0.1);
            console.log("... e seu filho sofreu mutação.")
          }
          break;
        case 3:
        case 4:
        case 5:
        case 8:
        case 10:
          if (random(1) < taxaMutacao){
            this.codigoGenetico[i] += random(-5, 5);
            console.log("... e seu filho sofreu mutação.")
          }
          break;
        case 6:
          if (random(1) < taxaMutacao){
            this.codigoGenetico[i] += random(-0.001, 0.001);
            // limita a taxa de reprodução para ficar entre 0.005 e 0.01
            if (this.codigoGenetico[i] > 0.01)
              this.codigoGenetico[i] = 0.01;
            else if (this.codigoGenetico[i] < 0.005)
              this.codigoGenetico[i] = 0.005;
            console.log("... e seu filho sofreu mutação.")
          }
          break;
      }
    }
  }

  if (caracteristicas[7] == null){
    this.baseConhecimento = [];
    this.baseConhecimento[0] = []; // índice 0 = comidas boas
    this.baseConhecimento[1] = []; // índice 1 = comidas ruins
    this.baseConhecimento[2] = []; // índice 2 = predadores
  } else {
    this.baseConhecimento = caracteristicas[7];
  }
}

//____________________________________________________________________________
//  método que define qual comportamento a criatura irá realizar
//____________________________________________________________________________
Criatura.prototype.comportamentos = function(plantas, insetos, venenos, carnes, criaturas) {
  var separacao, alinhado, coeso;
  var segueVeneno, seguePlanta, segueInseto, predadorPresa, segueCarne;

  // limita a fome à fome máxima
  if (this.fome > this.maxFome){
    this.fome = this.maxFome;
  }
  // verifica se está faminto ou não
  if (this.fome < (this.maxFome/3)){
    this.faminto = true;
  } else {
    this.faminto = false;
  }

  // se estiver com fome, vai procurar alimento
  if (this.faminto){
    separacao = null;
    alinhado = null;
    coeso = null;

    segueVeneno = this.alimenta(venenos, this.codigoGenetico[5]);
    seguePlanta = this.alimenta(plantas, this.codigoGenetico[3]);
    segueInseto = this.alimenta(insetos, this.codigoGenetico[4]);
    segueCarne = this.alimenta(carnes, this.codigoGenetico[10]);
    predadorPresa = this.persegue(criaturas, this.codigoGenetico[8]);

    segueVeneno.mult(this.codigoGenetico[2]);
    seguePlanta.mult(this.codigoGenetico[0]);
    segueInseto.mult(this.codigoGenetico[1]);
    predadorPresa.mult(this.codigoGenetico[7]);
    segueCarne.mult(this.codigoGenetico[9]);

    this.aplicaForca(segueVeneno);
    this.aplicaForca(segueCarne);
    this.aplicaForca(predadorPresa);
    this.aplicaForca(seguePlanta);
    this.aplicaForca(segueInseto);

  // se estiver sem fome, vai andar em grupo
  } else {
    segueVeneno = null;
    seguePlanta = null;
    segueInseto = null;
    segueCarne = null;

    predadorPresa = this.fugir(criaturas, this.codigoGenetico[8]);
    separacao = this.separar(criaturas);
    alinhado = this.alinhar(criaturas);
    coeso = this.coesao(criaturas);

    if (this.codigoGenetico[7] > 0){
      predadorPresa.mult(this.codigoGenetico[7] * -2);
    } else {
      predadorPresa.mult(this.codigoGenetico[7] * 2);
    }
    separacao.mult(1.5);
    alinhado.mult(1.0);
    coeso.mult(1.0);

    this.aplicaForca(separacao);
    this.aplicaForca(alinhado);
    this.aplicaForca(coeso);
    this.aplicaForca(predadorPresa);
  }
}

//____________________________________________________________________________
// método de atualização
//____________________________________________________________________________
Criatura.prototype.update = function() {
  // capacidade de reprodução só aumenta se a criatura estiver bem alimentada
  if (this.fome > (this.maxFome - this.maxFome/4)){
    this.reproducao += this.codigoGenetico[6];
  }
  // fitness vai subindo com o tempo, se comer o tipo de comida errada, perde um pouco
  this.fitness += 0.01;

  // a criatura começará a perder muita vida se estiver com fome
  if (this.fome <= 0) {
    this.vida -= 0.001;
  } else {
    this.vida -= 0.00001;
    this.fome -= 0.00075;
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
// método que define a forma como a criatura irá se alimentar, dependendo da fome
//____________________________________________________________________________
Criatura.prototype.alimenta = function(comidas, percepcao) {
  var lembranca = Infinity;
  var maisProximo = null;

  for (var i = comidas.length - 1; i >= 0; i--) {

    var distancia = this.posicao.dist(comidas[i].posicao);
    if (distancia < this.maxVelocidade + this.raio/2) {
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
    return this.movimenta(maisProximo, false);
  }
  return createVector(0, 0);
}

//____________________________________________________________________________
// método que define se a criatura irá perseguir outra criatura
//____________________________________________________________________________
Criatura.prototype.persegue = function(predadores, percepcao) {
  var lembranca = Infinity;
  var maisProximo = null;

  for (var i = predadores.length - 1; i >= 0; i--) {
    if (predadores[i].tipo != this.tipo){
      var distancia = this.posicao.dist(predadores[i].posicao);
      // se é caçador e pode caçar
      if (this.tipo == 1 && this.resistencia > predadores[i].resistencia){
        if (distancia < this.maxVelocidade + this.raio/2) {
          var devorado = predadores.splice(i, 1)[0];
          this.matou(devorado);
          console.log(this.nome + " caçou " + devorado.nome);

          // limita a fome e a vida aos seus valores máximos
          if (this.fome > this.maxFome)
            this.fome = this.maxFome;
          if (this.vida > this.maxVida)
            this.vida = this.maxVida;
        } else {
          if (distancia < lembranca && distancia < percepcao) {
            lembranca = distancia;
            maisProximo = predadores[i];
          }
        }
      // se é caçador mas não pode caçar
      } else if (this.tipo == 1 && this.resistencia <= predadores[i].resistencia){
        if (distancia < lembranca && distancia < percepcao) {
          lembranca = distancia;
          maisProximo = predadores[i];
        }
      }
    }
  }
  // aqui define o comportamento da criatura, só irá perseguir se for caçador
  if (maisProximo != null){
    if (this.tipo == 1){
      return this.movimenta(maisProximo, false);
    }
  }
  return createVector(0, 0);
}

//____________________________________________________________________________
// método que define se a criatura irá fugir de algum predador
//____________________________________________________________________________
Criatura.prototype.fugir = function(predadores, percepcao) {
  var lembranca = Infinity;
  var maisProximo = null;

  for (var i = predadores.length - 1; i >= 0; i--) {
    if (this.baseConhecimento[2].contains(predadores[i])){
      var distancia = this.posicao.dist(predadores[i].posicao);
      if (distancia < lembranca && distancia < percepcao) {
        lembranca = distancia;
        maisProximo = predadores[i];
      }
    }
  }

  if (maisProximo != null){
    return this.movimenta(maisProximo, true);
  }
  return createVector(0, 0);
}

//____________________________________________________________________________
// método de movimento da criatura
//____________________________________________________________________________
Criatura.prototype.movimenta = function(obj, fugindo) {
  var desejo;
  // verifica se o objeto recebido é um vetor ou uma criatura
  if (obj.name == "p5.Vector"){
    desejo = p5.Vector.sub(obj, this.posicao);
  } else {
    desejo = p5.Vector.sub(obj.posicao, this.posicao);
  }
  if (this.fome <= this.maxFome/2){
    desejo.setMag(this.maxVelocidade);
  } else {
    desejo.setMag(random(this.maxVelocidade/2 - 0.5, this.maxVelocidade/2 + 0.5));
  }
  var direcao = p5.Vector.sub(desejo, this.velocidade);
  if (fugindo){
    direcao.limit(this.maxForca * 2);
  } else {
    direcao.limit(this.maxForca);
  }

  return direcao;
}

//____________________________________________________________________________
// método onde as duas melhores criaturas da espécie gerará um filho
//____________________________________________________________________________
Criatura.prototype.reproduz = function() {
  // para reproduzir, precisa estar com, pelo menos, 2/3 da saúde máxima
  if (this.vida >= (this.maxVida - this.maxVida/3) && this.reproducao > this.intervaloReproducao){
    if (random(1) < 0.1){
      var melhorParceiro = null;
      // vai procurar o melhor parceiro para gerar um filho
      for (var i = criaturas.length - 1; i >= 0; i--){
        if ((criaturas[i] === undefined) || (criaturas[i].vida < criaturas[i].maxVida/2)){
          continue;
        }
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
      if (melhorParceiro == null || melhorParceiro.reproducao < melhorParceiro.intervaloReproducao){
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
        novasCaracteristicas.push(this.baseConhecimento);
        console.log(this.nome + " reproduziu...");
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
  // if (debug){
  //   noFill();
  //   stroke(0, 255, 0);
  //   ellipse(0, 0, this.codigoGenetico[3] * 2); // aura para comida planta
  //   line(0, 0, 0, -this.codigoGenetico[0] * 50);
  //   stroke(255, 0, 0);
  //   ellipse(0, 0, this.codigoGenetico[4] * 2); // aura para comida inseto
  //   line(0, 0, 0, -this.codigoGenetico[1] * 50);
  //   stroke(0, 0, 255);
  //   ellipse(0, 0, this.codigoGenetico[5] * 2); // aura para perigo
  //   line(0, 0, 0, -this.codigoGenetico[2] * 50);
  //   stroke(255, 255, 0);
  //   ellipse(0, 0, this.codigoGenetico[8] * 2); // aura para predador/presa
  //   line(0, 0, 0, -this.codigoGenetico[7] * 50);
  //   stroke(255);
  //   ellipse(0, 0, this.codigoGenetico[10] * 2); // aura para comida carne (criatura)
  //   line(0, 0, 0, -this.codigoGenetico[9] * 50);
  //   // aqui mostra um contorno na criatura significando sua fome
  //   strokeWeight(2);
  //   stroke(lerpColor(color(255,0,0), color(0,255,0), this.fome));
  // }

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
// método que faz a criatura dar volta ao mundo quando chega ao limite da tela
//____________________________________________________________________________
Criatura.prototype.limites = function() {

  if (this.posicao.x < -this.raio) {
    this.posicao.x = width + this.raio;
  } else if (this.posicao.x > width + this.raio) {
    this.posicao.x = -this.raio;
  }

  if (this.posicao.y < -this.raio) {
    this.posicao.y = height + this.raio;
  } else if (this.posicao.y > height + this.raio) {
    this.posicao.y = this.raio;
  }
}

//____________________________________________________________________________
// método usado quando um predador caça uma presa
//____________________________________________________________________________
Criatura.prototype.matou = function(devorado){
  // predador ganha propriedades de vida e de fome por caçar
  this.vida += devorado.vida/3;
  this.fome += this.maxFome;
  if (this.tipo == 1){
    this.fitness += 3;
  } else {
    this.fitness -= 3;
  }
  // chance de pequena melhora nas habilidades de caça do predador
  if (random(1) < taxaMutacao){
    this.codigoGenetico[7] += random(0.1);
  }
  // chance de pequena melhoria na percepção de presas com base na taxa de mutação
  if (random(1) < taxaMutacao){
    this.codigoGenetico[8] += random(0.1);
  }

  // todas as criaturas do mesmo tipo da presa irão adicionar esse predador na base de conhecimento
  for (var i = criaturas.length - 1; i >= 0; i--){
    if (criaturas[i].nome == devorado.nome){
      if (!criaturas[i].baseConhecimento[2].contains(this))
        criaturas[i].baseConhecimento[2].push(this);

      // chance de pequena melhoria na capacidade de fuga das presas com base na taxa de mutação
      if (random(1) < taxaMutacao){
        criaturas[i].codigoGenetico[7] -= random(0.1);
      }
      // chance de pequena melhoria na percepção de predadores com base na taxa de mutação
      if (random(1) < taxaMutacao){
        criaturas[i].codigoGenetico[8] += random(0.1);
      }
    }
  }
}

//____________________________________________________________________________
// função que adiciona um objeto à uma base de conhecimento
//____________________________________________________________________________
Criatura.prototype.conhecer = function(devorado){
  var base = null;
  // se for comida ruim, perde vida e adiciona aquele tipo à base de conhecimento
  // se for carnívoro e comer algo diferente de carne de criatura, também perde vida
  // se for onívoro e comer carne de criatura, também perde vida
  if ((devorado.tipo == 2) || (this.tipo == 1 && devorado.tipo != 3) || (this.tipo == 2 && devorado.tipo == 3)){
    this.vida -= devorado.vida;
    this.fitness -= 5;
    base = this.baseConhecimento[1];
  // se for onívoro, se for carnívoro e comer carne de criatura, ou se for herbívoro e comer planta
  // adiciona vida e sacia fome, e adiciona o tipo à base de conhecimento
  } else if ((this.tipo == 2) || (this.tipo == 1 && devorado.tipo == 3) || (this.tipo == 0 && devorado.tipo == 0)){
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
    console.log(this.nome + " sofreu mutação ao comer.");
  }

  // após selecionar a base de conhecimento apropriada, adiciona o alimento se ainda não estiver lá
  if (!base.contains(devorado))
    base.push(devorado);
}

//____________________________________________________________________________
// função para manter distância entre as  criaturas quando estiverem andando em bando
//____________________________________________________________________________
Criatura.prototype.separar = function(criaturas){
  var distanciaDesejada = 25;
  var direcao = createVector(0,0);
  var contador = 0;
  // para cada criatura, verifica se é da mesma espécie
  for (var i = 0; i < criaturas.length; i++){
    if (criaturas[i].nome == this.nome && criaturas[i].fome > criaturas[i].maxFome/3){
      var distancia = p5.Vector.dist(this.posicao, criaturas[i].posicao);
      if ((distancia > 0) && (distancia < distanciaDesejada)){
        var diferenca = p5.Vector.sub(this.posicao, criaturas[i].posicao);
        diferenca.normalize();
        diferenca.div(distancia);
        direcao.add(diferenca);
        contador++;
      }
    }
  }
  if (contador > 0){
    direcao.div(contador);
  }
  if (direcao.mag() > 0) {
    direcao.normalize();
    direcao.mult(this.maxVelocidade);
    direcao.sub(this.velocidade);
    direcao.limit(this.maxForca);
  }
  return direcao;
}

//____________________________________________________________________________
// função para alinhar as criaturas de um mesmo bando, para andar numa velocidade média
//____________________________________________________________________________
Criatura.prototype.alinhar = function(criaturas){
  var distanciaVizinho = 50;
  var soma = createVector(0,0);
  var contador = 0;
  // para cada criatura, verifica se é da mesma espécie
  for (var i = 0; i < criaturas.length; i++){
    if (criaturas[i].nome == this.nome && criaturas[i].fome > criaturas[i].maxFome/3){
      var distancia = p5.Vector.dist(this.posicao, criaturas[i].posicao);
      if ((distancia > 0) && (distancia < distanciaVizinho)){
        soma.add(criaturas[i].velocidade);
        contador++;
      }
    }
  }
  if (contador > 0){
    soma.div(contador);
    soma.normalize();
    soma.mult(this.maxVelocidade);
    var direcao = p5.Vector.sub(soma, this.velocidade);
    direcao.limit(this.maxForca);
    return direcao;
  } else {
    return createVector(0,0);
  }
}

//____________________________________________________________________________
// função que define um local médio para onde o bando vai se mover
//____________________________________________________________________________
Criatura.prototype.coesao = function(criaturas){
  var distanciaVizinho = 50;
  var soma = createVector(0,0);
  var contador = 0;
  // para cada criatura, verifica se é da mesma espécie
  for (var i = 0; i < criaturas.length; i++){
    if (criaturas[i].nome == this.nome && criaturas[i].fome > criaturas[i].maxFome/3){
      var distancia = p5.Vector.dist(this.posicao, criaturas[i].posicao);
      if ((distancia > 0) && (distancia < distanciaVizinho)){
        soma.add(criaturas[i].posicao);
        contador++;
      }
    }
  }
  if (contador > 0){
    soma.div(contador);
    return this.movimenta(soma, false);
  } else {
    return createVector(0,0);
  }
}
