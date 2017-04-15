"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';




exports.checkUserLogin = function(db, req, res, callback) {
  // Get the documents collection
 	 var collection = db.collection('member');
  // Find some documents
	 collection.find({username:req.body.name, password: encrypt(req.body.password)})
		.toArray((error, result) => {
      if (error) {
    		callback('cannot connect to database', undefined);
    	}else{
			if (result.length == 1) {
        callback(undefined, result);
				console.log('login success');
			} else {
        callback('invalid username or password',undefined);
				console.log('invalid username or password');
			}
    }
		});
}


exports.checkUserSignup = function(db, req, callback) {
  // Get the documents collection
  var collection = db.collection('member');
  // Find some documents
  collection.find({username :req.body.username}).toArray((error, result) => {
  if (error) {
    callback('cannot connect to database', undefined);
  } else {
    if (result.length == 0) {
      callback(undefined,'success');
      collection.insert({
      username:     req.body.name,
      password: encrypt(req.body.password),
      email:    req.body.email
    });
    console.log('signup success');
  }
  else {
    callback('That username is taken. Try another.',undefined);
    console.log('That username is taken. Try another.');
  }
}
});
}
