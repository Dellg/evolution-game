var xGame = 1000;
var yGame = 750;
var menu = 0;
var criaturas = [];
var alimentosPlanta;
var alimentosCarne;
var alimentosVeneno;
var countAlimentos = 75; // será para cada tipo de alimento
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

  function adicionarAleatorios() {
    for (var i = 0; i < 5; i++){ // <---------------------------------- quantidade de criaturas aleatórias
      var temp1 = random(1, 4);
      var temp2 = random(1, 4);
      tipoCriaturas.push(["Criatura" + i, round(random(2)), temp1, (4 - temp1), temp2, (4 - temp2),
                          color(random(255), random(255), random(255))]);
    }
    alert("Criaturas adicionadas! Aperte em Iniciar Jogo para começar.")
    limparCampos();
  }

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

  var botaoIniciar = createButton('Iniciar Jogo');
  botaoIniciar.position(50, 700);
  botaoIniciar.mousePressed(carregarDados);

  function carregarDados(){
    if (tipoCriaturas.length <= 0){
      alert("Adicione algumas criaturas para poder iniciar o jogo.")
      return false;
    }
    // cria tipos de alimentos diferentes
    for (var i = 0; i < 12; i++){
      var t = i%3;
      var v = random(-0.5, 1);
      var f = random(0.5, 3);
      var c = color(random(255), random(255), random(255));
      tipoAlimentos[i] = [t, v, f, c];
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
    if (criaturas.length <= 0){
      geracao += 1;
      iniciaGeracao();
    } else {
      // gera novas comidas se tiver menos da quantidade definida comidas no canvas
      if (random(1) < 0.05 || (alimentosPlanta.length + alimentosCarne.length + alimentosVeneno.length) < countAlimentos){
        if (random(1) < 0.1) {
          adicionaNovaComida(null, null);
        }
      }
      for (var i = 0; i < criaturas.length; i++){
        var crtr = criaturas[i];
        crtr.comportamentos(alimentosPlanta, alimentosCarne, alimentosVeneno, criaturas);
        crtr.limites();
        crtr.update();
        crtr.show();

        // aqui verifica se foi feita reprodução, para adicionar os filhos à população
        var filho = criaturas[i].reproduz();
        if (filho != null) {
          if (this.debug)
            console.log(criaturas[i].nome + " reproduziu.");
          criaturas.push(filho);
        }
        // aqui verifica se a criatura morreu, para retirá-la da população
        if (crtr.morreu()){
          if (this.debug)
            console.log(criaturas[i].nome + " morreu.");
          criaturas.splice(i, 1);
          adicionaNovaComida(crtr.posicao.x, crtr.posicao.y);
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
    for (var j = 0; j < 6; j++){ // <--------------------------- alterar aqui pra criar mais de uma de cada tipo
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
    adicionaNovaComida(null, null);
  }
  // redesenha a tela com a nova geração
  redraw();
}

//______________________________________________________________________________
// método que adiciona novas comidas nas listas
//______________________________________________________________________________
function adicionaNovaComida(x, y){
  if (x == null || y == null){
    x = random(5, xGame-5);
    y = random(5, yGame-5);
  }
  var r = round(random(tipoAlimentos.length - 1));
  switch (tipoAlimentos[r][0]) {
    case 0:
      alimentosPlanta.push(new Alimento(x, y, tipoAlimentos[r]));
      break;
    case 1:
      alimentosCarne.push(new Alimento(x, y, tipoAlimentos[r]));
      break;
    case 2:
      alimentosVeneno.push(new Alimento(x, y, tipoAlimentos[r]));
      break;
  }
}

//______________________________________________________________________________
// método para verificar se um array contém um objeto
//______________________________________________________________________________
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i].tipo === obj.tipo)
            return true;
    }
    return false;
}
