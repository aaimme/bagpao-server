"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAnz9lnXlaGYpDV_zpyrx9ecKgJDmlLOPI'
});


		exports.end = function(req) {
						console.log(req.body);
						mongo.connect(connection, (error, database) => {
						database
						.collection('trip')
						.insert({
							creator:`${req.body.username}`,
							tripid:`${req.body.tripid}`,
							daytrip:`${req.body.daytrip}`,
							origin:`${req.body.origin}`,
							destination:`${req.body.desination}`,
							picture:`${req.body.picture}`,
							name:`${req.body.name}`,
							privacy:`${req.body.privicy}`,
		//					place[i] :`${req.body.place[i]}`,
		//					time[i] :`${req.body.time[i]}`,
							status:`${req.body.status}`
							});
				   		 });

						var result_obj ={
							'message' : 'create trip success'
						}
						res.json(result_obj);
						console.log('create trip success');
		}

		exports.transportation = function(db, req, callback) {
	 			 var collection = db.collection('transportation');
	 		   collection.find(
           {$or : [
             {origin:`${req.body.origin}`,destination:`${req.body.destination}`},
             {origin:`${req.body.destination}`,destination:`${req.body.origin}`}
             ]}
          ).toArray(function(err, docs) {
	 		    if (err) {
	 		      callback('cannot connect to database', undefined);
	 		    } else{
	 		      if (docs.length !== 0) {
	 		        callback(undefined, docs);
	 		    	} else{
	 		           callback('cannot found',undefined);
	 		      }
	 		   }
	 		   });
	 	}

	 exports.plan = function(db, req, callback) {
		 			var collection = db.collection('place');
		 		  collection.find({city:`${req.body.destination}`}).toArray(function(err, docs) {
		 			 if (err) {
		 				 callback('cannot connect to database', undefined);
		 			 } else{
		 				 if (docs.length !== 0) {
		 					 callback(undefined, docs);
		 			 	 } else{
		 							callback('cannot found',undefined);
		 				 }
		 			}
		 			});
	 }

	//connect API
	// Geocode an address.
googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response) {
  if (!err) {
    console.log(response.json.results);
  }
});
