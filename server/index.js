var express = require("express");
var app = express();

var server = app.listen(3000, function(){
  console.log("listening to requests on 3000")})

app.use(express.static("../client/"))

// socket setup
var socket = require("socket.io");
var io = socket(server);

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

// what to do when socket is active
io.on('connection', function(socket){
  console.log("made socket connection", socket.id)
  // handle key downs
  socket.on("keyPress", function(data){
    if (data.direction === "up"){
      console.log("server says received " + data.direction + " press from " + socket.id)
    } 
    else if (data.direction === "down"){
      console.log("server says received " + data.direction + " press from " + socket.id)
    } 
  })
  // handle key up
  socket.on("keyPress", function(data){
    if (data.direction === "up"){
      console.log("server says received " + data.direction + " release from " + socket.id)
    } 
    else if (data.direction === "down"){
      console.log("server says received " + data.direction + " release from " + socket.id)
    } 
  })
  socket.on("disconnect", function(){
    console.log("disconnected")})})


