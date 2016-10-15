var app = angular.module("PHD", []);
app.controller("MainController", function($scope){
  $scope.page = 'login'
  $scope.notes = {
    0: {
      doctor: {
        type: 'Neurologist',
        name: 'Mitch Ball',
        address: 'Fake Address, Address St.'
      },
      date:{
        day: '14th',
        month: 'Oct',
        time: '2pm'
      }
    },
    1: {
      doctor: {
        type: 'Cardiac Surgeon',
        name: 'Alexander Jones',
        address: '3 Melbourne Ave.'
      },
      date:{
        day: '2nd',
        month: 'Dec',
        time: '9am'
      }
    }
  }
  console.log($scope.notes)
});
