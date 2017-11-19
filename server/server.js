const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('hi there');

  //  GREETING MESSAGES
  socket.emit('newMessage', {
    from: 'admin',
    text: 'welcome to the chart app'
  });

  socket.broadcast.emit('newMessage', {
    from: 'admin',
    text: 'new user joined',
    createdAt: new Date().getTime()
  });

  //  NEW MESSAGE FROM USER
  socket.on('createMessage', msg => {
    console.log('create message: ', msg);
    io.emit('newMessage', {
      ...msg,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('bye client');
  });
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
