var express = require('express');
var validator = require('../public/js/validator');
var db        = require('../module/mongo');
var session     = require('express-session');
var mongoStore  = require('connect-mongo')(session);
var router = express.Router();

router.get('/',function(req, res, next) {
  res.render('index');
}).post('/',function(req, res, next) {
  db.isRegisted(req.body,function(err,doc) {
    if(err) {
      console.log(err);
    } else if(doc) {
      req.session.username = doc.username;
      res.json({
        isLogin:true,
        isAdmin:doc.isAdmin,
        user:doc.username
      });
    } else
      res.json({
        isLogin:false,
        isAdmin:false,
        info:'用户名或密码错误'
      });
  });
});

module.exports = router;