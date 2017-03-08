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

		
	exports.addPlaceToMongo = function(req) {
		console.log(req.body);
		mongo.connect(connection, (error, database) => {
		database
		.collection('place')
		.insert({ 
			idplace:`${req.body.idplace}`,
			name:`${req.body['name']}`,
			contact:`${req.body.contact}`,
			city:`${req.body.city}`,
			latitude:`${req.body.latitude}`,
			longitude:`${req.body.longitude}`,
			categories:`${req.body.categories}`,
			picture:`${req.body.picture}`,
			description:`${req.body.description}`,			
			});
   		 }); 

		var signup_obj ={
			'message' : 'add data success'
		}
		res.json(signup_obj);
		console.log('add data success');
	}	


