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

socket.on('newLocationMessage', ({from, url}) => {
  console.log('new message: ', {from, url});
  const a = $('#message-container').prepend(`<a href="${url}" target="_blank">${from} shared his location</a>`)
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


const locationBtn = $('#send-locations');

locationBtn.click(() => {
  if (!navigator.geolocation) {
    return alert('geolocation not supported by your browser');
  }
  
  navigator.geolocation.getCurrentPosition((pos) => {
    socket.emit('createLocationMessage', {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });
  }, () => {
    alert('unable to fetch location');
  })
})