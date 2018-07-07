var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const app = express();
const db = require('./db');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'src/assets')));

app.use(db.session);

app.all('*', (req, res, next) => {
  const origin = req.headers.origin
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token,sign')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET, POST')
  next();
});

app.get('/login', db.isLogin);
app.get('/logout', db.logout);
app.get('/get/salelog', db.salelog);
app.get('/get/:tableName', db.get);
app.post('/login', db.login);
app.post('/set/PurchaseCar', db.PurchaseCar);
app.post('/set/SaleCar', db.SaleCar);
app.post('/insert/customerinfo', db.insertCustomerinfo)

app.listen(3000);
console.log("server is listening at port 3000.");