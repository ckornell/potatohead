var fs           = require('fs');
var path         = require('path');
var config       = require('../config/main.json');
var fork         = require('child_process').fork;
var _            = require('lodash');
var app          = require('../app');
var variables    = require('../config/variables.json');
var nconf        = require('nconf');
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
   '/node_modules/bb-mirage/views/html/layouts'
   ];



   var collectedViews = {};
   _.each(viewPaths, function(item) {
    var key = path.basename(item);
    collectedViews[key] = fs.readdirSync(config.location+item);
   });

   // var removeIndex = {};
   // _.each(collectedViews, function(section, key){
   //   removeIndex[key] = [];
   //  _.each(section, function(item) {    
   //    if(!/header|footer|categories/g.test(item)) {
   //      removeIndex[key].push(item);
   //    }
   //  });
   // });

   // _.each(removeIndex, function(section, key){
   //  _.each(section, function(item){
   //    var idx = collectedViews[key].indexOf(item);
   //    collectedViews[key].splice(idx, 1);
   //  });
   // });

   var collectedJSON = JSON.stringify(collectedViews, null, 4);
   fs.writeFileSync('./build/json/views.json', collectedJSON);

   if(typeof callback === 'function') {
     callback();
   }
}

exports.rewriteStylus = function rewriteStylus(data) {
  nconf.file({ file: config.location + '/assets/html/stylesheets/variables.json' });
  _.each(data.form, function(value, key) {
    nconf.set(key, value);
  });

  nconf.save(function (err) {
    fs.readFile(config.location + '/assets/html/stylesheets/variables.json', function (err, data) {
      console.dir(JSON.parse(data.toString()));
      id = require('../app').id;
      console.log('socket id is supposed to be', id);
      app.io.sockets.socket(id).emit('refreshFrame');
    });
  });

}