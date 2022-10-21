const express = require("express");
const path = require("path")

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

app.get("/", (req, res)=>{
    res.render('index.html')
});

const port = process.env.PORT || 3000


function char () {
    return(
        {
            x: Math.floor(Math.random()*401),
            y: Math.floor(Math.random()*401),
            width: 20,
            height: 20,
            speed: 20,
            score: 0,
            name: 'Player',
            color: 'green'
        }
    )
}

function food (){
    return(
        { 
            x: Math.floor(Math.random()*400),
            y: Math.floor(Math.random()*400),
            width: 10,
            height: 10,
            color: "red"
        }
    )
}
            

let players = []

io.on("connection", (socket) =>{

    verificarPlayer(socket)

    io.emit("players", players)
    socket.emit("players", players)

    socket.on("setPosition", positions =>{
        if(positions){
            players.map(p=>{
                    if(p.id === positions.id){
                        p.char.x = positions.char.x;
                        p.char.y = positions.char.y
                        p.char.name = positions.char.name
                    }
                })
        }    
        socket.broadcast.emit("newPositions", players)
    } )


    socket.on("message", data => {
        socket.broadcast.emit("messages", {message:data, id:socket.id})
    })


    socket.on("disconnect", () =>{
        removePlayer(socket)
        socket.broadcast.emit("newPositions", players)
        console.log(`usuario ${socket.id} se desconectou`)
        players.map(p => {console.log(p.id)})
    })
})

server.listen(port, () => {
    console.log("Servidor online...")
})

const removePlayer = (socket) => {
    players.map((player, i) =>{
        if (player.id === socket.id){
            players.splice(i, 1)
        }
        
    })
}

const verificarPlayer = (socket) => {
    console.log(`usuario ${socket.id} se conectou`)
    players.push({
                id: socket.id,
                char: char() 
            })
}
