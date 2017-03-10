"use strict";
var assert = require('assert');
var express = require('express');
var app = express();
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';

exports.editProfile = function(req, callback) {
		console.log(req.body);
		mongo.connect(connection, (err, database) => {
			if (err) {
  			callback('cannot connect to database', undefined);
  			} 
  			else {
  			callback(undefined, 'edit success');
  			database
			.collection('member')
			.update({username:`${req.body.username}` },
			{ $set : {
			username:`${req.body.username}`,
			password:`${req.body.password}`,
			email:`${req.body.email}`,
			displayname:`${req.body.displayname}`,
			birthday:`${req.body.birthday}`,
			currentcity:`${req.body.currentcity}`,
			interest:`${req.body.interest}`,
			bio:`${req.body.bio}`
			}
			});
   		  } 	
		});
	}	

