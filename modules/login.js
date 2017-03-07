"use strict";
var assert = require('assert');
var express = require('express');
var app = express();
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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