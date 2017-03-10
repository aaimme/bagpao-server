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

var mandrill = require('node-mandrill')('wIonE-z4VA6qXMXWJxRHrQ');  // sent email

var search = require('./modules/Search');
var login = require('./modules/login');
var admin = require('./modules/admin');
var member = require('./modules/member');
var show = require('./modules/show');

//can recieve api from another domain
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post(`/show`, (req, res) =>{
	res.send('<h1>Hello Node.jsh1>');
	show.showpopular(req, (error, result) => {
		 if (error) {
     		console.log(error);
     		var error_obj = {
     			'message' : `${error}`
     		}
     		res.json(error_obj);
     	}
     	else{
     		var add_obj ={
			'message' : result
			}
			res.json(add_obj);    		     		
     	}
	});
});


app.post(`/signup`, (req, res) => {

	console.log(req.body);
	mongo.connect(connection, (error, database) => {
	login.checkUserSignup(database, req, (error, result) => {
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
     		'message' : `That username is taken. Try another.`
     }
      res.json(result_obj);
    }
   	});
	});
});

app.post(`/login`, (req, res) => {

	console.log(req.body);
  	mongo.connect(connection, (error, database) => {
  	login.checkUserLogin(database, req, (error, result) => {
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
     		'message' : `success`,
     		'username' : result[0].username,
     		'email': result[0].email
     }

      res.json(result_obj);
     	console.log('login success');
    }
  });
	});
});

//update member to database
app.post(`/editprofile`, (req, res) => {

		member.editProfile(req, (error, result) => {
		 if (error) {
     		console.log(error);
     		var error_obj = {
     			'message' : `${error}`
     		}
     		res.json(error_obj);
     	}
     	else{
     		var editprofile_obj = {
		'message' : result	
	}
	res.json(editprofile_obj);
     	}
	});	
	});

app.post(`/places`, (req, res) => {

	console.log(req.body);
    mongo.connect(connection, (error, database) => {
     search.searchPlace(database, req, (error, result) => {
     	if (error) {
     		console.log(error);
     		var error_obj = {
     			'message' : `${error}`
     		}
     		res.json(error_obj);
     	}
     	else{
     		console.log(result.length);
     		var i
     		for(i = 0; i < result.length; i++){
     			var _name = result[i].name;
     			var _city = result[i].city;
     			var _picture = result[i].picture;

       		}
     			var result_obj = {
     			'message' : `success`,
     			result
       		}
     		res.json(result_obj);
     		console.log('search success');
     	}

     });
	});
});

app.post(`/trips`, (req, res) => {

	console.log(req.body);
    mongo.connect(connection, (error, database) => {
     search.searchTrip(database, req, (error, result) => {
     	if (error) {
     		console.log(error);
     		var error_obj = {
     			'message' : `${error}`
     		}
     		res.json(error_obj);
     	}
     	else{
     		//console.log(result);
        var results = []
        for(var i = 0; i < result.length; i++) {
     		var result_obj = {
     			'message' : `success`,
     			'by' : result[i].by,
     			'name' : result[i].name,
     			'picture' : result[i].picture,
     		}
     		//res.json(result_obj);
     		//console.log('search success');
        results[i] = result_obj
     	  }
        console.log(results);
        res.json(results);
      }
     });
	});
});

app.post(`/admin/places`, (req, res) =>{
	admin.addPlaceToMongo(req, (error, result) => {
		 if (error) {
     		console.log(error);
     		var error_obj = {
     			'message' : `${error}`
     		}
     		res.json(error_obj);
     	}
     	else{
     		var add_obj ={
			'message' : result
			}
			res.json(add_obj);
			console.log('add data success');
     		     		
     	}
	});
});

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

// define your own email api which points to your server.

app.post( '/api/sendemail/', function(req, res){

    var _name = req.body.name;
    var _email = req.body.email;
    var _subject = req.body.subject;
    var _message = req.body.message;
    console.log(req.body);
    //implement your spam protection or checks.

    sendEmail ( _name, _email, _subject, _message );

});

function sendEmail ( _name, _email, _subject, _message) {
    mandrill('/messages/send', {
        message: {
            to: [{email: _email , name: _name}],
            from_email: 'noreply@yourdomain.com',
            subject: _subject,
            text: _message
        }
    }, function(error, response){
        if (error) console.log( error );
        else console.log(response);
    });
}

app.listen(1200, function () {
  console.log('Server running on port 1200...')
});