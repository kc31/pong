var express = require("express");
var app = express();

var server = app.listen(3000, function(){
  console.log("listening to requests on 3000")})

app.use(express.static("../client/"))

// socket setup
var socket = require("socket.io");
var io = socket(server);

// %%%% game variables %%%% 
// game canvas
var width = 600
var height = 400
// paddles
var plen = 100
var p1 = 150
var p2 = 150
var p1Move = false;
var p1Direction
var p2Move = false;
var p2Direction

// ball location
var ballX = 300
var ballY = 200

// ball movement
var bSpeed = 10

// ball size
var radius = 10
/*
var angle = Math.floor(Math.random() * (90 - 0 + 1)) + 0;
console.log(angle)
console.log(Math.cos(angle * (180 / Math.PI) + Math.PI / 4))
var vX = bSpeed * Math.cos(angle * (180 / Math.PI) + Math.PI / 4)
console.log("vX " + vX)
var vY = bSpeed * Math.sin(angle * (180 / Math.PI) + Math.PI / 4)
console.log("vY " + vY)
*/
var vX = -bSpeed
var vY = 0
// %%%% end of game variables %%%% 


// what to do when socket is active
io.on('connection', function(socket){
  console.log("made socket connection", socket.id)
  // when client wants to move paddle
  socket.on("keyPress", function(data){
    if (data.direction === "up"){
      console.log("server says received " + data.direction + " press from " + socket.id)
      p1Move = true
      p1Direction = 1
    } 
    else if (data.direction === "down"){
      console.log("server says received " + data.direction + " press from " + socket.id)
      p1Move = true
      p1Direction = -1
    } 
  })
  // handle key up
  socket.on("keyUp", function(data){
    if (data.direction === "up"){
      console.log("server says received " + data.direction + " release from " + socket.id)
      p1Move = false
    } 
    else if (data.direction === "down"){
      console.log("server says received " + data.direction + " release from " + socket.id)
      p1Move = false
    } 
  })
  socket.on("disconnect", function(){
    console.log("disconnected")})})


function movePaddle1(){
  if (p1Direction === 1){
    p1 = p1 - 10
  }
  else if (p1Direction === -1){
    p1 = p1 + 10
  }
  //console.log(p1Move)
}

function movePaddle2(){
  if (p2Move == true){
    if (p2Direction === "up"){
      p2 = p2 - 10
    }
    else if (p2Direction === "down"){
      p2 = p2 + 10
    }
  }
  else{}
}

function moveBall(){
  // handle regular moving
  ballX = ballX + vX
  ballY = ballY + vY
  // handle top/bottom
  if (ballY < 5 || ballY > height - 5){
    vY = vY *  1
    return 0
  }
  // handle left/right walls
  if (ballX <= 30 ){
    // creds on the guy on ricket on xna for the idea
    // logic to calculate new vX and vY based on ball hit location relative to
    // paddle
    if (ballY >= p1 && ballY <= p1 + plen){
      console.log("paddle hit")
      var relIntersect = (p1 + (plen / 2)) - ballY + 10
      var normalized = (relIntersect / (plen / 2))
      angle = normalized * 5 * Math.PI / 12
      vX = bSpeed * Math.cos(angle * (180 / Math.PI) + Math.PI / 4)
      vX = Math.round(-1 * vX)
      console.log("vX is " + vX)
      vY = bSpeed * -Math.sin(angle * (180 / Math.PI) + Math.PI / 4)
      vY = Math.ceil(-1 * vY)
      console.log("vY is " + vY)
      return 1
    }
    else{
      console.log("game over")
      vX = 0
      vY = 0
      ballX = width / 2
      ballY = height / 2
      return -1
    }
  }
  else if (ballX >= width - 30){
    if (ballY >= p2 && ballY <= p2 + plen){
      console.log("paddle hit")
      var relIntersect = (p2 + (plen / 2)) - ballY + 10
      var normalized = (relIntersect / (plen / 2))
      angle = normalized * 5 * Math.PI / 12
      vX = bSpeed * Math.cos(angle * (180 / Math.PI) + Math.PI / 4)
      vX = Math.round(1 * vX)
      console.log("vX is " + vX)
      vY = bSpeed * -Math.sin(angle * (180 / Math.PI) + Math.PI / 4)
      vY = Math.ceil(-1 * vY)
      console.log("vY is " + vY)
      return 1
    }
    else{
      console.log("game over")
      vX = 0
      vY = 0
      ballX = width / 2
      ballY = height / 2
      return -1
    }
  }
}

function gameRefresh(){
  if (p1Move){
    movePaddle1()
  }
  //console.log("p1 " + p1)
  movePaddle2()
  var ballEvent = moveBall() 
  if (ballEvent === 1){
  // alert everyone ball velocity has hit a paddle
  // and velocity needs to be changed
    io.emit('tick', {vX: vX, vY: vY})
  }
  else if (ballEvent === 0){
  // alert everyone the ball has hit the top/bottom boundaries
    io.emit('tick', {vX: vX, vY: vY})
  }
  else if (ballEvent == -1){
  // player has scored. 
    io.emit('tick', {vX: vX, vY: vY})
  }
}

// setting game refresh rate
setInterval(gameRefresh, 1000/7) 
