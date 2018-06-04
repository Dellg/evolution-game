function Alimento(x, y, caracteristicas){
  // código gerado para a criatura lembrar desse alimento na base de conhecimento
  this.codigo = "" + caracteristicas[0] + caracteristicas[1] + caracteristicas[2];
  // tipo do alimento: 0 = planta, 1 = inseto, 2 = toxico, 3 = carne
  this.tipo = caracteristicas[0];
  switch (this.tipo) {
    case 0:
      this.nome = "planta";
      var r = int(round(random(-0.51, 4.4)));
      this.imagem = caracteristicas[3].get(32, 32 * r, 32, 32);
      break;
    case 1:
      this.nome = "inseto";
      var r = int(round(random(-0.51, 4.4)));
      this.imagem = caracteristicas[3].get(0, 32 * r, 32, 32);
      break;
    case 2:
      this.nome = "veneno";
      this.imagem = caracteristicas[3].get(0, 160, 32, 32);
      break;
    case 3:
      this.nome = "carne";
      this.imagem = caracteristicas[3].get(32, 160, 32, 32);
      break;
  }
  this.vida = random(caracteristicas[1] - 0.25, caracteristicas[1] + 0.25);
  this.fome = random(caracteristicas[2] - 0.25, caracteristicas[2] + 0.25);
  this.posicao = createVector(x, y);
  this.raio = (this.fome * 3);
}

Alimento.prototype.show = function(){
  image(this.imagem, this.posicao.x - 16, this.posicao.y - 16); // desenhar a imagem no canvas
}
