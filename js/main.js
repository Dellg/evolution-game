var xGame = 1000;
var yGame = 750;
var menu = 0;
var criaturas = [];
var alimentos = [];
var countAlimentos = 50;
var tipoCriaturas = [];
var tipoAlimentos = [];

function setup(){
  createCanvas(xGame, yGame);
  background(15);

  fill(255);
  textFont("Times New Roman", 16);

  text("Nome da criatura:", 45, 50);
  var nome = createInput();
  nome.style("width", "220px");
  nome.position(50, 65);

  text("Tipo:", 45, 100);
  var tipo = createRadio();
  tipo.style("color", "#FFFFFF");
  tipo.style("font-family", "Times New Roman");
  tipo.style("font-size", "10pt");
  tipo.option('Herbívoro',0);
  tipo.option('Carnívoro',1);
  tipo.option('Onívoro',2);
  tipo.position(50, 115);

  text("Vida:", 45, 150);
  var vida = createInput(0,"number",0,5);
  vida.style("width", "220px");
  vida.position(50, 165);

  text("Fome:", 45, 200);
  var fome = createInput(0,"number");
  fome.style("width", "220px");
  fome.position(50, 215);

  text("Velocidade:", 45, 250);
  var velocidade = createInput(0,"number");
  velocidade.style("width", "220px");
  velocidade.position(50, 265);

  text("Resistência:", 45, 300);
  var resistencia = createInput(0,"number");
  resistencia.style("width", "220px");
  resistencia.position(50, 315);

  text("Cor:", 45, 350);
  corR = createSlider(0, 255, 0);
  corR.position(50, 362);
  corG = createSlider(0, 255, 0);
  corG.position(50, 387);
  corB = createSlider(0, 255, 0);
  corB.position(50, 412);

  text("Percepção para alimentos:", 45, 450);
  var prcpAlimento = createInput(0,"number");
  prcpAlimento.style("width", "220px");
  prcpAlimento.position(50, 465);

  text("Percepção para perigo:", 45, 500);
  var prcpPerigo = createInput(0,"number");
  prcpPerigo.style("width", "220px");
  prcpPerigo.position(50, 515);

  var botaoAdcCrt = createButton('Adicionar Criatura');
  botaoAdcCrt.position(50, 550);
  botaoAdcCrt.mousePressed(adicionarCriatura);

  function adicionarCriatura() {
    var somatorio1 = parseInt(vida.value()) + parseInt(fome.value()) + parseInt(velocidade.value()) + parseInt(resistencia.value());
    var somatorio2 = parseInt(prcpAlimento.value()) + parseInt(prcpPerigo.value());

    if (nome.value() == "" || tipo.value() == "" || vida.value() == "" || fome.value() == "" ||
        velocidade.value() == "" || resistencia.value() == "" || prcpAlimento.value() == "" ||
        prcpPerigo.value() == ""){
      alert("Preencha todos os campos!")
      return false;
    } else if (somatorio1 != 10){
      alert("Você deve distribuir 10 pontos em Vida, Fome, Velocidade e Resistência.")
      return false;
    } else if (somatorio2 != 180){
      alert("Você deve distribuir 180 pontos nas Percepções de alimentos e perigos.")
      return false;
    }
    alert("Criatura adicionada! Continue adicionado ou aperte em Iniciar Jogo.")
    tipoCriaturas.push([nome.value(), tipo.value(), vida.value(), fome.value(), velocidade.value(),
                        resistencia.value(), color(corR.value(), corG.value(), corB.value()),
                        prcpAlimento.value(), prcpPerigo.value()]);
    nome.value("");
    tipo.value(false);
    vida.value("");
    fome.value("");
    velocidade.value("");
    resistencia.value("");
    corR.value(0);
    corG.value(0);
    corB.value(0);
    prcpAlimento.value("");
    prcpPerigo.value("");
  }

  var botaoIniciar = createButton('Iniciar Jogo');
  botaoIniciar.position(50, 700);
  botaoIniciar.mousePressed(carregarDados);

  function carregarDados(){
    if (tipoCriaturas.length <= 0){
      alert("Adicione algumas criaturas para poder iniciar o jogo.")
      return false;
    }
    // cria as criaturas pré-definidas
    for (var i = 0; i < tipoCriaturas.length; i++){
      for (var j = 0; j < 6; j++){
        var x = random(xGame);
        var y = random(yGame);
        var criatura = new Criatura(x, y, tipoCriaturas[i]);
        criaturas.push(criatura);
      }
    }
    // cria tipos de alimentos diferentes
    for (var i = 0; i < 12; i++){
      var t = i%3;
      var v = random(-0.5, 0.5);
      var f = random(0.5, 1.5);
      var c = color(random(255), random(255), random(255));
      tipoAlimentos[i] = [t, v, f, c];
    }
    // cria alimentos usando os tipos pré-criados
    for (var i = 0; i < countAlimentos; i++){
      var x = random(xGame);
      var y = random(yGame);
      var r = round(random(tipoAlimentos.length - 1));
      alimentos.push(new Alimento(x, y, tipoAlimentos[r]));
    }
    // remove elementos de entrada de dado
    nome.remove();
    tipo.remove();
    vida.remove();
    fome.remove();
    velocidade.remove();
    resistencia.remove();
    corR.remove();
    corG.remove();
    corB.remove();
    prcpAlimento.remove();
    prcpPerigo.remove();
    botaoAdcCrt.remove();
    botaoIniciar.remove();
    menu = 1;
  }
}

function draw(){
  // menu principal de entrada de dados
  if (menu == 0){
    col = color(corR.value(), corG.value(), corB.value());
    fill(col);
    rect(195,362,58,58);
  // interface do jogo
  } else if (menu == 1){
    background(15);
    // gera novas comidas se tiver menos de 30 comidas no canvas
    if (alimentos.length < countAlimentos){
      if (random(1) < 0.1) {
        var x = random(xGame);
        var y = random(yGame);
        var r = round(random(tipoAlimentos.length - 1));
        alimentos.push(new Alimento(x, y, tipoAlimentos[r]));
      }
    }
    for (var i = 0; i < criaturas.length; i++){
      var crtr = criaturas[i];
      crtr.comportamentos(alimentos, criaturas);
      crtr.update();
      crtr.show();
      if (crtr.morreu()){
        criaturas.splice(i, 1);
        var r = round(random(tipoAlimentos.length - 1));
        alimentos.push(new Alimento(crtr.posicao.x, crtr.posicao.y, tipoAlimentos[r]));
      }
    }
    for (var i = 0; i < alimentos.length; i++){
      var almt = alimentos[i];
      almt.show();
    }
  }
}
