const port = 80; // Server port (default 80)
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



io.on('connection', (sock) => { // Called on each client connection
  sock.on('initCL', () => {
    sock.emit('CLid', sock.id); // Give player their id
  });
  sock.on('requestMovement', (d) => { // When a player requests movement
    sock.emit('receiveMovement', d); // Accept movement and send to all players for updates
  });
});

setInterval(() => { // Send ticks to clients, 100 TPS
  io.emit('tick');
}, 10);
