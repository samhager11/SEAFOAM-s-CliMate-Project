var express = require('express')
    ,passport = require('passport')
    ,userController = require('../controllers/user_controller.js')
    ,userRouter = express.Router()

userRouter.route('/test')
  .get(userController.allUsers)
  .post(userController.createUser)

userRouter.route('/login')
    .get(function(req,res){
        res.render('login', {message: req.flash('loginMessage')})
    })
    .post(passport.authenticate('local-login', {
        successRedirect: '/profile'
        ,failureRedirect: '/login'
        ,failureFlash: true
    }))

userRouter.route('/signup')
    .get(function(req,res){
        res.render('signup', {message: req.flash('signupMessage')})
    })
    .post(passport.authenticate('local-signup',{
        successRedirect: '/profile'
        ,failureRedirect: '/signup'
        ,failureFlash: true
    }))

userRouter.get('/profile', isLoggedIn, function(req, res){
    res.render('profile', {user: req.user})
})

userRouter.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}))

userRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
}))

userRouter.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next()
    res.redirect('/')
}


userRouter.route('/user/:user_id')
  .get(userController.showUser)
  // REMEMBER TO DO AN UPDATE
  // .put(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = userRouter
