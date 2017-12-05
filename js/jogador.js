function Jogador(x, y, caracteristicas, heranca, geracao){
  // variável que determina quanto tempo a criatura ficará viva
  this.tempo = 5000
  // nome da criatura para identificação
  this.nome = "Jogador";
  this.codigo = this.nome;
  // tipo de alimento que a criatura consome: 0 = planta, 1 = carne, 2 = ambos
  this.tipo = caracteristicas[1];
  // a criatura vai perdendo vida se estiver com fome
  this.vida = random(caracteristicas[2]/3, caracteristicas[2]);
  this.maxVida = parseFloat(caracteristicas[2]);
  // fome define de quanto em quanto tempo a criatura precisa estar se alimento
  this.fome = random(caracteristicas[3]/3, caracteristicas[3]);
  this.maxFome = parseFloat(caracteristicas[3]);
  this.velocidade = 0;
  this.maxVelocidade = parseFloat(caracteristicas[4]);
  // carnívoros só irão atacar outras criaturas que tem resistência menor que a deles
  this.resistencia = parseFloat(caracteristicas[5]);
  this.cor = caracteristicas[6];

  // dados da criatura
  this.posicao = createVector(x, y);
  this.maxForca = random(0.001, 0.025) / 5;
  this.raio = 5;
  this.angulo = 0;

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
    // código genético
    this.codigoGenetico[0] = random(-0.5, 1); // peso comida planta
    this.codigoGenetico[1] = random(-0.5, 1); // peso comida carne
    this.codigoGenetico[2] = random(-0.5, 1); // peso perigo
    this.codigoGenetico[3] = random(20, 100); // raio de percepção para detectar planta
    this.codigoGenetico[4] = random(20, 100); // raio de percepção para detectar carne
    this.codigoGenetico[5] = random(20, 100); // raio de percepção para detectar veneno
    this.codigoGenetico[6] = random(0.005, 0.01); // taxa de reprodução
    this.codigoGenetico[7] = random(-0.5, 1); // peso predador/presa
    this.codigoGenetico[8] = random(20, 100); // raio de percepção para detectar predadores/presa
  // filho de alguma criatura - chances de mutação
  } else {
    for (var i = 0; i < heranca.length; i++){
      this.codigoGenetico[i] = heranca[i];
      switch (i) {
        case 0:
        case 1:
        case 2:
        case 7:
          if (random(1) < taxaMutacao){
            this.codigoGenetico[i] += random(-0.1, 0.1);
            console.log("... e seu filho sofreu mutação.")
          }
          break;
        case 3:
        case 4:
        case 5:
        case 8:
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
// método de atualização
//____________________________________________________________________________
Jogador.prototype.update = function() {
  // verifica se ainda está com tempo de vida
  if (this.tempo > 0){
    this.tempo--;
  } else {
    // this.vida = -10;
    // console.log("Você morreu de velhice.");
  }

  // capacidade de reprodução só aumenta se a criatura estiver bem alimentada
  if (this.fome > (this.maxFome - this.maxFome/4)){
    this.reproducao += this.codigoGenetico[6];
  }
  // fitness vai subindo com o tempo, se comer o tipo de comida errada, perde um pouco
  this.fitness += 0.01;

  // a criatura começará a perder muita vida se estiver com fome
  // if (this.fome <= 0) {
  //   this.vida -= 0.001;
  // } else {
  //   this.vida -= 0.00025;
  //   this.fome -= 0.001;
  // }

  if (keyIsDown(LEFT_ARROW)){
    this.angulo -= this.maxForca;
  }
  if (keyIsDown(RIGHT_ARROW)){
    this.angulo += this.maxForca;
  }
  if (keyIsDown(UP_ARROW)){
    if (this.velocidade < this.maxVelocidade / 20){
      this.velocidade += .000025;
    } else {
      this.velocidade = this.maxVelocidade / 20;
    }
  } else {
    if (this.velocidade > 0){
      this.velocidade -= .00005;
    } else if (this.velocidade < 0) {
      this.velocidade = 0;
    }
  }
  if (keyIsDown(DOWN_ARROW)){
    this.velocidade -= .0001;
  }
}

function keyReleased() {
  this.velocidade = 0;
}

//____________________________________________________________________________
// método pra verificar se a criatura está sem vida
//____________________________________________________________________________
Jogador.prototype.morreu = function() {
  return (this.vida < 0)
}

//____________________________________________________________________________
// método que desenha a criatura no canvas na direção da velocidade
//____________________________________________________________________________
Jogador.prototype.show = function(){
  this.posicao.x += cos(this.angulo)*(this.velocidade);
  this.posicao.y += sin(this.angulo)*(this.velocidade);
  push();
  translate(this.posicao.x, this.posicao.y);
  rotate(this.angulo + 1.555555);

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
