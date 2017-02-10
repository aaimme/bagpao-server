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

app.post('/post', (req, res) => {

		console.log(req.body);
		mongo.connect(connection, (error, database) => {
		database
		.collection('contactus')
		.insert({ 
			no:`${req.body.no}`,
			name:`${req.body.name}`,
			subject:`${req.body.subject}`,
			email:`${req.body.email}` ,
			message :`${req.body.message}` 
			});
   		 }); 

		res.send(req.body);
	
});

app.get('/get', (req, res) => {

		console.log(req.params);
		mongo.connect(connection, (error, database) => {
		database
		.collection('contactus')  
		.insert({ 
			no:`${req.params.no}`,
			name:`${req.params.name}`,
			subject:`${req.params.subject}`,
			email:`${req.params.email}` ,
			message :`${req.params.message}` 
			});
   		 }); 

		res.send('success input GET in database !!');
		
	
});
app.listen(1200);


