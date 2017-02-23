"use strict";

var express = require('express');
var app = express();
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post(`/post`, (req, res) => {

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

	res.send(req.body);
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

	res.send(req.params);	
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

	res.send(req.body);	
});

app.get(`/search/:name/:email`, (req, res) => {

	console.log(req.params);
    mongo.connect(connection, (error, database) => {
    database
    .collection('contactus')
    .find({"name": req.params.name, "email": req.params.email}).toArray((error, documents) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.send (documents)
        }
    	});
	});
});


app.listen(1200, function () {
  console.log('Server running on port 1200...')
});