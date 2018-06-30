/* 循环赛 */

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
//userName, userId
var cycleMatchSchma = new mongo.Schema({
    round : {type:String},
    match : {type:Array}
});

var cycleMatchModel = db.model("cycleMatch", cycleMatchSchma);

//语法： db.collection.update(c1,$set,multi,upsert)
cycleMatchModel.updateCycleMatchInfoByAthlete = function(data) {
    return db.model('cycleMatch').update({round : data.round, 'match.athleteA' : data.athleteA, 'match.athleteB' : data.athleteB}, {$set:{ 'match.$.winAthlete' : data.winAthlete}}, {multi: true});
}

cycleMatchModel.saveCycleMatchInfo = function(Data) {
   db.model('cycleMatch').remove(function() {
    Data.forEach(function(data){
      var monInsert = new cycleMatchModel(data);
      monInsert.save(function(err){
          if(err)
              console.log(err);
      })
    })
  });
}
cycleMatchModel.getCycleMatch = function(req,res) {
    db.model("cycleMatch").find(function(err,doc) {
        if(err) {
            res.json(false);
            console.log(err);
        }
        else {
            if(doc)
                res.json(doc);
            else
                res.json(false);
        }
    });
}
cycleMatchModel.SaveSingleCycle = function(req,res) {
  cycleMatchModel.saveCycleMatchInfo(req.body);
  res.json(true);
}

exports = module.exports = cycleMatchModel;