var express = require('express');
var validator = require('../public/javascripts/validator');
var db        = require('../module/mongo');
var session     = require('express-session');
var mongoStore  = require('connect-mongo')(session);
var router = express.Router();

/* handle signin req. */
router.get('/', function(req, res, next) {
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
}).post('/',function(req, res, next) {
  db.isRegisted(req.body,function(err,doc) {
    if(err) {
      console.log(err);
    } else if(doc) {
      req.session.username = doc.username;
      res.render('info',doc);
    }
    else
      res.render('signin',{info : "用户名或密码错误"});
  });
});

module.exports = router;