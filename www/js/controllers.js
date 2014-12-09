angular.module('phonecatFilters', []).filter('timeInSeconds', function() {
    return function(date) {
        return date*1000;
    }
});

angular.module('starter.controllers', ['angularMoment', 'phonecatFilters'])

.filter('to_trusted', ['$sce', function($sce){
      return function(text) {
          return $sce.trustAsHtml(text);
      };
  }])

.controller('LoginController', function($scope, $state) {
  // check if the user is logged in
  if((window.localStorage.getItem("isLoggedIn") == true) || !loginRequired) {
    $state.transitionTo("app.home");
  }

  // Form data for the login modal
  $scope.loginData = { 'result' : false };

  $scope.doLogin = function() {
    if($scope.loginData.username && $scope.loginData.password && $scope.loginData.username.length > 0 && $scope.loginData.password.length > 0) {
      console.log('valid');
    } else {
      console.log('try me');
    }
  }
})

.controller('CardsController', function($scope, $state, $http) {
  // check if the user is logged in
  if((!(window.localStorage.getItem("isLoggedIn") == true)) && loginRequired) {
    $state.transitionTo("app.login");
  }

  // list of all messages
  $scope.messages = [];
  $scope.fetching = true;
  $scope.error = null;

  // defaults
  $scope.defaultPicture = "img/user.png";

  // lets fetch the list of all events
  $http({
      url: 'http://csa.codians.com/events.php',
      method: "POST",
      data: {'token': ''}
    }).success(function (data, status, headers, config) {
        // we got data from the server
        if(data.response && data.response == "success") {
          // we got data from the server
          $scope.fetching = false;  
          $scope.messages = data.data;
        } else {
          // an error occurred
          $scope.fetching = false;

          // was there a response message?
          if(data.responseMessage != undefined) {
            $scope.error = data.responseMessage;
          } else {
            $scope.error = JSON.stringify(data);
          }
        }
    }).error(function (data, status, headers, config) {
        // an error occurred
        $scope.fetching = false;

        // was there a response message?
        if(data.responseMessage != undefined) {
          $scope.error = data.responseMessage;
        } else {
          if(data == "") {
            $scope.error = "Could not connect to the server";
          } else {
            $scope.error = JSON.stringify(data);
          }
        }
    });
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
})
