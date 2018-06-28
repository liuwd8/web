var express = require('express');
var router  = express.Router();
var session     = require('express-session');
var mongoStore  = require('connect-mongo')(session);
var db      = require('../model/mongo');
/* GET home page. */
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
            res.render('index',{username:doc.username});
          } else {
            res.redirect('/signin');
          }
        });
      } else {
        res.redirect('/signin');
      }
    });
  } else {
    res.redirect('/signin');
  }
});

module.exports = router;