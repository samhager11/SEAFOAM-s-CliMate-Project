var User          = require('../models/user_model.js')
    ,secret       = 'allyourbase'

function create(req,res){
  var user = new User(req.body.user)
  user.save(function(err){
    if(err) res.json({err: err})
    res.json({message: 'User created!'})
  })
}

function update(req,res){
  User.findById(req.params.user_id, function(err,user){
    if(err) res.send(err)

    if(req.body.user_name)
      user.user_name = req.body.username
    if(req.body.email)
      user.email = req.body.email
    if(req.body.city)
      user.city = req.body.city
    if(req.body.state)
      user.state = req.body.state
    if(req.body.country)
      user.country = req.body.country
    if(req.body.password)
      user.password = req.body.password
  })
}
