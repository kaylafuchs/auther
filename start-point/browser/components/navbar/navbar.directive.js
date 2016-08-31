'use strict'

app.directive('navbar', function ($state, $location, $http, AuthFactory) {
  return {
    restrict: 'E',
    templateUrl: '/browser/components/navbar/navbar.html',
    link: function (scope) {
      scope.pathStartsWithStatePath = function (state) {
        var partial = $state.href(state)
        var path = $location.path()
        scope.logout = () => {
          $http.post('/logout', {})
          AuthFactory.resetCurrentUser();
          $state.go('home')
        }
        return path.startsWith(partial)
      }
      scope.currentUser = function(){
        return AuthFactory.getCurrentUser()
      }
    }
  }
})
