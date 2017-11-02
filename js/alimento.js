function Alimento(x, y, caracteristicas){
  // código gerado para a criatura lembrar desse alimento na base de conhecimento
  this.codigo = "" + caracteristicas[0] + caracteristicas[1] + caracteristicas[2] + caracteristicas[3];
  // tipo do alimento: 0 = planta, 1 = carne, 2 = toxico
  this.tipo = caracteristicas[0];
  switch (this.tipo) {
    case 0:
      this.nome = "planta";
      break;
    case 1:
      this.nome = "carne";
      break;
    case 2:
      this.nome = "veneno";
      break;
  }
  this.vida = random(caracteristicas[1] - 0.25, caracteristicas[1] + 0.25);
  this.fome = random(caracteristicas[2] - 0.25, caracteristicas[2] + 0.25);
  this.cor = caracteristicas[3];
  this.posicao = createVector(x, y);
  this.raio = (this.fome * 4);

  this.show = function(){
    noStroke();
    fill(this.cor);
    if (this.tipo == 0){
      ellipse(this.posicao.x, this.posicao.y, this.raio);
    } else if (this.tipo == 1){
      rect(this.posicao.x, this.posicao.y, this.raio - 1, this.raio - 1);
    } else if (this.tipo == 2){
      triangle(this.posicao.x - this.raio/1.5, this.posicao.y - this.raio/1.5, this.posicao.x, this.posicao.y, this.posicao.x + this.raio/1.5, this.posicao.y - this.raio/1.5);
    }
  }
}
