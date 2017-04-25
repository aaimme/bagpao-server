"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';
let crypto  = require('crypto');

function encrypt(password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}

exports.checkUserLogin = function( req, callback) {
	mongo.connect(connection, (error, database) => {
		 database.collection('member').find({username:`${req.body.username}`, password: encrypt(`${req.body.password}`)})
		.toArray((error, result) => {
      if (error) {
    		callback('cannot connect to database', undefined);
    	}else{
			if (result.length == 1) {
        callback(undefined, result);
				console.log('login success');
			} else {
        callback('invalid username or password',undefined);
				console.log('invalid username or password');
			}
    }
		});
	});
}


exports.checkUserSignup = function( req, callback) {
	console.log(req.body);
	mongo.connect(connection, (error, database) => {
		 database.collection('member').find({username :`${req.body.username}`}).toArray((error, result) => {
  if (error) {
    callback('cannot connect to database', undefined);
  } else {
    if (result.length == 0) {
      callback(undefined,'success');
			mongo.connect(connection, (error, database) => {
				 database.collection('member').insert({
      username: req.body.username,
      password: encrypt(req.body.password),
      email: req.body.email,
			birthday: '',
			currentcity: '',
			interest: [],
			bio: '',
			picture: 'app/img/icon.png'

    });
	});
    console.log('signup success');
  }

  else {
    callback('That username is taken. Try another.',undefined);
    console.log('That username is taken. Try another.');
  }
}
});
});
}
