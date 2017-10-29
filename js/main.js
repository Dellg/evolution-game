var xGame = 1000;
var yGame = 750;
var criaturas = [];
var alimentos = [];
var tipoAlimentos = [];

function setup(){
  createCanvas(xGame, yGame);

  for (var i = 0; i < 10; i++){
    var x = random(xGame);
    var y = random(yGame);
    var t = round(random(2));
    var criatura = new Criatura(x, y, t);
    criaturas.push(criatura);
  }

  // cria tipos de alimentos diferentes
  for (var i = 0; i < 5; i++){
    var t = round(random(2));
    var v = random(1);
    var f = random(1);
    var c = color(random(255), random(255), random(255));
    tipoAlimentos[i] = [t, v, f, c];
  }

  // cria alimentos usando os tipos pré-criados
  for (var i = 0; i < 30; i++){
    var x = random(xGame);
    var y = random(yGame);
    var r = round(random(tipoAlimentos.length - 1));
    alimentos.push(new Alimento(x, y, tipoAlimentos[r]));
  }
}

function draw(){
  background(15);
  // gera novas comidas se tiver menos de 30 comidas no canvas
  if (alimentos.length < 30){
    if (random(1) < 0.1) {
      var x = random(xGame);
      var y = random(yGame);
      var r = round(random(tipoAlimentos.length - 1));
      alimentos.push(new Alimento(x, y, tipoAlimentos[r]));
    }
  }

  for (var i = 0; i < criaturas.length; i++){
    var crtr = criaturas[i];
    crtr.comportamentos(alimentos);
    crtr.update();
    crtr.show();
    if (crtr.morreu()){
      criaturas.splice(i, 1);
    }
  }
  for (var i = 0; i < alimentos.length; i++){
    var almt = alimentos[i];
    almt.show();
  }
}
