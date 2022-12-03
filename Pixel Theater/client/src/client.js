// Handle serversided events here
const sock = io();
var id = null;
var players = [];
var playersObj = [];

sock.on('CLid', (d) => { // On each server tick
  player.id = d[0];
  players = d[1];
});

sock.on('tick', () => { // On each server tick
  update();
});

sock.on('receiveMovement', (d) => { // On player movement
  var i = players.findIndex(player => player.id==d[0]);
  players[i].x = d[1];
  players[i].y = d[2];
});

sock.on('playerconnect', (d) => { // Update player list when a new player connects
  if (d[1] != player.id) {
    players.push(d[0]);
  };
});
sock.on('playerdisconnect', (d) => { // Update player list when a player disconnects
  var i = players.findIndex(player => player.id==d);
  if (i !== -1) {players.splice(i, 1);}
});

// Handle clientsided events here / main or whatever
var c = null;
const canv = document.querySelector('canvas');
canv.width = 2000, canv.height = 2000;
var keys = [];



window.onload = function() { // Once the website properly loads
  sock.emit('initCL'); // On first join
  c = canv.getContext('2d');
  c.font = "bold 8pt sans-serif";
  
  // This needs to be fixed, I'll do it later (TODO: Render peers)
  //players.forEach((d) => { // Iterate through list of current online players and render them or some shit idk
  //  var peerData = new Peer(d.id, d.x, d.y);
  //  playersObj.push(peerData);
  //  console.log(playersObj);
  //});
};

function update() { // Render game (clear last frame, draw new one)
  if (c == null) { return; } // If the website hasn't properly loaded yet, get out of this procedure
  
  //c.clearRect(player.x-((screen.width/2)-32),player.y-((screen.height/2)-32),player.x+((screen.width/2)+32),player.y+((screen.height/2)+32)); // Clear last frame
  c.clearRect(0,0,canv.width,canv.height);
  window.scrollTo(player.x-innerWidth/2, player.y-innerHeight/2); // Keep player in center of screen

  player.draw(); // Draw client player and later draw peers
  player.update();
};



class Player { // Client player
  constructor(id, x, y) { // Called upon initializing player
    this.w = 16, this.h = 16;
    this.x = x, this.y = y;
    this.id = id;
    this.vel = 2;
  };
  draw() { // Render player
    c.beginPath();
    c.fillStyle = "blue";
    c.arc(this.x, this.y, this.w, 0, 2*Math.PI);
    c.fill()
    c.closePath();
  };
  update() { // Check for input and update player
    if (document.body === document.activeElement) {
      if (keys['SHIFT']) {this.vel = 3} else {this.vel = 2}; // Sprint
      if (keys['S']) { // Down
        this.y += this.vel;
        sock.emit('applyMovement', [this.id, this.x, this.y]);
      };
      if (keys['W']) { // Up
        this.y -= this.vel;
        sock.emit('applyMovement', [this.id, this.x, this.y]);
      };
      if (keys['D']) { // Right
        this.x += this.vel;
        sock.emit('applyMovement', [this.id, this.x, this.y]);
      };
      if (keys['A']) { // Left
        this.x -= this.vel;
        sock.emit('applyMovement', [this.id, this.x, this.y]);
      };
    };
    if (player.x-player.w <= 0) {player.x = player.w}; // Out of bounds
    if (player.y-player.h <= 0) {player.y = player.h}; // Out of bounds
    if (player.x+player.w >= canv.width) {player.x = canv.width-player.w}; // Out of bounds
    if (player.y+player.h >= canv.height) {player.y = canv.height-player.h}; // Out of bounds
  };
};
class Peer { // Server player / peers
  constructor(id, x, y) {
    this.x = x, this.y = y;
    this.id = id;
  };
  draw() {
    c.beginPath();
    c.fillStyle = "red";
    c.arc(this.x, this.y, 16, 0, 2*Math.PI);
    c.fill()
    c.closePath();
  };
};
const player = new Player(id, 16, 16); // Create a new instance of the player


// Keystrokes
addEventListener('keydown', function (e) { // Keys down
  keys[e.key.toUpperCase()] = true;
});
addEventListener('keyup', function (e) { // Keys up
  keys[e.key.toUpperCase()] = false;
});
