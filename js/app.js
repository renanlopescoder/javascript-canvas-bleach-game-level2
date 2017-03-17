var pontuacao = 0;
var mortes = 0;
var STEP = 50;
const STEP_X = 101;
const STEP_Y = 83;

// funções do game
function getDificuldade() {
  return pontuacao * STEP;
}

function numeroAleatorio(minimum, maximum) {
  return Math.floor(Math.random()*(maximum - minimum + 1) + minimum);
}

function selectRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function checkCollision(object, player) {
  return (player.x > object.x - object.hitBox.x/2 &&
          player.x < object.x + object.hitBox.x/0.8 &&
          player.y > object.y - object.hitBox.y/2 &&
          player.y < object.y + object.hitBox.y/2);
}
// Actor (super class)

var Actor = function(x, y, sprite) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
};
Actor.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Funções do inimigo

var Enemy = function(x, y, sprite) {
  sprite = sprite || 'images/enemy.png';
  Actor.call(this, x, y, sprite);
  this.speed = numeroAleatorio(100, 200);
};

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.hitBox = {'x': 106, 'y': 83};
Enemy.prototype.startY = [68, 151, 234];
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(dt) {

  // update position and wrap-around if past edge
  if (this.x <= (canvas.width + this.hitBox.x/2)) {
    this.x += (this.speed + getDificuldade()) * dt;
  } else {
    this.x = -this.hitBox.x;
    this.y = selectRandom(this.startY);
    this.speed = numeroAleatorio(100, 200);
  }

  // Checando "encontro" do jogador com o inimigo e fazendo reset do player para local inicial
  if (checkCollision(this, player)) {
    player.reset();
    mortes += 1;
    $('#mortes').text(mortes);
  }
};

// Funções do Jogador
var Player = function(x, y, sprite) {
  sprite = sprite || 'images/urahara.png';
  x = x || 200;
  y = y || 400;
  Actor.call(this, x, y, sprite);
};
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function() {

  // Movimentação do Jogador
  
  switch(this.action) {
    case 'up':
      if (this.y > canvas.boundaries.up) {
        this.y -= STEP_Y;
      }
      break;
    case 'right':
      if (this.x < canvas.boundaries.right) {
        this.x += STEP_X;
      }
      break;
    case 'down':
      if (this.y < canvas.boundaries.down) {
        this.y += STEP_Y;
      }
      break;
    case 'left':
      if (this.x > canvas.boundaries.left) {
        this.x -= STEP_X;
      }
      break;
  }

  // posição

  if (this.position !== this.x + ',' + this.y) {
    this.position = this.x + ',' + this.y;
    // console.log(this.position);
  }
  
  this.action = null;

  // Resetando ao chegar no fogo
  if (this.y < 25) {
    this.reset();
  }

};
Player.prototype.handleInput = function(e) {
  this.action = e;
};
Player.prototype.reset = function() {
  this.x = 200;
  this.y = 400;
};

// Pegando item
var Prize = function(x, y, sprite) {
  sprite = sprite || 'images/udprize.png';
  x = x || 200;
  y = y || 68;
  Actor.call(this, x, y, sprite);
};

Prize.prototype = Object.create(Actor.prototype);
Prize.prototype.hitBox = {'x': 80, 'y': 83};
Prize.prototype.startX = [-2, 99, 200, 301, 402];
Prize.prototype.constructor = Prize;
Prize.prototype.update = function(dt) {

  // lidando com "encontro" jogador com inimigo
  if (checkCollision(this, player)) {
    
    // resetando posição do jogador ao colidir com inimigo
    player.reset();
    
    this.x = selectRandom(this.startX);
    pontuacao += 1;
    $('#score').text(pontuacao);

  }
};

// Inicio
var Start = function(x, y, sprite) {
  sprite = sprite || 'images/Selector.png';
  x = x || 200;
  y = y || 375;
  Actor.call(this, x, y, sprite);
};
Start.prototype = Object.create(Actor.prototype);
Start.prototype.constructor = Start;
Start.prototype.update = function(dt) {};


// Inicializando objetos criando array (lista) de inimigos e objeto do jogador

var allEnemies = [
  new Enemy(-100, 68),
  new Enemy(-100, 151),
  new Enemy(-100, 234)
];
var player = new Player();
var prize = new Prize();
var start = new Start();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

