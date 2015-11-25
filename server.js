var express             = require('express')
    ,app                = express()
    ,logger             = require('morgan')
    ,mongoose           = require('mongoose')
    ,bodyParser         = require('body-parser')
    ,cookieParser       = require('cookie-parser')
    ,ejs                = require('ejs')
    ,ejsLayouts         = require('express-ejs-layouts')
    ,flash              = require('connect-flash')
    ,session            = require('express-session')
    ,passport           = require('passport')
    ,passportConfig     = require('./config/passport.js')
    ,request_yelp       = require('request')
    ,Twit               = require('twit')
    ,server             = require('http').createServer(app)
    ,io                 = require('socket.io')(server)

// environment port
// var port = process.env.PORT || 3000
server.listen(3000)


// mongoose connection
mongoose.connect('mongodb://samhager11:password123@ds041613.mongolab.com:41613/seafoam-climate', function(err){
  if(err) return console.log('Cannot connect to DB')
  console.log('Connected to MongoDB!')
})



// middleware
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// set the public folder as the static assets serving folder
app.use(express.static('public'))

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// Testing user model
// var User = require('./models/user_model.js')
// var user1 = new User({
//   local:
//     {user_name: 'andykim'
//     ,email: 'andy@andy.com'
//     ,city: 'santa monica'
//     ,country: 'united states'
//     ,password: 'andy'}
//   })
// console.log(user1)



// session middleware
app.use(session({
  secret: 'allyourbase',
  cookie: {expires: 6000000}
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

<<<<<<< HEAD



=======
>>>>>>> 4115fcb431e11ea30898f2f7abfa785d298c326b
// root route
app.get('/', function(req,res){
  res.render('home')
})

//user Routes
var userRoutes = require('./routes/user_routes.js')
<<<<<<< HEAD
app.use('/', userRoutes)

// set the public folder as the static assets serving folder
app.use(express.static('public'))

// //checking enviro variables
// console.log(process.env)
=======
app.use(userRoutes)
var yelpRoutes = require('./routes/yelp_routes.js')
app.use('/yelp',yelpRoutes)
>>>>>>> 4115fcb431e11ea30898f2f7abfa785d298c326b

//set server to listen on port (3000)
// app.listen(port, function(){
//   console.log('Server running on port', port)
// })
