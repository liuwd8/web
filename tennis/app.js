var express     = require('express');
var path        = require('path');
var favicon     = require('serve-favicon');
var logger      = require('morgan');
var cookieParser= require('cookie-parser');
var bodyParser  = require('body-parser');
var session     = require('express-session');
var db          = require('./model/mongo');
var mongoStore  = require('connect-mongo')(session);

var index               = require('./router/index');
var signin              = require('./router/signin');
var signout             = require('./router/signout');
var partials            = require('./router/partials');
var race                = require('./model/race');
var SingleElimination   = require('./model/SingleElimination');
var SingleCycle         = require('./model/SingleCycle');
var GroupLoop           = require('./model/GroupLoop');
var athletes            = require('./model/athlete');

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
app.use(express.static(path.join(__dirname, 'public')));
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

app.get('/SingleElimination', SingleElimination.getEliminationMatch);
app.get('/SingleEliminationCopy', SingleElimination.getPrevEliminationMatch);
app.get('/SingleCycle',SingleCycle.getCycleMatch);
app.get('/GroupLoop',GroupLoop.getGroupMatch);
app.get('/athletes',athletes.getAllAthletes);

app.post('/SaveSingleElimination',SingleElimination.SaveSingleElimination);
app.post('/SaveSingleCycle',SingleCycle.SaveSingleCycle);
app.post('/SaveGroupLoop',GroupLoop.SaveGroupLoop);
app.post('/SaveAthletes',athletes.saveAllAthletes);
app.post('/UpdateAthletes',athletes.UpdateAthletes);

app.post('/SingleElimination', race.SE);
app.post('/SingleCycle',race.SC);
app.post('/GroupLoop',race.GL);

app.use('/signin', signin);
app.use('/signout', signout);
app.use('/partials',partials);
app.use('/',index);

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
