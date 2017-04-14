"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';

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

exports.placeCategories = function(req, callback) {
   console.log(req.body);
    mongo.connect(connection, (err, database) => {
      database
      .collection('place')
      .find({category: req.body.category}).toArray(function(err, docs) {
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
        $limit : 3
      },
      {
        $sort : {totalAmount : -1}
      }
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
