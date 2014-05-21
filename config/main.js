var path = require('path');
module.exports = {
  "server": "http://localhost:3008",
  "requireStartup": "true",
  "adapter": "frontend1",
  "location": path.join(process.cwd(), '../frontend-templates')
}