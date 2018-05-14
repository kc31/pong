var express = require("express");
var app = express();

var server = app.listen(3000, function(){
  console.log("listening to requests on 3000")})

app.use(express.static("public"))

// socket setup
var socket = require("socket.io");
var io = socket(server);

io.on('connection', function(socket){
  console.log("made socket connection", socket.id)
  socket.on("keyPress", function(data){
    if (data.direction === "up"){
      console.log("server says received " + data.direction)
    } 
    else if (data.direction === "down"){
      console.log("server says received " + data.direction)
    } 
  })
  socket.on("disconnect", function(){
    console.log("disconnected")})})


