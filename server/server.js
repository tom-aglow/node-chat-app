const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('hi there');

  //  USER JOIN THE ROOM
  socket.on('join', ({name, room}, callback) => {

    room = room.toLowerCase();

    //  HANDLE CASE IF ROOM OR USERNAME IS INVALID OR NAME IS TAKEN
    if (!isRealString(name) || !isRealString(room)) {
      return callback('name and room name are required');
    }

    if (users.isNameTaken(name, room)) {
      return callback('name is already taken, please choose another one');
    }

    //  JOIN THE ROOM
    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);

    io.to(room).emit('updateUserList', users.getUserList(room));

    //  GREETING MESSAGES
    socket.emit('newMessage', generateMessage('', 'welcome to the chat'));

    socket.broadcast.to(room).emit(
      'newMessage',
      generateMessage('', `${name} has joined`)
    );


    callback();
  });

  //  NEW MESSAGE FROM USER
  socket.on('createMessage', ({text}, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, text));
    }

    callback();
  });

  //  LOCATION SHARING
  socket.on('createLocationMessage', coords => {
    const user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords));
    }
  });

  //  DISCONNECT
  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('', `${user.name} has left`));
    }
  });
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
