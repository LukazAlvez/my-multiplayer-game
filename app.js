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
    return({
    x: Math.floor(Math.random()*501),
    y: Math.floor(Math.random()*501),
    width: 20,
    height: 20,
    speed: 20,
    color: 'green'
    })
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
                    }
                })
        }    
        socket.broadcast.emit("newPositions", players)
    } )


    socket.on("disconnect", () =>{
        removePlayer(socket)
        socket.broadcast.emit("players", players)
        console.log(`usuario ${socket.id} se desconectou`)
        console.log(players)
    })
})

server.listen(3000, () => {
    console.log("rodado na porta 3000")
})

const removePlayer = (socket) => {
    players.map((player, i) =>{
        if (player.id === socket.id){
            players.splice(i, 1)
        }
        
    })
}

const verificarPlayer = (socket) => {
    players.push({
                id: socket.id,
                char: char() 
            })

    // if(players.length === 0){
    //     players.push({
    //         id: socket.id,
    //         char: char() 
    //     })
    //     console.log(`usuario ${socket.id} se conectou`)
    //     return
    // }else{
    //     players.map(p =>{
    //       if(p.id === socket.id ){
    //         return
    //       }else{
    //         players.push({
    //             id: socket.id,
    //             char: char() 
    //         })
    //         console.log(`usuario ${socket.id} se conectou`)
    //       }
    //     })
    // }
}
