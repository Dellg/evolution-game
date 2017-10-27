var xGame = 1000
var yGame = 750
var criaturas = []
var alimentos = []
var countCriaturas = 10
var countAlimentos = 25

function setup(){
  createCanvas(xGame, yGame)

  for (var i = 0; i < countCriaturas; i++){
    var x = random(xGame)
    var y = random(yGame)
    var criatura = new Criatura(x, y)
    criaturas.push(criatura)
  }

  for (var i = 0; i < countAlimentos; i++){
    var x = random(xGame)
    var y = random(yGame)
    var t = round(random(2))
    console.log(t)
    var alimento = new Alimento(t, x, y)
    alimentos.push(alimento)
  }
}

function draw(){
  background(50)
  for (var i = 0; i < countCriaturas; i++){
    var crtr = criaturas[i]
    crtr.update()
    crtr.show()
    crtr.comportamentos()
  }
  for (var i = 0; i < countAlimentos; i++){
    var almt = alimentos[i]
    almt.show()
  }
}
