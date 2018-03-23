var xGame = window.innerWidth-20;
var yGame = window.innerHeight-20;
var menu = 0;
// -1 = video da intro
// 0 = menu principal
// 1 = levels
// 2 = fim do jogo
var criatura = null;
var pontuacao = 0; // pontuação do jogador, contará como "moeda" do jogo
var tempoJogo = 0; // quantidade de anos que se passaram
var levelnum = 1;
var level = null;
var imagens = [];
var criaturasSalvas = [];

//______________________________________________________________________________
// carregando imagens no projeto
//______________________________________________________________________________
function preload(){
  imagens.push(loadImage('https://i.imgur.com/qNy2Os7.png')); //Nalulóbulis
  imagens.push(loadImage('https://i.imgur.com/5RFi96h.png')); //Kunglob
  imagens.push(loadImage('https://i.imgur.com/uOG6hKE.png')); //Cacoglobius
}

//______________________________________________________________________________
// preparação do jogo e recebimento de dados do usuário
//______________________________________________________________________________
function setup(){
  createCanvas(xGame, yGame);
  background(15);
  fill(255);

  // informações do Level 1
  textFont("Times New Roman", 32);
  text("Escolha uma das criaturas existentes e modifique-a ao longo do jogo:", 60, 60);

  tipo = createRadio();
  tipo.style("color", "#FFFFFF");
  tipo.style("font-family", "Times New Roman");
  tipo.style("font-size", "10pt");
  tipo.option('Herbívoro',0);
  tipo.option('Carnívoro',1);
  tipo.option('Onívoro',2);
  tipo.value(0);
  tipo.position(50, 115);

  textFont("Times New Roman", 16);
  text("Nomeie a sua criatura:", 45, 300);
  nome = createInput();
  nome.style("width", "220px");
  nome.position(50, 315);

  botaoAdcCrt = createButton('Iniciar Jogo');
  botaoAdcCrt.position(50, 360);
  botaoAdcCrt.mousePressed(adicionarCriatura);

  botaoNoPlayer = createButton('Testar Sem Jogador (opção de desenvolvedor)');
  botaoNoPlayer.position(50, 450);
  botaoNoPlayer.mousePressed(testar);

  // informações do pré-Level 2
  caract = createRadio();
  caract.style("color", "#FFFFFF");
  caract.style("font-family", "Times New Roman");
  caract.style("font-size", "10pt");
  caract.option('Chifres',0);
  caract.option('Orelhas Grandes',1);
  caract.option('Duas Caudas',2);
  caract.option('Escalar Árvores',3);
  caract.option('Peçonha',4);
  caract.option('Carapaça',5);
  caract.option('Asas',6);
  caract.option('Espinhos',7);
  caract.value(0);
  caract.position(50, 145);
  caract.hide();

  botaoConfirmar = createButton('Confirmar');
  botaoConfirmar.position(50, 360);
  botaoConfirmar.mousePressed(confirmarNovaCaracteristica);
  botaoConfirmar.hide();

  //______________________________________________________________________________
  // iniciar um jogo apenas com as criaturas pré-definidas do level
  //______________________________________________________________________________
  function testar() {
    level = new Level(null);
    limparCampos();
  }

  //______________________________________________________________________________
  // iniciar um jogo apenas com as criaturas pré-definidas do level
  //______________________________________________________________________________
  function confirmarNovaCaracteristica() {
    levelnum = 2;
    alert("Iniciando capítulo 2... (ainda será implementado)")
  }

  //______________________________________________________________________________
  // adicionar uma criatura definida pelo usuário
  //______________________________________________________________________________
  function adicionarCriatura() {
    if (nome.value() == ""){
      alert("Você deve dar um nome a sua criatura!");
      return false;
    }

    var vida = 2, fome, velocidade, resistencia, aparencia;
    var infor = [];
    infor.push(nome.value());

    switch (tipo.value()){
      // herbívoro
      case "0":
        fome = 1.5;
        velocidade = 1;
        resistencia = 1.5;
        infor.push("Casco");
        infor.push("Grande");
        infor.push("Chifre");
        aparencia = imagens[0];
        break;
      // carnívoro
      case "1":
        fome = 6;
        velocidade = 1.25;
        resistencia = 2.5;
        infor.push("Garra");
        infor.push("Pequeno");
        infor.push("Orelhas grandes");
        aparencia = imagens[1];
        break;
      // onívoro
      case "2":
        fome = 3;
        velocidade = 1.1;
        resistencia = 1.9;
        infor.push("Mão");
        infor.push("Médio");
        infor.push("Duas caudas");
        aparencia = imagens[2];
        break;
    }

    alert("A criatura " + nome.value() + " foi criada com sucesso!")
    this.criatura = [infor, tipo.value(), vida, fome, velocidade, resistencia, aparencia];
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
    botaoAdcCrt.remove();
    botaoNoPlayer.remove();
    menu = 1;
  }
}

//______________________________________________________________________________
// onde o jogo acontece, de fato
//______________________________________________________________________________
function draw(){
  if (menu == -1){ // intro

  } else if (menu == 0){ // principal
    rect(70,140,34,34);
    fill(15);
    noStroke();
    rect(300,130,800,100);
    fill(255);
    if (tipo.value() == 0){
      img = imagens[0].get(32, 64, 32, 32);
      text("Os herbívoros se alimentam de plantas, eles possuem baixa velocidade devido ao seu tamanho, se", 330, 150);
      text("alimentam com mais frequência, possuem um chifre que usam apenas para intimidar alguns predadores.", 330, 165);
      text("Herbívoros tem uma alta taxa de reprodução.", 330, 180);
    } else if (tipo.value() == 1){
      img = imagens[1].get(32, 64, 32, 32);
      text("Os carnívoros se alimentam de outras criaturas ou de carnes, são pequenos e, por isso, são velozes,", 330, 150);
      text("possuem orelhas grandes para ficar atentos às presas. Eles saciam sua fome muito rápido, precisando", 330, 165);
      text("se alimentar poucas vezes. Carnívoros tem uma baixa taxa de reprodução.", 330, 180);
    } else if (tipo.value() == 2){
      text("Os onívoros se alimentam de plantas e alguns insetos, tem uma velocidade média devido ao seu tamanho,", 330, 150);
      text("possuem duas caudas que ajudam na sua locomoção. Se alimentam com uma frequência regular.", 330, 165);
      text("Onívoros tem uma taxa de reprodução balanceada.", 330, 180);
      img = imagens[2].get(32, 64, 32, 32);
    }
    image(img, 72, 142);
  } else if (menu == 1){ // levels
    if (levelnum == 1){
      level.rodar();
      fill(255);
      text("Pontos de Modificação: " + pontuacao, 10, 20);
      text(parseInt(tempoJogo) + " anos", 10, 40);

    } else if (levelnum == 1.5){ // escolha de novas características .hide() e .show()
      fill(15);
      noStroke();
      rect(30,90,800,100);
      fill(255);
      textFont("Times New Roman", 32);
      text("Escolha uma nova característica para fortificar sua criatura:", 60, 120);
      caract.show();
      botaoConfirmar.show();

    } else if (levelnum == 2){

    }
  } else if (menu == 2){ // fim do jogo

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
