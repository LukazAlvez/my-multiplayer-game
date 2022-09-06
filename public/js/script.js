var socket = io("http://localhost:3000");

const canvas =document.getElementById("canvas");
const ctx = canvas.getContext("2d");

document.addEventListener("keydown", control)


socket.on("setPosition", data=>{
    console.log("setPosition....ok")
    char = data
} )

let char;

let usersConnected

console.log

setInterval(game, 60);

function game(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    socket.on('serverPosition', data=>{
        usersConnected = data
    })
    socket.emit("charPosition", char)
    

    if(char){
        draw(char.px, char.py, char.width, char.height, char.color)
    }    
    if(usersConnected){
        draw(usersConnected.px, usersConnected.py, usersConnected.width, usersConnected.height, "green")
    }
    

    if(char.px < 0){
        char.px = 1
    }
    if(char.py < 0){
        char.py = 1
    }
    if(char.px > canvas.height){
        char.px -= 20
    }
    if(char.py > canvas.width){
        char.py -= 20
    }

}
function draw(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function control(event){
    switch(event.keyCode){
        case 37://left
            char.px -= char.speed;
            break;
        case 38://up
            char.py -= char.speed;
            break;
        case 39://right
            char.px += char.speed;
            break;
        case 40://down
            char.py += char.speed;
            break;
    }
}

