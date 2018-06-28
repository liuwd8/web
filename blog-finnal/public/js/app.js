'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives','ngRoute']).
  config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/addPost', {
        templateUrl: 'partials/addPost',
        controller: AddPostCtrl
      }).
      when('/readPost/:id', {
        templateUrl: 'partials/readPost',
        controller: ReadPostCtrl
      }).
      when('/editPost/:id', {
        templateUrl: 'partials/editPost',
        controller: EditPostCtrl
      }).
      when('/deletePost/:id', {
        templateUrl: 'partials/deletePost',
        controller: DeletePostCtrl
      }).
      when('/signin', {
        templateUrl: 'partials/signin',
        controller: SigninCtrl
      }).
      when('/signup', {
        templateUrl: 'partials/signup',
        controller: SignupCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]).run(function($rootScope, $http, $location, $routeParams) {
    $rootScope.global = {isLogin:false,isAdmin: false};
    $rootScope.user = {username:''};
    $rootScope.logout=function() {
      $http.get('/signout').then(function(data) {
        $rootScope.global.isLogin = data.data.isLogin;
        $rootScope.user.username  = '';
        $rootScope.global.isAdmin = false;
        $location.url('/signin');
      });
    }
    $rootScope.isLoginApp=function(callback) {
      $http.get('/isLogin').then(function(data) {
        $rootScope.global.isLogin = data.data.isLogin;
        if(data.data.isLogin) {
          $rootScope.user.username  = data.data.username;
          $rootScope.global.isAdmin = data.data.isAdmin;
          if(callback)
            callback();
        } else {
          $rootScope.user.username  = '';
          $rootScope.global.isAdmin = false;
          $location.url('/signin');
        }
      })
    }
  });