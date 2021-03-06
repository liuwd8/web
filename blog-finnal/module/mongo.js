'use strict'

var mongo   = require("mongoose");
var crypto  = require('crypto');
mongo.Primose = global.Primose;
var db      = mongo.createConnection('mongodb://127.0.0.1:27017/account');

db.on('connected', function () {
  console.log('账户数据库连接已建立');
});

db.on('error', function (err) {
  console.log('账户数据库连接异常:' + err);
});

db.on('disconnected', function () {
  console.log('账户数据库连接已断开');
});

var monSchema = new mongo.Schema({
  username : {type:String},
  password : {type:String},
  sid : {type:Number},
  email : {type:String},
  phone : {type:Number},
  isAdmin:{type:Boolean}
});
var monModel = db.model('account',monSchema);

db.isRepeatedUsername = function(data,callback) {
  return this.model('account').findOne({username: data},callback);
}
db.isRepeatedSid = function(data,callback) {
  return this.model('account').findOne({sid: data},callback);
}
db.isRepeatedPhone = function(data,callback) {
  return this.model('account').findOne({phone: data},callback);
}
db.isRepeatedEmail = function(data,callback) {
  return this.model('account').findOne({email: data},callback);
}
db.isRegisted = function(data,callback) {
  var sha1 = crypto.createHash('sha1');
  sha1.update(data.password);
  data.password = sha1.digest('hex');
  return this.model('account').findOne({username: data.username,password: data.password},callback);
}
db.isRegistedUser = function(data,callback) {
  return this.model('account').findOne({username: data},callback);
}

db.saveAccount = function(data) {
  var sha1 = crypto.createHash('sha1');
  sha1.update(data.password);
  data.password = sha1.digest('hex');
  var content = {
    username : data.username,
    password : data.password,
    sid : data.sid,
    email : data.email,
    phone : data.phone,
    isAdmin:false
  };
  var monInsert = new monModel(content);
  monInsert.save(function(err) {
    if(err)
      console.log(err);
  });
}
db.model('account').findOne({username: "admin"},function(err,doc){
  if(err)
    console.log(err);
  else if(!doc) {
    var sha1 = crypto.createHash('sha1');
    sha1.update('admin');
    var password = sha1.digest('hex');
    var content = {
      username : 'admin',
      password : password,
      sid : '99999999',
      email : 'admin@my.com',
      phone : '99999999999',
      isAdmin: true
    };
    var monInsert = new monModel(content);
    monInsert.save(function(err) {
      if(err)
        console.log(err);
    });
  }
});
exports = module.exports = db;