var express     = require('express');
var path        = require('path');
var logger      = require('morgan');
var cookieParser= require('cookie-parser');
var bodyParser  = require('body-parser');
var session     = require('express-session');
var fileStore   = require('session-file-store')(session);

const app = express();
const db = require('./db');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'src/assets')));

app.use(session({
  name: 'csmsV1.0',
  secret: 'csmsVueSysu615DbFinalProjectAuthedBy:Lx,Lwd',
  store: new fileStore(),
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 6 *  60 * 60 * 1000 //6h
  }
}));

app.all('*', (req, res, next) => {
  const origin = req.headers.origin
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token,sign')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET, POST')
  next();
});

app.get('/api/getSaleInfo', db.getSaleInfo);
// app.use('/api/book', bookApi);
app.post('/api/login', db.login);

app.listen(3000);
console.log("server is listening at port 3000.");