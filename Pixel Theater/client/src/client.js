// Server stuff
const sock = io();


// Handle serversided events here
sock.emit('initCL', 'datahere'); // On first join

sock.on('tick', () => { // On each server tick
  draw();
});


// Handle clientsided events here / Main
var c = null;

var keys = [];



window.onload = function() {
  c = document.getElementById('canvas').getContext('2d');
  draw();
  c.font = "bold 8pt sans-serif";
};

function draw() {
  if (c == null) { return; }
  
  player.draw();
};



class Player { // Client player
  constructor(x, y) {
    this.w = 16;
    this.h = 16;
    this.x = x;
    this.y = y;
  };

  draw() {
    c.beginPath();
    c.fillStyle = "#ff0000";
    c.fillRect(this.x-8, this.y-8, this.x+8, this.y+8);
    c.fillRect(10,10,14,14);
    c.closePath();
  }
};

const player = new Player(32, 32);


// Keystrokes
addEventListener('keydown', function (e) { // Keys down
  keys[e.key.toUpperCase()] = true;
});
addEventListener('keyup', function (e) { // Keys up
  keys[e.key.toUpperCase()] = false;
});