"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';
let cookie  = require('cookie-parser');
let crypto  = require('crypto');
let tokens  = [];

function encrypt(password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}

exports.checkUserLogin = function(db, req, callback) {
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
				let token = Date.now() + '-' +
					parseInt(Math.random() * 1000000000000);
				tokens[token] = result[0];
				res.cookie('token', token, {maxAge: 60000});
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
