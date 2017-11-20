const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('hi there');

  //  USER JOIN THE ROOM
  socket.on('join', ({name, room}, callback) => {

    //  HANDLE CASE IF ROOM OR USERNAME IS INVALID
    if (!isRealString(name) || !isRealString(room)) {
      callback('name and room name are required');
    }

    //  JOIN THE ROOM
    socket.join(room);

    //  GREETING MESSAGES
    socket.emit('newMessage', generateMessage('admin', 'welcome to the chat'));

    socket.broadcast.to(room).emit(
      'newMessage',
      generateMessage('admin', `${name} has joined`)
    );


    callback();
  });

  //  NEW MESSAGE FROM USER
  socket.on('createMessage', (msg, callback) => {
    console.log('create message: ', msg);
    io.emit('newMessage', generateMessage(msg.from, msg.text));
    callback('this is from s');
  });

  //  LOCATION SHARING
  socket.on('createLocationMessage', coords => {
    io.emit('newLocationMessage', generateLocationMessage('admin', coords));
  });

  //  DISCONNECT
  socket.on('disconnect', () => {
    console.log('bye client');
  });
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
