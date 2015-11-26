

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

//for Weather call
var startLatitude;
var startLongitude;
var stateAbbrev;
var stateFull;
var city;


navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
//Get the latitude and the longitude;
function successFunction(position) {
  var startLatitude = position.coords.latitude;
  var startLongitude = position.coords.longitude;
  console.log(startLongitude)
  codeLatLng(startLatitude, startLongitude)
}

function errorFunction(){
  alert("Geocoder failed");
}

//Get Google GeoCode API based on user startLatitude and startLongitude
//Parse through result object to return city and state for use in weather call
function codeLatLng(lat, lng) {

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
      city = city.short_name
      stateAbbrev = state.short_name
      stateFull = state.long_name
      console.log(city + " " + stateAbbrev + " " + stateFull)

      } else {
        alert("No results found");
      }
  })
}


//Get user location continuously for yelp and uber responses
navigator.geolocation.watchPosition(function(position) {
    console.log(position);
    // Update latitude and longitude
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
});




//Get IP info for current user to be able to pass city and state to weather search
$.get("http://ipinfo.io", function(ip_info) {
    console.log(ip_info.city, ip_info.region);
     state = convert_state(ip_info.region, 'abbrev');
     city  = ip_info.city;

    $inpCity.val(city)
    $inpState.val(state)
    console.log($inpState.val())
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
        url: '/yelp/' + city  + stateAbbrev,
        method: 'GET',
        success: function(data){
          // console.log(data)
          if(data.businesses){
            for (var i = 0; i < 5; i++){
              var business = data.businesses[i]
              console.log(business)
              if (business.location.neighborhoods){
                $(".apiDisplay").append('<div>'+ business.name + ', ' + business.location.neighborhoods[0] + '</div>')
              }
              else
                $(".apiDisplay").append('<div>'+ business.name + ', ' + business.location.city + ' - ' + business.phone + '</div>')
              }
            }}
          })
      $.ajax({
        // Twitter Stream Call
        url: '/yelp/' + $inpCity.val() + $inpState.val(),
        method: 'GET',
        success: function(data){
          var socket = io();
          socket.on('connect', function(){
            console.log('Connected!')
          socket.on('tweets', function(tweet){
            $(".twitterStream").text(tweet.text)
          })
          })
        }
      })
        }
      })}

//Get Weather and Call APIs Uber and Yelp for SEARCH location (IP and GEO Coordinates)
$('#submit').on('click', function(){
  $(".apiDisplay").empty()
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
              $(".apiDisplay").append('<div>'+ business.name + ', ' + business.location.city + '</div>')
            }
            else{
              $(".apiDisplay").append('<div>No Nearby Businesses</div>')
            }
          }}
        })
      }
    })})
