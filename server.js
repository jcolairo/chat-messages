const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', (err, db) => {
  if(err) throw err;

  client.on('connection', (socket) => {

    const col = db.collection('messages');
    const sendStatus = (s) => {
      socket.emit('status', s);
    };

    // wait for input
    socket.on('input', (data) => {
      const name = data.name;
      const message = data.message;
      const whitespacePattern = /^\s*$/;

      if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
        sendStatus('Name and message is required');
      } else {
        col.insert({name, message}, () => {
          sendStatus({
            message: 'Message send',
            clear: true
          });
        });
      }
    });
  });
});
