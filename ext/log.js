var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: __dirname + '/app.log' })
    ]
  });
module.exports = logger;