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

		var signup_obj ={
			'message' : 'signup success'
		}
		res.send(signup_obj);
	
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
     	else{
     		console.log(result);
     		var result_obj = {
     			'message' : `success!!`,
     			'username' : result[0].username,
     			'email': result[0].email
     		} 
     		res.json(result_obj);
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
  	}else{
  		if (docs.length === 1) {
  			callback(undefined, docs);
  	}else{
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
		.update({ 
			username:`${req.body.username}`,
			password:`${req.body.pass}`,
			email:`${req.body.email}`,
			displayname:`${req.body.displayname}`,
			birthday:`${req.body.birthday}`,
			currentcity:`${req.body.currentcity}`,
			interest:`${req.body.interest}`,
			bio:`${req.body.bio}`
			});
   		 }); 
});


app.get(`/contactus/:name/:email/:subject/:message`, (req, res) => {

	console.log(req.params);
	mongo.connect(connection, (error, database) => {
	database
	.collection('contactus')  
	.insert({ 
		name:`${req.params.name}`,
		email:`${req.params.email}` ,
		subject:`${req.params.subject}`,
		message :`${req.params.message}` 
		});
   	}); 
	var contactus_obj = {
		'message' : 'send success!!'
	}
	res.send(contactus_obj);	
});

app.listen(1200, function () {
  console.log('Server running on port 1200...')
});