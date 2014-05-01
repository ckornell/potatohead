var express = require('express');
var app    = express();
var http   = require('http');
var server = http.createServer(app);
var io     = require('socket.io').listen(server);
var fs     = require('fs');
var exphbs  = require('express3-handlebars');

exports.start = function start() {
  var nodeapp = server.listen(2000, function() {
    console.log('Listening on port %d', nodeapp.address().port);
  });

  app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));

  app.set('view engine', '.hbs');


  app.get('/', function (req, res) {
    res.render('viewer', {'stuff': 'twentythree'});
  });

  app.use(express.static('build/'));

  io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
}



