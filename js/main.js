var xGame = 1000;
var yGame = 750;
var menu = 0;
var criaturas = [];
var variacaoCriaturas = 6; // variável que controla a quantidade de tipo de criatura
var quantiaEspecie = 6; // variável que controla quantas de cada criatura serão geradas
var alimentosPlanta;
var alimentosCarne;
var alimentosVeneno;
var variacaoAlimentos = 20; // variável que controla quantos tipos de alimentos serão criados
var countAlimentos = 80; // será para cada tipo de alimento
var tipoCriaturas = [];
var tipoAlimentos = [];
var geracao = 0;
var taxaMutacao = 0.01;
var debug = false;

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

  var botaoLimpar = createButton('Limpar');
  botaoLimpar.position(217, 550);
  botaoLimpar.mousePressed(limparCampos);

  var botaoAdcRnd = createButton('Adicionar 5 criaturas aleatórias');
  botaoAdcRnd.position(50,580);
  botaoAdcRnd.mousePressed(adicionarAleatorios);

  var botaoIniciar = createButton('Iniciar Jogo');
  botaoIniciar.position(50, 700);
  botaoIniciar.mousePressed(carregarDados);

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
    tipoCriaturas.push([nome.value(), tipo.value(), vida.value(), fome.value(), velocidade.value(),
                        resistencia.value(), color(corR.value(), corG.value(), corB.value())]);
    limparCampos();
  }

  //______________________________________________________________________________
  // adicionar criaturas aleatoriamente
  //______________________________________________________________________________
  function adicionarAleatorios() {
    for (var i = 0; i < variacaoCriaturas; i++){
      var t = i%3;
      var temp1 = random(1, 3);
      var temp2 = random(1, 3);
      tipoCriaturas.push(["Criatura" + i, t, temp1, (4 - temp1), temp2, (4 - temp2),
                          color(random(255), random(255), random(255))]);
    }
    alert("Criaturas adicionadas! Aperte em Iniciar Jogo para começar.")
    limparCampos();
  }

  //______________________________________________________________________________
  // limpar os campos de entrada de dados
  //______________________________________________________________________________
  function limparCampos(){
    nome.value("");
    tipo.value(false);
    vida.value("");
    fome.value("");
    velocidade.value("");
    resistencia.value("");
    corR.value(0);
    corG.value(0);
    corB.value(0);
  }

  //______________________________________________________________________________
  // carrega os dados dos alimentos e inicia o jogo com uma geração
  //______________________________________________________________________________
  function carregarDados(){
    if (tipoCriaturas.length <= 0){
      alert("Adicione algumas criaturas para poder iniciar o jogo.")
      return false;
    }
    // cria tipos de alimentos diferentes
    for (var i = 0; i < variacaoAlimentos; i++){
      var t = i%3;
      var v = random(0.5, 1.5);
      var f = random(0.5, 3);
      var r;
      var g;
      var b;
      switch (t) {
        // planta
        case 0:
          r = random(0, 126);
          g = random(177, 255);
          b = 0;
          break;
        // carne
        case 1:
          r = random(177, 255);
          g = random(0, 126);
          b = 0;
          break;
        // veneno
        case 2:
          r = random(0, 80);
          g = random(0, 80);
          b = random(126, 255);
          break;
      }
      tipoAlimentos[i] = [t, v, f, r, g, b];
    }
    iniciaGeracao();
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
    botaoAdcRnd.remove();
    botaoLimpar.remove();
    botaoIniciar.remove();
    menu = 1;
  }
}

//______________________________________________________________________________
// método que ativa o modo debug com o botão do mouse
//______________________________________________________________________________
function mousePressed(){
  this.debug = !this.debug;
}

//______________________________________________________________________________
// onde o jogo acontece, de fato
//______________________________________________________________________________
function draw(){
  // menu principal de entrada de dados
  if (menu == 0){
    col = color(corR.value(), corG.value(), corB.value());
    fill(col);
    rect(195,362,58,58);
  // interface do jogo
  } else if (menu == 1){
    background(15);
    fill(255);
    text("Geração " + geracao, 10, 20);
    if (this.debug){
      text("  Legenda:", 10, 40);
      text("Alimentos:", 10, 60);
      text("- com cor em tom de verde/verde-limão são plantas;", 10, 80);
      text("- com cor em tom de vermelho/laranja são carnes;", 10, 100);
      text("- com cor em tom de azul/roxo são venenos.", 10, 120);
      text("Criaturas:", 10, 150);
      text("- com formato de losango são herbívoros;", 10, 170);
      text("- com formato de triângulo são onívoros;", 10, 190);
      text("- com formato de seta são carnívoros.", 10, 210);
      text("Aura das criaturas:", 10, 240);
      text("- verde é a área de percepção para plantas;", 10, 260);
      text("- azul é a área de percepção para carnes;", 10, 280);
      text("- vermelho é a área de percepção para venenos;", 10, 300);
      text("- amarelo é a área de percepção para predadores/presas.", 10, 320);
      text("Linhas que saem pela frente e por trás das criaturas são forças de atração e repulsão, respectivamente:", 10, 350);
      text("- verde é a força de atração/repulsão por plantas;", 10, 370);
      text("- azul é a força de atração/repulsão por carnes;", 10, 390);
      text("- vermelho é a força de atração/repulsão por venenos;", 10, 410);
      text("- amarelo é a força de atração/repulsão por predadores/presas.", 10, 430);
    }
    if (criaturas.length <= 0){
      geracao += 1;
      iniciaGeracao();
    } else {
      // gera novas comidas se tiver menos da quantidade definida comidas no canvas
      if ((alimentosPlanta.length + alimentosCarne.length + alimentosVeneno.length) < countAlimentos){
        if (random(1) < 0.2) {
          adicionaNovaComida(null, null);
        }
      }
      for (var i = criaturas.length - 1; i > 0; i--){
        var crtr = criaturas[i];
        crtr.comportamentos(alimentosPlanta, alimentosCarne, alimentosVeneno, criaturas);
        crtr.limites();
        crtr.update();
        crtr.show();

        // aqui verifica se foi feita reprodução, para adicionar os filhos à população
        if (crtr != undefined){
          var filho = crtr.reproduz();
          if (filho != null) {
            criaturas.push(filho);
          }
        }
        // aqui verifica se a criatura morreu, para retirá-la da população
        if (crtr.morreu()){
          criaturas.splice(i, 1);
          console.log(crtr.nome + " morreu.")
          adicionaNovaComida(crtr.posicao.x, crtr.posicao.y, true);
        }
      }
      for (var i = 0; i < alimentosPlanta.length; i++){
        var almt = alimentosPlanta[i];
        almt.show();
      }
      for (var i = 0; i < alimentosCarne.length; i++){
        var almt = alimentosCarne[i];
        almt.show();
      }
      for (var i = 0; i < alimentosVeneno.length; i++){
        var almt = alimentosVeneno[i];
        almt.show();
      }
    }
  }
}

//______________________________________________________________________________
// aqui reinicia o jogo com uma nova geração
//______________________________________________________________________________
function iniciaGeracao(){
  // cria quantidades das criaturas pré-definidas
  for (var i = 0; i < tipoCriaturas.length; i++){
    for (var j = 0; j < quantiaEspecie; j++){
      var x = random(xGame);
      var y = random(yGame);
      var criatura = new Criatura(x, y, tipoCriaturas[i], null, geracao);
      criaturas.push(criatura);
    }
  }
  alimentosPlanta = [];
  alimentosCarne = [];
  alimentosVeneno = [];
  // cria alimentos usando os tipos pré-criados
  for (var i = 0; i < countAlimentos; i++){
    adicionaNovaComida(null, null, false);
  }
  // redesenha a tela com a nova geração
  redraw();
}

//______________________________________________________________________________
// método que adiciona novas comidas nas listas
//______________________________________________________________________________
function adicionaNovaComida(x, y, morto){
  if (x == null || y == null){
    x = random(5, xGame-5);
    y = random(5, yGame-5);
  }
  var r = round(random(tipoAlimentos.length - 1));
  switch (tipoAlimentos[r][0]) {
    case 0:
      if (morto || alimentosPlanta.length < (countAlimentos/2)){
        alimentosPlanta.push(new Alimento(x, y, tipoAlimentos[r]));
        alimentosPlanta.push(new Alimento(x, y, tipoAlimentos[r]));
      }
      break;
    case 1:
      if (morto || alimentosCarne.length < (countAlimentos/2)/2){
        alimentosCarne.push(new Alimento(x, y, tipoAlimentos[r]));
      }
      break;
    case 2:
      if (morto || alimentosVeneno.length < (countAlimentos/2)/2){
        alimentosVeneno.push(new Alimento(x, y, tipoAlimentos[r]));
      }
      break;
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
