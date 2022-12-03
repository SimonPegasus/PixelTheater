const port = 81; // Server port (default 80)
const version = 'Pixel Theater 0.0.0'; // Version

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const colors = require('colors');

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);

server.listen(port, () => { // On start
  date = new Date();
  console.log(colors.blue.bold("--"+version+"--"));
  console.log('['+colors.gray(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds())+'] '+colors.green.bold('Listening on port '+port));
});

server.on('error', (err) => { // On error
  console.error(err);
});


// Main
players = [];
io.on('connection', (sock) => { // Main listener
  sock.on('initCL', () => { // Called on each client connection
    date = new Date();
    console.log('['+colors.gray(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds())+'] '+colors.green.bold(sock.id)+colors.white.bold(' connected'));
    var data = {
      'id' : sock.id,
      'x' : null,
      'y' : null
    };
    players.push(data);
    sock.emit('CLid', [sock.id, players]); // Give player their id
    io.emit('playerconnect', [data, sock.id]);
  });
  sock.on('disconnect', (reason) => { // Called on client disconnect
    date = new Date();
    console.log('['+colors.gray(date.getHours()+':'+date.getMinutes()+':'+date.getSeconds())+'] '+colors.red.bold(sock.id)+colors.white.bold(' disconnected: ')+colors.white.bold(reason));
    var i = players.findIndex(player => player.id==sock.id);
    if (i !== -1) {players.splice(i, 1);} // Remove player from players[]
    io.emit('playerdisconnect', sock.id);
  });

  sock.on('applyMovement', (d) => { // When a player requests movement
    players[players.findIndex(player => player.id==sock.id)].x = d[1];
    players[players.findIndex(player => player.id==sock.id)].y = d[2];
    io.emit('receiveMovement', d); // Accept movement and send to all players for updates
    console.log(players);
  });
});

setInterval(() => { // Send ticks to clients, 100 TPS
  io.emit('tick');
}, 10);
