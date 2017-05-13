"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';
var isodate = require("isodate");
var ObjectId = require('mongodb').ObjectID;
const async = require('async');
var date;
// Write current date as ISO 8601 string.
date = new Date();

var recom = require('./recom');

		exports.end = function(req) {
			var results = req.body.place;
			mongo.connect(connection, (error, database) => {
				database.collection('trip').insert([{
                	name:`${req.body.name}`,
    							creator:`${req.body.username}`,
                	origin:`${req.body.origin}`,
                	destination:`${req.body.destination}`,
									depart:`${req.body.depart}`,
									return:`${req.body.return}`,
									daytrip:`${req.body.daytrip}`,
									place : [],
									prices: req.body.prices,
                	privacy:`${req.body.privacy}`,
									like: 0,
									favorite: [],
									liker: [],
                	datesubmit: date,
									picture:`${req.body.picture}`
                }]);

								for(var i = 0; i < results.length; i++) {
									var result_obj = {
											'days': results[i].days,
											'placeid': ObjectId(results[i].placeid),
											'category': results[i].category
									}
									results[i] = result_obj
									database.collection('trip').update({ name:`${req.body.name}`},
												{	$push: {place: {	$each: [results[i]]	}}});
									}


									database.collection('reviews').insert({
										trip:`${req.body.name}`,
										creator: `${req.body.username}`,
										reviews: []
									});
								});

								recom.createTripTable(req);
						console.log('create trip success');
}

		exports.transportation = function( req, callback) {
				 mongo.connect(connection, (err, database) => {
				   database.collection('transportation').find(
           {$or : [
             {origin:`${req.body.origin}`,destination:`${req.body.destination}`},
             {origin:`${req.body.destination}`,destination:`${req.body.origin}`}
					 ]}
					//  ,
					//  {
	        //  $sort : {depart : -1}
	        //  }
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
			 });
	 	}


	 exports.plan = function( req, callback) {
					mongo.connect(connection, (err, database) => {
					  database.collection('place').find({city:`${req.body.destination}`}).toArray(function(err, docs) {
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
				});
	 }

	 exports.getplaces = function( req, _callback) {
		 var places = req.body.place;
		 getAllPlaceDetail(places, (err, result) => {
	           if (err) {
	             console.log(`getAllPlaceDetail error message : ${err}`);
	             _callback(undefined, result);
	           }else{
	             _callback(undefined, result);
	           }
	         });
	    }

	    var getPlaceDetail = (placeId, callback) => {
	      var find_obj = {
	        _id : ObjectId(placeId)
	      };
		mongo.connect(connection, (err, database) => {
	      database.collection('place').find(find_obj).toArray((err, docs) => {
	        if (err) {
	          callback(err, undefined);
	        }else{
	          callback(undefined, docs);
	        }
	      });
		});
	    }

	    var getAllPlaceDetail = (place_array, callback) => {
	      if (place_array.length > 0) {
	        var array_place_detail = [];
	        async.forEachOf(place_array, (value, key) => {
	          var temp_obj = {};
	          getPlaceDetail(value.placeid, (err,result) => {
	            temp_obj = {
	              days: value.days,
								time: value.time,
	              name: result[0].name,
	              city: result[0].city,
	              picture: result[0].picture

	            }
	            array_place_detail.push(temp_obj);
	            if (key+1 == place_array.length) {
	              callback(undefined, array_place_detail);
	            }
	          });
	        });
	      }else{
	        callback('Error, place not found.', undefined);
	      }
	    }

   exports.addReview = function ( req){
		 mongo.connect(connection, (err, database) => {
     database.collection('reviews').find({creator :req.body.username ,trip: `${req.body.tripname}`})
     .toArray((error, result) =>{
			 console.log(result.length,req.body);
       if(result.length !== 0){
         database
         .collection('reviews')
         .update(
        { trip: `${req.body.trip}`  },
        {
          $push: {
               reviews: {
               $each: [ {
                 user :`${req.body.username}`,
                 comment :`${req.body.comment}`,
                 creator: true,
                 date : date} ]
            }
          }
        }
       );
			 console.log('11');
       }
       else {
         database
         .collection('reviews')
         .update(
        { trip: `${req.body.trip}`  },
        {
          $push: {
               reviews: {
               $each: [ {
                 user :`${req.body.username}`,
                 comment :`${req.body.comment}`,
                 date : date} ]
            }
          }
        }
     );
		 console.log('aa');
       }
         });
			 });
   }

	 exports.review = function(req, callback) {
	     mongo.connect(connection, (err, database) => {
	       database
	       .collection('reviews')
	       .find({trip: req.body.trip}).toArray(function(err, docs) {
	   	if (err) {
	   		callback('cannot connect to database', undefined);
	   	}else{
	   		if (docs.length !== 0) {
	   			callback(undefined, docs[0].reviews);
	   	}else{
	   			callback('cannot found trip',undefined);
	   		}
	   	}
	   });
	 });
	 }
