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
  sock.on('initCL', (data) => {
    console.log(data); // Placeholder, supposed to do stuff with the data and send data back to all clients such as location data, etc.
  });
});

setInterval(() => { // Send ticks to clients, 20 TPS
  io.emit('tick');
}, 50);