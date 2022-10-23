const express = require('express');
const path = require('path');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { on } = require('events');
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html');
});

const port = process.env.PORT || 3000;

function player(id) {
  return {
    id: id,
    x: Math.floor(Math.random() * 490),
    y: Math.floor(Math.random() * 490),
    width: 15,
    height: 15,
    speed: 15,
    score: 0,
    name: 'Player',
    color: 'green',
  };
}

function food() {
  return {
    x: Math.floor(Math.random() * 490),
    y: Math.floor(Math.random() * 490),
    width: 10,
    height: 10,
    color: 'red',
  };
}

let players = [];
let messages = [];

io.on('connection', socket => {
  newPlayer(socket);
  setFood();
  getFood(socket);
  setPlayers(players);
  setPosition(socket);
  sendMessage(socket);

  socket.on('disconnect', () => {
    removePlayer(socket);
    setPlayers(players);
  });
});

// funçoes

const setPosition = socket => {
  socket.on('myPosition', position => {
    players.map(p => {
      if (p.id === position.id) {
        p.x = position.x;
        p.y = position.y;
        p.name = position.name;
      }
    });
    io.emit('newPositions', players);
  });
};
const setPlayers = players => {
  io.emit('setPlayers', players);
};

const newPlayer = socket => {
  players.push(player(socket.id));
};
const removePlayer = socket => {
  players.map((player, i) => {
    if (player.id === socket.id) {
      players.splice(i, 1);
    }
  });
};

const sendMessage = socket => {
  socket.on('sendMessage', message => {
    messages.push({
      id: socket.id,
      message: message,
    });
    io.emit('getMessage', messages);
  });
};

const setFood = () => {
  io.emit('spawnFood', food());
};

const getFood = socket => {
  socket.on('getFood', player => {
    setFood();
  });
};

server.listen(port, () => {
  console.log('Servidor online...');
});

//     verificarPlayer(socket)

//     socket.on("start", ()=>
//         io.emit("spawnFood", food() )
//     )

//     socket.on("getFood", id =>{
//         players.map(p =>{
//             if(p.id === id){
//                 p.char.width += 5
//                 p.char.height += 5
//                 p.char.score += 1
//             }
//         })
//         players.map(p =>{
//             if(p.char.score === 10){
//                 socket.emit("winner", p.id)
//                 players.map(p =>{
//                     p.char.score = 0
//                     p.char.width = 15
//                     p.char.height = 15
//                 })
//             }
//         })
//     })

//     io.emit("players", players)
//     socket.emit("players", players)

//     socket.on("setPosition", positions =>{
//         if(positions){
//             players.map(p=>{
//                     if(p.id === positions.id){
//                         p.char.x = positions.char.x;
//                         p.char.y = positions.char.y
//                         p.char.name = positions.char.name
//                     }
//                 })
//         }
//         socket.broadcast.emit("newPositions", players)
//     } )

//     socket.on("message", data => {
//         socket.broadcast.emit("messages", {message:data, id:socket.id})
//     })

//     socket.on("disconnect", () =>{
//         removePlayer(socket)
//         socket.broadcast.emit("newPositions", players)
//         console.log(`usuario ${socket.id} se desconectou`)
//         players.map(p => {console.log(p.id)})
//     })
// })

// const removePlayer = (socket) => {
//     players.map((player, i) =>{
//         if (player.id === socket.id){
//             players.splice(i, 1)
//         }

//     })
// }

// const verificarPlayer = (socket) => {
//     console.log(`usuario ${socket.id} se conectou`)
//     players.push({
//                 id: socket.id,
//                 char: char()
//             })
// }
