var fs           = require('fs');
var path         = require('path');
var config       = require('../config/main');
var fork         = require('child_process').fork;
var _            = require('lodash');
var app          = require('../app');
var variables    = require('../config/variables.json');
var nconf        = require('nconf');
var exclude      = require('../config/exclude.json');
var server;

exports.buildNavigation = function buildNavigation(callback) {
   server = fork('./app.js', [
    '-w', '0',
    '--url', 'https://leviapi.bbhosted.com',
    '-p', '3008'
    ], { cwd: config.location });

   var viewPaths = ['/node_modules/bb-mirage/views/html/header',
   '/node_modules/bb-mirage/views/html/footer',
   '/node_modules/bb-mirage/views/html/categories',
   '/node_modules/bb-mirage/views/html/home'
   ];

   exports.server = server;

   var collectedViews = {};
   _.each(viewPaths, function(item) {
    var key = path.basename(item);
    collectedViews[key] = fs.readdirSync(config.location+item); 
   });

   var removeIndex = {};
   _.each(collectedViews, function(section, key){
     removeIndex[key] = [];
    _.each(section, function(item) {
      //hardcoding special case for header
      if(exclude.indexOf(item) !== -1) {
        if(item === 'slide_menu.html') {
          if(key === 'header') {
            return false;
          }
        }
        removeIndex[key].push(item);
      }
    });
   });

   _.each(removeIndex, function(section, key){
    _.each(section, function(item){
      var idx = collectedViews[key].indexOf(item);
      collectedViews[key].splice(idx, 1);
    });
   });

   var collectedJSON = JSON.stringify(collectedViews, null, 4);
   fs.writeFileSync('./build/json/views.json', collectedJSON);

   if(typeof callback === 'function') {
     callback();
   }
}

var restartServer = function restartServer(res) {
  console.log('restart called');
  if(server) {
    console.log('into server');
    var id = require('../app').id;
    app.io.sockets.socket(id).emit('reloading');
    server.kill();
    server = fork('./app.js', [
      '-w', '0',
      '--url', 'https://leviapi.bbhosted.com',
      '-p', '3008'
      ], { cwd: config.location, silent: true});

    server.stdout.on('data', function(data) {
      if(/listening on port/g.test(data.toString())) {
        console.log('refresh', id);
        res.redirect('back');
        app.io.sockets.socket(id).emit('refresh');
      }
    });
  }
}

exports.restartServer = restartServer;

exports.rewriteStylus = function rewriteStylus(data) {

  nconf.file({ file: config.location + '/assets/html/stylesheets/variables.json' });
  _.each(data.form, function(value, key) {
    nconf.set(key, value);
  });

  nconf.save(function (err) {
    fs.readFile(config.location + '/assets/html/stylesheets/variables.json', function (err, data) {
      var id = require('../app').id;
      app.io.sockets.socket(id).emit('refreshFrame');
    });
  });
}

exports.overwriteStylus = function overwriteStylus(res) {
 fs.writeFile(config.location + '/assets/html/stylesheets/variables.json', '{}', function(){
    var id = require('../app').id;
    app.io.sockets.socket(id).emit('refreshFrame');
    res.redirect('/');
 });
}

exports.deleteImages = function deleteImages(res) {
 var directory = '/public/html/images/sprites/global/';
 var filesToRemove = fs.readdirSync(config.location+directory);
 filesToRemove.forEach(function(item, index){
    fs.unlink(config.location + directory + '/' + item, function(){
      return restartServer(res);
    })
 })

 return restartServer(res);
}