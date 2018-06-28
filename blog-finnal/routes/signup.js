var express     = require('express');
var router      = express.Router();
var validCheck  = require('../module/validatorOfPost');
var db          = require('../module/mongo');
/* Handle regist req */
router.get('/', function(req, res, next) {
  res.render('index');
}).post('/',function(req, res, next) {
  var validcheck = {
    isValid : validCheck(req.body),
    info : {
      username:req.body.username,
      email   :req.body.email,
      sid     :req.body.sid,
      phone   :req.body.phone
    }
  };
  var repeatCheck = {
    isValid : {
      isTrue : true,
      usernameError : "",
      phoneError : "",
      emailError : "",
      sidError :""
    },info : {
      username:req.body.username,
      email   :req.body.email,
      sid     :req.body.sid,
      phone   :req.body.phone
    }
  };
  if(!validcheck.isValid.isTrue)
    res.json(validcheck);
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
      if(!repeatCheck.isValid.isTrue)
        res.json(repeatCheck);
      else {
        req.session.username = req.body.username;
        db.saveAccount(req.body);
        res.json({
          isLogin: 1,
          user:req.body.username
        });
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
        repeatCheck.isValid.isTrue = false;
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
        repeatCheck.isValid.isTrue = false;
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
        repeatCheck.isValid.isTrue = false;
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
        repeatCheck.isValid.isTrue = false;
        repeatCheck.isValid.emailError = "该邮箱已被注册";
      }
      return resolve();
    });
  });
}

module.exports = router;