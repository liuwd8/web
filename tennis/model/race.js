var SingleEliminationModel = require('./SingleElimination');
var SingleCycleModel =require('./SingleCycle');
var GroupLoopModel = require('./GroupLoop');
var athletes = require('./athlete');

var SingleElimination = function(data) {
  var seeds = [];
  var ran = [];
  var position = {
    8:[0],
    16:[0,4],
    32:[0,8,15,7],
    64:[0,16,31,15,8,24,23,7],
    128:[0,32,63,31,16,48,47,15,8,40,55,23,24,56,39,7]
  };
  var temp,aIndex,bIndex;
  var randomTimes = 1000;
  data.forEach(function(par) {
    //if(par['defeatedMatchNum'] === 0)
      if(par['seedParticipantNum'] > 0)
        seeds.push(par);
      else
        ran.push(par);
  });
  seeds.sort(function(a,b) {
    return a['seedParticipantNum'] - b['seedParticipantNum'];
  });
  for(var i=0;i<randomTimes;++i) {
    aIndex=Math.floor(Math.random()*ran.length);
    bIndex=Math.floor(Math.random()*ran.length);
    temp=ran[aIndex];
    ran[aIndex]=ran[bIndex];
    ran[bIndex]=temp;
  }
  if(seeds.length > ran.length) {
    alert('种子选手人数不能多于总参赛人数的一半');
    return;
  }
  var n=2;
  while(n<data.length)
    n=n*2;
  var matches = new Array(n/2);
  for(var i=0;i<n-data.length;++i)
    ran.push(undefined);
  var o=0;
  var count = 0;
  for (var i = 0; i < n/4; i++) {
    o = ran.length-i-1;
    if(i < seeds.length) {
      matches[Math.floor((i%2===0?position[n][i>>1]:(n-1-position[n][i>>1]))/2)] = {athleteA:seeds[i],athleteB:ran[o]};
    } else {
      matches[Math.floor((i%2===0?position[n][i>>1]:(n-1-position[n][i>>1]))/2)] = {athleteA:ran[count],athleteB:ran[o]};
      count++;
    }
  }
  for(var i=matches.length-1;i>=0;--i) {
    if(matches[i] === undefined) {
      o--;
      matches[i] = {athleteA:ran[count],athleteB:ran[o]}
      count++;
    }
  }
  SingleEliminationModel.saveEliminationMatchInfo(matches);
  return matches;
}
var SingleCycle = function(data) {
  var pNum = data.length;  //选手人数
  var dataTmp = data.slice(0); //保留原参赛选手
  var matches = [];
  if(pNum >= 5 && pNum % 2 == 1) {
    //不可移动‘0’号位
    var dataRes = dataTmp.slice();
    dataRes.reverse();
    var virtualPeople = undefined;
    for(var i = 1; i <= pNum; ++i) {
      var info = {round: i, match:[]};    
      for(var j = 0; j < (pNum+1)/2; ++j) {
        if(j == 0)
          info.match.push({athleteA:dataTmp[(j+dataTmp.length-i+1)%dataTmp.length],athleteB:virtualPeople});
        else 
          info.match.push({athleteA:dataTmp[(j+dataTmp.length-i+1)%dataTmp.length], athleteB:dataRes[(i+j-2)%dataRes.length]});
      }
      matches.push(info);
    }
  } else {
    dataTmp.shift();
    
    //人数为奇数时候，根据规则，补平人数
    if(pNum % 2 == 1) 
      dataTmp.push(undefined);

    var dataRes = dataTmp.slice(0);
    dataRes.reverse();
    for(var i = 1; i <= pNum-1; ++i) {
      var f1 = async function () {
        var info = {round: i, match:[]};    
        for(var j = 0; j < pNum/2; ++j) {
          var f2 = function() {
            if(j == 0)
              info.match.push({athleteA:data[0],athleteB:dataRes[i-1]});
            else {
              info.match.push({athleteA:dataTmp[(j+dataTmp.length-i)%dataTmp.length], athleteB:dataRes[(i+j-1)%dataRes.length]});
            }
          };
          f2();
        }
        matches.push(info);
      }
      f1();
    }
  }
  return matches;
}
var GroupLoop = function(data) {
  var matches=[];
  var days= data.days;
  var sectionPerDay = data.sectionPerDay;
  var changdishu = data.changdishu;
  var containPerchangdi = data.containPerchangdi;
  var groups = Math.ceil(
    (data.participants.length*data.participants.length)/(
      days*sectionPerDay*changdishu*containPerchangdi*2+data.participants.length));
  var groupsArray = new Array(groups);
  for(var i=0;i<groups;++i)
    groupsArray[i] = [];
  var k=1,j=0;
  for(var i=0;i<data.participants.length;++i) {
    if(j===groups) {
      k=-1;
      j+=k;
    } else if(j===-1) {
      k=1;
      j+=k;
    }
    groupsArray[j].push(data.participants[i]);
    j+=k;
  }
  for(var i=0;i<groups;++i)
    matches.push(SingleCycle(groupsArray[i]));
  GroupLoopModel.saveGroupMatchInfo(matches);
  return matches;
}

var nextSingleElimination = function(data) {
  var matches = [];
  for(var i = 0; i < date.length; ) {
    matches.push({'athleteA': data[i], 'athleteB': data[i+1]});
    i+=2;
  }
  return matches;
}

var race={};

race.SE = function(req, res) {
  if(!req.body || !req.body.participants) {
    res.json([]);
    return 0;
  }
  athletes.saveAthleteInfo(req.body.participants);
  res.json(SingleElimination(req.body.participants));
}
race.SC = function(req, res) {
  if(!req.body || !req.body.participants) {
    res.json([]);
    return 0;
  }
  athletes.saveAthleteInfo(req.body.participants);
  var matches = SingleCycle(req.body.participants);
  SingleCycleModel.saveCycleMatchInfo(matches);
  res.json(matches);
}
race.GL = function(req, res) {
  if(!req.body || !req.body.participants) {
    res.json([]);
    return 0;
  }
  athletes.saveAthleteInfo(req.body.participants);
  res.json(GroupLoop(req.body));
}
module.exports = race;