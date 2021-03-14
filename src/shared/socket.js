import openSocket from 'socket.io-client';

const socket = openSocket('https://collab-editor-backend.herokuapp.com', {
  transports: ['websocket'],
});

export default function subscribeToTimer(callback) {
  socket.on('timer', timestamp => callback(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}
