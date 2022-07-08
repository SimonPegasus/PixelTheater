const port = 80; // Server port
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



io.on('connection', (sock) => { // Called on each client connection
  sock.on('init', (data) => {
    console.log(data);
  });
});

server.on('error', (err) => { // On error
  console.error(err);
});

setInterval(() => { // Send ticks to clients
  io.emit('tick');
}, 50);