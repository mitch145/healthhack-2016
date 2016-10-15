var app = angular.module("MyTodoList", []);
app.controller("myCtrl", function($scope) {

  $scope.searchTodos = '';
  // $scope.newTodo = '';


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCYsz02dbZPrjTvEGfpmwLLY_-qnA8cOB4",
    authDomain: "fir-testing-c97b4.firebaseapp.com",
    databaseURL: "https://fir-testing-c97b4.firebaseio.com",
    storageBucket: "fir-testing-c97b4.appspot.com",
  };
  firebase.initializeApp(config);

  // Initialise $scope.todos
  firebase.database().ref('todos/').once('value', function(snapshot) {
    $scope.$apply(function() {
      $scope.todos = snapshot.val();
    });
  });
  

  // Get a ref to the database service
  var database = firebase.database();

  function writeNewTodo(body) {

    // Get a key for a new Post.
    var newPostKey = database.ref().child('posts').push().key;

    // A post entry.
    var postData = {
      key: newPostKey,
      body: body
    };

    // Write the new post's data
    var updates = {};
    updates['/todos/' + newPostKey] = postData;

    return database.ref().update(updates);
  }

  $scope.addTodo = function addTodo($scope){

    // Send todo to database
    writeNewTodo($scope.newTodo);

    // Clear form input 
    $scope.newTodo = '';

    return;
  };

  $scope.removeTodo = function removeTodo($scope, key){

    var updates = {};
    updates['/todos/' + key] = null;

    return database.ref().update(updates);
  };

  // Watch the firebase database
  firebase.database().ref('todos/').on('value', function(snapshot){
    $scope.todos = snapshot.val();
    console.log("length");
    console.log($scope.todos.length);
    for(i = 0; i < $scope.todos.length; i++){
      console.log($scope.todos[i].body);
    }
    
  });

});
