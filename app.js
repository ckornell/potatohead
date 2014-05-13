var express      = require('express');
var app          = express();
var http         = require('http');
var server       = http.createServer(app);
var io           = require('socket.io').listen(server);
var fs           = require('fs');
var hbs          = require('hbs');
var config       = require('./config/main.json');
var RSVP         = require('rsvp');
var adapter      = require('./adapters/'+ config.adapter);
var navigation   = require('./build/json/views.json');
var variables    = require('./config/variables.json');
var helpers      = require('./helpers.js');

exports.io = io;
var start = function start() {

  var nodeapp = server.listen(2000, function() {
    console.log('Potato Head is listening on port %d', nodeapp.address().port);
  });

  app.set('view engine', 'hbs');

  app.set('view options', { layout: './layouts/main'});

  hbs.registerPartials('./views/partials');

  app.get('/', function (req, res) {
    res.render('viewer', {
      nav: navigation, 
      config: config, 
      variables: variables
    });
  });

  app.use(express.static('build/'));
  app.use(express.static(__dirname + '/public'));
  
  helpers.registerHelpers();

  io.sockets.on('connection', function (socket) {
    var id = socket.id;
    exports.id = id;
    console.log('socket id is', id);
    socket.on('stylus rewrite', function (data) {
      console.log('REWRITE');
      adapter.rewriteStylus(data);
      
    });

  
    socket.emit('loadStatus', {'isLoaded': true});
  });
}

exports.build = function build(callback) {
  adapter.buildNavigation(function(){
    start();
  });
}



