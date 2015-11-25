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

app.set('port', (process.env.PORT || 3000));
     //... lots of code here maybe





// mongoose connection
mongoose.connect('mongodb://samhager11:password123@ds041613.mongolab.com:41613/seafoam-climate', function(err){
  if(err) return console.log('Cannot connect to DB')
  console.log('Connected to MongoDB!')
})

// TWITTER STREAM
var twitter = new Twit({
  consumer_key: 'RZ0FmndPW3bwnmcgrqFc58Rff',
  consumer_secret: 'xsr18knDtlLhnNXx0y65fsNQy5S6lFziBkI9TPVdo5BCMSMDws',
  access_token: '22934806-pAAHDdALQpUniGg9iCTGb25xPHxF2UEUMBjqX2eWE',
  access_token_secret: '1vLkUb6WU7C8hfQ8hhHc7j5IPHjpK3NguRV3NAPIUyuFx'
})

var stream = twitter.stream('statuses/filter', { track: 'javascript' })
// the word 'connect' matches with socket.on first parameter in index.html
io.on('connect', function(socket){
  // the word 'tweet' matches with socket.on first parameter in index.html
  stream.on('tweet', function(tweet){
    socket.emit('tweets', tweet)
  })
})
// END TWITTER STREAM


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

// root route
app.get('/', function(req,res){
  res.render('home')
})

//user Routes
var userRoutes = require('./routes/user_routes.js')
app.use(userRoutes)
var yelpRoutes = require('./routes/yelp_routes.js')
app.use('/yelp',yelpRoutes)

//set server to listen on port (3000)
// app.listen(port, function(){
//   console.log('Server running on port', port)
// })
server.listen(app.get('port'), function(){
      console.log('Serving started in port: ' + app.get('port'));
  });
