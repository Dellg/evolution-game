function Alimento(x, y, caracteristicas){
  // tipo do alimento: 0 = planta, 1 = carne, 2 = toxico
  this.tipo = caracteristicas[0];
  this.vida = caracteristicas[1];
  this.fome = caracteristicas[2];
  this.cor = caracteristicas[3];
  this.posicao = createVector(x, y);
  this.raio = 6;

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
