var xGame = 1000;
var yGame = 750;
var criaturas = [];
var alimentos = [];

function setup(){
  createCanvas(xGame, yGame);

  for (var i = 0; i < 10; i++){
    var x = random(xGame);
    var y = random(yGame);
    var t = round(random(2));
    var criatura = new Criatura(x, y, t);
    criaturas.push(criatura);
  }

  for (var i = 0; i < 30; i++){
    var x = random(xGame);
    var y = random(yGame);
    var t = round(random(2));
    var alimento = new Alimento(x, y, t);
    alimentos.push(alimento);
  }
}

function draw(){
  background(50);
  // gera novas comidas se tiver menos de 30 comidas no canvas
  if (alimentos.length < 30){
    if (random(1) < 0.1) {
      alimentos.push(new Alimento(random(xGame), random(yGame), round(random(2))));
    }
  }

  for (var i = 0; i < criaturas.length; i++){
    var crtr = criaturas[i];
    crtr.comportamentos(alimentos);
    crtr.update();
    crtr.show();
  }
  for (var i = 0; i < alimentos.length; i++){
    var almt = alimentos[i];
    almt.show();
  }
}
