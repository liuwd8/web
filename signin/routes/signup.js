var express     = require('express');
var router      = express.Router();
var validCheck  = require('../module/validatorOfPost');
var db          = require('../module/mongo');
/* Handle regist req */
router.get('/', function(req, res, next) {
  res.render('signup',{
    isValid:{
      usernameError : "",
      passwordError : "",
      passwordAgainError : "",
      phoneError : "",
      emailError : "",
      sidError :""
    },
    info: {username:'',sid:'',phone:'',email:''}
  });
}).post('/',function(req, res, next) {
  var validcheck = {isValid : validCheck(req.body),info : req.body};
  var repeatCheck = {isValid : {
    isTrue : false,
    usernameError : "",
    phoneError : "",
    emailError : "",
    sidError :""
  },info: req.body};
  if(!validcheck.isValid.isTrue)
    res.render('signup',validcheck);
  else {
    checkUsername(repeatCheck,req.body).then(function() {
      return checkSid(repeatCheck,req.body);
    }).then(function() {
      return checkPhone(repeatCheck,req.body);
    }).then(function() {
      return checkEmail(repeatCheck,req.body);
    }).catch(function(err) {
      console.log(err);
    }).then(function() {
      if(repeatCheck.isValid.isTrue)
        res.render('signup',repeatCheck);
      else {
        req.session.username = req.body.username;
        db.saveAccount(req.body);
        res.render('info',req.body);
      }
      return;
    });
  }
});

function checkUsername(repeatCheck,data) {
  return new Promise(function (resolve,reject) {
    db.isRepeatedUsername(data.username,function(err,doc) {
      if(err) {
        console.log(err);
        reject();
      }
      if(doc) {
        repeatCheck.isValid.isTrue = true;
        repeatCheck.isValid.usernameError = "该用户名已被注册";
      }
      return resolve();
    });
  });
}
function checkSid(repeatCheck,data) {
  return new Promise(function (resolve,reject) {
    db.isRepeatedSid(data.sid,function(err,doc) {
      if(err) {
        console.log(err);
        reject();
      }
      if(doc) {
        repeatCheck.isValid.isTrue = true;
        repeatCheck.isValid.sidError = "该学号已被注册";
      }
      return resolve();
    });
  });
}
function checkPhone(repeatCheck,data) {
  return new Promise(function (resolve,reject) {
    db.isRepeatedPhone(data.phone,function(err,doc) {
      if(err) {
        console.log(err);
        reject();
      }
      if(doc) {
        repeatCheck.isValid.isTrue = true;
        repeatCheck.isValid.phoneError = "该号码已被注册";
      }
      return resolve();
    });
  });
}
function checkEmail(repeatCheck,data) {
  return new Promise(function (resolve,reject) {
    db.isRepeatedEmail(data.email,function(err,doc) {
      if(err) {
        console.log(err);
        reject();
      }
      if(doc) {
        repeatCheck.isValid.isTrue = true;
        repeatCheck.isValid.emailError = "该邮箱已被注册";
      }
      return resolve();
    });
  });
}

module.exports = router;