'use strict';

/* Controllers */
var calculateIndexes = function (current, length, displayLength) {
  var indexes = [];
  var start = Math.round(current - displayLength / 2);
  var end = Math.round(current + displayLength / 2);
  if (start <= 1) {
    start = 1;
    end = start + displayLength - 1;
    if (end >= length - 1) {
        end = length - 1;
    }
  }
  if (end >= length - 1) {
    end = length ;
    start = end - displayLength + 1;
    if (start <= 1) {
        start = 1;
    }
  }
  for (var i = start; i <= end; i++) {
    indexes.push(i);
  }
  return indexes;
};
Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}
function IndexCtrl($scope, $http, $rootScope, $routeParams, $location) {
  $rootScope.isLoginApp(function(){
    $scope.seachStatus = 0; //未搜索
    if(!$routeParams.p)
      $routeParams.p = "1";
    $http.get('/api/posts/?p=' + $routeParams.p).
      then(function(data) {
        $scope.posts = data.data.posts;
        $scope.posts.forEach(function(post) {
          post.text = post.text.substr(0,100) + '...';
          post.date =(new Date(post.date)).Format("yyyy-MM-dd hh:mm:ss");
        });
      });
    $http.get('/api/count').
      then(function(data){
        $scope.count = data.data;
        $scope.maxBlogsNumberPage = Math.ceil(data.data/15);
        $scope.current = parseInt($routeParams.p);
        $scope.pageIndex = calculateIndexes($scope.current,$scope.maxBlogsNumberPage,5);
      });
  });
  $scope.getMore = function(id) {
    $location.url('/readPost/'+ id);
  }
  $scope.hidePost=function(post,hide) {
    $http.post('/api/hidePost/' + post._id,{isHide:hide}).then(function(data){
      post.isHide = hide;
    });
  }
  $scope.paginationTo = function(n) {
    if(n<1)
      $scope.current = 1;
    else if(n>$scope.maxBlogsNumberPage)
      $scope.current = $scope.maxBlogsNumberPage;
    else
      $scope.current = n;
    $http.get('/api/posts/?p=' + $scope.current).
      then(function(data) {
        $scope.posts = data.data.posts;
        $scope.posts.forEach(function(post) {
          post.text = post.text.substr(0,100) + '...';
          post.date =(new Date(post.date)).Format("yyyy-MM-dd hh:mm:ss");
        });
      });
  }
  $scope.filterBlog = function() {
    if($scope.filter && $scope.filter !=='') {
      $scope.seachStatus = 1; //正在搜索
      $http.post('/api/seach/' + $rootScope.user.username,{filter:$scope.filter.split(' ')}).then(function(data) {
        $scope.filterCount = data.data.length;
        $scope.maxBlogsNumberPage = Math.ceil(data.data.length/15);
        $scope.current = 1;
        $scope.pageIndex = calculateIndexes($scope.current,$scope.maxBlogsNumberPage,5);
        $scope.seachStatus = 2; //搜索结束
        $scope.seachResult = $scope.filterCount ? '共搜索到' + $scope.filterCount + '篇博客' : '未搜索到相关博客';
        $scope.allPosts = data.data;
        $scope.filterPaginationTo(1);
      })
    }
    $scope.filterPaginationTo = function(n) {
      if(n<1)
        $scope.current = 1;
      else if(n>$scope.maxBlogsNumberPage)
        $scope.current = $scope.maxBlogsNumberPage;
      else
        $scope.current = n;
      $scope.posts = [];
      for(var i = (n-1)*15;i<$scope.allPosts.length&&i<n*15;++i)
        $scope.posts.push($scope.allPosts[i]);
      $scope.posts.forEach(function(post) {
        post.text = post.text.substr(0,100) + '...';
        post.date =(new Date(post.date)).Format("yyyy-MM-dd hh:mm:ss");
      });
    }
  }
}

function AddPostCtrl($scope, $http, $rootScope, $location) {
  $rootScope.isLoginApp(function(){
    $scope.submitPost = function () {
      $http.post('/api/post', $scope.form).
        then(function(data) {
          $location.path('/');
        });
      }
  });
}

function ReadPostCtrl($scope, $http,  $rootScope, $location, $routeParams) {
  $scope.showCommentBool = false;
  $rootScope.isLoginApp(function(){
    if(!$routeParams.p)
      $routeParams.p = "1";

    $http.get('/api/post/' + $routeParams.id +"?p="+ $routeParams.p).
      then(function(data) {
        data.data.date = (new Date(data.data.date)).Format('yyyy-MM-dd hh:mm:ss');
        data.data.comment.forEach(function(comment){
          comment.editComment = false;
          comment.date = (new Date(comment.date)).Format('yyyy-MM-dd hh:mm:ss');
        });
        $scope.post = data.data;
        $scope.count = data.data.length;
        $scope.maxBlogsNumberPage = Math.ceil(data.data.length/10);
        $scope.current = parseInt($routeParams.p);
        $scope.pageIndex = calculateIndexes($scope.current,$scope.maxBlogsNumberPage,5);
      });
    $scope.paginationTo = function(n) {
      if(n<1)
        $scope.current = 1;
      else if(n>$scope.maxBlogsNumberPage)
        $scope.current = $scope.maxBlogsNumberPage;
      else
        $scope.current = n;
      $http.get('/api/post/' + $routeParams.id +"?p="+ $scope.current).
        then(function(data) {
          data.data.date = (new Date(data.data.date)).Format('yyyy-MM-dd hh:mm:ss');
          data.data.comment.forEach(function(comment){
            comment.editComment = false;
            comment.date = (new Date(comment.date)).Format('yyyy-MM-dd hh:mm:ss');
          });
          $scope.post = data.data;
        });
    }
  });
  $scope.showComment = function() {
    $scope.showCommentBool = !$scope.showCommentBool;
  }
  $scope.submit = function () {
    if($rootScope.user.username && $rootScope.user.username!== '') {
      var newCommentFrom = {
        context: $scope.newComment,
        username:$rootScope.user.username,
      };
      $http.post('/api/addComment/' + $routeParams.id, newCommentFrom).
        then(function(data) {
          $scope.post.comment = data.data.comment;
          $scope.post.comment.forEach(function(comment){
            comment.editComment = false;
            comment.date = (new Date(comment.date)).Format('yyyy-MM-dd hh:mm:ss');
          });
          $scope.showCommentBool = false;
          $scope.newComment = '';

          $scope.count = data.data.length;
          $scope.maxBlogsNumberPage = Math.ceil(data.data.length/10);
          $scope.current = 1;
          $routeParams.p = '1';
          $scope.pageIndex = calculateIndexes($scope.current,$scope.maxBlogsNumberPage,5);
        });
    } else {
      $location.url('/signin');
    }
  };
  $scope.deleteComment = function(comment) {
    $http.post('/api/deleteComment/' + $routeParams.id, {id:comment._id}).
      then(function(data) {
        $scope.post.comment = data.data.comment;
        $scope.post.comment.forEach(function(comment){
          comment.editComment = false;
          comment.date = (new Date(comment.date)).Format('yyyy-MM-dd hh:mm:ss');
        });
        $scope.count = data.data.length;
        $scope.maxBlogsNumberPage = Math.ceil(data.data.length/10);
        $scope.current = $scope.current > $scope.maxBlogsNumberPage ? $scope.maxBlogsNumberPage : $scope.current;
        $scope.pageIndex = calculateIndexes($scope.current,$scope.maxBlogsNumberPage,5);
      });
  }
  $scope.showEditCommentDiv = function(comment) {
    comment.editComment = !comment.editComment;
  }
  $scope.changeComment = function(comment) {
    $http.post('/api/updateComment/' + $routeParams.id, comment).
      then(function(data) {
        $scope.post.comment = data.data;
        $scope.post.comment.forEach(function(comment){
          comment.editComment = false;
          comment.date = (new Date(comment.date)).Format('yyyy-MM-dd hh:mm:ss');
        });
      });
  }
  $scope.hideComment=function(comment,hide) {
    $http.post('/api/hideComment/' + $routeParams.id,{
      id:comment._id,isHide:hide
    }).then(function(data){
      comment.isHide = hide;
    });
  }
}

function EditPostCtrl($rootScope, $scope, $http, $location, $routeParams) {
  $scope.form = {};
  $rootScope.isLoginApp(function(){
    $http.get('/api/post/' + $routeParams.id).
      then(function(data) {
        $scope.form = data.data;
      });
  });

  $scope.editPost = function () {
    if($rootScope.user.username && $rootScope.user.username!=='') {
      $http.put('/api/post/' + $routeParams.id, $scope.form).
        then(function(data) {
          $location.url('/readPost/' + $routeParams.id);
        });
    }
  };
}

function DeletePostCtrl($rootScope, $scope, $http, $location, $routeParams) {
  $rootScope.isLoginApp(function(){
    $http.get('/api/post/' + $routeParams.id).
      then(function(data) {
        data.data.date = (new Date(data.data.date)).Format('yyyy-MM-dd hh:mm:ss');
        data.data.comment.forEach(function(comment){
          comment.editComment = false;
          comment.date = (new Date(comment.date)).Format('yyyy-MM-dd hh:mm:ss');
        });
        $scope.post = data.data;
      });
  });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      then(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

function SigninCtrl($scope, $http, $rootScope, $location) {
  $rootScope.isLoginApp(function(){
    $location.url('/');
  });
  $(function() {
    $("#username").on("input",checkUsername);
    $("#username").on("blur",checkUsername);
    $("#password").on("input",checkPassword);
    $("#password").on("blur",checkPassword);
    $("#form").on("input",check);
    $scope.login={};
    $('#submit').on('click',function() {
      $http.post('/signin', $scope.login).then(function(data) {
        $rootScope.global.isLogin = data.data.isLogin;
        if(data.data.isLogin) {
          $rootScope.user.username = data.data.user;
          $location.url('/');
        } else {
          $("#info-signin").text(data.data.info);
          $('#info-signin').addClass('error');
        }
      })
    })
  });

  function checkUsername() {
    if($("#username").val()=="")
      $("#usernameError").text("请输入用户名");
    else
      $("#usernameError").text("");
  }

  function checkPassword() {
    if($("#password").val()=="")
      $("#passwordError").text("请输入密码");
    else
      $("#passwordError").text("");
  }
  function check() {
    if($("#username").val()!=""&&$("#password").val()!="") {
      $("#submit").addClass("submitenable").removeAttr("disabled");
      if($("#info-signin").text() === "用户名或密码错误") {
        $('#info-signin').removeClass('error');
        $("#info-signin").text('请登录')
      }
    } else
      $("#submit").removeClass("submitenable").attr("disabled","disabled");
  }
}
function SignupCtrl($scope, $http, $rootScope, $location) {
  var validator = {
    username : {
      state : false,
      errorMessage : "6~18位英文字母、数字或下划线，必须以英文字母开头",
      isValid: function (username) {
        return /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(username);
      }
    },
    password : {
      state : false,
      errorMessage : "密码为6~12位数字、大小写字母、中划线、下划线",
      isValid : function (password) {
        return /^[a-zA-Z0-9_\-]{6,12}$/.test(password);
      }
    },
    sid : {
      state : false,
      errorMessage : "学号8位数字，不能以0开头",
      isValid : function (sid) {
        return /^[1-9][0-9]{7}$/.test(sid);
      }
    },
    phone : {
      state : false,
      errorMessage : "电话11位数字，不能以0开头",
      isValid : function (phone) {
        return /^[1-9][0-9]{10}$/.test(phone);
      }
    },
    email : {
      state : false,
      errorMessage : "请输入正确的邮箱地址",
      isValid : function (email) {
        return /^[a-zA-Z_\-]+@(([a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/.test(email);
      }
    }
  }

  $(function () {
    var funcCheckInfo = function() {
      checkInfo(this.name,this.value);
    };
    var funcCheckValid = function() {
      checkValid(this.name,this.value);
    };
    $("#form").on("input",checkBeforeSubmit);
    $(".input").on("blur",funcCheckInfo).on("input",funcCheckValid);
    $("#password").on("blur",function() {
      if($("#passwordAgain").val()!=="" && $("#passwordAgain").val() !== $(this).val())
        $("#passwordAgainError").text("两次输入的密码不相同");
      else
        $("#passwordAgainError").text("");
    });
    $("#passwordAgain").off().on("blur",function() {
      if(this.value !== $("#password").val()) {
        $("#passwordAgainError").text("两次输入的密码不相同");
      } else {
        $("#passwordAgainError").text("");
      }
    });
    $("#reset").on('click',reset);
    $('.input').trigger('input');
    $scope.regist = {};
    $('#submit').on('click',function() {
      $http.post('/signup', $scope.regist).then(function(data) {
        $rootScope.global.isLogin = data.data.isLogin || data.data.isValid.isTrue;
        if($rootScope.global.isLogin) {
          $rootScope.user.username = data.data.user;
          $location.url('/');
        } else {
          $scope.regist.username = data.data.info.username;
          $scope.regist.email = data.data.info.email;
          $scope.regist.sid = data.data.info.sid;
          $scope.regist.phone = data.data.info.phone;
          $scope.regist.password = $scope.regist.passwordAgain = "";
          $('#usernameError').text(data.data.isValid.usernameError);
          $('#passwordError').text(data.data.isValid.passwordError);
          $('#passwordAgainError').text(data.data.isValid.passwordAgainError);
          $('#sidError').text(data.data.isValid.sidError);
          $('#emailError').text(data.data.isValid.emailError);
          $('#phoneError').text(data.data.isValid.phoneError);
        }
      })
    })
  });

  function checkInfo(name,val) {
    if(!validator[name].state) {
      $("#"+name+"Error").text(validator[name].errorMessage);
    } else {
      $("#"+name+"Error").text("");
    }
  }
  function checkValid(name,val) {
    if(!validator[name].isValid(val)) {
      validator[name].state = false;
    } else {
      validator[name].state = true;
    }
  }
  function checkBeforeSubmit() {
    if(validator.username.state && validator.password.state &&
    validator.phone.state && validator.sid.state && validator.email.state
    && $("#passwordAgain").val() === $("#password").val())
      $("#submit").addClass("submitenable").removeAttr("disabled");
    else
      $("#submit").removeClass("submitenable").attr("disabled","disabled");
  }
  function reset() {
    $(".input").val("");
    $(".error").text("");
  }
}