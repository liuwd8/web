var mysql = require('mysql');
var validator = require('./validator');

var db = {};
var mysqlconfig = {
  host: 'localhost',
  user: 'csmsAdmin',
  password: 'sysu615@',
  database: 'csms',
  port: '3306'
}
var sqlMap = {
  queryUser: 'select * from users where username=? and password=?',
  createUser: 'insert into users values(?,?)',
  querySalesInfo: 'select * from SaleInfo'
}

var conn = mysql.createConnection(mysqlconfig);
conn.connect(sqlMap.createUser, [], function() {

});

db.login = function(req, res, next) {
  conn.query(sqlMap.queryUser, [req.body.username, req.body.password], function(err, result) {
    if(err) {
      console.log(err);
    } else {
      console.log(result);
    }
  })
}

db.getSaleInfo = function(req, res, next) {
  conn.query(sqlMap.querySalesInfo, function (err, result) {
    res.json(result);
  });
}

exports = module.exports = db;