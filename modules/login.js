"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';


exports.checkUserLogin = function(db, req, callback) {
  // Get the documents collection 
 	 var collection = db.collection('member');
  // Find some documents 
  collection.find({username:`${req.body.username}`, password:`${req.body.password}`}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length === 1) {
  			callback(undefined, docs);
  	}else{
  			callback('invalid username or password',undefined);
  		}
  	}

  });
}


exports.checkUserSignup = function(db, req, callback) {
  // Get the documents collection
  var collection = db.collection('member');
  // Find some documents
  collection.find({username:`${req.body.username}`}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	} else {
  		if (docs.length === 1) {
  			callback(undefined, docs);
  	}
  	else{
  			callback('success',undefined);
  			collection.insert({
				username:`${req.body.username}`,
				password:`${req.body.password}`,
				email:`${req.body.email}`
				});
  		}
  	}

  });
}