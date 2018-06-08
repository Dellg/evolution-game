var xGame = 1045;
var yGame = 760;
var menu = -1
var criatura = null;
var pontuacao = 0; // pontuação do jogador, contará como "moeda" do jogo
var tempoJogo = 0; // quantidade de anos que se passaram
var levelnum = 1;
var level = null;
var imagens = [];
var criaturasSalvas = [];
var criaturaFutura = null;
var humanoImagem = [];
var menusImagens = [];
var fossilImagens = [];
var levelImagens = [];
var introImagens = [];
var zeramentoImagens = [];
var nomeJogador;
var musicas = [];
var particulas = [];
var quantidadeObjetos = 124; // imagens e sons
var contadorObjetos = 0; // para gerenciar o loading
var carregando = true;
var link = 'https://raw.githubusercontent.com/Dellg/evolution-game/master/';
var upgradeSelecionado = 0;
var imagemAtual = 0;
var tempoImagem = 0;
var volumeSlider;
var frameHistoria = 0;
var fonte;
var aparenciaFutura;
var tempoTexto = 0;
var indexTexto = 0;
var flagTexto = false;

//______________________________________________________________________________
// carregando imagens no projeto
//______________________________________________________________________________
function preload(){
  // carregando imagem inicial
  fonte = loadFont(link + 'lib/LithosPro.otf');
  menusImagens.push(loadImage(link + 'img/menus/carregando.png'));
}

// funções que carregam os objetos do jogo
function carregaArquivo(vetor, tipo, id, arquivo){
  if (tipo == 0){
    loadImage(arquivo, imageLoaded);
    function imageLoaded(image){
      vetor[id] = image;
      contadorObjetos++;
      if (contadorObjetos == quantidadeObjetos){
        botaoCrdts.show();
        volumeSlider.show();
        nomeJog.show();
        botaoIniciar.show();
        musicas[0].loop();
        carregando = false;
      }
    }
  } else {
    loadSound(arquivo, soundLoaded);
    function soundLoaded(sound){
      vetor[id] = sound;
      contadorObjetos++;
      if (contadorObjetos == quantidadeObjetos){
        botaoCrdts.show();
        volumeSlider.show();
        nomeJog.show();
        botaoIniciar.show();
        musicas[0].loop();
        carregando = false;
      }
    }
  }
}

//______________________________________________________________________________
// preparação do jogo e recebimento de dados do usuário
//______________________________________________________________________________
function setup(){
  var tamanhoDna = 50;
  for (var i = 0; i < tamanhoDna; i++){
    alphaDna = i - floor(tamanhoDna/2);
    x = xGame/2 + (20 * alphaDna);
    y = yGame/2 + sin(contador + (0.25 * alphaDna));
    particulas.push(new Particula(x, y, 0, i));
  }
  for (var i = 0; i < tamanhoDna; i++){
    alphaDna = i - floor(tamanhoDna/2);
    x = xGame/2 + (20 * alphaDna);
    y = yGame/2 + sin(contador + (0.25 * alphaDna));
    particulas.push(new Particula(x, y, 1, i));
  }
  createCanvas(xGame, yGame);

  // créditos para as músicas
  botaoCrdts = createButton('Woodland Tales - por Adrian von Ziegler');
  botaoCrdts.style('font-family', 'Lithos Pro');
  botaoCrdts.style('font-weight', 'bold');
  botaoCrdts.style('color', 'white');
  botaoCrdts.id('botaoMusica');
  botaoCrdts.position(30, yGame - 30);
  botaoCrdts.mousePressed(redireciona);
  botaoCrdts.hide();

  volumeSlider = createSlider(0, 100, 100);
  volumeSlider.id('sliderVolume');
  volumeSlider.elt.textContent = 'Teste';
  volumeSlider.position(29, yGame - 65);
  volumeSlider.hide();
  volumeSlider.mouseMoved(mudouVolume);

  // função que controla o volume das músicas
  function mudouVolume(){
    if (musicas.length == 9){
      for (var i = 0; i < musicas.length; i++){
        if (musicas[i] != undefined){
          musicas[i].setVolume(volumeSlider.value()/100);
        }
      }
    }
  }

  // informações do menu principal
  nomeJog = createInput();
  nomeJog.id('nome');
  nomeJog.value("Jogador");
  nomeJog.position(296, 490);
  nomeJog.size(186, 50);
  nomeJog.hide();

  botaoIniciar = createButton('');
  botaoIniciar.id('botaoIniciar');
  botaoIniciar.position(196, 627);
  botaoIniciar.size(210, 50);
  botaoIniciar.mousePressed(passouMenuPrincipal);
  botaoIniciar.hide();

  // imagens padrão
  carregaArquivo(imagens, 0, 0, link + 'img/nalulobulis/n-chifres.png'); //Nalulóbulis
  carregaArquivo(imagens, 0, 1, link + 'img/kunglob/k-orelhasgrandes.png'); //Kunglob
  carregaArquivo(imagens, 0, 2, link + 'img/cacoglobius/c-duascaudas.png'); //Cacoglobius
  // imagens com mutação
  carregaArquivo(imagens, 0, 3, link + 'img/nalulobulis/n-orelhasgrandes.png');
  carregaArquivo(imagens, 0, 4, link + 'img/kunglob/k-chifres.png');
  carregaArquivo(imagens, 0, 5, link + 'img/cacoglobius/c-chifres.png');
  carregaArquivo(imagens, 0, 6, link + 'img/nalulobulis/n-duascaudas.png');
  carregaArquivo(imagens, 0, 7, link + 'img/kunglob/k-duascaudas.png');
  carregaArquivo(imagens, 0, 8, link + 'img/cacoglobius/c-orelhasgrandes.png');
  carregaArquivo(imagens, 0, 9, link + 'img/nalulobulis/n-escalador.png');
  carregaArquivo(imagens, 0, 10, link + 'img/kunglob/k-escalador.png');
  carregaArquivo(imagens, 0, 11, link + 'img/cacoglobius/c-escalador.png');
  carregaArquivo(imagens, 0, 12, link + 'img/nalulobulis/n-peconha.png');
  carregaArquivo(imagens, 0, 13, link + 'img/kunglob/k-peconha.png');
  carregaArquivo(imagens, 0, 14, link + 'img/cacoglobius/c-peconha.png');
  carregaArquivo(imagens, 0, 15, link + 'img/nalulobulis/n-carapaca.png');
  carregaArquivo(imagens, 0, 16, link + 'img/kunglob/k-carapaca.png');
  carregaArquivo(imagens, 0, 17, link + 'img/cacoglobius/c-carapaca.png');
  carregaArquivo(imagens, 0, 18, link + 'img/nalulobulis/n-asas.png');
  carregaArquivo(imagens, 0, 19, link + 'img/kunglob/k-asas.png');
  carregaArquivo(imagens, 0, 20, link + 'img/cacoglobius/c-asas.png');
  carregaArquivo(imagens, 0, 21, link + 'img/nalulobulis/n-espinhos.png');
  carregaArquivo(imagens, 0, 22, link + 'img/kunglob/k-espinhos.png');
  carregaArquivo(imagens, 0, 23, link + 'img/cacoglobius/c-espinhos.png');
  // imagens com novas mutações para o level 4
  carregaArquivo(imagens, 0, 24, link + 'img/nalulobulis/n-novaevolucao.png'); // id 24
  carregaArquivo(imagens, 0, 25, link + 'img/kunglob/k-novaevolucao.png');     // id 25
  carregaArquivo(imagens, 0, 26, link + 'img/cacoglobius/c-novaevolucao.png'); // id 26
  // imagens para o minigame da dança do acasalamento
  carregaArquivo(imagens, 0, 27, link + 'img/nalulobulis/n-idle.png');
  carregaArquivo(imagens, 0, 28, link + 'img/nalulobulis/n-right.png');
  carregaArquivo(imagens, 0, 29, link + 'img/nalulobulis/n-down.png');
  carregaArquivo(imagens, 0, 30, link + 'img/nalulobulis/n-left.png');
  carregaArquivo(imagens, 0, 31, link + 'img/nalulobulis/n-up.png');
  carregaArquivo(imagens, 0, 32, link + 'img/kunglob/k-idle.png');
  carregaArquivo(imagens, 0, 33, link + 'img/kunglob/k-right.png');
  carregaArquivo(imagens, 0, 34, link + 'img/kunglob/k-down.png');
  carregaArquivo(imagens, 0, 35, link + 'img/kunglob/k-left.png');
  carregaArquivo(imagens, 0, 36, link + 'img/kunglob/k-up.png');
  carregaArquivo(imagens, 0, 37, link + 'img/cacoglobius/c-idle.png');
  carregaArquivo(imagens, 0, 38, link + 'img/cacoglobius/c-right.png');
  carregaArquivo(imagens, 0, 39, link + 'img/cacoglobius/c-down.png');
  carregaArquivo(imagens, 0, 40, link + 'img/cacoglobius/c-left.png');
  carregaArquivo(imagens, 0, 41, link + 'img/cacoglobius/c-up.png');
  // imagem do jogador humano
  carregaArquivo(humanoImagem, 0, 0, link + 'img/humano/humano.png');
  carregaArquivo(humanoImagem, 0, 1, link + 'img/humano/ossos.png');
  carregaArquivo(humanoImagem, 0, 2, link + 'img/humano/mouseClicou.png');
  carregaArquivo(humanoImagem, 0, 3, link + 'img/alimento/alimento.png');
  // imagens dos menus
  carregaArquivo(menusImagens, 0, 1, link + 'img/menus/principal.png');
  carregaArquivo(menusImagens, 0, 2, link + 'img/menus/seleciona-nalu.png');
  carregaArquivo(menusImagens, 0, 3, link + 'img/menus/seleciona-kung.png');
  carregaArquivo(menusImagens, 0, 4, link + 'img/menus/seleciona-caco.png');
  carregaArquivo(menusImagens, 0, 5, link + 'img/menus/icones-game.png');
  carregaArquivo(menusImagens, 0, 6, link + 'img/menus/pedras.png');
  carregaArquivo(menusImagens, 0, 7, link + 'img/menus/icones-minigames.png');
  carregaArquivo(menusImagens, 0, 8, link + 'img/menus/hud.png');
  carregaArquivo(menusImagens, 0, 9, link + 'img/menus/hud-minigames1.png');
  carregaArquivo(menusImagens, 0, 10, link + 'img/menus/hud-minigames2.png');
  carregaArquivo(menusImagens, 0, 11, link + 'img/menus/hud-minigames3.png');
  for (var i = 1; i < 9; i++){
    carregaArquivo(menusImagens, 0, 11 + i, link + 'img/menus/upgrade' + i + '.png');
  }
  // imagens das peças do fóssil do minigame do level 5
  for (var i = 1; i < 9; i++){
    carregaArquivo(fossilImagens, 0, i-1, link + 'img/puzzle/peca' + i + '-0.png');
  }
  for (var i = 1; i < 9; i++){
    carregaArquivo(fossilImagens, 0, i+7, link + 'img/puzzle/peca' + i + '-1.png');
  }
  for (var i = 1; i < 9; i++){
    carregaArquivo(fossilImagens, 0, i+15, link + 'img/puzzle/peca' + i + '-2.png');
  }
  carregaArquivo(fossilImagens, 0, 24, link + 'img/puzzle/peca9.png');
  // imagens dos níveis 1, 2-3, 4 e 5
  for (var i = 1; i < 5; i++){
    carregaArquivo(levelImagens, 0, i-1, link + 'img/level/level' + i + '.png');
  }
  for (var i = 1; i < 5; i++){
    carregaArquivo(levelImagens, 0, i+3, link + 'img/level/level' + i + 'up.png');
  }
  // carregando músicas
  carregaArquivo(musicas, 1, 0, link + 'music/Woodland-Tales-Adrian-von-Ziegler.mp3');
  carregaArquivo(musicas, 1, 1, link + 'music/Slava-Moy-Brat-Adrian-von-Ziegler.mp3');
  carregaArquivo(musicas, 1, 2, link + 'music/Tale-of-Siltharea-Adrian-von-Ziegler.mp3');
  carregaArquivo(musicas, 1, 3, link + 'music/Forest-Rites-Adrian-von-Ziegler.mp3');
  carregaArquivo(musicas, 1, 4, link + 'music/Origins-Adrian-von-Ziegler.mp3');
  carregaArquivo(musicas, 1, 5, link + 'music/Fable-Adrian-von-Ziegler.mp3');
  carregaArquivo(musicas, 1, 6, link + 'music/Galdrar-Adrian-von-Ziegler.mp3');
  carregaArquivo(musicas, 1, 7, link + 'music/Follow-the-Hunt-Adrian-von-Ziegler.mp3');
  carregaArquivo(musicas, 1, 8, link + 'music/Sacred-Earth-Adrian-von-Ziegler.mp3');

  // carregando imagens da introdução e do zeramento
  for (var i = 1; i < 12; i++){
    carregaArquivo(introImagens, 0, i-1, link + 'img/historia/intro' + i + '.png');
  }
  for (var i = 2; i < 9; i++){
    carregaArquivo(zeramentoImagens, 0, i-2, link + 'img/historia/zeramento' + i + '.png');
  }

  // informações do menu de seleção
  nome = createInput();
  nome.id('criatura');
  nome.value("Criatura");
  nome.position(362, 610);
  nome.size(360, 40);
  nome.hide();

  botaoAdcCrt = createButton('');
  botaoAdcCrt.id('botaoSelecionou');
  botaoAdcCrt.position(404, 680);
  botaoAdcCrt.size(263, 50);
  botaoAdcCrt.mousePressed(adicionarCriatura);
  botaoAdcCrt.hide();

  tipo = -1;
  botaoHerb = createButton('');
  botaoHerb.id('botaoHerb');
  botaoHerb.position(151, 169);
  botaoHerb.size(200, 200);
  botaoHerb.mousePressed(function t() { tipo = 0});
  botaoHerb.hide();

  botaoCarn = createButton('');
  botaoCarn.id('botaoCarn');
  botaoCarn.position(427, 170);
  botaoCarn.size(200, 200);
  botaoCarn.mousePressed(function t() { tipo = 1});
  botaoCarn.hide();

  botaoOni = createButton('');
  botaoOni.id('botaoOni');
  botaoOni.position(707, 170);
  botaoOni.size(200, 200);
  botaoOni.mousePressed(function t() { tipo = 2});
  botaoOni.hide();

  // informações do pré-Level 2
  botaoUpgrade1 = createButton('');
  botaoUpgrade1.class('botaoUpgrade');
  botaoUpgrade1.position(78, 248);
  botaoUpgrade1.size(134, 134);
  botaoUpgrade1.mousePressed(function t() { upgradeSelecionado = 0});
  botaoUpgrade1.hide();

  botaoUpgrade2 = createButton('');
  botaoUpgrade2.class('botaoUpgrade');
  botaoUpgrade2.position(222, 248);
  botaoUpgrade2.size(134, 134);
  botaoUpgrade2.mousePressed(function t() { upgradeSelecionado = 1});
  botaoUpgrade2.hide();

  botaoUpgrade3 = createButton('');
  botaoUpgrade3.class('botaoUpgrade');
  botaoUpgrade3.position(366, 248);
  botaoUpgrade3.size(134, 134);
  botaoUpgrade3.mousePressed(function t() { upgradeSelecionado = 2});
  botaoUpgrade3.hide();

  botaoUpgrade4 = createButton('');
  botaoUpgrade4.class('botaoUpgrade');
  botaoUpgrade4.position(510, 248);
  botaoUpgrade4.size(134, 134);
  botaoUpgrade4.mousePressed(function t() { upgradeSelecionado = 3});
  botaoUpgrade4.hide();

  botaoUpgrade5 = createButton('');
  botaoUpgrade5.class('botaoUpgrade');
  botaoUpgrade5.position(78, 428);
  botaoUpgrade5.size(134, 134);
  botaoUpgrade5.mousePressed(function t() { upgradeSelecionado = 4});
  botaoUpgrade5.hide();

  botaoUpgrade6 = createButton('');
  botaoUpgrade6.class('botaoUpgrade');
  botaoUpgrade6.position(222, 428);
  botaoUpgrade6.size(134, 134);
  botaoUpgrade6.mousePressed(function t() { upgradeSelecionado = 5});
  botaoUpgrade6.hide();

  botaoUpgrade7 = createButton('');
  botaoUpgrade7.class('botaoUpgrade');
  botaoUpgrade7.position(366, 428);
  botaoUpgrade7.size(134, 134);
  botaoUpgrade7.mousePressed(function t() { upgradeSelecionado = 6});
  botaoUpgrade7.hide();

  botaoUpgrade8 = createButton('');
  botaoUpgrade8.class('botaoUpgrade');
  botaoUpgrade8.position(510, 428);
  botaoUpgrade8.size(134, 134);
  botaoUpgrade8.mousePressed(function t() { upgradeSelecionado = 7});
  botaoUpgrade8.hide();

  botaoCancelar = createButton('');
  botaoCancelar.id('botaoCancelar');
  botaoCancelar.position(242, 640);
  botaoCancelar.size(260, 45);
  botaoCancelar.mousePressed(function t() { upgradeSelecionado = 8; confirmarNovaCaracteristica()});
  botaoCancelar.hide();

  botaoConfirmar = createButton('');
  botaoConfirmar.id('botaoConfirmar');
  botaoConfirmar.position(582, 643);
  botaoConfirmar.size(260, 45);
  botaoConfirmar.mousePressed(confirmarNovaCaracteristica);
  botaoConfirmar.hide();

  //______________________________________________________________________________
  // função que redireciona o jogador para o link do canal do Adrian von Ziegler (músico)
  //______________________________________________________________________________
  function redireciona() {
    switch (menu) {
      case -1: // intro
        open('https://www.youtube.com/watch?v=2kHmb7ZVh6s');
        break; // seleção
      case -0.5:
        open('https://www.youtube.com/watch?v=nwZu4x_3x0M');
        break;
      case 0:
        open('https://www.youtube.com/watch?v=fD2Cn8DqIq4');
        break;
      case 1: // levels
        switch (levelnum) {
          case 1:
            open('https://www.youtube.com/watch?v=guJHiF2RSyo');
            break;
          case 1.5:
            open('https://www.youtube.com/watch?v=_n6faOWXpKw');
            break;
          case 2:
            open('https://www.youtube.com/watch?v=_n6faOWXpKw');
            break;
          case 3:
            open('https://www.youtube.com/watch?v=SC-aRr0JY8A');
            break;
          case 4:
            open('https://www.youtube.com/watch?v=bmooZIyYUr0');
            break;
          case 5:
            open('https://www.youtube.com/watch?v=5sd0HexlfPk');
            break;
        }
        break;
      case 2: // final
        open('https://www.youtube.com/watch?v=aRZMHXoOK5g');
        break;
    }
  }

  //______________________________________________________________________________
  // iniciar um jogo apenas com as criaturas pré-definidas do level
  //______________________________________________________________________________
  function passouMenuPrincipal() {
    nomeJogador = nomeJog.value();
    nomeJog.remove();
    botaoIniciar.remove();
    tipo = 0;
    musicas[0].stop();
    musicas[1].loop();
    botaoCrdts.elt.textContent = 'Slava, Moy Brat - por Adrian von Ziegler';
    menu = -0.5;
  }

  //______________________________________________________________________________
  // iniciar um jogo apenas com as criaturas pré-definidas do level
  //______________________________________________________________________________
  function confirmarNovaCaracteristica() {
    if (criatura[1] == upgradeSelecionado){
      alert("Você já possui essa melhoria, escolha outra!");
      return false;
    }

    // dá a pontuação apropriada dependendo do upgrade
    switch (upgradeSelecionado) {
      case 0:
        if (pontuacao >= 200){
          criaturasSalvas[0][0].push("Chifres");
          criaturasSalvas[0][5] += 0.25;
          criaturasSalvas[0][4] -= 0.25;
          if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[4];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[5];
          }
          pontuacao -= 200;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 1:
        if (pontuacao >= 200){
          criaturasSalvas[0][0].push("Orelhas Grandes");
          criaturasSalvas[0][4] += 0.25;
          criaturasSalvas[0][5] -= 0.25;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[3];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[8];
          }
          pontuacao -= 200;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 2:
        if (pontuacao >= 200){
          criaturasSalvas[0][0].push("Duas Caudas");
          criaturasSalvas[0][3] -= 0.3;
          criaturasSalvas[0][5] -= 0.25;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[6];
          } else if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[7];
          }
          pontuacao -= 200;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 3:
        if (pontuacao >= 150){
          criaturasSalvas[0][0].push("Escalar Árvores");
          criaturasSalvas[0][4] += 0.25;
          criaturasSalvas[0][3] += 0.3;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[9];
          } else if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[10];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[11];
          }
          pontuacao -= 150;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 4:
        if (pontuacao >= 250){
          criaturasSalvas[0][0].push("Peçonha");
          criaturasSalvas[0][3] -= 0.3;
          criaturasSalvas[0][4] -= 0.25;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[12];
          } else if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[13];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[14];
          }
          pontuacao -= 250;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 5:
        if (pontuacao >= 200){
          criaturasSalvas[0][0].push("Carapaça");
          criaturasSalvas[0][5] += 0.33;
          criaturasSalvas[0][4] -= 0.33;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[15];
          } else if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[16];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[17];
          }
          pontuacao -= 200;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 6:
        if (pontuacao >= 250){
          criaturasSalvas[0][0].push("Asas");
          criaturasSalvas[0][3] += 0.3;
          criaturasSalvas[0][4] += 0.25;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[18];
          } else if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[19];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[20];
          }
          pontuacao -= 250;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 7:
        if (pontuacao >= 100){
          criaturasSalvas[0][0].push("Espinhos");
          criaturasSalvas[0][3] += 0.3;
          criaturasSalvas[0][5] += 0.25;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[21];
          } else if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[22];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[23];
          }
          pontuacao -= 100;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 8:
        break;
    }

    // upgrade das criaturas adversárias
    criaturasSalvas[1][0].push("Carapaça");
    criaturasSalvas[1][5] += 0.33;
    criaturasSalvas[1][4] -= 0.33;
    if (criaturasSalvas[1][1] == 0){
      criaturasSalvas[1][6] = imagens[15];
    } else if (criaturasSalvas[1][1] == 1){
      criaturasSalvas[1][6] = imagens[16];
    } else if (criaturasSalvas[1][1] == 2){
      criaturasSalvas[1][6] = imagens[17];
    }

    criaturasSalvas[2][0].push("Espinhos");
    criaturasSalvas[2][3] += 0.3;
    criaturasSalvas[2][5] += 0.25;
    if (criaturasSalvas[2][1] == 0){
      criaturasSalvas[2][6] = imagens[21];
    } else if (criaturasSalvas[2][1] == 1){
      criaturasSalvas[2][6] = imagens[22];
    } else if (criaturasSalvas[2][1] == 2){
      criaturasSalvas[2][6] = imagens[23];
    }

    botaoUpgrade1.remove();
    botaoUpgrade2.remove();
    botaoUpgrade3.remove();
    botaoUpgrade4.remove();
    botaoUpgrade5.remove();
    botaoUpgrade6.remove();
    botaoUpgrade7.remove();
    botaoUpgrade8.remove();
    botaoCancelar.remove();
    botaoConfirmar.remove();
    levelnum = 2;
    level = new Level2(criaturasSalvas);
    alert("Iniciando capítulo 2");
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
    var inforModificada = [];

    infor.push(nome.value());

    switch (tipo){
      // herbívoro
      case 0:
        fome = 1.5;
        velocidade = 1;
        resistencia = 1.5;
        infor.push("Casco");
        infor.push("Grande porte");
        infor.push("Chifre");
        aparencia = imagens[0];
        aparenciaFutura = imagens[24];
        break;
      // carnívoro
      case 1:
        fome = 6;
        velocidade = 1.25;
        resistencia = 2.5;
        infor.push("Garra");
        infor.push("Pequeno porte");
        infor.push("Orelhas grandes");
        aparencia = imagens[1];
        aparenciaFutura = imagens[25];
        break;
      // onívoro
      case 2:
        fome = 3;
        velocidade = 1.1;
        resistencia = 1.9;
        infor.push("Mão");
        infor.push("Médio porte");
        infor.push("Duas caudas");
        aparencia = imagens[2];
        aparenciaFutura = imagens[26];
        break;
    }

    arrayCopy(infor, inforModificada);
    inforModificada[0] = inforModificada[0] + " Modificada";

    alert("A criatura " + nome.value() + " foi criada com sucesso!")
    criatura = [infor, tipo, vida, fome, velocidade, resistencia, aparencia];
    criaturaFutura = [inforModificada, tipo, vida, fome, velocidade, resistencia, aparencia];
    level = new Level(criatura);
    limparCampos();
  }

  //______________________________________________________________________________
  // limpar os campos de entrada de dados
  //______________________________________________________________________________
  function limparCampos(){
    // remove elementos de entrada de dado
    nome.remove();
    botaoAdcCrt.remove();
    botaoHerb.remove();
    botaoCarn.remove();
    botaoOni.remove();
    botaoCrdts.elt.textContent = 'Forest Rites - por Adrian von Ziegler';
    menu = 1;
    musicas[2].stop();
    musicas[3].loop();
  }
}

//______________________________________________________________________________
// onde o jogo acontece, de fato
//______________________________________________________________________________
function draw(){
  if (carregando){
    image(menusImagens[0], 0, 0);
    for (var i = 0; i < particulas.length; i++){
      particulas[i].animar();
    }
  } else {
    if (menu == -1){ // intro
      image(menusImagens[1], 0, 0);
      fill(255)
      textFont(fonte, 18);
      text('Equipe de desenvolvimento:', 25, 35);
      text('- Wendell Gomes Silva', 40, 55);
      text('- Jessica Ferreira da Silva', 40, 75);
    } else if (menu == -0.5){
      tempoImagem += 0.1;
      fill(255);
      strokeWeight(3);
      stroke(0);
      textFont(fonte, 24);
      textStyle(BOLD);
      switch (imagemAtual) {
        case 0:
          image(introImagens[0], 0, 0);
          text('A humanidade segue seu curso tranquilamente...', 90, 60);
          break;
        case 1:
          image(introImagens[1], 0, 0);
          text('A humanidade segue seu curso tranquilamente...', 90, 60);
          break;
        case 2:
          image(introImagens[2], 0, 0);
          text('Cada um segue seu próprio destino, todos dentro de um pequeno', 90, 60);
          text('planeta em um vasto universo...', 90, 90);
          break;
        case 3:
          image(introImagens[3], 0, 0);
          text('Cada um segue seu próprio destino, todos dentro de um pequeno', 90, 60);
          text('planeta em um vasto universo...', 90, 90);
          break;
        case 4:
          image(introImagens[4], 0, 0);
          text('Me diz uma coisa...', 90, 60);
          text('Você acredita que há vida em outros planetas?!', 90, 90);
          break;
        case 5:
          image(introImagens[5], 0, 0);
          text('Alguns acreditam que nesta imensidão existe algum planeta', 90, 60);
          text('com vida tão complexa quanto a nossa...', 90, 90);
          text('Outros acreditam que é pura fantasia!', 90, 120);
          break;
        case 6:
          image(introImagens[6], 0, 0);
          text('O que você acha?', 90, 60);
          text('Muitos buscam pela resposta, mas nada se encontrou até agora.', 90, 90);
          break;
        case 7:
          image(introImagens[7], 0, 0);
          text('Tá bom, te contarei um segredo...', 90, 60);
          break;
        case 8:
          image(introImagens[8], 0, 0);
          text('Há 380 bilhões de anos luz da terra (onde os humanos jamais', 90, 60);
          text('conseguiram chegar a imaginar) existe um pequeno planeta a', 90, 90);
          text('girar em seu próprio sistema solar...', 90, 120);
          text('É o planeta Geb...', 90, 150);
          break;
        case 9:
          image(introImagens[9], 0, 0);
          text('A verdade é que Geb se desenvolveu de uma maneira muito', 90, 60);
          text('parecida com a Terra, ao ponto de também gerar vidas', 90, 90);
          text('complexas.', 90, 120);
          break;
        case 10:
          image(introImagens[9], 0, 0);
          text('Como pode ver, a vida aqui está aflorando visivelmente, e os', 90, 60);
          text('seres vivos desse planeta apesar de familiares são um pouco', 90, 90);
          text('diferentes.', 90, 120);
          break;
        case 11:
          image(introImagens[10], 0, 0);
          text('Você gostaria de passar uma temporada aqui?! Não se preocupe,', 90, 60);
          text('pode ficar quantos milhões de anos quiser...', 90, 90);
          break;
        case 12:
          image(introImagens[10], 0, 0);
          text('Observe de perto as gerações surgindo e sucumbindo, a vida', 90, 60);
          text('fluindo de acordo com a evolução natural.', 90, 90);
          break;
      }
      if (tempoImagem >= 30){
        if (frameHistoria >= 0 && frameHistoria < 10 || frameHistoria >= 20 && frameHistoria < 30){
          imgm = humanoImagem[2].get(0, 0, 32, 32);
          image(imgm, 40, 40);
        } else {
          imgm = humanoImagem[2].get(32, 0, 32, 32);
          image(imgm, 40, 40);
        }
        frameHistoria += 0.4;
        if (frameHistoria >= 40){
          frameHistoria = 0;
        }
      }
    } else if (menu == 0){ // principal
      if (tipo == 0){
        image(menusImagens[2], 0, 0);
      } else if (tipo == 1){
        image(menusImagens[3], 0, 0);
      } else if (tipo == 2){
        image(menusImagens[4], 0, 0);
      }
    } else if (menu == 1){ // levels
      if (levelnum == 1.5){ // escolha de novas características .hide() e .show()
        switch (upgradeSelecionado) {
          case 0:
            image(menusImagens[12], 0, 0);
            break;
          case 1:
            image(menusImagens[13], 0, 0);
            break;
          case 2:
            image(menusImagens[14], 0, 0);
            break;
          case 3:
            image(menusImagens[15], 0, 0);
            break;
          case 4:
            image(menusImagens[16], 0, 0);
            break;
          case 5:
            image(menusImagens[17], 0, 0);
            break;
          case 6:
            image(menusImagens[18], 0, 0);
            break;
          case 7:
            image(menusImagens[19], 0, 0);
            break;
          case 8:
            image(menusImagens[20], 0, 0);
            break;
        }
        if (indexTexto == 0) {
          if (tempoTexto >= 30){
            if (frameHistoria >= 0 && frameHistoria < 10 || frameHistoria >= 20 && frameHistoria < 30){
              imgm = humanoImagem[2].get(0, 0, 32, 32);
              image(imgm, xGame/2 - 200, 100);
            } else {
              imgm = humanoImagem[2].get(32, 0, 32, 32);
              image(imgm, xGame/2 - 200, 100);
            }
            frameHistoria += 0.4;
            if (frameHistoria >= 40){
              frameHistoria = 0;
            }
          }
          tempoTexto += 0.25;

          stroke(0);
          fill(255);
          textFont(fonte, 14);
          text('Você acumulou pontos de modificação', 40, 150);
          text('suficientes para transformá-los em', 40, 165);
          text('uma estrutura para sua espécie! Escolha', 40, 180);
          text('com sabedoria, avaliando as vantagens e', 40, 195);
          text('desvantagens de cada uma.', 40, 210);
        }

        textFont(fonte, 16);
        text('200', 120, 390);
        text('200', 263, 390);
        text('200', 406, 390);
        text('150', 549, 390);
        text('250', 120, 570);
        text('200', 263, 570);
        text('250', 406, 570);
        text('100', 553, 570);
      } else {
        level.rodar(); // todos os levels
      }

      // desenha HUD em todos os levels
      fill(255);
      strokeWeight(3);
      stroke(0);
      textFont(fonte, 16);
      textStyle(BOLD);
      image(menusImagens[8], 25, 25);
      text(pontuacao, 90, 60);
      text(parseInt(tempoJogo), 90, 100);

    } else if (menu == 2){ // fim do jogo
      tempoImagem += 0.1;
      fill(255);
      strokeWeight(3);
      stroke(0);
      textFont(fonte, 24);
      textStyle(BOLD);
      switch (imagemAtual) {
        case 0:
          image(introImagens[6], 0, 0);
          text('Já faz um bom tempo não é?!', 90, 60);
          text('O que acha de voltar para casa agora?!', 90, 90);
          break;
        case 1:
          image(zeramentoImagens[0], 0, 0);
          text('Parece que muita coisa tem acontecido por aqui na terra...', 90, 60);
          break;
        case 2:
          image(zeramentoImagens[1], 0, 0);
          text('Foi uma viagem e tanta, não foi?!', 90, 60);
          break;
        case 3:
          image(zeramentoImagens[1], 0, 0);
          text('Passar tantos anos em um planeta distante e depois voltar', 90, 60);
          text('para seu antigo lar pode dar um pouco de nostalgia...', 90, 90);
          break;
        case 4:
          image(zeramentoImagens[2], 0, 0);
          text('Estava com saudade? Se passaram ' + int(tempoJogo) + ' milhões de anos', 90, 60);
          text('desde que saiu para ir até o planeta Geb.', 90, 90);
          break;
        case 5:
          image(zeramentoImagens[3], 0, 0);
          text('Se prestar atenção, aqui na terra muitas coisas mudaram', 90, 60);
          text('também, a evolução é um processo constante.', 90, 90);
          break;
        case 6:
          image(zeramentoImagens[4], 0, 0);
          text('Não se preocupe com Geb, tudo irá continuar seguindo seu', 90, 60);
          text('curso natural...', 90, 90);
          text(criatura[0][0] + ' vai continuar evoluindo...', 90, 120);
          break;
        case 7:
          image(zeramentoImagens[5], 0, 0);
          text('Os humanos vão continuar evoluindo...', 90, 60);
          break;
        case 8:
          image(zeramentoImagens[6], 0, 0);
          text('Porque a vida só existe se for livre para modificar...', 90, 60);
          text('para evoluir... pra construir e desconstruir...', 90, 90);
          break;
        case 9:
          image(zeramentoImagens[6], 0, 0);
          text('Obrigado pela viagem e volte sempre!', 90, 60);
          break;
        case 10:
          image(zeramentoImagens[6], 0, 0);
          textFont(fonte, 60);
          text('Fim', xGame/2, 120);
          textFont(fonte, 18);
          text('Equipe de desenvolvimento:', xGame - 320, yGame - 80);
          text('- Wendell Gomes Silva', xGame - 305, yGame - 60);
          text('- Jessica Ferreira da Silva', xGame - 305, yGame - 40);
          text('Jogador: ' + nomeJogador, xGame/2, 200);
          text('Espécie: ' + criatura[0][0], xGame/2, 220);
          text('Pontos de Modificação: ' + pontuacao, xGame/2, 240);
          text('Tempo de Jogo: ' + int(tempoJogo), xGame/2, 260);
          text('Características adquiriras pela espécie:', xGame/2, 280);
          for (var i = 1; i < criatura[0].length; i++){
            text('-' + criatura[0][i], xGame/2 + 20, 280 + (20 * i));
          }
          break;
      }
      if (tempoImagem >= 30 && imagemAtual != 10){
        if (frameHistoria >= 0 && frameHistoria < 10 || frameHistoria >= 20 && frameHistoria < 30){
          imgm = humanoImagem[2].get(0, 0, 32, 32);
          image(imgm, 40, 40);
        } else {
          imgm = humanoImagem[2].get(32, 0, 32, 32);
          image(imgm, 40, 40);
        }
        frameHistoria += 0.4;
        if (frameHistoria >= 40){
          frameHistoria = 0;
        }
      }
    }
  }
}

function mousePressed(){
  if (menu == -0.5){
    if (tempoImagem >= 30){
      tempoImagem = 0;
      imagemAtual += 1;
      if (imagemAtual == 13){
        menu = 0;
        musicas[1].stop();
        musicas[2].loop();
        botaoCrdts.elt.textContent = 'Tale of Silthârea - por Adrian von Ziegler';
        nome.show();
        botaoHerb.show();
        botaoCarn.show();
        botaoOni.show();
        botaoAdcCrt.show();
      }
    }
  } else if (menu == 2){
    if (tempoImagem >= 30 && imagemAtual != 10){
      tempoImagem = 0;
      imagemAtual += 1;
    }
  }
  if (levelnum == 1.5){
    if (indexTexto == 0){
      if (tempoTexto >= 30){
        indexTexto = -1;
      }
    }
  } else if (levelnum == 1 || levelnum == 2 || levelnum == 3 || levelnum == 4){
    if (level != undefined){
      level.mousePressed();
    }
  } else if (levelnum == 5){
    if (level.serHumano.cavando){
      level.serHumano.carrega(10);
    } else {
      if (level != undefined){
        level.mousePressed();
      }
    }
  }
}

function keyPressed(){
  level.keyPressed();
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
