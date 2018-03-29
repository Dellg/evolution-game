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
  link = 'https://raw.githubusercontent.com/Dellg/evolution-game/master/img/';
  // imagens padrão
  imagens.push(loadImage(link + 'nalulobulis/n-chifres.png')); //Nalulóbulis
  imagens.push(loadImage(link + 'kunglob/k-orelhasgrandes.png')); //Kunglob
  imagens.push(loadImage(link + 'cacoglobius/c-duascaudas.png')); //Cacoglobius
  // imagens com mutação
  imagens.push(loadImage(link + 'nalulobulis/n-orelhasgrandes.png'));
  imagens.push(loadImage(link + 'kunglob/k-chifres.png'));
  imagens.push(loadImage(link + 'cacoglobius/c-chifres.png'));
  imagens.push(loadImage(link + 'nalulobulis/n-duascaudas.png'));
  imagens.push(loadImage(link + 'kunglob/k-duascaudas.png'));
  imagens.push(loadImage(link + 'cacoglobius/c-orelhasgrandes.png'));
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
  nome.value("Criatura");
  nome.position(50, 315);

  botaoAdcCrt = createButton('Iniciar Jogo');
  botaoAdcCrt.position(50, 360);
  botaoAdcCrt.mousePressed(adicionarCriatura);

  // informações do pré-Level 2
  caract = createRadio();
  caract.style("color", "#FFFFFF");
  caract.style("font-family", "Times New Roman");
  caract.style("font-size", "10pt");
  caract.option('Chifres (150 pontos de modificação)----------',0);
  caract.option('Orelhas Grandes (100 pontos de modificação)',1);
  caract.option('Duas Caudas (150 pontos de modificação)---',2);
  caract.option('Escalar Árvores (100 pontos de modificação)',3);
  caract.option('Peçonha (150 pontos de modificação)----------',4);
  caract.option('Carapaça (100 pontos de modificação)---------',5);
  caract.option('Asas (150 pontos de modificação)---------------',6);
  caract.option('Espinhos (85 pontos de modificação)----------',7);
  caract.option('Nada',8);
  caract.value(0);
  caract.position(50, 145);
  caract.style('width', '280px');
  caract.hide();

  botaoConfirmar = createButton('Confirmar');
  botaoConfirmar.position(50, 360);
  botaoConfirmar.mousePressed(confirmarNovaCaracteristica);
  botaoConfirmar.hide();

  //______________________________________________________________________________
  // iniciar um jogo apenas com as criaturas pré-definidas do level
  //______________________________________________________________________________
  function confirmarNovaCaracteristica() {
    if (criatura[1] == caract.value()){
      alert("Você já possui essa melhoria, escolha outra!");
      return false;
    }

    // dá a pontuação apropriada dependendo do upgrade
    switch (caract.value()) {
      case "0":
        if (pontuacao >= 150){
          criaturasSalvas[0][0].push("Chifres");
          criaturasSalvas[0][5] += 0.25;
          criaturasSalvas[0][4] -= 0.25;
          if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[4];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[5];
          }
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case "1":
        if (pontuacao >= 100){
          criaturasSalvas[0][0].push("Orelhas Grandes");
          criaturasSalvas[0][4] += 0.25;
          criaturasSalvas[0][5] -= 0.25;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[3];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[8];
          }
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case "2":
        if (pontuacao >= 150){
          criaturasSalvas[0][0].push("Duas Caudas");
          criaturasSalvas[0][3] -= 0.3;
          criaturasSalvas[0][5] -= 0.25;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[6];
          } else if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[7];
          }
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case "3":
        if (pontuacao >= 100){
          criaturasSalvas[0][0].push("Escalar Árvores");
          criaturasSalvas[0][4] += 0.25;
          criaturasSalvas[0][3] += 0.3;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case "4":
        if (pontuacao >= 150){
          criaturasSalvas[0][0].push("Peçonha");
          criaturasSalvas[0][3] -= 0.3;
          criaturasSalvas[0][4] -= 0.25;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case "5":
        if (pontuacao >= 100){
          criaturasSalvas[0][0].push("Carapaça");
          criaturasSalvas[0][5] += 0.33;
          criaturasSalvas[0][4] -= 0.33;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case "6":
        if (pontuacao >= 150){
          criaturasSalvas[0][0].push("Asas");
          criaturasSalvas[0][3] += 0.3;
          criaturasSalvas[0][4] += 0.25;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case "7":
        if (pontuacao >= 85){
          criaturasSalvas[0][0].push("Espinhos");
          criaturasSalvas[0][3] += 0.3;
          criaturasSalvas[0][5] += 0.25;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case "8":
        break;
    }
    caract.remove();
    botaoConfirmar.remove();
    levelnum = 2;
    level = new Level2(criaturasSalvas);
    alert("Iniciando capítulo 2... (ainda será implementado)");
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
    criatura = [infor, tipo.value(), vida, fome, velocidade, resistencia, aparencia];
    level = new Level(criatura);
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
      rect(350,130,800,100);
      fill(255);
      textFont("Times New Roman", 32);
      text("Escolha uma nova característica para fortificar sua criatura:", 60, 120);
      textFont("Times New Roman", 16);
      switch (caract.value()) {
        case "0":
          text("Adiciona chifres na sua criatura.", 380, 150);
          text("Vantagem: +Resistência", 380, 165);
          text("Desvantagem: -Velocidade", 380, 180);
          break;
        case "1":
          text("Adiciona orelhas grandes na sua criatura.", 380, 150);
          text("Vantagem: +Velocidade", 380, 165);
          text("Desvantagem: -Resistência", 380, 180);
          break;
        case "2":
          text("Adiciona duas caudas na sua criatura.", 380, 150);
          text("Vantagem: -Fome", 380, 165);
          text("Desvantagem: -Resistência", 380, 180);
          break;
        case "3":
          text("Adiciona pés que possibilitam escalar árvores na sua criatura.", 380, 150);
          text("Vantagem: +Velocidade", 380, 165);
          text("Desvantagem: +Fome", 380, 180);
          break;
        case "4":
          text("Adiciona peçonha na sua criatura.", 380, 150);
          text("Vantagem: -Fome", 380, 165);
          text("Desvantagem: -Velocidade", 380, 180);
          break;
        case "5":
          text("Adiciona uma carapaça na sua criatura.", 380, 150);
          text("Vantagem: ++Resistência", 380, 165);
          text("Desvantagem: --Velocidade", 380, 180);
          break;
        case "6":
          text("Adiciona asas na sua criatura.", 380, 150);
          text("Vantagem: +Velocidade", 380, 165);
          text("Desvantagem: +Fome", 380, 180);
          break;
        case "7":
          text("Adiciona espinhos na sua criatura.", 380, 150);
          text("Vantagem: +Resistência", 380, 165);
          text("Desvantagem: +Fome", 380, 180);
          break;
        case "8":
          text("Não adiciona nada na sua criatura.", 380, 150);
          text("Vantagem: nenhuma", 380, 165);
          text("Desvantagem: nenhuma", 380, 180);
          break;
      }
      caract.show();
      botaoConfirmar.show();

    } else if (levelnum == 2){
      level.rodar();
      fill(255);
      textFont("Times New Roman", 16);
      text("Pontos de Modificação: " + pontuacao, 10, 20);
      text(parseInt(tempoJogo) + " anos", 10, 40);

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
