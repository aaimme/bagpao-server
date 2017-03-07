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


exports.addTripToMongo = function(req) {
		console.log(req.body);
		mongo.connect(connection, (error, database) => {
		database
		.collection('trips')
		.insert({ 
			tripname:`${req.body.name}`,
			daytrip:`${req.body.contact}`,
			origin:`${req.body.latitude}`,
			desination:`${req.body.longitude}`	
			});
   		 }); 

		var signup_obj ={
			'message' : 'create trip success'
		}
		res.json(signup_obj);
		console.log('create trip success');
	}	