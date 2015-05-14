// Wait for Cordova to load
if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
  // this is for cordova
  document.addEventListener("deviceready", onDeviceReady, false);
} else {
  // this is for browsers
  onDeviceReady();
}

// Cordova is ready
function onDeviceReady() {
    var db = window.openDatabase("CSA", "1.0", "CSA", 200000);
    db.transaction(populateDB, errorCB);
}

// Populate the database 
function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, title TEXT, description TEXT, admin_id INT, venue TEXT, timestamped INT)');
}

// Transaction error callback
function errorCB(tx, err) {
    // alert("Error processing SQL: " + err);
}

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

  // get the initial list of all posts
  var db = window.openDatabase("CSA", "1.0", "CSA", 200000);
  db.transaction(function(tx) {
      // select all products
      tx.executeSql('SELECT * FROM posts ORDER BY timestamped DESC LIMIT 30',[],function(tx, result) {
        for(var i = 0; i < result.rows.length; i++) {
          $scope.messages.push(result.rows.item(i));
        }
        $scope.$apply();
      },errorCB);
    }, errorCB);

  // defaults
  $scope.defaultPicture = "img/user.png";

  // write the result od the http fetch to the database and update the view
  $scope.writeDatabase = function(data) {
    var db = window.openDatabase("CSA", "1.0", "CSA", 200000);

    // delete the old data
    db.transaction(function(tx) {
      tx.executeSql('DROP TABLE IF EXISTS posts;');
    }, errorCB);

    // create the table to store the new data
    db.transaction(populateDB, errorCB);

    // insert the new data that was passed
    db.transaction(function(tx) {
      for(var i = 0; i < data.length; i++) {
        tx.executeSql('INSERT OR IGNORE INTO posts (id, title, description, admin_id, venue, timestamped) VALUES("'+data[i]['id']+'", "'+data[i]['title']+'", "'+data[i]['description']+'", "'+data[i]['admin_id']+'", "'+data[i]['venue']+'", "'+data[i]['timestamped']+'")');
      }
      console.log("done");
    }, errorCB);

    db.transaction(function(tx) {
      // select all products
      tx.executeSql('SELECT * FROM posts ORDER BY timestamped DESC LIMIT 30',[],function(tx, result) {
        for(var i = 0; i < result.rows.length; i++) {
          $scope.messages.push(result.rows.item(i));
        }
        $scope.$apply();
      },errorCB);
    }, errorCB);
  }

  // lets fetch the list of all events
  $http({
      url: 'http://csa.christuniversity.in/csa-api//events.php',
      method: "POST",
      data: {'token': ''}
    }).success(function (data, status, headers, config) {
        // we got data from the server
        if(data.response && data.response == "success") {
          // we got data from the server
          $scope.fetching = false;  
          $scope.messages = [];
          $scope.writeDatabase(data.data);
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