const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', (err, db) => {
  if(err) throw err;

  client.on('connection', (socket) => {

    const col = db.collection('messages');

    // wait for input
    socket.on('input', (data) => {
      const name = data.name;
      const message = data.message;
      const whitespacePattern = /^\s*$/;

      if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
        console.log('Invalid');
      } else {
        col.insert({name, message}, () => {
          console.log('Interested');
        });
      }
    });
  });
});
