const socket = io();

socket.on('connect', () => {
  console.log('hi server!');

  socket.emit('createMessage', {
    from: 'tom@ohhhh.me',
    text: 'test'
  })
});

socket.on('disconnect', () => {
  console.log('bye server!');
});

socket.on('newMessage', (msg) => {
  console.log('new message: ', msg);
});

