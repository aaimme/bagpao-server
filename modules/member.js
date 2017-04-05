"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';


exports.findUser = function(db, req, callback) {
  // Get the documents collection
 	 var collection = db.collection('member');
  // Find some documents
  collection.find({username:`${req.body.username}`}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length === 1) {
  			callback(undefined, docs);
  	}else{
  			callback('cannot found data',undefined);
  		}
  	}
  });
}


exports.editProfile = function(req, callback) {
		console.log(req.body);
		 var collection = db.collection('member');
	  // Find some documents
	  collection.find({username:`${req.body.username}`}).toArray(function(err, docs) {
	  	if (err) {
	  		callback('cannot connect to database', undefined);
	  	}else{
	  		if (docs.length === 1) {
	  			callback(undefined, docs);
	  	}else{
	  			callback('cannot found data',undefined);
	  		}
	  	}
	  });

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
