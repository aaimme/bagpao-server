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


  exports.searchPlace = function(db, req, callback) {
  // Get the documents collection
  var collection = db.collection('place');
  // Find some documents
  collection.find({name:`${req.body.name}`}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	} else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	} else{
  			callback('cannot found this place',undefined);
  		}
  	}

  });
}


	exports.searchTrip = function(db, req, callback) {
  // Get the documents collection
  var collection = db.collection('trips');
  // Find some documents
  collection.find({tripname:`${req.body.name}`}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	} else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	} else{
  			callback('cannot found this trip',undefined);
  		}
  	}

  });
}