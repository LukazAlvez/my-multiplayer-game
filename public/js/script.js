var socket = io();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const chat = document.getElementById('chat');
const playerList = document.getElementById('players');

document.addEventListener('keydown', control);

let players;
let player;
let playerId;
let messages = [];
let food;

socket.on('setPlayers', data => {
  players = data;
  playerId = socket.id;
  players.map(p => {
    if (p.id === playerId) {
      player = p;
    }
  });
});

getName();
getMessage();
setFood();
setInterval(game, 60);

// render =>
function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  colisionMap(player);
  setPlayer();
  renderNames();
  colision(player, food, getFood);
  //   render others player
  if (players) {
    players.map(p => {
      if (p.id !== playerId) {
        render(p);
        renderText(p.name, '#eeeeee', p.x + p.width / 2, p.y + p.height + 10);
        renderMessage(p);
      }
    });
  }
  //   render player
  render(player, player.color);
  // render other
  render(food, food.color);
  renderMessage(player);
} //   <= render

function setPlayer() {
  player.name = playerName;
  socket.emit('myPosition', player);
  socket.on('newPositions', data => {
    players = data;
  });
}

function render(obj, color = '#222222') {
  if (obj) {
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#222222';
    ctx.fillStyle = color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }
}
function colisionMap(obj) {
  if (obj.x < 0) {
    obj.x = 0;
  }
  if (obj.y < 0) {
    obj.y = 0;
  }
  if (obj.x + obj.width > canvas.width) {
    obj.x = canvas.height - obj.width;
  }
  if (obj.y + obj.height > canvas.height) {
    obj.y = canvas.height - obj.height;
  }
}

function renderText(text, color, x, y, font = 'sans-serif', size = '12') {
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.font = ` ${size}px ${font}`;
  ctx.fillText(text, x, y, canvas.width);
}

function getName() {
  const input = prompt('Enter your name:');
  if (input === '') {
    getName();
  } else {
    playerName = input;
  }
}

function control(event) {
  switch (event.keyCode) {
    case 37: //left
      player.x -= player.speed;
      event.preventDefault();
      break;
    case 38: //up
      player.y -= player.speed;
      event.preventDefault();
      break;
    case 39: //right
      player.x += player.speed;
      event.preventDefault();
      break;
    case 40: //down
      player.y += player.speed;
      event.preventDefault();
      break;
    case 13:
      sendMessage();
      break;
  }
}

function sendMessage() {
  if (chat.value === '') {
    return;
  }
  socket.emit('sendMessage', chat.value);
  chat.value = '';
}

function getMessage() {
  socket.on('getMessage', message => {
    messages = message;
  });
}
function renderMessage(player) {
  if (messages) {
    messages.map(m => {
      if (m.id === player.id) {
        renderText(
          m.message,
          '#eeeeee',
          player.x + player.width / 2,
          player.y - 10,
        );
        setTimeout(() => {
          m.message = '';
        }, 10000);
      }
    });
  }
}
function renderNames() {
  playerList.innerHTML = '';
  players.map(p => {
    playerList.innerHTML += `<b>${p.name}</b><br>`;
  });
}

function setFood() {
  socket.on('spawnFood', data => {
    food = data;
  });
}

function getFood() {
  setTimeout(() => {
    socket.emit('getFood', player);
    setFood();
  }, 1000);
}

function colision(player, obj, func) {
  if (player && obj) {
    let p = player;
    let o = obj;
    if (
      p.x < o.x + o.width &&
      p.x + p.width > o.x &&
      p.y < o.y + o.height &&
      p.y + p.height > o.y
    ) {
      return func();
    }
  }
}

// const chat = document.getElementById('chat');

// let listPlayer = document.getElementById('players');
// listPlayer.innerHTML += `<p>${input}</p>`;

// socket.emit('start');

// socket.on('spawnFood', data => {
//   food = data;
// });

// socket.on('winner', id => {
//   let winner = document.getElementById('winner');
//   players.map(p => {
//     if (p.id === id) {
//       winner.innerHTML = `<h2>${p.char.name} winner!!!</h2>`;
//     }
//   });
//   console.log(id + ' venceu');
// });

// let players;
// let player;
// let id;
// let server;
// let messages;
// let myMessage;
// let food;

// setInterval(game, 30);

// function game() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   socket.emit('setPosition', player);

//   socket.on('newPositions', positions => {
//     server = positions;
//     positions.map(p => {
//       if (p.id === id) {
//         player.char.width = p.char.width;
//         player.char.height = p.char.height;
//       }
//     });
//     playersOn(server);
//   });

//   socket.on('messages', data => {
//     messages = data;
//   });

//   if (messages) {
//     server.map(p => {
//       if (p.id === messages.id) {
//         drawText(messages.message, '#eeeeee', p.char.x, p.char.y - 5);
//         setTimeout(() => {
//           messages = '';
//         }, 5000);
//       }
//     });
//   }

//   if (myMessage) {
//     drawText(myMessage, '#eeeeee', player.char.x, player.char.y - 5);
//   }

//   if (players) {
//     players.map(p => {
//       if (p.id === id) {
//         player = p;
//         player.char.name = input;
//       }
//     });
//   }

//   // desenhando jogadores conectados
//   if (server) {
//     server.map(p => {
//       if (p.id === id) {
//         return;
//       } else {
//         draw(p.char.x, p.char.y, p.char.width, p.char.height, '#111111');
//         drawText(
//           p.char.name,
//           '#eeeeee',
//           p.char.x,
//           p.char.y + p.char.height + 10,
//         );
//       }
//     });
//   }

//   // desenhando o jogador
//   if (player) {
//     draw(
//       player.char.x,
//       player.char.y,
//       player.char.width,
//       player.char.height,
//       player.char.color,
//     );
//   }

//   // desenhando food

//   if (food) {
//     draw(food.x, food.y, food.width, food.height, food.color);
//   }

//   if (server) {
//     if (server.length > 0) {
//       colisionFood();
//     }
//   }

//   if (player) {
//     if (player.char.x < 0) {
//       player.char.x = 1;
//     }
//     if (player.char.y < 0) {
//       player.char.y = 1;
//     }
//     if (player.char.x + player.char.width > canvas.height) {
//       player.char.x -= 5;
//     }
//     if (player.char.y + player.char.height > canvas.width) {
//       player.char.y -= 5;
//     }
//   }
// }

//

// function playersOn(players) {
//   listPlayer.innerHTML = '';
//   players.map(p => {
//     listPlayer.innerHTML += `<b>${p.char.name}</b> <span>Food: ${p.char.score}</span><br>`;
//   });
// }

// function message() {
//   myMessage = chat.value;

//   if (chat.value === '') {
//     return;
//   }
//   socket.emit('message', chat.value);

//   chat.value = '';

//   setTimeout(() => {
//     myMessage = '';
//   }, 5000);
// }
// function control(event) {
//   switch (event.keyCode) {
//     case 37: //left
//       event.preventDefault();
//       player.char.x -= player.char.speed;
//       break;
//     case 38: //up
//       event.preventDefault();
//       player.char.y -= player.char.speed;
//       break;
//     case 39: //right
//       event.preventDefault();
//       player.char.x += player.char.speed;
//       break;
//     case 40: //down
//       event.preventDefault();
//       player.char.y += player.char.speed;
//       break;
//     case 13:
//       message();
//       break;
//   }
// }

// function colisionFood() {
//   if (player && food) {
//     let p = player.char;
//     let f = food;
//     if (
//       p.x < f.x + f.width &&
//       p.x + p.width > f.x &&
//       p.y < f.y + f.height &&
//       p.y + p.height > f.y
//     ) {
//       food = '';
//       setTimeout(() => {
//         getFood();
//         socket.emit('start');
//       }, 1000);
//     }
//   }
// }

// function getFood() {
//   socket.emit('getFood', id);
// }
