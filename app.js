var express      = require('express');
var app          = express();
var http         = require('http');
var server       = http.createServer(app);
var io           = require('socket.io').listen(server);
var fs           = require('fs');
var hbs          = require('hbs');
var config       = require('./config/main');
var RSVP         = require('rsvp');
var adapter      = require('./adapters/'+ config.adapter);
var navigation   = require('./build/json/views.json');
var variables    = require('./config/variables.json');
var helpers      = require('./helpers.js');
var multer       = require('multer');
var nconf        = require('nconf');

exports.io = io;
var start = function start(opts) {

  var nodeapp = server.listen(2000, function() {
    console.log('Potato Head is listening on port %d', nodeapp.address().port);
  });

  exports.server = nodeapp;

  app.set('view engine', 'hbs');

  app.set('view options', { layout: './layouts/main'});

  hbs.registerPartials('./views/partials');

  app.get('/', function (req, res) {
    res.render('viewer', {
      nav: navigation, 
      config: config,
      server: opts.server, 
      variables: variables,
      loading: false
    });
  });

  app.post('/images', multer({
    dest: config.location + '/public/html/images/sprites/global',
    rename: function(fieldname, filename) {
      var newName = '';
      switch(fieldname) {
        case 'logo': 
          newName = 'logo'
        break;
        case 'menu-icon': 
          newName = 'icn-menu'
        break;
        case 'small-logo':
          newName = 'logo-small'
        break;
        case 'cart-icon': 
          newName = 'icn-cart'
        break;
        default: 
          newName = filename.replace(/\W+/g, '-') + '-' + Date.now();
      }

      return newName;
    },
    onFileUploadComplete: function(file, req, res, next) {
      adapter.restartServer(res);
    }
  }), function(req, res, next){});

  app.post('/reset', function(req, res, next){
    adapter.overwriteStylus(res);
  });

  app.post('/remove', function(req, res, next){
    adapter.deleteImages(res);
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

exports.build = function build(opts) {
  adapter.buildNavigation(function(){
    start(opts);
  });
}



