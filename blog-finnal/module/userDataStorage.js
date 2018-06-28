'use strict'

var mongo   = require("mongoose");
var db      = mongo.createConnection('mongodb://127.0.0.1:27017/blogData');

db.on('connected', function () {
  console.log('博客数据库连接已建立');
});

db.on('error', function (err) {
  console.log('博客数据库连接异常:' + err);
});

db.on('disconnected', function () {
  console.log('博客数据库连接已断开');
});

var monSchema = new mongo.Schema({
    username : {type:String},
    contents : {type:Array},
    dates    : {type:Date},
    isViewable:{type:Boolean}
});
db.isRepeatedUsername = function(data,callback) {
  return this.model('data').findOne({username: data},callback);
}
db.isRepeatedSid = function(data,callback) {
  return this.model('data').findOne({sid: data},callback);
}
db.isRepeatedPhone = function(data,callback) {
  return this.model('data').findOne({phone: data},callback);
}
db.isRepeatedEmail = function(data,callback) {
  return this.model('data').findOne({email: data},callback);
}
db.isLoginIn = function(data,callback) {
  return this.model('data').findOne({username: data},callback);
}
var monModel = db.model('data',monSchema);

db.saveBlogData = function(data) {
  var content = {
    username : data.username,
    
    contents : data.contents,
    dates    : new Date(),
    isViewable:true
  };
  var monInsert = new monModel(content);
  monInsert.save(function(err) {
    if(err)
      console.log(err);
  });
}

exports = module.exports = db;