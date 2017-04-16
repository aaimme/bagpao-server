var express = require('express');
var app = express();
let body    = require('body-parser');
app.use( body.json() );       // to support JSON-encoded bodies
app.use(body.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8'
});

//Geocode an address.
// googleMapsClient.geocode({
// address: 'The Royal Pantheon, Khwaeng Phra Borom Maha Ratchawang, Khet Phra Nakhon, Krung Thep Maha Nakhon 10200'
// }, function(err, response) {
// if (!err) {
//   console.log(response.json.results);
// }
// });

app.get(`/api`, (req, res) =>{
var request = require('request');
var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?&origins='+req.query.origin+'&destinations='+req.query.destination+'&key=AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8'
request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log('body:', body); // Print the HTML for the Google homepage.
  body = JSON.parse(body);
  console.log(body);
  res.send(body);

});
});


app.listen(1200, function() {
  console.log('Server running on port 1200...')
});
