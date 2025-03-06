import{io} from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.on('connect', () => {
  console.log('Connected to the server');
});
socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
socket.on('newReview', (data) => {
  console.log('New review:', data);
});

