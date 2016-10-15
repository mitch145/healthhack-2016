var app = angular.module("PHD", []);
app.controller("MainController", function($scope){
  $scope.page = 'login'
  $scope.notes = {
    0: {
      doctor: {
        type: 'Neurologist',
        name: 'Mitch Ball',
        address: 'Fake Address, Address St.'
      }
    },
    1: {
      doctor: {
        type: 'Cardiac Surgeon',
        name: 'Alexander Jones',
        address: '3 Melbourne Ave.'
      }
    }
  }
  console.log($scope.notes)
});
