// make connection


var socket = io.connect("http://localhost:3000");

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

