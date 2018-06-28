/*
    运动员信息
*/


'use strict'

var mongo   = require("mongoose");
var promise = require('bluebird');

var db = mongo.createConnection('mongodb://liuwd8:Liuwd8665@127.0.0.1:27017/athlete');

db.on('connected', function () {
  console.log('数据库连接已建立');
});

db.on('error', function (err) {
  console.log('数据库连接异常:' + err);
});

db.on('disconnected', function () {
  console.log('数据库连接已断开');
});

//athlete -- 运动员信息集合
var athleteSchma = new mongo.Schema({
    athlete : {type:Object}
});

var athleteModel = db.model("athlete", athleteSchma);

athleteModel.getAthleteInfoById = function(data) {
  return this.model('athlete').findOne({_id: data._id}, function(err, doc){
    console.log("获取用户信息");
    if (error) {
        console.log(error);
        console.log('发生错误，请再次尝试');
    } else {
        if (doc) {
            //console.log("past message");
            data = doc;
        }
    }
  });
}

//语法： db.collection.update(c1,$set,multi,upsert)
//
//更新
athleteModel.updateAthlete = function(data) {
  return db.model('athlete').update({_id: data._id}, {$set:{ athlete: data.athlete}},function(err, doc){
    console.log(doc);
  });
}

//删除
athleteModel.removeAthlete = function(data) {
  return db.model('athlete').remove({_id: data._id});
}

//保存
athleteModel.saveAthleteInfo = function(Data) {
  db.model('athlete').remove(function() {
    Data.forEach(function(data){
      var info = {
          athlete : data
      };
      var monInsert = new athleteModel(info);
      monInsert.save(function(err){
        if(err)
            console.log(err);
      });
    });
  });
}
athleteModel.getAllAthletes = function(req, res) {
  db.model('athlete').find(function(err, doc) {
    if(err) {
      console.log(err);
      res.json(false);
    } else {
      res.json(doc);
    }
  });
}
athleteModel.saveAllAthletes = function(req, res) {
  athleteModel.saveAthleteInfo(req.body);
  res.json(true);
}
athleteModel.UpdateAthletes = function(req, res) {
  athleteModel.updateAthlete(req.body);
  res.json(true);
}
module.exports = athleteModel;