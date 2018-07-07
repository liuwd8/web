var mysql = require('mysql');
var validator = require('./validator');
var session = require('express-session');
var fileStore = require('session-file-store')(session);

var db = {};
var mysqlconfig = {
  host: 'localhost',
  user: 'csmsAdmin',
  password: 'sysu615@',
  database: 'csms',
  port: '3306',
  multipleStatements: true
}
var sqlMap = {
  login: 'select username from users where username=? and password=?',
  createUser: 'insert into users(username, password) values(?, ?)',
  queryUser: 'select username, status from users where status >= (\
    select status from users where username=?\
  )',
  queryInfo: 'select * from ',
  PurchaseCar: "update carinventory set CarNum = CarNum + ? where CName = ? ;\
    insert into purchaseinfo (CName,CNum) values (?,?);\
    insert into inandoutinfo (CName,InAndOutNum,InAndOutType) values (?,?,?);\
    select * from purchaseinfo",
  SaleCar: "update carinventory set CarNum =  CarNum - ? where CName = ? ;\
    insert into saleinfo (CName,SNum,SProfit,CusID) values (?,?,?,?);\
    insert into inandoutinfo (CName,InAndOutNum,InAndOutType) values(?,?,?);"
}
db.sessionConfig = {
  name: 'csmsV1.0',
  secret: 'csmsVueSysu615DbFinalProjectAuthedBy:Lx,Lwd',
  store: new fileStore({
    ttl: 6 * 60 * 60 * 1000 //6h
  }),
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 6 * 60 * 60 * 1000 //6h
  }
};
db.session = session(db.sessionConfig);

var conn = mysql.createConnection(mysqlconfig);
conn.connect();

db.login = function (req, res, next) {
  var message = validator.username.isValid(req.body.username) ? '' : validator.username.errorMessage;
  message += validator.password.isValid(req.body.password) ? '' : validator.password.errorMessage;
  if (message !== '') {
    res.json({
      state: false,
      message: message
    });
  } else {
    conn.query(sqlMap.login, [req.body.username, req.body.password], function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        req.session.username = result[0].username;
        res.json({
          state: true,
          message: '登录成功',
          username: result[0].username
        });
      } else {
        res.json({
          state: false,
          message: '用户名或密码错误'
        })
      }
    })
  }
}
db.isLogin = function (req, res, next) {
  if (validator.username.isValid(req.session.username)) {
    db.sessionConfig.store.get(req.sessionID, function (err, doc) {
      if (err) {
        console.log(err.Error);
        res.json({ state: false });
      } else if (doc && doc.username === req.session.username) {
        res.json({ state: true });
      } else {
        res.json({ state: false });
      }
    })
  } else {
    res.json({ state: false });
  }
}

db.logout = function(req, res, next) {
  if(!req.session.username) {
    res.json({ state: false });
    return;
  }
  res.clearCookie(db.sessionConfig.name);
  db.sessionConfig.store.destroy(req.sessionID, err => {
    if (err) {
      console.log(err.Error);
      res.json({ state: false });
    } else {
      res.json({ state: true });
    }
  })
}

db.get = function(req, res, next) {
  if(req.params.tableName === 'users') {
    conn.query(sqlMap.queryUser, [req.session.username], function(err, result) {
      res.json(result);
    });
    return;
  }
  var str = sqlMap.queryInfo + req.params.tableName;
  conn.query(str, function(err, result) {
    res.json(result);
  });
}

db.SaleCar = function(req, res, next) {
  var params = [
    req.body.CNum,
    req.body.CName,
    req.body.CName,
    req.body.CNum,
    req.body.CName,
    req.body.CNum,
    '出库'
  ];
  conn.query(sqlMap.SaleCar, params, function(err,result) {
    if(err) {
      console.log(err);
      res.json({state: false});
    } else {
      console.log(err);
      res.json({state: true});
    }
  })
}

db.PurchaseCar = function(req, res, next) {
  var params = [
    req.body.CNum,
    req.body.CName,
    req.body.CName,
    req.body.CNum,
    req.body.CName,
    req.body.CNum,
    '入库'
  ];
  conn.query(sqlMap.PurchaseCar, params, function(err, result) {
    if(err) {
      console.log(err);
      res.json({state: false});
    } else {
      res.json(result[3]);
    }
  })
}

exports = module.exports = db;