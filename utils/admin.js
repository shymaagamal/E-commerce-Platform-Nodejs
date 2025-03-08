import{io} from 'socket.io-client';
import 'dotenv/config';
const socket = io(`http://localhost:${process.env.PORT}`);
socket.on('connect', () => {
  console.log('Connected to the server as Admin ');
});
socket.on('disconnect', () => {
  console.log('Disconnected from the server as Admin');
});
socket.on('newOrder', (data) => {
  console.log('New order has been placed :', data);
});

