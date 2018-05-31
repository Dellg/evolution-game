var xGame = 1045;
var yGame = 760;
var menu = -1///0;
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
var criaturaFutura = null;
var humanoImagem = [];
var menusImagens = [];
var fossilImagens = [];
var levelImagens = [];
var nomeJogador;
var musicas = [];
var particulas = [];
var quantidadeObjetos = 105; // imagens e sons
var contadorObjetos = 0; // para gerenciar o loading
var carregando = true;
var link = 'https://raw.githubusercontent.com/Dellg/evolution-game/master/';
var upgradeSelecionado = 0;

//______________________________________________________________________________
// carregando imagens no projeto
//______________________________________________________________________________
function preload(){
  // carregando imagem inicial
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
  botaoCancelar.position(250, 627);
  botaoCancelar.size(210, 50);
  botaoCancelar.mousePressed(function t() { upgradeSelecionado = 8; confirmarNovaCaracteristica()});
  botaoCancelar.hide();

  botaoConfirmar = createButton('');
  botaoConfirmar.id('botaoConfirmar');
  botaoConfirmar.position(600, 627);
  botaoConfirmar.size(210, 50);
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
    musicas[2].loop();
    botaoCrdts.elt.textContent = 'Tale of Silthârea - por Adrian von Ziegler';
    menu = 0;
    nome.show();
    botaoHerb.show();
    botaoCarn.show();
    botaoOni.show();
    botaoAdcCrt.show();
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
        if (pontuacao >= 150){
          criaturasSalvas[0][0].push("Chifres");
          criaturasSalvas[0][5] += 0.25;
          criaturasSalvas[0][4] -= 0.25;
          if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[4];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[5];
          }
          pontuacao -= 150;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 1:
        if (pontuacao >= 100){
          criaturasSalvas[0][0].push("Orelhas Grandes");
          criaturasSalvas[0][4] += 0.25;
          criaturasSalvas[0][5] -= 0.25;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[3];
          } else if (criatura[1] == 2){
            criaturasSalvas[0][6] = imagens[8];
          }
          pontuacao -= 100;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 2:
        if (pontuacao >= 150){
          criaturasSalvas[0][0].push("Duas Caudas");
          criaturasSalvas[0][3] -= 0.3;
          criaturasSalvas[0][5] -= 0.25;
          if (criatura[1] == 0){
            criaturasSalvas[0][6] = imagens[6];
          } else if (criatura[1] == 1){
            criaturasSalvas[0][6] = imagens[7];
          }
          pontuacao -= 150;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 3:
        if (pontuacao >= 100){
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
          pontuacao -= 100;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 4:
        if (pontuacao >= 150){
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
          pontuacao -= 150;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 5:
        if (pontuacao >= 100){
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
          pontuacao -= 100;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 6:
        if (pontuacao >= 150){
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
          pontuacao -= 150;
        } else {
          alert("Você não tem pontuação suficiente para pegar esta mutação.");
          return false;
        }
        break;
      case 7:
        if (pontuacao >= 85){
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
          pontuacao -= 85;
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

    var vida = 2, fome, velocidade, resistencia, aparencia, aparenciaFutura;
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
        infor.push("Grande");
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
        infor.push("Pequeno");
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
        infor.push("Médio");
        infor.push("Duas caudas");
        aparencia = imagens[2];
        aparenciaFutura = imagens[26];
        break;
    }

    arrayCopy(infor, inforModificada);
    inforModificada[0] = inforModificada[0] + " Modificada";

    alert("A criatura " + nome.value() + " foi criada com sucesso!")
    criatura = [infor, tipo, vida, fome, velocidade, resistencia, aparencia];
    criaturaFutura = [inforModificada, tipo, vida, fome, velocidade, resistencia, aparenciaFutura];
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
      } else {
        level.rodar(); // todos os levels
      }

      // desenha HUD em todos os levels
      fill(255);
      strokeWeight(3);
      stroke(0);
      textFont("Lithos Pro", 16);
      textStyle(BOLD);
      image(menusImagens[8], 25, 25);
      text(pontuacao, 90, 60);
      text(parseInt(tempoJogo), 90, 100);

    } else if (menu == 2){ // fim do jogo

    }
  }
}

function mousePressed(){
  if (levelnum == 1){
    if (level != undefined){
      level.mousePressed();
    }
  } else if (levelnum == 5){
    if (level.serHumano.cavando){
      level.serHumano.carrega(10);
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
