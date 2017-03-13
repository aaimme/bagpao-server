"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';

exports.showpopular = function(callback) {
    mongo.connect(connection, (err, database) => {
      database
      .collection('place')
      .find().sort({view : -1}).toArray(function(err, docs) {
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

