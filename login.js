"use strict";

let express = require('express');
let app     = express();
let body    = require('body-parser');
let cookie  = require('cookie-parser');
let mongo   = require('mongodb').MongoClient;
let crypto  = require('crypto');
let storage = 'mongodb://localhost:27017/bagpaotravel';
let tokens  = [];


app.use(body.urlencoded({extended: true}));
app.use(cookie());
app.use(express.static('public'));


app.get ('/logout',   (req, res) => {
	delete tokens[req.cookies.token];
	console.log('logout');
});

app.get ('/settings',  (req, res) => {
	if (req.cookies == null ||
		req.cookies.token == null ||
		tokens[req.cookies.token] == null) {
			console.log('cookies null');
	} else {

	}
});

app.post('/register', (req, res) => {
	mongo.connect(storage, (error, database) => {
		database
		.collection('member')
		.find({username :req.body.name})
		.toArray((error, result) => {
			if (result.length == 0) {
				database.collection('member').insert({
					username:     req.body.name,
					password: encrypt(req.body.password),
					email:    req.body.email
				});
				console.log('signup success');
			}
			else {
				console.log('That username is taken. Try another.');
			}

		});
	});
});

app.post('/login', (req, res) => {
	mongo.connect(storage, (error, database) => {
		database
		.collection('member')
		.find({username:req.body.name, password: encrypt(req.body.password)})
		.toArray((error, result) => {
			if (result.length == 1) {
				let token = Date.now() + '-' +
					parseInt(Math.random() * 1000000000000);
				tokens[token] = result[0];
				res.cookie('token', token, {maxAge: 60000});
				res.redirect('/settings');
				console.log('login success');
			} else {
				res.redirect('/login');
				console.log('invalid username or password');
			}
		});
	});
});

// app.get ('/angular', (req, res) => res.render('angular.html'));
// app.get ('/react'  , (req, res) => res.render('react.html'));

app.use(ErrorHandler);
function ErrorHandler(req, res, next) {
	res.status(404).send('File not found');
}

app.listen(1200, function () {
  console.log('Server running on port 1200...')
});
function encrypt(password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}
