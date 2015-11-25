var express         = require('express')
    ,yelpRouter     = express.Router()
    ,Twit           = require('twit')

    //////////////////// YELP API ///////////////////////
    var oauthSignature = require('oauth-signature');
    var n = require('nonce')();
    var request = require('request');
    var qs = require('querystring');
    var _ = require('lodash');

    /* Function for yelp call
     * ------------------------
     * set_parameters: object with params to search
     * callback: callback(error, response, body)
     */
     var request_yelp = function(set_parameters, callback){
      //  type of request
       var httpMethod = 'GET';
      //  the URL we are using for the request
       var url        = 'http://api.yelp.com/v2/search';

      //  Set up default parameters here
      var default_parameters = {
        location: 'San+Francisco',
        sort: '2'
      };

      // We set the require parameters here
      var required_parameters = {
        oauth_consumer_key : 'hx2PWciKQLn47vVPBcVnPA',
        oauth_token : 'nxqy9H5bab67n-RO62M16swIe2-IesDc',
        oauth_nonce: n(),
        oauth_timestamp : n().toString().substr(0,10),
        oauth_signature_method : 'HMAC-SHA1',
        oauth_version : '1.0'
      }

      // We combine all the parameters in order of importance
      var parameters = _.assign(default_parameters, set_parameters, required_parameters)

      // We set our secrets here
      var consumerSecret = '7mVAAZ-wKWa7zbPkLR7V9BOr9zg'
      var tokenSecret = 'UumrJrZQ37au5bQZssIPohDlReg'

    // Then we call Yelp's Oauth 1.0a server, and it returns a signature
    // Note: this signature is only good for 300 seconds after the oauth_timestamp

    var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, {encodeSignature: false});

    // We then add the variable signature to the list of parameters
    parameters.oauth_signature = signature

    // Then we turn the parameters object into a query string
    // stringify is a method of 'qs' which concatenates the keys in the parameters object, which allows it to be used in the URL as a query
    var paramURL = qs.stringify(parameters)

    // Add the query string to the URL
    apiURL = url + '?' + paramURL
    //var apiURL = 'http://api.yelp.com/v2/search?location=San+Francisco&oauth_consumer_key=hx2PWciKQLn47vVPBcVnPA&oauth_consumer_secret=7mVAAZ-wKWa7zbPkLR7V9BOr9zg&oauth_token=nxqy9H5bab67n-RO62M16swIe2-IesDc&oauth_token_secret=UumrJrZQ37au5bQZssIPohDlReg&oauth_signature_method=HMAC-SHA1&oauth_signature=' + signature + '&oauth_timestamp=' + required_parameters.oauth_timestamp + '&oauth_nonce=' + required_parameters.oauth_nonce

    // Use request to make a request to the Yelp API
      request(apiURL, function(err, response, body){
      return callback(err, response, body)
      })
    }

    ////////////////// END YELP API //////////////////////

yelpRouter.route('/:FINEapple')
  .get(function(req,res){
    request_yelp({location: req.params.FINEapple}, function(err, response, body){
      console.log('blah')
      res.json(JSON.parse(body))
    })
  })

// TWITTER SOCKET
//Twitter Socket Setup ========================================================

// TWITTER STREAM


yelpRouter.route('/twitter')
  .get(function(req,res){
    var twitter = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })

  // //Setup twitter stream
  // var stream = twitter.stream('statuses/filter', { track: $.get("http://ipinfo.io", function(poop){poop.city}) })
  // // the word 'connect' matches with socket.on first parameter in index.html
  // io.on('connect', function(socket){
  //   // the word 'tweet' matches with socket.on first parameter in index.html
  //   stream.on('tweet', function(tweet){
  //     console.log(tweet)
  //     socket.emit('tweets', tweet)
  //   })
  // })
})


// TWITTER STREAM BEGIN
    //  var socket = io();
     //
    //    socket.on('connect', function() {
    //      console.log('Connected!');
    //    });
     //
    //    socket.on('tweets', function(tweet) {
    //      console.log(tweet);
    //    });
// TWITTER STREAM END

//Canvas-test route
yelpRouter.route('/test/canvas')
  .get(function(req,res){
    res.render('canvas-test')
  })

module.exports = yelpRouter
