/* Engine.js
 * 
 * Este arquivo (Engine.js) disponibiliza a funcionalidade de game loop com renderização e atualizações
 * insere usando contexto do canvas a tela inicial do game.
 * 
 * O game loop serve para redesenhar nossos personagens frame por frame alterando a localização
 * de acordo a entrada das setas do teclado do usuário assim temos uma ilusão de animação mas
 * não passa de imagens se redesenhando dentro de um loop "infinito" até o término do game
 * 
 */

/*
 * Criando varável global com o "documento", definindo canvas e adicionando ao corpo do documento
*/

var Engine = (function(global) {
  var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime;

  canvas.width = 501;
  canvas.height = 606;
  canvas.boundaries = {
    'up': 0,
    'right': 400,
    'down': 400,
    'left': 0
  };
  doc.body.appendChild(canvas);

/*
 * Função principal do game pega a data atual para comparar e criar um padrão
 * de tempo para diferentes maquinas e processamentos diferentes
*/

  function main() {

    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;

    /* Chamando as funções de atualização passando como parâmetro 
     * data/tempo resultante relativo ao game loop anterior para
     * evitar diferênças entre processamento das maquinas e manter
     * o jogo "justo" e também nossa renderização
     * 
     */
    update(dt);
    render();

    /* Fazendo um novo set neste game loop para próxima chamada
     */
    lastTime = now;

    win.requestAnimationFrame(main);
  }

function reset(){
  // Função reset por padrão vazia em nosso app.js temos uso da mesma com prototype  
}

  // Função de inicialização e setando a data/hora atual para inicio do game loop

  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  /* Função de atualização do nosso game loop passando data/hora como parâmetro a função
   * de atualização de entidades que fará a atualização dos inimigos e do nosso jogador 
  */ 
  function update(dt) {
    updateEntities(dt);
  }
  function updateEntities(dt) {
    prize.update();
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
  }

  /* Função para desenhar o game chamando a função de renderização
   * esta função será chamada a cada game loop para redesenhar e criar
   * a ilusão de animação
   */
  function render() {
    // Array com as imagens quais serão desenhadas na tela de acordo loop
    var rowImages = [
        'images/fire-block.png',   // Primeira linha da cena blocos de lava (Jogador reseta caso atingir esses blocos)
        'images/stone-block.png',   // linha 1/3 blocos de pedra por onde passa os inimigos
        'images/stone-block.png',   // linha 2/3 blocos de pedra por onde passa os inimigos
        'images/stone-block.png',   // linha 3/3 blocos de pedra por onde passa os inimigos
        'images/grass-block.png',   // Linha 1/2 gramado
        'images/grass-block.png'    // Linha 2/2 gramado
      ],
      numRows = 6, // Numero de linhas relacionadas acima
      numCols = 5, // Numero de colunas
      row, col;

    /* 
     * Loop percorrendo nossas linhas e colunas definidas desenhando nosso cenário
    */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* Função para desenhar em nosso contexto canvas nosso cenário
         * como parâmetro passamos a imagem a desenhar coordenada x e y
         */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }
    renderEntities();
  }

  /* Função de renderização qual será chamada a cada game loop
   * renderizando inimigos e o player definidos
   */
  function renderEntities() {
    start.render();
    prize.render();
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });

    player.render();
  }

  /* Fazendo o load de todas as imagens de cenário e personagens do game
   * desenhando na tela ao carregar a página do game
   */

  Resources.load([
    'images/stone-block.png',
    'images/fire-block.png',
    'images/grass-block.png',
    'images/enemy.png',
    'images/urahara.png',
    'images/udprize.png',
    'images/Selector.png'
  ]);
  Resources.onReady(init);

  /* Adicionando objeto de contexto do canvas a uma variável global 
   * facilitando uso em nosso arquivo app.js
   */
  global.canvas = canvas;
  global.ctx = ctx;
})(this);