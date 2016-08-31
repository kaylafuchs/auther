'use strict'

var app = require('express')()
var path = require('path')
var session = require('express-session')
var User = require('../api/users/user.model')

app.use(require('./logging.middleware'))

app.use(require('./request-state.middleware'))

app.use(session({
  secret: 'lolwut'
}))

app.use(function (req, res, next) {
  console.log('session', req.session)
  next()
})

app.use(require('./statics.middleware'))

app.use('/api', function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0
  console.log('request body', ++req.session.counter)
  next()
})

app.use('/api', require('../api/api.router'))

app.post('/login', function (req, res, next) {
  User.findOne({
    where: req.body
  })
    .then(function (user) {
      if (!user) {
        res.sendStatus(401)
      } else {
        req.session.userId = user.id
        console.log('user id', req.session.userId)
        res.sendStatus(204)
      }
    })
    .catch(next)
})

app.post('/logout', function (req, res, next) {
  req.session.userId = null
  req.session.destroy();
  console.log('session DESTROYED!!!! bwahahah')
  res.sendStatus(204)
})

app.get('/auth/me', function (req, res, next) {
  User.findById(req.session.userId)
  .then(function(result){
    res.send(result.email);
  })
})

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login']
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html')
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath)
  })
})

app.use(require('./error.middleware'))

module.exports = app
