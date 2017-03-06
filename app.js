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

//can recieve api from another domain
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post(`/signup`, (req, res) => {

	console.log(req.body);
	mongo.connect(connection, (error, database) => {
	database
	.collection('member')
	.insert({
		username:`${req.body.username}`,
		password:`${req.body.password}`,
		email:`${req.body.email}`
		});
  });

	var signup_obj = {
		'message' : 'success'
	}

  res.json(signup_obj);
	console.log('signup success');

});


app.post(`/login`, (req, res) => {

	console.log(req.body);
  mongo.connect(connection, (error, database) => {
  checkUserLogin(database, req, (error, result) => {
    if (error) {
     	console.log(error);
     	var error_obj = {
  		  'message' : `${error}`
     	}
     	res.json(error_obj);
    }
    else {
     	console.log(result);
     	var result_obj = {
     		'message' : `success!!`,
     		'username' : result[0].username,
     		'email': result[0].email
     }

      res.json(result_obj);
     	console.log('login success');
    }
  });
	});
});

var checkUserLogin = function(db, req, callback) {
  // Get the documents collection
  var collection = db.collection('member');
  // Find some documents
  collection.find({username:`${req.body.username}`, password:`${req.body.password}`}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	} else {
  		if (docs.length === 1) {
  			callback(undefined, docs);
  	} else {
  			callback('invalid username or password',undefined);
  		}
  	}

  });
}

//update member to database
app.post(`/editprofile`, (req, res) => {

		console.log(req.body);
		mongo.connect(connection, (error, database) => {
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
   		 });
		var editprofile_obj = {
		'message' : 'edit success!!',
		'value' : req.body
	}
	res.json(editprofile_obj);
});

app.post(`/places`, (req, res) => {

	console.log(req.body);
    mongo.connect(connection, (error, database) => {
     searchPlace(database, req, (error, result) => {
     	if (error) {
     		console.log(error);
     		var error_obj = {
     			'message' : `${error}`
     		}
     		res.json(error_obj);
     	}
     	else{
     		console.log(result);
     		var result_obj = {
     			'message' : `success`,
     			'idplace' : result[0].idplace,
     			'contact' : result[0].contact,
     			'picture' : result[0].picture,
     			'description' : result[0].description
     		}
     		res.json(result_obj);
     		console.log('searchTrip success');
     	}

     });
	});
});

var searchPlace = function(db, req, callback) {
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
app.post(`/contactus`, (req, res) => {

		console.log(req.body);
		mongo.connect(connection, (error, database) => {
		database
		.collection('contactus')
		.insert({
		name:`${req.body.name}`,
		email:`${req.body.email}` ,
		subject:`${req.body.subject}`,
		message :`${req.body.message}`
	 });
   });

		var contactus_obj = {
		'message' : 'success'
	}
	res.json(contactus_obj);

});

app.listen(1200, function () {
  console.log('Server running on port 1200...')
});
