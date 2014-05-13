var hbs = require('hbs');
var fs  = require('fs');

exports.registerHelpers = function registerHelpers() {
  hbs.registerHelper('foo', function(){
    return new hbs.handlebars.SafeString('<ul><li>foo</li></ul>');
  });

  hbs.registerHelper("showPotatoOption", function(option) {
    var path = __dirname+ "/views/partials/_" + option.control +'.hbs';
    var template = hbs.handlebars.compile(fs.readFileSync(path, 'utf8'));
    return new hbs.handlebars.SafeString(template(option));
  });
}
