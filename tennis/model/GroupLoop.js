/* 分组循环赛 */


'use strict'

var mongo   = require("mongoose");
var promise = require('bluebird');

var db = mongo.createConnection('mongodb://127.0.0.1:27017/match');

db.on('connected', function () {
  console.log('数据库连接已建立');
});

db.on('error', function (err) {
  console.log('数据库连接异常:' + err);
});

db.on('disconnected', function () {
  console.log('数据库连接已断开');
});

var groupMatchSchma = new mongo.Schema({
  _id : {type:Number},
  group : {type:Number},
  round : {type:Number},
  match : {type:Array}
});

var groupMatchModel = db.model("groupMatch", groupMatchSchma);

//语法： db.collection.update(c1,$set,multi,upsert)
groupMatchModel.updateGroupMatchInfoByAthlete = function(data) {
    return db.model('groupMatch').update({'group' : data.group, 'round' : data.round, 'match.athleteA' : data.athleteA, 'match.athleteB' : data.athleteB},
     {$set:{ 'match.$.winAthlete' : data.winAthlete}}, {multi: true});
}

groupMatchModel.saveGroupMatchInfo = function(Data) {
  db.model('groupMatch').remove(function(err) {
    var i = 0;
    Data.forEach(function(data, index){
      data.forEach(function(sdata, sindex){
        var info = {
          _id : i,
          group : index,
          round : sdata.round,
          match: sdata.match
        }
        var monInsert = new groupMatchModel(info);
        ++i;
        monInsert.save(function(err){
          if(err)
              console.log(err);
        });
      })    
    });
  });
}
groupMatchModel.getGroupMatch = function(req,res) {
    db.model("groupMatch").find(function(err,doc) {
      if(err) {
          res.json(false);
          console.log(err);
      }
      else {
          if(doc) {
              var allMatch = new Array();
              doc.forEach(function(_doc){
                if(allMatch[_doc.group] === undefined)
                  allMatch[_doc.group] = [];
                allMatch[_doc.group].push({round: _doc.round, match: _doc.match});
              })
              res.json(allMatch);
          }
          else
              res.json(false);
      }
    });
}
groupMatchModel.SaveGroupLoop = function(req,res) {
  groupMatchModel.saveGroupMatchInfo(req.body);
}

exports = module.exports = groupMatchModel;
