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
  if(window.localStorage.getItem("isLoggedIn") == true) {
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

.controller('CardsController', function($scope, $state) {
  // check if the user is logged in
  if(!(window.localStorage.getItem("isLoggedIn") == true)) {
    $state.transitionTo("app.login");
  }

  // list of all messages
  $scope.messages = [
    {
      'showClass': false, 
      "name": "Trisanki Saikia", 
      'message': "CSA General Meeting Tomorrow<br />Date: 8th December 2014<br />Day: Monday<br />Time: 4 pm<br />Venue: CSA Office", 
      "picture": "img/user.png",
      "timestamped": "1417958668"
    },{
      'showClass': false, 
      "name": "Anshula Shankar", 
      'message': "Good job today guys! Day one of Prayatana 2014 was a great success!<br />Follow the official CSA Instagram account : csa.christ<br />Follow the official CSA Twitter account: @CSA_Christ", 
      "picture": "img/user.png",
      "timestamped": "1417958668"
    },{
      'showClass': false, 
      "name": "Anumathi Malak", 
      'message': "Hi... Good evening... Prayatna(waste management program), Daksh and Gracias are the events comming up soon.... so its time to spend some time in csa office.... see you all there after 4....", 
      "picture": "img/user.png",
      "timestamped": "1417958668"
    }
  ];
  
  // what happens when show more is clicked?
  $scope.showMore = function(card){
       card.showClass = true;        
       console.log(card);          
        //fade out fadder div 
        
  };
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
})
