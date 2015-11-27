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
​
//Setup variables to be used for API searches
var yelpURL = 'http://api.yelp.com/v2/search'
var conditionsURL = 'https://api.wunderground.com/api/726c0ba149d8a811/conditions/q/'
var forecastURL = 'https://api.wunderground.com/api/726c0ba149d8a811/forecast/q/'
var $inpCtry = $('#appendCountryUrl')
var $inpState = $('#appendStateUrl')
var $inpCity = $('#appendCityUrl')
var city;
var state;
​
​
// create placeholder variables for User Position - used for Uber
var userLatitude;
var userLongitude;
var yelpLatitude;
var yelpLongitude;
var uberPrice;
var uberTimeMin;
var uberDistMiles;
​
// Uber API Constants
var uberClientId = "O4DQyt8u2XTuKGUAft4YZlzS9Yni4QQH";
var uberServerToken = "7zMUXj4LgZviCq0xfEdpgLn6LsBlENzR3EYlUItz";
​
​
//Twitter socket io instantiation
var socket = io();
socket.on('connect', function(){
  console.log('Connected!')
})
​
​
//Get user location
//for Weather call
var startLatitude;
var startLongitude;
var geoStateAbrev;
var geoStateFull;
var geoCity;
​
///////////////////////////////////////////////////////////////////////////////
​
//Get IP info for current user to be able to pass city and state to weather search
//NOT USED DUE TO UNSECURED URL GET REQUEST - HEROKU DID NOT ACCEPT
// $.get("http://ipinfo.io", function(ip_info) {
//     console.log(ip_info.city, ip_info.region);
//      state = convert_state(ip_info.region, 'abbrev');
//      city  = ip_info.city;
//
//     $inpCity.val(city)
//     $inpState.val(state)
//
// }, "jsonp");
​
//Get user location continuously for yelp and uber responses
​
navigator.geolocation.watchPosition(function(position) {
    console.log(position);
    // Update latitude and longitude
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
});

​
navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
//Get the latitude and the longitude;
function successFunction(position) {
  var startLatitude = position.coords.latitude;
  var startLongitude = position.coords.longitude;
  // console.log(startLongitude)
  getLocationAndMakeCalls(startLatitude, startLongitude)
}
​
function errorFunction(){
  alert("Geocoder failed");
}
​
//Get Google GeoCode API based on user startLatitude and startLongitude
//Parse through result object to return city and state for use in weather call
//Make calls to Weather, Yelp, Uber, and Twitter based on user location
//******************** API CALLS ON PAGE LOAD *********************//
function getLocationAndMakeCalls(lat, lng) {
  //make call to google geocode for user start lat and start long
  $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" +lat + "," + lng + "&key=AIzaSyDtL6P7cJfHJg3LQARwMlMXNl7iCGWm_8I", function(data,status){
    // for (var i = 0; i < data.results.length; i++) {
    //   console.log(data.results[i])
    // }
    if (data.results[1]) {
    for (var i=0; i<data.results[0].address_components.length; i++) {
      for (var b=0;b<data.results[0].address_components[i].types.length;b++) {
    //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
        if (data.results[0].address_components[i].types[b] == "administrative_area_level_1") {
            //this is the state object
            state= data.results[0].address_components[i];
          }
        if (data.results[0].address_components[i].types[b] == "locality") {
            //this is the city object
            city = data.results[0].address_components[i];
          }
        }
      }
      //state data
      geoCity = city.short_name
      geoStateAbrev = state.short_name
      geoStateFull = state.long_name
      console.log(geoCity + " " + geoStateAbrev + " " + geoStateFull)
      } else {
        alert("No results found");
      }
      console.log('window loads', geoStateAbrev)
    ///// Weather Underground API Call /////////////////////////////////////////
    $.ajax({
      url: conditionsURL + geoStateAbrev + '/' + geoCity + '.json',
      method: 'GET',
      success: function (data) {
        console.log(data.current_observation.weather, data.current_observation.temperature_string)
        $('#temperature').text(data.current_observation.temperature_string)
      }
    })
    $.ajax({
      url: forecastURL + geoStateAbrev + '/' + geoCity + '.json',
      method: 'GET',
      success: function(data){
        $('#day1').text(data.forecast.txt_forecast.forecastday[1].fcttext)
        console.log('=====forecast======',data.forecast.txt_forecast.forecastday[1].fcttext)
      }
    })
    ////// Yelp and Uber API Calls ///////////////////////////////////////////////////////
    $.ajax({
    url: '/yelp/' + geoCity + geoStateAbrev,
    method: 'GET',
    success: function(data){
      // console.log(data)
      if(data.businesses){
      for (var i = 0; i < 5; i++){
        var business = data.businesses[i]
        //If no lat and long returned from Yelp -
        if(!business.location.coordinate){
          console.log("no lat and long from yelp")
        }
        //Set Yelp Lat and Long for Uber endpoint use and run Uber call
        else {
            yelpLatitude = business.location.coordinate.latitude
            yelpLongitude = business.location.coordinate.longitude
            //Run Uber Ajax call for price and time estimates to each Yelp location returned
            getEstimatesForUserLocation(userLatitude, userLongitude)
          }
          console.log(business)
          if (business.location.neighborhoods){
            $(".yelp").append('<li>'+ business.name + ', ' + business.location.neighborhoods[0] + '</li>')
          }
          else
            $(".yelp").append('<li>'+ business.name + ', ' + business.location.city + ' - ' + business.phone + '</li>')
          }
        }}
      })
    ////// Twitter Stream Call ////////////////////////////////////////////////
    var search_term = geoCity
    console.log(search_term)
    socket.emit('updateTerm', search_term)
  })
}
​
​
​
//Ajax Get for Uber price estimate based on User location
function getEstimatesForUserLocation(latitude,longitude) {
  $.ajax({
    url: "https://api.uber.com/v1/estimates/price",
    headers: {
        Authorization: "Token " + uberServerToken
    },
    data: {
        start_latitude: latitude,
        start_longitude: longitude,
        end_latitude: yelpLatitude,   //from query to Yelp
        end_longitude: yelpLongitude  //from query to Yelp
    },
    success: function(result) {
        uberPrice = result.prices[0].estimate;
        uberTimeMin = Math.round(result.prices[0].duration/60)
        uberDistMiles = result.prices[0].distance
      // }
        console.log( uberPrice + ' : ' + uberTimeMin + ' min. : ' + uberDistMiles + ' mi.')
    },
    error: function(error) {
      console.log(error)
      console.log(uberPrice = "$$$");
      uberTimeMin = ""
      uberDistMiles = ""
    }
  });
}
​
​
//Get Weather and Call APIs Uber and Yelp for SEARCH location (GEO Coordinates)
//Stream twitter based on input city
$('#submit').on('click', function(){
  var search_term = $('#appendCityUrl').val()
  console.log(search_term)
  socket.emit('updateTerm', search_term)
  $(".yelp").empty()
  //Weather API Call
  $.ajax({
    url: conditionsURL + $('#appendStateUrl').val() + '/' + $('#appendCityUrl').val() + '.json',
    method: 'GET',
    success: function (data) {
      console.log(data.current_observation.weather, data.current_observation.temperature_string)
      }
    })
      // AJAX call for Yelp API app using city and state from user location info
  $.ajax({
    url: '/yelp/' + $('#appendCityUrl').val() + $('#appendStateUrl').val(),
    method: 'GET',
    success: function(data){
      console.log(data)
      for (var i = 0; i < 5; i++){
        var business = data.businesses[i]
        //If no lat and long returned from Yelp -
        if(!business.location.coordinate){
          console.log("no lat and long from yelp")
        }
        //Set Yelp Lat and Long for Uber endpoint use and run Uber call
        else {
            yelpLatitude = business.location.coordinate.latitude
            yelpLongitude = business.location.coordinate.longitude
            //Run Uber Ajax call for price and time estimates to each Yelp location returned
            getEstimatesForUserLocation(userLatitude, userLongitude)
          }
        console.log(business)
        if (business.location.neighborhoods){
          $(".yelp").append('<li>'+ business.name + ', ' + business.location.city + '</li>')
        }
        else{
          $(".yelp").append('<div>No Nearby Businesses</div>')
        }
      }
    }
  })
})
