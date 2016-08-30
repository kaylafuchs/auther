app.controller('signup', function($scope, AuthFactory){
  $scope.submitUser = AuthFactory.submitUser
})