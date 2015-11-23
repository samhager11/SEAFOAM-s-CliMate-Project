var mongoose  = require('mongoose')
    ,bcrypt   = require('bcrypt-nodejs')
    ,Schema   = mongoose.Schema


// User schema
var userSchema = new Schema({
  local: {
    name: String
    ,email: {type: String}
    ,password: {type: String}
    },
  facebook: {
    id: String
    ,name: String
    ,token: String
    ,email: String
    //Added city state and country to facebook strategy so user can add after authentication
  },
    city: {type: String}
    ,state: {type: String}
    ,country: {type: String}
    //removed required:true from city state and country so user can edit any
    ,searches: [{city:{type: String},
                state:{type: String},
                country:{type: String}}]
  //moved additional properties outside of facebook and local strategies
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
