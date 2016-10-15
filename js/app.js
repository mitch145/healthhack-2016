var app = angular.module("PHD", []);
app.controller("MainController", function($scope){
  // Misc variable initializations
  $scope.page = 'main'
  $scope.displayNote = 0;

  // Temporary fake data
  // $scope.notes = {
  //   0: {
  //     id: 0,
  //     doctor: {
  //       type: 'Neurologist',
  //       name: 'Mitch Ball',
  //       address: 'Fake Address, Address St.'
  //     },
  //     date:{
  //       day: '14th',
  //       month: 'Oct',
  //       time: '2pm'
  //     },
  //     comments: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //     prescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  //   },
  //   1: {
  //     id: 1,
  //     doctor: {
  //       type: 'Cardiac Surgeon',
  //       name: 'Alexander Jones',
  //       address: '3 Melbourne Ave.'
  //     },
  //     date:{
  //       day: '2nd',
  //       month: 'Dec',
  //       time: '9am'
  //     },
  //     comments: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //     prescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  //   },
  //   2: {
  //     id: 2,
  //     doctor: {
  //       type: 'Anaesthesiologist',
  //       name: 'Fake Name',
  //       address: '3 Territory Ave.'
  //     },
  //     date:{
  //       day: '2nd',
  //       month: 'Dec',
  //       time: '9am'
  //     },
  //     comments: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //     prescription:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  //   }
  // }

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA_fTfRSPEztikIG0N32cMBThPLNgETzK0",
    authDomain: "healthhack-97ec0.firebaseapp.com",
    databaseURL: "https://healthhack-97ec0.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "475621532622"
  };
  firebase.initializeApp(config);

  // Get a ref to the database service
  var database = firebase.database();

  // Initialise $scope.notes
  firebase.database().ref('notes/').once('value', function(snapshot) {
    $scope.$apply(function() {
      $scope.notes = snapshot.val();
    });
  });

  function writeNewNote(type, title, time, day, month, year, details) {

    // Get a key for a new Post.
    var newPostKey = database.ref().child('notes').push().key;

    // A post entry.
    var postData = {
      id: newPostKey,
      type: type,
      title: title,
      date:{
        time: time,
        day: day,
        month: month,
        year: year
      },
      details: details
    }

    // Write the new post's data
    var updates = {};
    updates['/notes/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
  }


  $scope.removeNote = function removeNote($scope, key) {

    var updates = {};
    updates['/notes/' + key] = null;

    return database.ref().update(updates);
  };

  // Watch the firebase database
  firebase.database().ref('notes/').on('value', function(snapshot) {
    $scope.notes = snapshot.val();
  });

  $scope.newNote = function(){
    $("#myModal").modal('show')
  }
  $scope.createNote = function(type, title, time, day, month, year, details){
    writeNewNote(type, title, time, day, month, year, details);
    $scope.type = ''
    $scope.title = ''
    $scope.time = ''
    $scope.day = ''
    $scope.month = ''
    $scope.year = ''
    $scope.details = ''
    $("#myModal").modal('hide')
  }
});
