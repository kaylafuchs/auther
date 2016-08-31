app.factory('AuthFactory', function ($http, $state) {
  var authObj = {}
  var currentUser = null;

  (function persistUser(){
    $http.get('/auth/me')
    .then(function(res){
      currentUser = res.data;
      console.log("current user from persistUser is:", currentUser);
    })
  })();

  authObj.submitUser = function (email, password) {
    $http.post('/api/users', {email: email, password: password})
      .then(function () {
        console.log('successfully created user')
        currentUser = email
        authObj.login(email, password)
      })
      .catch(console.log)
  }
  authObj.login = function (email, password) {
    $http.post('/login', {email: email, password: password})
      .then(function () {
        console.log('successfully logged in')
        currentUser = email
        $state.go('stories')
      })
      .catch(console.log)
  }

  authObj.getCurrentUser = function(){
    console.log("current user from auth factory is:", currentUser)
    return currentUser;
  }

  authObj.resetCurrentUser = function(){
    currentUser = null
  }

  return authObj
})
