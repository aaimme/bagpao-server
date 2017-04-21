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

		exports.end = function(req) {
			var results = req.body.place;
			mongo.connect(connection, (error, database) => {
						database
						.collection('trip')
						.insert([{
                name:`${req.body.name}`,
    						creator:`${req.body.username}`,
                origin:`${req.body.origin}`,
                destination:`${req.body.destination}`,
							  daytrip:`${req.body.daytrip}`,
								picture:'',
								place : [],
                privacy:`${req.body.privacy}`,
							  status:`active`,
								like: 0,
								share: 0,
								favorite: [],
                datesubmit: date,
								reviews: []
                }]);

								for(var i = 0; i < results.length; i++) {
									var result_obj = {
											'days': results[i].days,
											'placeid': ObjectId(results[i].placeid),
									}
									results[i] = result_obj
									database.collection('trip').update({ name:`${req.body.name}`},
												{	$push: {place: {	$each: [results[i]]	}}});
									}
									});
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

	 exports.getplaces = function(db, req, _callback) {
		 var places = req.body.place;
		 getAllPlaceDetail(places, db, (err, result) => {
	           if (err) {
	             console.log(`getAllPlaceDetail error message : ${err}`);
	             _callback(undefined, result);
	           }else{
	             _callback(undefined, result);
	           }
	         });
	    }

	    var getPlaceDetail = (placeId, db, callback) => {
	      var find_obj = {
	        _id : ObjectId(placeId)
	      };
	      db.collection('place').find(find_obj).toArray((err, docs) => {
	        if (err) {
	          callback(err, undefined);
	        }else{
	          callback(undefined, docs);
	        }
	      });
	    }

	    var getAllPlaceDetail = (place_array, db, callback) => {
	      if (place_array.length > 0) {
	        var array_place_detail = [];
	        async.forEachOf(place_array, (value, key) => {
	          var temp_obj = {};
	          getPlaceDetail(value.placeid, db, (err,result) => {
	            temp_obj = {
	              days: value.days,
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


   exports.review = function (database, req){
     database.collection('trip').find({creator :req.body.username ,name: `${req.body.tripname}`})
     .toArray((error, result) =>{
			 console.log(result.length);
       if(result.length !== 0){
         database
         .collection('trip')
         .update(
        { name: `${req.body.tripname}`  },
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
       }
       else {
         database
         .collection('trip')
         .update(
        { name: `${req.body.tripname}`  },
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
       }
         });
   }
