var xGame = 900
var yGame = 700
var criaturas = []
var countCriaturas = 10

function setup(){
  createCanvas(xGame, yGame)

  for (var i = 0; i < countCriaturas; i++){
    var x = random(xGame)
    var y = random(yGame)
    var criatura = new Criatura(x, y)
    criaturas.push(criatura)
  }
}

function draw(){
  background(50)
  for (var i = 0; i < countCriaturas; i++){
    var crtr = criaturas[i]
    crtr.update()
    crtr.show()
  }
}
