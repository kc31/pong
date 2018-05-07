// paddles
var plen = 100
var p1 = 150
var p2 = 150

// ball location
var ballX = 300
var ballY = 200

// ball movement
var bSpeed = 10
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

function setup(){
  var width = 600
  var height = 400
  createCanvas(width, height)
  frameRate(30)
}

function draw(){
  background(51)
  // limit the movement of paddles
  p1 = constrain(p1, 5, 295)
  p2 = constrain(p2, 5, 295)
  ballX = constrain(ballX, 40, 560)
  // draw ball
  ellipse(ballX, ballY, 20, 20)
  // draw paddles
  Paddle(10,p1)
  Paddle(width - 20, p2)
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
  if (ballY < 5 || ballY > 400){
    vY = vY * -1
    return 0
  }
  // handle left/right walls
  if (ballX <= 40 || ballX >= 560){
    if (ballY >= p1 && ballY <= p1 + plen){
      console.log("paddle hit")
      // creds on the guy on ricket on xna for the idea
      // logic to calculate new vX and vY based on ball hit location relative to
      // paddle
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
    else if (ballY >= p2 && ballY <= p2 + plen){
      console.log("paddle hit")
      var relIntersect = (p2 + (plen / 2)) - ballY + 10
      var normalized = (relIntersect / (plen / 2))
      angle = normalized * 5 * Math.PI / 12
      vX = bSpeed * Math.cos(angle * (180 / Math.PI) + Math.PI / 4)
      vX = -1 * vX
      console.log("vX is " + vX)
      vY = bSpeed * -Math.sin(angle * (180 / Math.PI) + Math.PI / 4)
      return 1
    }
    else{
      console.log("game over")
      vX = 0
      vY = 0
      ballX = 300
      ballY = 200
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
