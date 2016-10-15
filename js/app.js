var app = angular.module("PHD", []);
app.controller("MainController", function($scope){
  $scope.page = 'main'
  $scope.displayNote = 0;
  $scope.notes = {
    0: {
      id: 0,
      doctor: {
        type: 'Neurologist',
        name: 'Mitch Ball',
        address: 'Fake Address, Address St.'
      },
      date:{
        day: '14th',
        month: 'Oct',
        time: '2pm'
      },
      comments: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      prescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    1: {
      id: 1,
      doctor: {
        type: 'Cardiac Surgeon',
        name: 'Alexander Jones',
        address: '3 Melbourne Ave.'
      },
      date:{
        day: '2nd',
        month: 'Dec',
        time: '9am'
      },
      comments: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      prescription: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    2: {
      id: 2,
      doctor: {
        type: 'Anaesthesiologist',
        name: 'Fake Name',
        address: '3 Territory Ave.'
      },
      date:{
        day: '2nd',
        month: 'Dec',
        time: '9am'
      },
      comments: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      prescription:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  }
  $scope.newNote = function(){
    $("#myModal").modal('show')
  }
  $scope.createNote = function(type, name, address, day, month, time, comments, prescription){
    writeNewNote(type, name, address, day, month, time, comments, prescription);
    $scope.type = ''
    $scope.name = ''
    $scope.address = ''
    $scope.day = ''
    $scope.month = ''
    $scope.time = ''
    $scope.comments = ''
    $scope.prescription = ''
    $("#myModal").modal('hide')
  }
});
