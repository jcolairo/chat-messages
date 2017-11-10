
// function() {
const getNode = function(s) {
    return document.querySelector(s);
  },
  //  Get required nodes
  textarea = getNode('.chat-textarea');
chatName = getNode('.chat-name');

try {
  var socket = io.connect('http://127.0.0.1:8080');
} catch(err) {
  // Set status to warn user
}

if(socket !== undefined) {
  // Listen for keydown
  textarea.addEventListener('keydown', function(event) {
    const self = this;
    const name = chatName.value;

    if(event.which === 13 && event.shiftKey === false) {
      socket.emit('input', {
        name,
        message: self.value
      });

      event.preventDefault();
    }
  });
}
// };
