const socket = io();

socket.on('connect', () => {
  console.log('hi server!');
});

socket.on('disconnect', () => {
  console.log('bye server!');
});

socket.on('newMessage', (msg) => {
  console.log('new message: ', msg);
});

