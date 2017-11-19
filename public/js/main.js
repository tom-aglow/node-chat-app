const socket = io();

socket.on('connect', () => {
  console.log('hi server!');
});

socket.on('disconnect', () => {
  console.log('bye server!');
});

socket.on('newMessage', msg => {
  console.log('new message: ', msg);
  const p = $('#message-container').prepend(`<p>${msg.from}: ${msg.text}</p>`)
});

$('#message-form').on('submit', event => {
  event.preventDefault();

  socket.emit(
    'createMessage',
    {
      from: 'user',
      text: $('#message-field').val()
    },
    data => {
      console.log('got it: ', data);
    }
  );
});
