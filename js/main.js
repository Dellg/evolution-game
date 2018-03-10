var xGame = window.innerWidth-20;
var yGame = window.innerHeight-20;
var menu = 0;
// -4 = video da intro
// -3 = loja
// -2 = dados
// 0 = menu principal
// 1 = levels
// 2 = minigame reprodução
// 3 = minigame arena
// 4 = minigame roleta
var criatura = null;
var pontuacao = 0; // pontuação do jogador, contará como "moeda" do jogo
var levelnum = 1;
var level = null;
var imagens = [];
var debug = true;

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
  var nome = createInput();
  nome.style("width", "220px");
  nome.position(50, 315);

  var botaoAdcCrt = createButton('Iniciar Jogo');
  botaoAdcCrt.position(50, 360);
  botaoAdcCrt.mousePressed(adicionarCriatura);

  var botaoNoPlayer = createButton('Testar Sem Jogador (opção de desenvolvedor)');
  botaoNoPlayer.position(50, 450);
  botaoNoPlayer.mousePressed(testar);

  //______________________________________________________________________________
  // iniciar um jogo apenas com as criaturas pré-definidas do level
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
  if (menu == -4){ // intro

  } else if (menu == -3){ // loja

  } else if (menu == -2){ // dado

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
    } else if (levelnum == 2){

    }
  } else if (menu == 2){ // minigame reprodução
    //O primeiro minigame se chama "reprodução sexuada" nele o bixin vai aprender a fazer a dança do acasalamento pra atrair macho, ou femea dependendo do sexo (por isso q eu perguntei se tinha como colocar)... aí podia fazer aquelas coisinha de repetir sequencia, sabe? vai uma sequencia, aí vc repete, na proxima a sequencia ja aumenta, e vc repete... aí faz uma dancinha engraçadinha qualquer...
  } else if (menu == 3){ // minigame arena
    //tipo, dois macaco contra dois bode.. um macaco ataca, outro macaco foge.. um bode ataca, outro bode foge.. o macaco q ataca tem q matar o bode q foge.. antes q o bode q ataca mate o macaco q foge..
  } else if (menu == 4){ // minigame roleta sorte
    //o último é uma roleta da sorte, de 4 partes, uma parte ganha poucos pontos, outra ganha mais pontos, e outra ainda mais pontos, outra ganha nada...
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
