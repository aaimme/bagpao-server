"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';

// exports.placePopular = function(callback) {
//     mongo.connect(connection, (err, database) => {
//       database
//       .collection('place')
//       .find({idplace:`${req.body.idplace}`}).count().sort( idplace : -1).toArray(function(err, docs) {
//   	if (err) {
//   		callback('cannot connect to database', undefined);
//   	}else{
//   		if (docs.length !== 0) {
//   			callback(undefined, docs);
//   	}else{
//   			callback('please input data',undefined);
//   		}
//   	}
//   });
// });
// }

exports.placeCategories = function(req, callback) {
    mongo.connect(req, connection, (err, database) => {
      database
      .collection('place')
      .find({categories:`${req.body.categories}`}).toArray(function(err, docs) {
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
      .aggregate(
      {
       $project:
         {
           name:"$name",
           creator:"$creator",
           picture:"$picture",
           totalAmount: { $sum: [ "$like", "$share" ]}
         }
      },
      {
        $sort : {totalAmount : -1}
      },
      { $limit : 3 }
      ).toArray(function(err, docs) {
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
      .find().sort({datesubmit : -1}).toArray(function(err, docs) {
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
