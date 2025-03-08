import{io} from 'socket.io-client';
import 'dotenv/config';

const socket = io(`http://3.65.189.125:5000`);

socket.on('connect', () => {
  console.log('Connected to the server as Admin ');
});
socket.on('disconnect', () => {
  console.log('Disconnected from the server as Admin');
});
socket.on('newOrder', (data) => {
  console.log('New order has been placed :', data);
});
socket.on('connect_error', (error) => {
  console.log('Error connecting to the server:', error);
});
