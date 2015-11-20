var mongoose  = require('mongoose')
    ,bcrypt   = require('bcrypt-nodejs')
    ,Schema   = mongoose.Schema


// User schema
var userSchema = new mongoose.Schema({
  local: {
    user_name: String
    ,email: {type: String, required: true, unique: true}
    ,city: {type: String, required: true}
    ,state: {type: String}
    ,country: {type: String, required: true}
    ,password: {type: String, required: true}
    // ,searches: [{city:{
    //               type: String,
    //               required: true},
    //             state:{
    //               type: String},
    //             country:{
    //               type: String,
    //               required: true}}]
    },
  facebook: {
    id: String
    ,name: String
    ,token: String
    ,email: String
  }
})

// setup method available to each new user object
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null)
}

userSchema.methods.validPassword = function(password){
  var user = this
  return bcrypt.compareSync(password, user.local.password)
}

// create a user model using mongoose.model. 'User' must match database name in server.js
var User = mongoose.model('User', userSchema)

module.exports = User
