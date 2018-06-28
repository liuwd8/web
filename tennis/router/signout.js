var express     = require('express');
var router      = express.Router();

router.get('/',function(req,res) {
  res.clearCookie('connect.sid');
  res.redirect('/signin');
});

module.exports = router;