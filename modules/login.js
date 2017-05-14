"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://admin:admin@ds143081.mlab.com:43081/bagpao';

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';


function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.checkUserLogin = function( req, callback) {
	mongo.connect(connection, (error, database) => {
		 database.collection('member').find({ $or: [ {username:`${req.body.username}`, password: encrypt(`${req.body.password}`)},
			  {username:`${req.body.username}`, email: `${req.body.email}`} ] })
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

var recom = require('./recom');

exports.checkUserSignup = function( req, callback) {
	console.log(req.body);
	mongo.connect(connection, (error, database) => {
		 database.collection('member').find({ $or: [ {username :`${req.body.username}`},
			  { email :`${req.body.email}`}] }
		 ).toArray((error, result) => {
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

    recom.createUserTable(req);
    console.log('signup success');
  }

  else {
    callback('That username/email is taken. Try another.',undefined);
    console.log('That username is taken. Try another.');
  }
}
});
});
}
