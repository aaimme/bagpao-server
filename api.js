var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8'
});

//Geocode an address.
googleMapsClient.geocode({
address: 'The Royal Pantheon, Khwaeng Phra Borom Maha Ratchawang, Khet Phra Nakhon, Krung Thep Maha Nakhon 10200'
}, function(err, response) {
if (!err) {
  console.log(response.json.results);
}
});


 var urlapi ="https://maps.googleapis.com/maps/api/distancematrix/json?"origins=''&destinations=''&key=AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8;
 var origin = req.param.origin;
 var destination = req.param.destination;
 var units = 'km';
 var key-api = 'AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8';


googlemaps directions --origin 'KMITL' --destination 'The Royal Pantheon'
export GOOGLE_MAPS_API_KEY=AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8
