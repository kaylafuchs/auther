app.controller('login', function($scope, AuthFactory){
  $scope.submitLogin = AuthFactory.login
})