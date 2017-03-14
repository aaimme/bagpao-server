"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';


exports.planning = function(req) {
		console.log(req.body);
		mongo.connect(connection, (error, database) => {
		database
		.collection('trip')
		.insert({ 
			creator:`${req.body.username}`,
			tripid:`${req.body.tripid}`,
			daytrip:`${req.body.daytrip}`,
			origin:`${req.body.origin}`,
			destination:`${req.body.desination}`,
			picture:`${req.body.picture}`,
			name:`${req.body.name}`,
			privicy:`${req.body.privicy}`,
			place :`${req.body.place}`
			});
   		 }); 

		var step1_obj ={
			'message' : 'create trip success'
		}
		res.json(step1_obj);
		console.log('create trip success');
	}	

	exports.step2 = function(req) {
		console.log(req.body);
		mongo.connect(connection, (error, database) => {
		database
		.collection('transport')
		.insert({ 
			origin:`${req.body.origin}`,
			destination:`${req.body.desination}`,
			transport: `${req.body.transport}`	
			});
   		 }); 

		var step2_obj ={
			'message' : 'transportation...'
		}
		res.json(step2_obj);
		console.log('create trip success');
	}	

	//connect API