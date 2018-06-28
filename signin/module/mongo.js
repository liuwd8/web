'use strict'

var mongo   = require("mongoose");
var crypto  = require('crypto');

var db      = mongo.createConnection('mongodb://127.0.0.1:27017/account');

db.on('connected', function () {
  console.log('数据库连接已建立');
});

db.on('error', function (err) {
  console.log('数据库连接异常:' + err);
});

db.on('disconnected', function () {
  console.log('数据库连接已断开');
});

var monSchema = new mongo.Schema({
    username : {type:String},
    password : {type:String},
    sid : {type:Number},
    email : {type:String},
    phone : {type:Number}
});
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
db.isLoginIn = function(data,callback) {
  return this.model('account').findOne({username: data},callback);
}
var monModel = db.model('account',monSchema);

db.saveAccount = function(data) {
  var sha1 = crypto.createHash('sha1');
  sha1.update(data.password);
  data.password = sha1.digest('hex');
  var content = {
    username : data.username,
    password : data.password,
    sid : data.sid,
    email : data.email,
    phone : data.phone
  };
  var monInsert = new monModel(content);
  monInsert.save(function(err) {
    if(err)
      console.log(err);
  });
}

exports = module.exports = db;