/* 淘汰赛 */

'use strict'

var mongo   = require("mongoose");
var promise = require('bluebird');

var db = mongo.createConnection('mongodb://liuwd8:Liuwd8665@127.0.0.1:27017/match');

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
var eliminationMatchSchma = new mongo.Schema({
    athleteA : {type:JSON},
    athleteB : {type:JSON},
    winAthlete : {type:JSON}
});

var eliminationMatchModel = db.model("eliminationMatch", eliminationMatchSchma);
var eliminationMatchCopyModel = db.model("eliminationMatchCopy", eliminationMatchSchma);
//语法： db.collection.update(c1,$set,multi,upsert)
eliminationMatchModel.updateEliminationMatchInfoByAthlete = function(data) {
    return db.model("eliminationMatch").update({athleteA : data.athleteA, athleteB : data.athleteB}, {$set:{ winAthlete : data.winAthlete}}, {multi: true});
}

eliminationMatchModel.saveEliminationMatchInfo = function(Data) {
    db.model('eliminationMatch').find(function(err,doc) {
        if(err) {
            res.json(false);
        } else {
            db.model("eliminationMatchCopy").remove(function() {
                doc.forEach(function(data){
                    var info1 = {
                        athleteA : data.athleteA,
                        athleteB : data.athleteB,
                        winAthlete : data.winAthlete
                    };
                    var monInsertCopy = new eliminationMatchCopyModel(info1);
                    monInsertCopy.save(function(err){
                        if(err)
                            console.log(err);
                    })
                });
            });
            db.model('eliminationMatch').remove(function() {
                Data.forEach(function(data){
                    var info = {
                        athleteA : data.athleteA,
                        athleteB : data.athleteB,
                        winAthlete : data.winAthlete
                    };
                    var monInsert = new eliminationMatchModel(info);
                    monInsert.save(function(err){
                        if(err)
                            console.log(err);
                    });
                });
            });
        }
    })
}
eliminationMatchModel.getEliminationMatch = function(req,res) {
    db.model("eliminationMatch").find(function(err,doc) {
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
eliminationMatchModel.getNextEliminationMatch = function(req, res) {
    db.model("eliminationMatch").find(function(err,doc) {
        var athletes = [];
        doc.forEach(function(_doc) {
            if(!_doc.winAthlete) {
                res.json({err: '比赛还未完成'});
            }
            else
                athletes.push(_doc.winAthlete);
        });
        res.json(athletes);
    });
}
eliminationMatchModel.getPrevEliminationMatch = function(req, res) {
    db.model("eliminationMatchCopy").find(function(err,doc) {
        if(err) {
            res.json(false);
            console.log(err);
        }
        else {
            if(doc) {
                res.json(doc);
                db.model('eliminationMatch').remove(function() {
                    doc.forEach(function(data){
                        var info = {
                            athleteA : data.athleteA,
                            athleteB : data.athleteB,
                            winAthlete : data.winAthlete
                        };
                        var monInsert = new eliminationMatchModel(info);
                        monInsert.save(function(err){
                            if(err)
                                console.log(err);
                        });
                    });
                    db.model("eliminationMatchCopy").remove();
                });
            }
            else
                res.json(false);
        }
    });
}

eliminationMatchModel.SaveSingleElimination = function(req, res) {
    eliminationMatchModel.saveEliminationMatchInfo(req.body);
    res.json(true);
}

exports = module.exports = eliminationMatchModel;