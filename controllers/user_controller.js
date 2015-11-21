var User          = require('../models/user_model.js')
    ,secret       = 'allyourbase'

function index(req,res){
  User.find({},function(err,users){
    if(err) console.log(err)
    res.json(users)
  })
}

function show(req,res){
  //.user_id should match route
  User.find({email:req.params.email}, function(err,user){
    if(err) res.send(err)
    res.json(user)
  })
}

function create(req,res){
  var user = new User(req.body.user.local)
  console.log(req.body)
  user.save(function(err){
    if(err) res.json({err: err})
    res.json({message: 'User created!'})
  })
}

function update(req,res){
  User.findById(req.params.user_id, function(err,user){
    if(err) res.json({err:err})

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

    user.save(function(err){
      if(err) res.json({err:err})
      res.json({success: true, message: 'User has been updated!'})
    })
  })
}

function destroy(req,res){
  User.findOneAndRemove({_id:req.params.id}, function(err, user){
    if(err) res.json({err:err})
    res.json({success: true, message: 'User' + user + 'has been obliterated into the ether.'})
  })
}

module.exports = {
  allUsers: index,
  showUser: show,
  createUser: create,
  updateUser: update,
  deleteUser: destroy
}
