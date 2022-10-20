
var socket = io();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let listPlayer = document.getElementById('players')

document.addEventListener("keydown", control)

console.log(canvas.height, canvas.width)

socket.on("players", data =>{
    players = data;
    id = socket.id
    listPlayer.innerHTML = ""
    players.map(p =>{
        listPlayer.innerHTML += `<p>${p.id}</p>`
    })
})

let players;
let player;
let id;
let server

setInterval(game, 30);

function game(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    socket.emit("setPosition", player)
    socket.on("newPositions", positions =>{
        server = positions
    })
        
    
    if(players){
        players.map((p)=>{
            if(p.id === id){
                player = p
            }
        })
    }
    if(server){
        server.map((p)=>{
            if(p.id === id){
               return
            }else{
                draw(p.char.x, p.char.y, p.char.width, p.char.height, "black")
            }
        })
    }

    if(player){
        draw(player.char.x, player.char.y, player.char.width, player.char.height, player.char.color)
    }

    

    if(player.char.x< 0){
        player.char.x = 1
    }
    if(player.char.y < 0){
        player.char.y = 1
    }
    if(player.char.x > canvas.height){
        player.char.x -= 20
    }
    if(player.char.y > canvas.width){
        player.char.y -= 20
    }

}

function draw(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function control(event){
    switch(event.keyCode){
        case 37://left
            player.char.x -= player.char.speed;
            break;
        case 38://up
            player.char.y -= player.char.speed;
            break;
        case 39://right
            player.char.x += player.char.speed;
            break;
        case 40://down
            player.char.y += player.char.speed;
            break;
    }
}