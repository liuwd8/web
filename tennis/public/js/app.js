(function(){
  'use strict';
  angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives','ngRoute']).
    config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
      $routeProvider.
        when('/info',{
          templateUrl: 'partials/index',
          controller: IndexCtrl
        }).
        when('/competition', {
          templateUrl: 'partials/competition',
          controller: competitionCtrl
        }).
        when('/result', {
          templateUrl: 'partials/result',
          controller: resultCtrl
        }).
        otherwise({
          redirectTo: '/info'
        });
      $locationProvider.html5Mode({enable: true});
    }]).run(function($rootScope,$http) {
      String.prototype.conventer = function() {
        /*if(this === 'winMatchNum')
          return '胜利场数';
        else if(this === 'defeatedMatchNum')
          return '失败场数';
        else */if(this === 'seedParticipantNum')
          return '种子选手编号';

        return this;
      };
      $http.get('/athletes').then(function(data) {
        if(!data.data[0]) {
          $rootScope.keys = [];
          $rootScope.data = [];
          return;
        }
        $rootScope.keys = Object.keys(data.data[0].athlete);
        $rootScope.data = data.data.sort(function(a,b) {
          return b.athlete['积分'] - a.athlete['积分'];
        });
      });
      $http.get('SingleElimination').then(function(data) {
        $rootScope.SingleEliminationMatches = data.data;
      });
      $http.get('SingleCycle').then(function(data) {
        $rootScope.SingleCycleMatches = data.data;
      });
      $http.get('GroupLoop').then(function(data) {
        $rootScope.GroupLoopMatches = data.data;
      });
      if(!$rootScope.format)
        $rootScope.format='SingleElimination';
    })

  angular.module('myApp.directives', []).
    directive('onFinishRender',['$timeout', '$parse', function ($timeout, $parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          if(scope.$last === true) {
            $timeout(function () {
              scope.$emit('ngRepeatFinished');
            });
          }
        }
      }
    }]).
    directive('getWinner',['$timeout', '$parse',function ($timeout, $parse) {
      return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
          var a = $element.find('td');
          a.eq(0).on('click',function() {
            $scope.match.winAthlete = $scope.match.athleteA;
          });
          a.eq(2).on('click',function() {
            if($(this).text() === '') return;
            $scope.match.winAthlete = $scope.match.athleteB;
          });
          if(!$scope.match.athleteB)
            $scope.match.winAthlete = $scope.match.athleteA;
          if($scope.match.winAthlete) {
            if($scope.match.winAthlete['姓名'] === $scope.match.athleteA['姓名'])
              a.eq(0).css({"background":"#3fbdf7", "color":"white"});
            else if($scope.match.winAthlete['姓名'] === $scope.match.athleteB['姓名'])
              a.eq(2).css({"background":"#3fbdf7", "color":"white"});
            else
              $scope.match.winAthlete = undefined;
          }
        }
      }
    }])
  angular.module('myApp.filters', []).
    filter('interpolate', ['version', function(version) {
      return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      }
    }]);
  angular.module('myApp.services', []).value('version', '0.1');

  function IndexCtrl($scope,$http,$rootScope){
    var ori = {};
    $scope.showDiv=function(data, keys){
      $scope.info = data;
      ori = Object.assign({},$scope.info.athlete);
      $("div.index div#reviseInfo").show();
    }

    $("div.index #cancel").click(function() {
      $scope.info.athlete = ori;
      ori={};
      $("div.index div#reviseInfo").hide();
    });

    $("div.index #submit").click(function(){
      $http.post('/UpdateAthletes',$scope.info).then(function(data){
        if(!data.data)
          alert('存储数据时出错');
        else {
          alert('保存成功');
        }
      });
      $("div.index div#reviseInfo").hide();
    });

    $('div.index input').focus(function(){
      $(this).prev().addClass('red');
    });
    $('div.index input').blur(function(){
      $(this).prev().removeClass('red');
    });

    $scope.$on('ngRepeatFinished',function() {
      $('tr th').unbind('click');
      $('tr th').click(function(da) {
        var tm = da.currentTarget.innerText;
        var k;
        if(tm === '姓名' || tm === '性别') {
          k = function(a,b) {return b.athlete[tm].localeCompare(a.athlete[tm],'zh');}
        } else if(tm === '积分'){
          k = function(a,b) {return b.athlete[tm] - a.athlete[tm];}
        } else {
          return;
        }
        $rootScope.data.sort(function(a,b) {
          if(a.athlete[tm] === undefined) return 1;
          if(b.athlete[tm] === undefined) return -1;
          return k(a,b);
        });
        $rootScope.$apply();
      })
      $('tr th').first().unbind('click');
      $('tr th').last().unbind('click');
    })
  }

  function competitionCtrl($scope, $http,$rootScope) {
    var X = XLSX;
    var data = $rootScope.data;
    if(!$scope.sortable)
      $scope.sortable = '积分';
    //excel文件读取,定义参赛人员的默认属性
    var process_wb = (function() {
      var to_json = function to_json(workbook) {
        var participants = [];
        workbook.SheetNames.forEach(function(sheetName) {
          var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
          var attr = roa[1];
          var colName = roa.splice(2,roa.length);
          var json = [];
          colName.forEach(function(item){
            var temp={};
            item.forEach(function(value,index){
                temp[attr[index]]=value;
            });
            if(item.length > 0) {
            /*
              temp['winMatchNum'] = 0;   //胜场数
              temp['defeatedMatchNum'] = 0;//负场数
              */
              temp['seedParticipantNum'] = 0;//是否为种子选手
              participants.push({athlete:temp});
            }
          });
          if($scope.seedNum > participants.length) {
            alert('种子数不能多于总人数的一半');
            return;
          }
          participants.sort(function(a,b) {
            return Number(b.athlete[$scope.sortable]) - Number(a.athlete[$scope.sortable]);
          });
          for (var i = 0; i < $scope.seedNum; i++) {
            participants[i].athlete['seedParticipantNum'] = i+1;
          }
        });
        $rootScope.keys = Object.keys(participants[0].athlete);
        $rootScope.data = participants;
        return participants;
      };
      return function process_wb(wb) {
        data = to_json(wb);
      };
    })();
    $scope.generateMatches = function() {
      if(!data || data.length/$scope.seedNum < 2) return;
      for (var i = 0; i < data.length; ++i) {
        data[i].athlete['seedParticipantNum'] = 0;
      }
      for (var i = 0; i < $scope.seedNum; i++) {
        data[i].athlete['seedParticipantNum'] = i+1;
      }
      $rootScope.keys = Object.keys(data[0].athlete);
      var k = {participants:[]};
      data.forEach(function(d) {
        k.participants.push(d.athlete);
      })
      if($rootScope.format==="GroupLoop") {
        k.days = $scope.days;
        k.sectionPerDay= $scope.sectionPerDay;
        k.changdishu= $scope.changdishu;
        k.containPerchangdi= $scope.containPerchangdi;
      }
      $http.post($rootScope.format,k).then(function(data) {
        console.log(data.data);
        $rootScope[$rootScope.format+'Matches'] = data.data;
      });
    }
    var do_file = (function() {
      var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||{}).readAsBinaryString;
      var domrabs = true;
      if(!rABS) domrabs = false;

      return function do_file(files) {
        rABS = domrabs;
        var f = files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
          //Below need to delete in release
          if(typeof console !== 'undefined') console.log("onload", new Date(), rABS);
          //Above need to delete in release
          var data = e.target.result;
          if(!rABS) data = new Uint8Array(data);
          process_wb(X.read(data, {type: rABS ? 'binary' : 'array'}));
        };
        if(!f) return;
        if(rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
      };
    })();

    //文件拖拽处理
    (function() {
      var drop = document.getElementById('drop');
      if(!drop.addEventListener) return;

      function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        do_file(e.dataTransfer.files);
      }

      function handleDragover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }

      drop.addEventListener('dragenter', handleDragover, false);
      drop.addEventListener('dragover', handleDragover, false);
      drop.addEventListener('drop', handleDrop, false);
    })();
    
    (function() {
      var xlf = document.getElementById('xlf');
      if(!xlf.addEventListener) return;
      function handleFile(e) { do_file(e.target.files); }
      xlf.addEventListener('change', handleFile, false);
      var select= document.getElementById('Competition-system');
    })();

    (function() {
      document.getElementsByName('submit')[0].onclick = function() {
        /*if(document.getElementById('xlf').value == "") {
          alert("请选择文件!");
          return;
        }
        else {*/
          var option={};
          if($rootScope.format == 'SingleElimination') {
            option.fileName = '单淘汰赛划分结果';
            var matches = $rootScope.SingleEliminationMatches;
            var matcheInfo = [];    
            matches.forEach(function(data) {
              var info = { athleteA: '轮空', operate: 'vs', athleteB:'轮空'};
              if(data.athleteA) 
                info.athleteA = data.athleteA['姓名'];
              if(data.athleteB) 
                info.athleteB = data.athleteB['姓名'];
              matcheInfo.push(info);
            })
            option.datas=[
              {
                sheetData: matcheInfo,
                sheetName:'淘汰赛',
               // sheetFilter:['athleteB', 'operate','athleteA'],
                sheetHeader:['运动员', '对战', '运动员']
              }
            ];
            
          } else if ($rootScope.format == 'SingleCycle') {
            option.fileName = '单循环赛划分结果';
            var matches = $rootScope.SingleCycleMatches;
            //console.log('循环:',matches);
            var datas = [];
            matches.forEach(function(_match) {
              var outModel = { sheetData: null, sheetName: '', sheetHeader:['运动员', '对战', '运动员']};
              outModel.sheetName = '第' + _match.round + '轮';
              var matcheInfo = [];
              _match.match.forEach(function(data) {
                var info = { athleteA: '轮空', operate: 'vs', athleteB:'轮空'};
                if(data.athleteA) 
                  info.athleteA = data.athleteA['姓名'];
                if(data.athleteB) 
                  info.athleteB = data.athleteB['姓名'];
                matcheInfo.push(info);
              })
              outModel.sheetData = matcheInfo;
              datas.push(outModel);
            })
            option.datas = datas;
          } else {
            option.fileName = '分组循环赛划分结果';
            var matches = $rootScope.GroupLoopMatches;
            //console.log('小组:',matches);
            var datas = [];
            matches.forEach(function(smatch, index) {
              //var outModel = { sheetData: null, sheetName: '', sheetHeader:['运动员', '对战', '运动员']};
              var outModel = { sheetData: null, sheetName: ''};
              var sIndex = index + 1;
              outModel.sheetName = '第' + sIndex + '组';
              var matcheInfo = [];
              smatch.forEach(function(_match){
                matcheInfo.push({one: null, round: '第' + _match.round + '轮'});
                matcheInfo.push({sheetHeader1: '运动员', sheetHeader2: '对战', sheetHeader3: '运动员'});
                matcheInfo.push()
                _match.match.forEach(function(data) {
                  var info = { athleteA: '轮空', operate: 'vs', athleteB:'轮空'};
                  if(data.athleteA) 
                    info.athleteA = data.athleteA['姓名'];
                  if(data.athleteB) 
                    info.athleteB = data.athleteB['姓名'];
                  matcheInfo.push(info);
                })
              })
              outModel.sheetData = matcheInfo;
              datas.push(outModel);
            })
            option.datas = datas;
          }
          var toExcel=new ExportJsonExcel(option);
          toExcel.saveExcel();
        }
      //}
    })();


    $('.uploadBtn').click(function(){
      $('#xlf').click();
      event.stopPropagation();
    });
  }
  function resultCtrl($scope,$http,$rootScope) {
    var modifying = false;
    function tdClick() {
      $(this).find("td:even").click(function(){
        if($(this).text() === '') return;
        if($(this).css("background-color") === "rgb(63, 189, 247)"){
          $(this).css({"background":"none", "color":"black"});
        }else{
          $(this).siblings().css({"background":"none", "color":"black"});
          $(this).css({"background":"#3fbdf7", "color":"white"});
        }
      });
    }
    $scope.$on('ngRepeatFinished',function() {
      $('div.result .saveInfoButt').unbind('click');
      $('div.result .saveInfoButt').click(function() {
        if(modifying) {
          modifying = false;
          $('.GenerateCompetition').show();
          $('button.saveInfoButt').text('修改信息');
          $('div.result td').unbind('click');
          $http.post('Save'+$rootScope.format,$rootScope[$rootScope.format+'Matches']).then(function(data) {
            if(!data.data)
              alert('存储数据时出错');
            else {
              alert('修改完成');
            }
          });
        } else {
          modifying = true;
          $('.GenerateCompetition').hide();
          $('button.saveInfoButt').text('确认信息');
          $('div.result tr').each(tdClick);
        }
      });
    })
    $('.createNewRaceButt').click(function() {
      if($rootScope.format !== 'SingleElimination') {
        alert('仅支持单循环赛生成下一轮');
        return;
      }
      var k = $rootScope.SingleEliminationMatches;
      var n = true;
      var data = [];
      k.forEach(function(mat) {
        if(!mat.winAthlete || mat.winAthlete.toString() !== mat.athleteA.toString() && mat.winAthlete.toString() !== mat.athleteB.toString()) {
          n = false;
        }
        else {
          data.push(mat.winAthlete);
        }
      });
      if(n) {
        var ma = [];
        var kk = [];
        for(var i=0;i<data.length;i+=2) {
          ma.push({athleteA:data[i],athleteB:data[i+1]});
          kk.push(data[i]),kk.push(data[i+1]);
        }
        $http.post('SaveSingleElimination',ma).then(function(data) {
          if(data.data)
            $rootScope.SingleEliminationMatches = ma;
          else
            alert('存储数据时出错');
        });
        $http.post('SaveAthletes',kk).then(function(data) {
          if(!data.data)
            alert('存储数据时出错');
          else {
            $http.get('/athletes').then(function(data) {
              if(!data.data[0]) {
                $rootScope.keys = [];
                $rootScope.data = [];
                return;
              }
              $rootScope.keys = Object.keys(data.data[0].athlete);
              $rootScope.data = data.data.sort(function(a,b) {
                return b.athlete['积分'] - a.athlete['积分'];
              });
            });
          }
        })
      } else {
        alert('请确认所有比赛结果');
      }
    })
    $('.restoreButt').click(function () {
      $http.get('SingleEliminationCopy').then(function(data) {
        $rootScope.SingleEliminationMatches = data.data;
      });
    })
  }
})();