var xGame = window.innerWidth-20;
var yGame = window.innerHeight-20;
var menu = 0;
var criatura = null;
var levelnum = 1;
var level = null;
var imagens = [];

//______________________________________________________________________________
// carregando imagens no projeto
//______________________________________________________________________________
function preload(){
  // imagens.push(loadImage("img/nalulobulis.png"));
  // imagens.push(loadImage("img/kunglob.png"));
  // imagens.push(loadImage("img/cacoglobius.png"));
}

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
  tipo = createRadio();
  tipo.style("color", "#FFFFFF");
  tipo.style("font-family", "Times New Roman");
  tipo.style("font-size", "10pt");
  tipo.option('Herbívoro',0);
  tipo.option('Carnívoro',1);
  tipo.option('Onívoro',2);
  tipo.value(0);
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
  hueColor = createSlider(0, 255, 0);
  hueColor.position(50, 362);

  var botaoNoPlayer = createButton('Testar Sem Jogador');
  botaoNoPlayer.position(50, 450);
  botaoNoPlayer.mousePressed(testar);

  var botaoAdcCrt = createButton('Adicionar Criatura');
  botaoAdcCrt.position(50, 550);
  botaoAdcCrt.mousePressed(adicionarCriatura);

  //______________________________________________________________________________
  // adicionar uma criatura definida pelo usuário
  //______________________________________________________________________________
  function testar() {
    level = new Level(null);
    limparCampos();
  }

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
                        resistencia.value(), color(random(255), random(255), random(255))];
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
    hueColor.remove();
    botaoAdcCrt.remove();
    botaoNoPlayer.remove();
    menu = 1;
  }
}

//______________________________________________________________________________
// onde o jogo acontece, de fato
//______________________________________________________________________________
function draw(){
  if (menu == 0){
    fill(0);
    rect(195,362,34,34);
    // if (tipo.value() == 0){
    //   img = imagens[0].get(32, 64, 32, 32);
    // } else if (tipo.value() == 1){
    //   img = imagens[1].get(32, 64, 32, 32);
    // } else if (tipo.value() == 2){
    //   img = imagens[2].get(32, 64, 32, 32);
    // }
    // image(img, 196, 363);
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
