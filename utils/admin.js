import{io} from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.on('connect', () => {
  console.log('Connected to the server as Admin ');
});
socket.on('disconnect', () => {
  console.log('Disconnected from the server as Admin');
});
socket.on('newOrder', (data) => {
  console.log('New order has been placed :', data);
});

