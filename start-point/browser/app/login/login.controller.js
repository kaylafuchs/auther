app.controller('login', function($scope, AuthFactory){
  $scope.submitLogin = AuthFactory.login;

  $scope.currentUser = function(){
  	return AuthFactory.getCurrentUser();
  }

})