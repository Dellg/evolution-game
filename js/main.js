var xGame = window.innerWidth-20;
var yGame = window.innerHeight-20;
var menu = 0;
var criatura = null;
var level = null;

//______________________________________________________________________________
// preparação do jogo e recebimento de dados do usuário
//______________________________________________________________________________
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

  var botaoAdcCrt = createButton('Adicionar Criatura');
  botaoAdcCrt.position(50, 550);
  botaoAdcCrt.mousePressed(adicionarCriatura);

  //______________________________________________________________________________
  // adicionar uma criatura definida pelo usuário
  //______________________________________________________________________________
  function adicionarCriatura() {
    var somatorio = parseInt(vida.value()) + parseInt(fome.value()) + parseInt(velocidade.value()) + parseInt(resistencia.value());

    if (nome.value() == "" || tipo.value() == "" || vida.value() == "" || fome.value() == "" ||
        velocidade.value() == "" || resistencia.value() == ""){
      alert("Preencha todos os campos!")
      return false;
    } else if (somatorio != 10){
      alert("Você deve distribuir 10 pontos em Vida, Fome, Velocidade e Resistência.")
      return false;
    }
    alert("Criatura adicionada! Continue adicionado ou aperte em Iniciar Jogo.")
    this.criatura = [nome.value(), tipo.value(), vida.value(), fome.value(), velocidade.value(),
                        resistencia.value(), color(corR.value(), corG.value(), corB.value())];
    level = new Level(this.criatura);
    limparCampos();
  }

  //______________________________________________________________________________
  // limpar os campos de entrada de dados
  //______________________________________________________________________________
  function limparCampos(){
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
    botaoAdcCrt.remove();
    menu = 1;
  }
}

//______________________________________________________________________________
// onde o jogo acontece, de fato
//______________________________________________________________________________
function draw(){
  if (menu == 0){
    col = color(corR.value(), corG.value(), corB.value());
    fill(col);
    rect(195,362,58,58);
  // interface do jogo
  } else if (menu == 1){
    level.rodar();
  }
}

//______________________________________________________________________________
// método para verificar se um array contém um objeto
//______________________________________________________________________________
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i].codigo === obj.codigo)
            return true;
    }
    return false;
}
