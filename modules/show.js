"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://admin:admin@ds143081.mlab.com:43081/bagpao';
var ObjectId = require('mongodb').ObjectID;
const async = require('async');

exports.placePopularHome = function(callback) {
    mongo.connect(connection, (err, database) => {
      database
      .collection('place')
      .find({}).sort({ view : -1}).limit(3).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('please input data',undefined);
  		}
  	}
  });
});
}

exports.placePopular = function(callback) {
    mongo.connect(connection, (err, database) => {
      database
      .collection('place')
      .find({}).sort({ view : -1}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('please input data',undefined);
  		}
  	}
  });
});
}
exports.tripsPopular = function(callback) {
    mongo.connect(connection, (err, database) => {
      database
      .collection('trip')
      .aggregate([
        {
          $match : {privacy:"public"}
        },
        {
       $project:
         {
           name:"$name",
           creator:"$creator",
           picture:"$picture"
         }
        },
        {
        $sort : {like : -1}
        }
    ]).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('please input data',undefined);
  		}
  	}
  });
});
}

exports.placeCategories = function(req, callback) {
   console.log(req.body);
    mongo.connect(connection, (err, database) => {
      database
      .collection('place')
      .find({category: req.body.category}).sort({name : 1}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('please input data',undefined);
  		}
  	}
  });
});
}

exports.tripsPopularHome = function(callback) {
    mongo.connect(connection, (err, database) => {
      database
      .collection('trip')
      .aggregate([
      {
        $match : {privacy:"public"}
      },
      {
       $project:
         {
           name:"$name",
           creator:"$creator",
           picture:"$picture",
           like:"$like",
           favname:"$favorite",
           liker:"$liker"
         }
      },
      {
        $sort : {like : -1}
      },
      {
        $limit : 3
      }
    ]).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('please input data',undefined);
  		}
  	}
  });
});
}

exports.tripsRecent = function(callback) {
    mongo.connect(connection, (err, database) => {
      database
      .collection('trip')
      .find({privacy: "public"}).sort({datesubmit : -1}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('please input data',undefined);
  		}
  	}
  });
});
}


exports.searchTripDetail = function( req, _callback) {

  mongo.connect(connection, (err, database) => {
    if (err) {
      console.log("error", err);
    }else{

    }
    database.collection('trip').find({
    name: req.body.name
  }).toArray(function(err, docs) {
    if (err) {
      callback('cannot connect to database', undefined);
    }else{
      if (docs.length !== 0) {
        var array_result = [{
          name: docs[0].name,
          creator: docs[0].creator,
          origin: docs[0].origin,
          destination: docs[0].destination,
          depart: docs[0].depart,
          return: docs[0].return,
          daytrip: docs[0].daytrip,
          prices: docs[0].prices,
          picture: docs[0].picture,
          privacy: docs[0].privacy,
          like: docs[0].like,
          favorite: docs[0].favorite,
          datesubmit: docs[0].datesubmit,
          reviews: docs[0].reviews,
        }];

        getAllPlaceDetail(docs[0].place, (err, result) => {
          if (err) {
            array_result[0].place = [];
            console.log(`getAllPlaceDetail error message : ${err}`);
            _callback(undefined, array_result);
          }else{
            array_result[0].place = result;
            _callback(undefined, array_result);
          }

        });

      } else{
           callback('cannot found this trip',undefined);
      }
    }
    });
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
