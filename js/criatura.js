var frame = 0;
var fps = 0.03;

function Criatura(x, y, caracteristicas, heranca, geracao){
  // nome da criatura para identificação
  this.nome = caracteristicas[0][0];
  // informações sobre as características da criatura
  this.codigo = caracteristicas[0];
  // gênero da criatura: 0= macho, 1= fêmea
  this.genero = round(random(1));
  // tipo de alimento que a criatura consome: 0 = planta, 1 = carne e criatura, 2 = inseto e planta
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
  this.imagem = caracteristicas[6];

  // dados da criatura
  this.posicao = createVector(x, y);
  this.aceleracao = createVector();
  this.maxForca = random(0.01, 0.05);
  // não-carnívoros recebem um bônus extra na força de desvio para fugir melhor
  if (this.tipo != 1){
    this.maxForca += 0.025;
  }
  this.raio = 5;

  // características da IA
  this.geracao = geracao;
  if (this.tipo == 0){
    this.intervaloReproducao = random(4, 9);
  } else if (this.tipo == 2) {
    this.intervaloReproducao = random(8, 13);
  } else {
    this.intervaloReproducao = random(12, 22);
  }
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
      this.codigoGenetico[8] = random(20, 100); // raio de percepção para detectar predadores/presa
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
      this.codigoGenetico[8] = random(20, 100); // raio de percepção para detectar predadores/presa
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

Criatura.prototype.atualizaImagem = function(novaImagem) {
  this.imagem = novaImagem;
}

//____________________________________________________________________________
//  método que define qual comportamento a criatura irá realizar
//____________________________________________________________________________
Criatura.prototype.comportamentos = function(plantas, insetos, venenos, carnes, criaturas, obstaculos) {
  var separacao, alinhado, coeso;
  var segueVeneno, seguePlanta, segueInseto, predador, presa, segueCarne;

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
    predador = this.persegue(criaturas, this.codigoGenetico[8]);
    presa = this.fugir(criaturas, this.codigoGenetico[8]);

    if (this.codigoGenetico[7] > 0){
      presa.mult(this.codigoGenetico[7] * -3.5);
    } else {
      presa.mult(this.codigoGenetico[7] * 3.5);
    }
    segueVeneno.mult(this.codigoGenetico[2]);
    seguePlanta.mult(this.codigoGenetico[0]);
    segueInseto.mult(this.codigoGenetico[1]);
    predador.mult(this.codigoGenetico[7]);
    segueCarne.mult(this.codigoGenetico[9]);

    this.aplicaForca(segueVeneno);
    this.aplicaForca(segueCarne);
    this.aplicaForca(predador);
    this.aplicaForca(seguePlanta);
    this.aplicaForca(segueInseto);
    this.aplicaForca(presa);

  // se estiver sem fome, vai andar em grupo
  } else {
    segueVeneno = null;
    seguePlanta = null;
    segueInseto = null;
    segueCarne = null;
    predador = null;

    presa = this.fugir(criaturas, this.codigoGenetico[8]);
    separacao = this.separar(criaturas);
    alinhado = this.alinhar(criaturas);
    coeso = this.coesao(criaturas);

    if (this.codigoGenetico[7] > 0){
      presa.mult(this.codigoGenetico[7] * -2);
    } else {
      presa.mult(this.codigoGenetico[7] * 2);
    }
    separacao.mult(1.5);
    alinhado.mult(1.0);
    coeso.mult(1.0);

    this.aplicaForca(separacao);
    this.aplicaForca(alinhado);
    this.aplicaForca(coeso);
    this.aplicaForca(presa);
  }

  presa = this.desviar(obstaculos);
  presa.mult(-1);
  this.aplicaForca(presa);
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
      if (this.nome == [criatura[0][0]]){
        pontuacao += 1;
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
    return this.movimenta(maisProximo, false, 0);
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
      return this.movimenta(maisProximo, false, 0);
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
    return this.movimenta(maisProximo, true, 0);
  }
  return createVector(0, 0);
}

//____________________________________________________________________________
// método que define se a criatura vai desviar de algum obstáculo
//____________________________________________________________________________
Criatura.prototype.desviar = function(obstaculos) {
  var lembranca = Infinity;
  var maisProximo = null;

  for (var i = obstaculos.length - 1; i >= 0; i--) {
    var distancia = this.posicao.dist(obstaculos[i].posicao);
    if (distancia < lembranca && distancia < obstaculos[i].raio + 5) {
      lembranca = distancia;
      maisProximo = obstaculos[i];
    }
  }

  if (maisProximo != null){
    return this.movimenta(maisProximo, true, 5);
  }
  return createVector(0, 0);
}

//____________________________________________________________________________
// método de movimento da criatura
//____________________________________________________________________________
Criatura.prototype.movimenta = function(obj, fugindo, auxForca) {
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
    if (auxForca == 0){
      direcao.limit(this.maxForca * 3);
    } else {
      direcao.limit(this.maxForca * auxForca);
    }
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
        if ((criaturas[i] === undefined) || (criaturas[i].vida < criaturas[i].maxVida/2) || criaturas[i].genero == 1){
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
        novasCaracteristicas.push(this.codigo);
        novasCaracteristicas.push(this.tipo);
        novasCaracteristicas.push(this.maxVida);
        novasCaracteristicas.push(this.maxFome);
        novasCaracteristicas.push(this.maxVelocidade);
        novasCaracteristicas.push(this.resistencia);
        novasCaracteristicas.push(this.imagem);
        novasCaracteristicas.push(this.baseConhecimento);
        console.log(this.nome + " reproduziu...");

        if (this.nome == criatura[0][0]){
          pontuacao += 5;
        }
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
  var direcao = this.velocidade.heading();
  var angulo = direcao + PI / 2;
  var animFrame = 0;
  var animDirecao = 0;

  // pegar linha do gráfico para a animação dependendo da direção
  if (direcao >= -0.3875 && direcao < 0.3875){
    animDirecao = 96; // direita
  } else if (direcao >= 1.1625 && direcao < 1.9375){
    animDirecao = 64; // baixo
  } else if (direcao >= -1.9375 && direcao < -1.1625){
    animDirecao = 0;  // cima
  } else if (direcao >= -2.7125 && direcao < -1.9375){
    animDirecao = 128; // esquerda-cima
  } else if (direcao >= -1.1625 && direcao < -0.3875){
    animDirecao = 160; // direita-cima
  } else if (direcao >= 1.9375 && direcao < 2.7125){
    animDirecao = 192; // esquerda-baixo
  } else if (direcao >= 0.3875 && direcao < 1.1625){
    animDirecao = 224; // direita-baixo
  } else {
    animDirecao = 32; // esquerda
  }

  // pegar coluna do gráfico para a animação dependendo do frame
  if (frame >= 0 && frame < 10 || frame >= 20 && frame < 30){
    animFrame = 32;
    frame += fps;
  } else if (frame >= 10 && frame < 20){
    animFrame = 0;
    frame += fps;
  } else if (frame >= 30 && frame < 40){
    animFrame = 64;
    frame += fps;
  } else {
    frame = 0;
  }
  imgp = this.imagem.get(animFrame, animDirecao, 32, 32);
  image(imgp, this.posicao.x - 16, this.posicao.y - 16); // desenhar a imagem no canvas

  push();
  translate(this.posicao.x, this.posicao.y);
  rotate(angulo);

  pop();
}

//____________________________________________________________________________
// método que faz a criatura dar volta ao mundo quando chega ao limite da tela
//____________________________________________________________________________
Criatura.prototype.limites = function() {
  var tamanho = 28;

  if (this.posicao.x < -tamanho) {
    this.posicao.x = width + tamanho;
  } else if (this.posicao.x > width + tamanho) {
    this.posicao.x = -tamanho;
  }

  if (this.posicao.y < -tamanho) {
    this.posicao.y = height + tamanho;
  } else if (this.posicao.y > height + tamanho) {
    this.posicao.y = -tamanho;
  }
}

//____________________________________________________________________________
// método que faz a criatura dar meia volta ao chegar no limite da tela ou no meio (level 4)
//____________________________________________________________________________
Criatura.prototype.limitesLevel4 = function(espaco) {
  var tamanho = 32;
  var desejo = null;

  if (this.posicao.x < tamanho){
    desejo = createVector(this.maxVelocidade, this.velocidade.y);
  } else if (this.posicao.x > xGame/2 - espacoRio - tamanho && this.posicao.x < xGame/2){
    desejo = createVector(-this.maxVelocidade, this.velocidade.y);
  } else if (this.posicao.x < xGame/2 + espacoRio + tamanho && this.posicao.x >= xGame/2){
    desejo = createVector(this.maxVelocidade, this.velocidade.y);
  } else if (this.posicao.x > xGame - tamanho){
    desejo = createVector(-this.maxVelocidade, this.velocidade.y);
  }

  if (this.posicao.y < tamanho){
    desejo = createVector(this.velocidade.x, this.maxVelocidade);
  } else if (this.posicao.y > height - tamanho){
    desejo = createVector(this.velocidade.x, -this.maxVelocidade);
  }

  if (desejo != null){
    desejo.normalize();
    desejo.mult(this.maxVelocidade);
    var direcao = p5.Vector.sub(desejo, this.velocidade);
    direcao.limit(this.maxForca);
    this.aplicaForca(direcao);
  }
}

//____________________________________________________________________________
// método que faz a criatura dar meia volta ao chegar perto da água (level 5)
//____________________________________________________________________________
Criatura.prototype.limitesLevel5 = function() {
  var tamanho = 28;
  var desejo = null;

  if (this.posicao.x < tamanho){
    desejo = createVector(this.maxVelocidade, this.velocidade.y);
  } else if (this.posicao.x > xGame - 100 - tamanho * 4){
    desejo = createVector(-this.maxVelocidade, this.velocidade.y);
  }

  if (this.posicao.y < -tamanho) {
    this.posicao.y = height + tamanho;
  } else if (this.posicao.y > height + tamanho) {
    this.posicao.y = -tamanho;
  }

  if (desejo != null){
    desejo.normalize();
    desejo.mult(this.maxVelocidade);
    var direcao = p5.Vector.sub(desejo, this.velocidade);
    direcao.limit(this.maxForca);
    this.aplicaForca(direcao);
  }
}

//____________________________________________________________________________
// método usado quando um predador caça uma presa
//____________________________________________________________________________
Criatura.prototype.matou = function(devorado){
  if (this.nome == criatura[0][0]){
    pontuacao += 1;
  }
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
    return this.movimenta(soma, false, 0);
  } else {
    return createVector(0,0);
  }
}
