function Alimento(x, y, caracteristicas){
  // código gerado para a criatura lembrar desse alimento na base de conhecimento
  this.codigo = "" + caracteristicas[0] + caracteristicas[1] + caracteristicas[2] + caracteristicas[3];
  // tipo do alimento: 0 = planta, 1 = inseto, 2 = toxico, 3 = carne
  this.tipo = caracteristicas[0];
  switch (this.tipo) {
    case 0:
      this.nome = "planta";
      break;
    case 1:
      this.nome = "inseto";
      break;
    case 2:
      this.nome = "veneno";
      break;
    case 3:
      this.nome = "carne";
      break;
  }
  this.vida = random(caracteristicas[1] - 0.25, caracteristicas[1] + 0.25);
  this.fome = random(caracteristicas[2] - 0.25, caracteristicas[2] + 0.25);
  this.alfa = 0;
  this.r = caracteristicas[3];
  this.g = caracteristicas[4];
  this.b = caracteristicas[5];
  this.cor = color(this.r, this.g, this.b, this.alfa);
  this.posicao = createVector(x, y);
  this.raio = (this.fome * 3);
}

Alimento.prototype.show = function(){
  noStroke();
  if (this.alfa < 255){
    this.alfa += 5;
    this.cor = color(this.r, this.g, this.b, this.alfa);
  }
  fill(this.cor);
  ellipse(this.posicao.x, this.posicao.y, this.raio);
}
