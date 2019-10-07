var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ejsmate = require('ejs-mate');
const passport = require('passport');
const session = require('express-session');
const service = require('./routes/service')
var http= require('http');
var WebSocket = require('ws').Server;
require('./passport/passport')(passport); 
var idsarray=[];
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth')(passport);
var order = require('./routes/order');
require('./init');

var app = express();

//passport setup 
app.use(session({
	secret: 'thesecret',
	saveUninitialized: false,
	resave: false
  }))
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.engine('ejs',ejsmate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth',authRouter);
app.use('/service',service);
app.use('/Order',order);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
const PORT = process.env.PORT || 3000;
var server = http.createServer(app).listen(PORT,function(){
	console.log("App running on port "+ PORT);
});
var  wss = new WebSocket({server:server});
app.set('wss',wss);
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message',(data) =>{
      var message = JSON.parse(data);
      if(idsarray.includes(message.id))
          {
              let response = {status:'failed',message:'This order is on payment process'};
              ws.send(JSON.stringify(response));
              ws.close();
          }
      else
      {
          ws.id=message.id;
          idsarray.push(message.id);
      }
  })
  ws.on('close', () => {
    console.log(idsarray);
    console.log(ws.id);
    var index=idsarray.findIndex(ws.id);
    console.log('Index:'+index);
    idsarray.splice(index,1);
    console.log(idsarray);
    console.log('Client disconnected');});
});
module.exports = app;
