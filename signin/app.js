var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session     = require('express-session');
var db       = require('./module/mongo');
var mongoStore  = require('connect-mongo')(session);

var signin = require('./routes/signin');
var signup = require('./routes/signup');
var signout= require('./routes/signout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'recommand 128 bytes random string',
    store: new mongoStore({
      mongooseConnection : db,
      ttl : 3 * 60 * 1000
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 3 * 60 * 1000
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  if(req.session.username ) {
    var mongoSession = new mongoStore({
      mongooseConnection : db,
      ttl : 3 * 60 * 1000
    }).get(req.sessionID,function(err,doc) {
      if(err)
        console.log(err);
      else if(doc) {
        db.isLoginIn(doc.username,function(err,doc) {
          if(err) {
            console.log(err);
          } else if(doc) {
            if(req.query.username) {
             if(req.query.username !== doc.username){
                doc.err = "只能够访问自己的数据";
                res.render('info',doc);
              } else {
                res.render('info',doc);
              }
            } else {
              res.render('info',doc);
            }
          } else {
            res.render('signin',{info : "请登录"});
          }
        });
      } else {
        res.render('signin',{info : "请登录"});
      }
    });
  } else {
    res.render('signin',{info : "请登录"});
  }
})
app.use('/', signin);
app.use('/signin',signout);
app.use('/regist', signup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
