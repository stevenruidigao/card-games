var canvas = document.getElementById('canvas');
canvas.hidden = false;
var p = document.getElementById('enableJS');
p.hidden = true;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight - 50;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#50F050";
ctx.fillRect(0, 0, canvas.width, canvas.height);
window.online = true;