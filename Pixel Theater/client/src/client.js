// Server stuff
const sock = io();



sock.emit('init', 'datahere'); // On first join

sock.on('tick', () => { // On each server tick
  console.log('testing');
});