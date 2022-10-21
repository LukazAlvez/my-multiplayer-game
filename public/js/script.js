var socket = io();
const input = prompt('Please enter your name:');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const chat = document.getElementById('chat');

let listPlayer = document.getElementById('players');
listPlayer.innerHTML += `<p>${input}</p>`;

document.addEventListener('keydown', control);

socket.on('players', data => {
  players = data;
  id = socket.id;
});

socket.emit('start');

socket.on('spawnFood', data => {
  food = data;
});

socket.on('winner', id => {
  let winner = document.getElementById('winner');
  players.map(p => {
    if (p.id === id) {
      winner.innerHTML = `<h2>${p.char.name} winner!!!</h2>`;
    }
  });
  console.log(id + ' venceu');
});

let players;
let player;
let id;
let server;
let messages;
let myMessage;
let food;

setInterval(game, 30);

function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  socket.emit('setPosition', player);

  socket.on('newPositions', positions => {
    server = positions;
    positions.map(p => {
      if (p.id === id) {
        player.char.width = p.char.width;
        player.char.height = p.char.height;
      }
    });
    playersOn(server);
  });

  socket.on('messages', data => {
    messages = data;
  });

  if (messages) {
    server.map(p => {
      if (p.id === messages.id) {
        drawText(messages.message, '#eeeeee', p.char.x, p.char.y - 5);
        setTimeout(() => {
          messages = '';
        }, 5000);
      }
    });
  }

  if (myMessage) {
    drawText(myMessage, '#eeeeee', player.char.x, player.char.y - 5);
  }

  if (players) {
    players.map(p => {
      if (p.id === id) {
        player = p;
        player.char.name = input;
      }
    });
  }

  // desenhando jogadores conectados
  if (server) {
    server.map(p => {
      if (p.id === id) {
        return;
      } else {
        draw(p.char.x, p.char.y, p.char.width, p.char.height, '#111111');
        drawText(
          p.char.name,
          '#eeeeee',
          p.char.x,
          p.char.y + p.char.height + 10,
        );
      }
    });
  }

  // desenhando o jogador
  if (player) {
    draw(
      player.char.x,
      player.char.y,
      player.char.width,
      player.char.height,
      player.char.color,
    );
  }

  // desenhando food

  if (food) {
    draw(food.x, food.y, food.width, food.height, food.color);
  }

  if (server) {
    if (server.length > 0) {
      colisionFood();
    }
  }

  if (player) {
    if (player.char.x < 0) {
      player.char.x = 1;
    }
    if (player.char.y < 0) {
      player.char.y = 1;
    }
    if (player.char.x + player.char.width > canvas.height) {
      player.char.x -= 5;
    }
    if (player.char.y + player.char.height > canvas.width) {
      player.char.y -= 5;
    }
  }
}

function draw(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
function drawText(text, color, x, y, font = 'sans-serif', size = '13') {
  ctx.fillStyle = color;
  ctx.font = ` ${size}px ${font}`;
  ctx.fillText(text, x, y, canvas.width);
}
function playersOn(players) {
  listPlayer.innerHTML = '';
  players.map(p => {
    listPlayer.innerHTML += `<b>${p.char.name}</b> <span>Food: ${p.char.score}</span><br>`;
  });
}

function message() {
  myMessage = chat.value;

  if (chat.value === '') {
    return;
  }
  socket.emit('message', chat.value);

  chat.value = '';

  setTimeout(() => {
    myMessage = '';
  }, 5000);
}
function control(event) {
  switch (event.keyCode) {
    case 37: //left
      event.preventDefault();
      player.char.x -= player.char.speed;
      break;
    case 38: //up
      event.preventDefault();
      player.char.y -= player.char.speed;
      break;
    case 39: //right
      event.preventDefault();
      player.char.x += player.char.speed;
      break;
    case 40: //down
      event.preventDefault();
      player.char.y += player.char.speed;
      break;
    case 13:
      message();
      break;
  }
}

function colisionFood() {
  if (player && food) {
    let p = player.char;
    let f = food;
    if (
      p.x < f.x + f.width &&
      p.x + p.width > f.x &&
      p.y < f.y + f.height &&
      p.y + p.height > f.y
    ) {
      console.log('colidio');
    }
  }
}

// socket.emit('start');
// getFood();
// console.log('spawFood');

function getFood() {
  socket.emit('getFood', id);
}
