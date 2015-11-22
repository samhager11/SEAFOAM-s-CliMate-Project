var
   passport        = require('passport')
  ,LocalStrategy   = require('passport-local').Strategy
  ,User            = require('../models/user_model.js')



passport.serializeUser(function(user,done){
  done(null,user.id)
})

passport.deserializeUser(function(id,done){
  User.findById(id, function(err, user){
    done(err, user)
  })
})

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    User.findOne({'local.email': email}, function(err, user){
        if(err) return done(err)
        if(user) return done(null, false, req.flash('signupMessage', 'Sorry, looks like that email is already taken.'))
        var newUser = new User()
        newUser.local.user_name = req.body.user_name
        newUser.local.email = email
        newUser.local.password = newUser.generateHash(password)

        newUser.save(function(err){
            if(err) throw err
            return done(null, newUser, null)
        })
    })
}))

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    User.findOne({'local.email': email}, function(err, user){
        if(err) return done(err)
        if(!user) return done(null, false, req.flash('loginMessage', 'No user found with that email...'))
        if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', "Sorry, that's not the correct password."))

        return done(null, user)
    })
}))

module.exports = passport
