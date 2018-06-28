var express = require('express');
var validator = require('../model/validator');
var db        = require('../model/mongo');
var session     = require('express-session');
var mongoStore  = require('connect-mongo')(session);
var router = express.Router();

router.get('/', function(req, res, next) {
  if(req.session.username) {
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
            res.redirect('/');
          } else {
            res.render('signin',{user:{username:''},error:'用户不存在'});
          }
        });
      } else {
        res.render('signin',{user:{username:''},error:'登录已过期，请重新登录'});
      }
    });
  } else {
    res.render('signin',{user:{username:''},error:''});
  }
}).post('/',function(req, res, next) {
  db.isRegisted(req.body,function(err,doc) {
    if(err) {
      console.log(err);
    } else if(doc) {
      req.session.username = doc.username;
      res.redirect('/');
    }
    else
      res.render('signin',{user:{username:req.body.username},error : "用户名或密码错误"});
  });
});

module.exports = router;