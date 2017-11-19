const socket = io();

function scrollToBottom() {
  //  Selectors
  const msg = $('#messages');
  const newMsg = msg.children('li:last-child');

  //  Heights
  const clientHeight = msg.prop('clientHeight');
  const scrollTop = msg.prop('scrollTop');
  const scrollHeight = msg.prop('scrollHeight');
  const newMsgHeight = newMsg.innerHeight();
  const lastMsgHeight = newMsg.prev().innerHeight();

  if (clientHeight + scrollTop + newMsgHeight + lastMsgHeight >= scrollHeight) {
    msg.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);

  jQuery('#messages').append(li);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const li = jQuery('<li></li>');
  const a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  const messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
