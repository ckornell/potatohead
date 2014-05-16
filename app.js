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
var multer       = require('multer');
//var images       = require();

exports.io = io;
var start = function start() {

  var nodeapp = server.listen(2000, function() {
    console.log('Potato Head is listening on port %d', nodeapp.address().port);
  });

  exports.server = nodeapp;

  app.set('view engine', 'hbs');

  app.set('view options', { layout: './layouts/main'});

  hbs.registerPartials('./views/partials');

  app.use(multer({
    dest: config.location + '/public/html/images/sprites/global',
    rename: function(fieldname, filename) {
      if(fieldname === 'logo') {
        return 'logo';
      } else if('menu') {
        return 'menu';
      }

      return filename.replace(/\W+/g, '-') + '-' + Date.now();
    },
    onFileUploadComplete: function(file) {
      console.log("uploaded file"+ file);
      adapter.restartServer();
    }
  }));

  app.get('/', function (req, res) {
    res.render('viewer', {
      nav: navigation, 
      config: config, 
      variables: variables
    });
  });

  app.post('/images', function(req, res){
    console.log("files: ", req.files);
    res.redirect('/');
  });

  app.use(express.static('build/'));
  app.use(express.static(__dirname + '/public'));
  
  helpers.registerHelpers();

  io.sockets.on('connection', function (socket) {
    exports.id = socket.id;
    socket.on('stylus rewrite', function (data) {
      adapter.rewriteStylus(data);
    });
  });
}

exports.build = function build(callback) {
  adapter.buildNavigation(function(){
    start();
  });
}



