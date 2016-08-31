'use strict'

var app = require('express')()
var path = require('path')
var session = require('express-session')
var passport = require('passport')
var User = require('../api/users/user.model')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var Sequelize = require('sequelize');

app.use(require('./logging.middleware'))

app.use(require('./request-state.middleware'))

app.use(session({
  secret: 'lolwut'
}))


// app.use(function(req, res, next) {
//   console.log('session', req.session)
//   next()
// })



app.use('/api', function(req, res, next) {
  if (!req.session.counter) req.session.counter = 0
  console.log('request body', ++req.session.counter)
  next()
})

app.use('/api', require('../api/api.router'))

app.post('/login', function(req, res, next) {
  User.findOne({
      where: req.body
    })
    .then(function(user) {
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

app.post('/logout', function(req, res, next) {
  req.session.userId = null
  req.session.destroy();
  console.log('session DESTROYED!!!! bwahahah')
  res.sendStatus(204)
})

<<<<<<< HEAD
app.use(passport.initialize());
app.use(passport.session())
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/', // or wherever
    failureRedirect: '/' // or wherever
  })
);
passport.use(
  new GoogleStrategy({
      clientID: '540290091414-3vg31octfm984rdumo99cvujnqbsbr9g.apps.googleusercontent.com',
      clientSecret: 'g7crJFiHV9YAIa0yStpAgGJe',
      callbackURL: '/auth/google/callback'
    },
    // Google will send back the token and profile
    function(token, refreshToken, profile, done) {
      // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
      /*

      --- fill this part in ---
      */
      var info = {
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos ? profile.photos[0].value : undefined
      };
      User.findOrCreate({
          where: {
            googleId: profile.id
          },
          defaults: info
        })
        .spread(function(user) {
          done(null, user);
        })
        .catch(done);
    })
);
passport.serializeUser(function(user, done) {
  console.log('serialized', user)
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  console.log('deserialize')
  User.findById(id)
  .then(function(user){
    done(null, user)
  })
  .catch(done)
})
app.get('/auth/google', passport.authenticate('google', {
  scope: 'email'
}));


// handle the callback after Google has authenticated the user
app.use(function (req, res, next) {
 console.log('user', req.user);
 next();
});


=======
app.get('/auth/me', function (req, res, next) {
  User.findById(req.session.userId)
  .then(function(result){
    res.send(result.email);
  })
})
>>>>>>> acd7b838dc94dfb3db9c0843ca08d59620ce065f

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login']
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html')
validFrontendRoutes.forEach(function(stateRoute) {
  app.get(stateRoute, function(req, res) {
    res.sendFile(indexPath)
  })
})
app.use(require('./statics.middleware'))
app.use(require('./error.middleware'))

module.exports = app
