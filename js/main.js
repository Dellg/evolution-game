var xGame = window.innerWidth-20;
var yGame = window.innerHeight-20;
var menu = 0;
var criatura = null;
var levelnum = 1;
var level = null;
var imagens = [];
var debug = true;

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

  text("Pata:", 45, 150);
  pata = createRadio();
  pata.style("color", "#FFFFFF");
  pata.style("font-family", "Times New Roman");
  pata.style("font-size", "10pt");
  pata.option('Casco',0);
  pata.option('Garra',1);
  pata.option('Mão',2);
  pata.value(0);
  pata.position(50, 165);

  text("Tamanho:", 45, 200);
  tamanho = createRadio();
  tamanho.style("color", "#FFFFFF");
  tamanho.style("font-family", "Times New Roman");
  tamanho.style("font-size", "10pt");
  tamanho.option('Grande',0);
  tamanho.option('Pequeno',1);
  tamanho.option('Médio',2);
  tamanho.value(0);
  tamanho.position(50, 215);

  text("Característica especial:", 45, 250);
  caract = createRadio();
  caract.style("color", "#FFFFFF");
  caract.style("font-family", "Times New Roman");
  caract.style("font-size", "10pt");
  caract.option('Chifre',0);
  caract.option('Orelhas grandes',1);
  caract.option('Duas caudas',2);
  caract.option('Escala Árvores',3);
  caract.option('Peçonha',4);
  caract.option('Carapaça',5);
  caract.option('Pele Camufla',6);
  caract.option('Asas',7);
  caract.option('Espinhos',8);
  caract.value(0);
  caract.position(50, 265);

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
    if (nome.value() == ""){
      alert("Você deve dar um nome a sua criatura!");
      return false;
    }
    // valores padrão
    vida = 2;
    fome = 0;
    velocidade = 1;
    resistencia = 1;
    infor = [];
    infor.push(nome.value());

    // valores adicionais do tipo de pata
    switch (pata.value()) {
      case "0":
        velocidade += 0.3;
        resistencia += 0.1;
        fome -= 0.5;
        infor.push("Casco");
        break;
      case "1":
        velocidade += 0.1;
        resistencia += 0.5;
        fome += 4.5;
        infor.push("Garra");
        break;
      case "2":
        velocidade -= 0.1;
        resistencia += 0.2;
        fome += 0.5;
        infor.push("Mão");
        break;
    }
    // valores adicionais do tamanho
    switch (tamanho.value()) {
      case "0":
        velocidade -= 0.2;
        resistencia += 0.3;
        fome += 3;
        infor.push("Grande");
        break;
      case "1":
        velocidade += 0.2;
        resistencia += 0.2;
        fome += 1.5;
        infor.push("Pequeno");
        break;
      case "2":
        resistencia += 0.2;
        fome += 2;
        infor.push("Médio");
        break;
    }
    // valores adicionais da característica especial
    switch (caract.value()) {
      case "0":
        resistencia += 0.5;
        fome -= 1;
        infor.push("Chifre");
        break;
      case "1":
        velocidade -= 0.1;
        resistencia += 0.6;
        fome += 1;
        infor.push("Orelhas grandes");
        break;
      case "2":
        velocidade += 0.2;
        resistencia += 0.1;
        fome += 0.5;
        infor.push("Duas caudas");
        break;
      case "3":
        velocidade += 0.1;
        resistencia += 0.3;
        fome += 1;
        infor.push("Escala Árvores");
        break;
      case "4":
        velocidade += 0.1;
        resistencia += 0.1;
        fome += 2;
        infor.push("Peçonha");
        break;
      case "5":
        velocidade -= 0.2;
        resistencia += 0.8;
        fome -= 1.5;
        infor.push("Carapaça");
        break;
      case "6":
        resistencia += 0.4;
        fome += 3;
        infor.push("Pele Camufla");
        break;
      case "7":
        velocidade += 0.1;
        resistencia += 0.4;
        fome += 2;
        infor.push("Asas");
        break;
      case "8":
        velocidade += 0.1;
        resistencia += 0.4;
        fome += 2;
        infor.push("Espinhos");
        break;
    }

    alert("A criatura " + nome.value() + " foi criada com sucesso!")
    cor = color(random(255), random(255), random(255));
    console.log("vida: " + vida);
    console.log("fome: " + fome);
    console.log("vlcd: " + velocidade);
    console.log("rsts: " + resistencia);
    this.criatura = [infor, tipo.value(), vida, fome, velocidade, resistencia, cor];
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
    pata.remove();
    tamanho.remove();
    caract.remove();
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
    fill(255);
    if (debug){
      text("Alimentos:", 10, 60);
      text("- com cor em tom de verde/verde-limão são plantas;", 10, 80);
      text("- com cor em tom de vermelho/laranja são insetos;", 10, 100);
      text("- com cor em tom de azul/roxo são comidas tóxicas;", 10, 120);
      text("- com cor branca são carnes de animais mortos.", 10, 140);
      text("Criaturas:", 10, 170);
      text("- com formato de losango são herbívoros;", 10, 190);
      text("- com formato de triângulo são onívoros;", 10, 210);
      text("- com formato de seta são carnívoros.", 10, 230);
      text("Aura das criaturas:", 10, 260);
      text("- verde é a área de percepção para plantas;", 10, 280);
      text("- vermelho é a área de percepção para insetos;", 10, 300);
      text("- azul é a área de percepção para venenos;", 10, 320);
      text("- amarelo é a área de percepção para predadores/presas.", 10, 340);
      text("- branco é a área de percepção para carnes.", 10, 360);
      text("Linhas que saem pela frente e por trás das criaturas são forças de atração e repulsão, respectivamente:", 10, 390);
      text("- verde é a força de atração/repulsão por plantas;", 10, 410);
      text("- vermelho é a força de atração/repulsão por insetos;", 10, 430);
      text("- azul é a força de atração/repulsão por venenos;", 10, 450);
      text("- amarelo é a força de atração/repulsão por predadores/presas.", 10, 470);
      text("- branco é a força de atração/repulsão por carnes.", 10, 490);
    }
  }
}

//______________________________________________________________________________
// método que ativa o modo debug com o botão do mouse
//______________________________________________________________________________
function mousePressed(){
  if (menu == 1)
    debug = !debug;
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
