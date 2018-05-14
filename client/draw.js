var socket = io.connect("http://localhost:3000");

// game variables

// paddles
var plen = 100
var p1 = 150
var p2 = 150

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

$(document).keydown(function(code){
  console.log("keypres")
    if (code.which === 38){
      socket.emit("keyPress", {
      direction:"up"})
      console.log("up")
    }else if (code.which == 40) {
      socket.emit("keyPress",{
      direction: "down"})
      console.log("down")
}})

function setup(){
 var width = 600
 var height = 400
  //var width = screen.width * 0.5;
  //var height = ceil(width / 1.42222)
  var canvas = createCanvas(width, height)
  canvas.parent("canvasContainer")
  frameRate(30)
}

function draw(){
  background(51)
  // limit the movement of paddles
  p1 = constrain(p1, 5, height - 100 - 5)
  p2 = constrain(p2, 5, height - 100 - 5)
  ballX = constrain(ballX, radius*2, width - radius * 2)
  // draw ball
  ellipse(ballX, ballY, radius * 2, radius * 2)
  // draw paddles
  Paddle(10,p1)
  Paddle(width - radius * 2, p2)
  keyPress()
  var x = moveBall()
  if (x === 1){
    moveBall()
  }
}

function moveBall(){
  // handle regular moving
  ballX = ballX + vX
  ballY = ballY + vY
  // handle top/bottom
  if (ballY < 5 || ballY > height - 5){
    vY = vY * -1
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
      vX = round(-1 * vX)
      console.log("vX is " + vX)
      vY = bSpeed * -Math.sin(angle * (180 / Math.PI) + Math.PI / 4)
      vY = ceil(-1 * vY)
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
      vX = round(1 * vX)
      console.log("vX is " + vX)
      vY = bSpeed * -Math.sin(angle * (180 / Math.PI) + Math.PI / 4)
      vY = ceil(-1 * vY)
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

// handles keypresses
function keyPress(){
  if(keyIsDown(DOWN_ARROW)){
    p1 = p1 + 10
  }
  else if (keyIsDown(UP_ARROW)){
    p1 = p1 - 10
  }
}

function Paddle(x,y){
  var x = x
  var y = y
  rect(x, y, 10, plen)
}
