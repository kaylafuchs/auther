app.factory('AuthFactory', function ($http, $state) {
  var authObj = {}
  authObj.submitUser = function (email, password) {
    $http.post('/api/users', {email: email, password: password})
      .then(function () {
        console.log('success')
        $state.go('stories')
      })
      .catch(console.log)
  }
  authObj.login = function (email, password) {
    $http.post('/login', {email: email, password: password})
      .then(function () {
        console.log('success')
        $state.go('stories')
      })
      .catch(console.log)
  }
  return authObj
})
