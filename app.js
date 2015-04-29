var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var socket = require('socket.io');

var users = {};
function getUsers(obj){
    var tmp = [];
    for(var i in obj){
        tmp.push('<span onclick="toUser(this.innerHTML)">' + obj[i] + '</span>');
    }
    return tmp.join('<br>');
};

var log = require('./ext/log');
var conf = require('./config');



//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, conf.get('app-view')));
app.set('view engine', conf.get('app-engine'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger(conf.get('log-level')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: conf.get('session:secret'),
    key: conf.get('session:key'),
    cookie: conf.get('session:cookie')
}));
app.use(express.static(path.join(__dirname, conf.get('app-static'))));

require('./routes')(app);

/*
app.get('/testlog', function(req,res){
    log.info('Hello from log');
    res.end('TEST LOG');
})
app.use('/', routes);
app.use('/users', users);
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
  
});

var io = socket.listen(app.listen(conf.get('port')));
io.sockets.on('connection', function(client){
    client.on('send', function(data){
        io.sockets.emit('message', {message: data.message});
        
    });
    client.on('hello', function(data){
        client.set('nickname', data.name);
        client.emit('message', {message:'<span style="font-size: 14pt; color: #3366ff;">hi ' + data.name + '</span>'});
        client.broadcast.emit('message', {message: '<span style="font-size: 14pt; color: #3366ff;">' + data.name + ' вошол в чат.</span>'});
        
        if(Object.keys(users).length > 0){
           var userList = getUsers(users);
           client.emit('message', {message: '<span style="font-size: 14pt; color: #3366ff;">В чате юзеров: ' + Object.keys(users).length + '</span>'});
        }else{
            client.emit('message', {message: '<span style="font-size: 14pt; color: #3366ff;">Аплодисменты первонаху!!!</span>'});
        }
        if(Object.keys(users).length > 0){
           var userList = getUsers(users);
           client.emit('users', {users: userList});
        }
        users[client.id] = data.name;
        
    });
    client.on('disconnect', function(data){
        if(Object.keys(users).length > 1){
            client.get('nickname', function(err, name){
                client.broadcast.emit('message', {message: '<span style="font-size: 14pt; color: #3366ff;">' + name + ' потерялся.</span>'});
            });
        };
        delete users[client.id];
    });
});
/*
var server = app.listen(conf.get('port'), function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
*/
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'Ошибка'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'Ошибка'
  });
});


module.exports = app;
