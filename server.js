const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', (err, db) => {
  if(err) throw err;

  client.on('connection', (socket) => {

    const col = db.collection('messages');
    const sendStatus = (s) => {
      socket.emit('status', s);
    };

    // Emit all messages
    col.find().limit(100).sort({_id: 1}).toArray(function(err, res) {
      if(err) throw err;
      socket.emit('output', res);
    });

    // wait for input
    socket.on('input', (data) => {
      const name = data.name;
      const message = data.message;
      const whitespacePattern = /^\s*$/;

      if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
        sendStatus('Name and message is required');
      } else {
        col.insert({name, message}, () => {

          // Emit latests message to all clients
          client.emit('output', [data]);

          sendStatus({
            message: 'Message send',
            clear: true
          });
        });
      }
    });
  });
});
