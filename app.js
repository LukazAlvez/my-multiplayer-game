const express = require("express");
const path = require("path")

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { match } = require("assert");
const io = new Server(server)

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

app.get("/", (req, res)=>{
    res.render('index.html')
});


let char = {
    px: Math.floor(Math.random()*501),
    py: Math.floor(Math.random()*501),
    width: 20,
    height: 20,
    speed: 20,
    color: 'black'
}

io.on("connection", (socket) =>{
    console.log("um usuario se conectou")

    socket.emit("setPosition", char)

    socket.on('charPosition', data=>{
        socket.broadcast.emit("serverPosition", data)
    })
})

server.listen(3000, () => {
    console.log("rodado na porta 3000")
})
