// Handle serversided events here
const sock = io();
var id = null;

sock.emit('initCL'); // On first join
sock.on('CLid', (d) => { // On each server tick
  player.id = d;
});

sock.on('tick', () => { // On each server tick
  draw();
  window.scrollTo(player.x-innerWidth/2, player.y-innerHeight/2); // Keep player in center of screen

  if (document.body === document.activeElement) {
    if (keys['SHIFT']) {player.speed = 3} else {player.speed = 2}; // Sprint
    if (keys['S']) { // Down
      sock.emit('requestMovement', [player.id, 3, player.speed]);
    };
    if (keys['W']) { // Up
      sock.emit('requestMovement', [player.id, 1, player.speed]);
    };
    if (keys['D']) { // Right
      sock.emit('requestMovement', [player.id, 4, player.speed]);
    };
    if (keys['A']) { // Left
      sock.emit('requestMovement', [player.id, 2, player.speed]);
    };
  };
});

sock.on('receiveMovement', (d) => { // On player movement
  if (player.x-player.w <= 0) {player.x = player.w}; // Out of bounds
  if (player.y-player.h <= 0) {player.y = player.h}; // Out of bounds
  if (player.x+player.w >= canv.width) {player.x = canv.width-player.w}; // Out of bounds
  if (player.y+player.h >= canv.height) {player.y = canv.height-player.h}; // Out of bounds

  if (d[0] == player.id) {
    if (d[1] == 3) { // Down
      player.y += d[2];
    } else if (d[1] == 1) { // Up
      player.y -= d[2];
    } else if (d[1] == 4) { // Right
      player.x += d[2];
    } else if (d[1] == 2) { // Left
      player.x -= d[2];
    }
  } else {
    return;
  };
});


// Handle clientsided events here / Main
var c = null;
const canv = document.querySelector('canvas');
canv.width = 2000, canv.height = 2000;
var keys = [];



window.onload = function() { // Once the website properly loads
  c = canv.getContext('2d');
  c.font = "bold 8pt sans-serif";
};

function draw() { // Render game (clear last frame, draw new one)
  if (c == null) { return; } // If the website hasn't properly loaded yet, get out of this procedure
  
  c.clearRect(player.x-((screen.width/2)-32),player.y-((screen.height/2)-32),player.x+((screen.width/2)+32),player.y+((screen.height/2)+32)); // Clear last frame
  player.draw();
};



class Player { // Client player
  constructor(id, x, y) { // Called upon initializing player
    this.w = 16;
    this.h = 16;
    this.x = x;
    this.y = y;
    this.id = id;
    this.speed = 2;
  };
  draw() { // Render player
    c.beginPath();
    c.fillStyle = "blue";
    c.arc(this.x, this.y, this.w, 0, 2*Math.PI);
    c.fill()
    c.closePath();
  }
};
const player = new Player(id, 16, 16); // Create a new instance of the player


// Keystrokes
addEventListener('keydown', function (e) { // Keys down
  keys[e.key.toUpperCase()] = true;
});
addEventListener('keyup', function (e) { // Keys up
  keys[e.key.toUpperCase()] = false;
});
