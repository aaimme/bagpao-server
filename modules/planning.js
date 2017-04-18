"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';
var isodate = require("isodate");
var ObjectId = require('mongodb').ObjectID;
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
                datesubmit: date
                }]);

								for(var i = 0; i < results.length; i++) {
									var result_obj = {
											'days': results[i].days,
											'placeid': ObjectId(results[i].placeid),
									}
									results[i] = result_obj
									console.log(i,results[i]);
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

   exports.review = function (database, req){
     database.collection('trip').find({creator :req.body.username ,name: `${req.body.tripname}`})
     .toArray((error, result) =>{
       if(result.length == 1){
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
