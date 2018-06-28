var express     = require('express');
var router      = express.Router();
var db        = require('../module/mongo');
var session     = require('express-session');
var mongoStore  = require('connect-mongo')(session);

router.get('/',function(req,res) {
  res.clearCookie('connect.sid');
  res.redirect('/');
})

exports = module.exports = router;