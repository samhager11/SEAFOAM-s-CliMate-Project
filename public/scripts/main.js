console.log("===========weatherU api initiated!!!!!!!");

//Formatting state name to abbreviation
function convert_state(name, to) {
    var name = name.toUpperCase();
    var states = new Array(                         {'name':'Alabama', 'abbrev':'AL'},          {'name':'Alaska', 'abbrev':'AK'},
        {'name':'Arizona', 'abbrev':'AZ'},          {'name':'Arkansas', 'abbrev':'AR'},         {'name':'California', 'abbrev':'CA'},
        {'name':'Colorado', 'abbrev':'CO'},         {'name':'Connecticut', 'abbrev':'CT'},      {'name':'Delaware', 'abbrev':'DE'},
        {'name':'Florida', 'abbrev':'FL'},          {'name':'Georgia', 'abbrev':'GA'},          {'name':'Hawaii', 'abbrev':'HI'},
        {'name':'Idaho', 'abbrev':'ID'},            {'name':'Illinois', 'abbrev':'IL'},         {'name':'Indiana', 'abbrev':'IN'},
        {'name':'Iowa', 'abbrev':'IA'},             {'name':'Kansas', 'abbrev':'KS'},           {'name':'Kentucky', 'abbrev':'KY'},
        {'name':'Louisiana', 'abbrev':'LA'},        {'name':'Maine', 'abbrev':'ME'},            {'name':'Maryland', 'abbrev':'MD'},
        {'name':'Massachusetts', 'abbrev':'MA'},    {'name':'Michigan', 'abbrev':'MI'},         {'name':'Minnesota', 'abbrev':'MN'},
        {'name':'Mississippi', 'abbrev':'MS'},      {'name':'Missouri', 'abbrev':'MO'},         {'name':'Montana', 'abbrev':'MT'},
        {'name':'Nebraska', 'abbrev':'NE'},         {'name':'Nevada', 'abbrev':'NV'},           {'name':'New Hampshire', 'abbrev':'NH'},
        {'name':'New Jersey', 'abbrev':'NJ'},       {'name':'New Mexico', 'abbrev':'NM'},       {'name':'New York', 'abbrev':'NY'},
        {'name':'North Carolina', 'abbrev':'NC'},   {'name':'North Dakota', 'abbrev':'ND'},     {'name':'Ohio', 'abbrev':'OH'},
        {'name':'Oklahoma', 'abbrev':'OK'},         {'name':'Oregon', 'abbrev':'OR'},           {'name':'Pennsylvania', 'abbrev':'PA'},
        {'name':'Rhode Island', 'abbrev':'RI'},     {'name':'South Carolina', 'abbrev':'SC'},   {'name':'South Dakota', 'abbrev':'SD'},
        {'name':'Tennessee', 'abbrev':'TN'},        {'name':'Texas', 'abbrev':'TX'},            {'name':'Utah', 'abbrev':'UT'},
        {'name':'Vermont', 'abbrev':'VT'},          {'name':'Virginia', 'abbrev':'VA'},         {'name':'Washington', 'abbrev':'WA'},
        {'name':'West Virginia', 'abbrev':'WV'},    {'name':'Wisconsin', 'abbrev':'WI'},        {'name':'Wyoming', 'abbrev':'WY'}
        );
    var returnthis = false;
    $.each(states, function(index, value){
        if (to == 'name') {
            if (value.abbrev == name){
                returnthis = value.name;
                return false;
            }
        } else if (to == 'abbrev') {
            if (value.name.toUpperCase() == name){
                returnthis = value.abbrev;
                return false;
            }
        }
    });
    return returnthis;
}

//Setup variables to be used for API searches
var yelpURL = 'http://api.yelp.com/v2/search'
var conditionsURL = 'http://api.wunderground.com/api/726c0ba149d8a811/conditions/q/';
var $inpCtry = $('#appendCountryUrl')
var $inpState = $('#appendStateUrl')
var $inpCity = $('#appendCityUrl')
var state = '';
var city = '';
// create placeholder variables for User Position - used for Uber
var userLatitude;
var userLongitude;


var socket = io();
socket.on('connect', function(){
  console.log('Connected!')
})

//Get user location
navigator.geolocation.watchPosition(function(position) {
    console.log(position);
    // Update latitude and longitude
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
});

//Uber Setup ==================================================================
//Uber Secret: ooJn0ntCQYlovNZQBZ0j7VPvI43OXqd0PpN569Km

// CLIENT ID
// O4DQyt8u2XTuKGUAft4YZlzS9Yni4QQH

// SERVER TOKEN
// 7zMUXj4LgZviCq0xfEdpgLn6LsBlENzR3EYlUItz


//Uber API endpoints
//    /v1/products
//    /v1/estimates/price
//    /v1/estimates/time
//    /v1/promotions



//Get IP info for current user to be able to pass city and state to weather search
$.get("http://ipinfo.io", function(poop) {
    console.log(poop.city, poop.region);
     state = convert_state(poop.region, 'abbrev');
     city  = poop.city;

    console.log($inpCity);
    $inpCity.val(city)
    $inpState.val(state)
}, "jsonp");

//Get Weather and Call APIs Uber and Yelp for CURRENT location (IP and GEO Coordinates)
window.onload = function(){
  $.ajax({
    url: conditionsURL + $inpState.val() + '/' + $inpCity.val() + '.json',
    method: 'GET',
    success: function (data) {
      console.log(data.current_observation.weather, data.current_observation.temperature_string)
      // AJAX call for Yelp API app using city and state from IP Info
      $.ajax({
        url: '/yelp/' + $inpCity.val() + $inpState.val(),
        method: 'GET',
        success: function(data){
          console.log(data)
          if(data.businesses){
            for (var i = 0; i < 5; i++){
              var business = data.businesses[i]
              console.log(business)
              if (business.location.neighborhoods){
                $(".yelp").append('<li>'+ business.name + ', ' + business.location.neighborhoods[0] + '</li>')
              }
              else
                $(".yelp").append('<li>'+ business.name + ', ' + business.location.city + ' - ' + business.phone + '</li>')
              }
            }}
          })
        }
      })}
      socket.on('tweets', function(tweet){
        console.log(tweet)
      $(".twitterStream").text(tweet.text)
      })
//Get Weather and Call APIs Uber and Yelp for SEARCH location (IP and GEO Coordinates)
$('#submit').on('click', function(){
  var search_term = $inpCity.val()
  console.log(search_term)
  socket.emit('updateTerm', search_term)
  $(".yelp").empty()
  $.ajax({
    url: conditionsURL + $('#appendStateUrl').val() + '/' + $('#appendCityUrl').val() + '.json',
    method: 'GET',
    success: function (data) {
      console.log(data.current_observation.weather, data.current_observation.temperature_string)
      // AJAX call for Yelp API app using city and state from IP Info
      $.ajax({
        url: '/yelp/' + $('#appendCityUrl').val() + $('#appendStateUrl').val(),
        method: 'GET',
        success: function(data){
          console.log(data)
          for (var i = 0; i < 5; i++){
            var business = data.businesses[i]
            console.log(business)
            if (business.location.neighborhoods){
              $(".yelp").append('<li>'+ business.name + ', ' + business.location.city + '</li>')
            }
            else{
              $(".yelp").append('<div>No Nearby Businesses</div>')
            }
          }}
        })
      }
    })})

// module.exports = Main
