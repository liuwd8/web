var express       = require('express');
var path          = require('path');
//var favicon = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var db            = require('./module/mongo');
var mongoStore    = require('connect-mongo')(session);

var signin        = require('./routes/signin');
var signup        = require('./routes/signup');
var signout       = require('./routes/signout');
var api           = require('./routes/api');
var routes        = require('./routes');
var app           = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view options', {
  layout: false
});
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
      ttl : 6 * 60 * 60 * 1000 //6h
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 6 *  60 * 60 * 1000 //6h
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',routes.index);
app.get('/partials/:name', routes.partials);
app.use('/signin', signin);
app.use('/signup', signup);
app.use('/signout', signout);
// JSON API

app.get('/isLogin', api.isLoginApp);
app.get('/api/count', api.count);
app.get('/api/posts', api.posts);
app.get('/api/post/:id', api.post);
app.post('/api/seach/:username', api.seach);
app.post('/api/post', api.addPost);
app.post('/api/hidePost/:id', api.hidePost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);
app.post('/api/addComment/:id', api.addComment);
app.post('/api/deleteComment/:id', api.deleteComment);
app.post('/api/updateComment/:id', api.updateComment);
app.post('/api/hideComment/:id', api.hideComment);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

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
