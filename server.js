var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function(err, db) {
  if(err) throw err;

  client.on('connection', function(socket) {

    var col = db.collection('messages');

    // wait for input
    socket.on('input', function(data) {
      var name = data.name;
      var message = data.message;
      var whitespacePattern = /^\s*$/;

      if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
        console.log('Invalid');
      } else {
        col.insert({name: name, message: message}, function() {
          console.log('Interested');
        });
      }
    });
  });
});
