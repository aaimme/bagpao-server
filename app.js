"use strict";
var assert = require('assert');
var express = require('express');
var app = express();
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';
let body    = require('body-parser');
app.use( body.json() );       // to support JSON-encoded bodies
app.use(body.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var mandrill = require('node-mandrill')('wIonE-z4VA6qXMXWJxRHrQ');  // sent email

const jwt = require('express-jwt');
const authCheck = jwt({
  secret: 'k7w9mXU_l1KzIHon0kw1o5T3fegHny2iSeeZ-oPcr-C52wuPX8ALMCz_3u4Kbw-M',
  audience: '39OEQrij8jRT7q2s7SxGPJzxzp64ZcAx'
});

var isodate = require("isodate");
var date;
// Write current date as ISO 8601 string.
date = new Date();

var search = require('./modules/search');
var login = require('./modules/login');
var admin = require('./modules/admin');
var member = require('./modules/member');
var plan = require('./modules/planning');
var show = require('./modules/show');
var path = require('./modules/path');

//can recieve api from another domain
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post(`/show`, (req, res) =>{
 console.log(req.body);
  var showtype = (error, result) => {
  if (error) {
    console.log(error);
    var error_obj = {
      'message' : `${error}`
    }
    res.json(error_obj);
  }
  else {
    res.json(result);
  }
  }

    if(req.body.do == "pc"){
      show.placeCategories(req, showtype);
    }
    else if(req.body.do == "tr"){
      show.tripsRecent(showtype);
    }
    else if(req.body.do == "pp"){
    show.placePopular(showtype);
    }
    else if(req.body.do == "tp"){
    show.tripsPopular(showtype);
    }
    else if(req.body.do == "ph"){
    show.placePopularHome(showtype);
    }
    else if(req.body.do == "ph"){
    show.tripsPopularHome(showtype);
    }
    else if (req.body.do == "mem"){
      mongo.connect(connection, (error, database) => {
        member.findUser(database ,req , showtype);
      });
   }

});

app.get ('/logout',   (req, res) => {
	delete tokens[req.cookies.token];
	console.log('logout');
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
     		'message' : result
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
        'status': result[0].status,
     		'interest': result[0].interest,
        'bio': result[0].bio,
        'picture': result[0].picture,
        'mytrip': result[0].mytrip
     }
      res.json(result_obj);
    }
  });
	});
});

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
        var result_obj = {
        'message' : result
    }
  res.json(result_obj);
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
            var results = []
            for(var i = 0; i < result.length; i++) {
            var result_obj = {
                'name' : result[i].name,
                'city' : result[i].city,
                'picture' : result[i].picture,
                'description' : result[i].description,
                'contact' : result[i].contact
            }
            results[i] = result_obj
          }
            res.json(results);
     		console.log('search success');
     	}
    });
	});
});

app.post(`/trips`, (req, res) => {
	console.log(req.body);
    mongo.connect(connection, (error, database) => {
     search.searchTripAll(database, req, (error, result) => {
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
     			'creator' : result[i].creator,
     			'name' : result[i].name,
     			'picture' : result[i].picture,
          'place' : result[i].place
     		}
     	    results[i] = result_obj
     	  }
          res.json(results);
          console.log('search success');
      }
     });
	});
});

app.post(`/planning`, (req, res) =>{

    mongo.connect(connection, (error, database) => {
      if(req.body.numstep == 1){
        plan.transportation(database, req, (error, result) => {
            if (error) {
               console.log(error);
               var error_obj = {
                   'message' : `${error}`
               }
               res.json(error_obj);
           }
           else{
             var results = []
             for(var i = 0; i < result.length; i++) {
             var result_obj = {
                 'number' : i,
                 'type' : result[i].type,
                 'route' : result[i].route,
                 'name' : result[i].name,
                 'origin' : result[i].origin,
                 'stationstart' : result[i].stationstart,
                 'depart' : result[i].depart,
                 'destination' : result[i].destination,
                 'stationend' : result[i].stationend,
                 'arrive' : result[i].arrive,
                 'price' : result[i].price
             }
             results[i] = result_obj
           }
             res.json(results);
             console.log('find route success');
           }
         });

      }
      else if(req.body.numstep == 2){
        plan.plan(database, req, (error, result) => {
          if (error) {
             console.log(error);
             var error_obj = {
                 'message' : `${error}`
             }
             res.json(error_obj);
         }
         else{
           var results = []
           for(var i = 0; i < result.length; i++) {
           var result_obj = {
               'placeid' : result[i].placeid,
               'name' : result[i].name,
               'picture' : result[i].picture,
               'city' : result[i].city,
               'category' : result[i].category
           }
           results[i] = result_obj
         }
           res.json(results);
           console.log('find place success');
         }
       });
      }
      // search placeCategories reqeuir numstep and categories and(name or city)
      else if(req.body.numstep == 3){
          search.searchPlace(database, req, (error, result) => {
        	if (error) {
        		console.log(error);
        		var error_obj = {
        			'message' : `${error}`
        		}
        		res.json(error_obj);
        	}
        	else{
               var results = []
               for(var i = 0; i < result.length; i++) {
               var result_obj = {
                 'placeid' : result[i].placeid,
                 'name' : result[i].name,
                 'picture' : result[i].picture,
                 'city' : result[i].city,
                 'category' : result[i].category
               }
               results[i] = result_obj
             }
               res.json(results);

        		console.log('search success');
        	}
       });
      }
      else if(req.body.numstep == 4){
        plan.end(req);
  }
  });

});

app.post(`/admin`, (req, res) =>{
    console.log(req.body.admin);
    var json_object = (error, result) => {
    if (error) {
       console.log(error);
       var error_obj = {
         'message' : `${error}`
       }
       res.json(error_obj);
     }
     else{
       var result_obj ={
     'message' : result
     }
     res.json(result_obj);
     console.log('add data success');
   }
   }

     if(req.body.admin == 'place'){
       admin.addPlaceToMongo(req,json_object);
     }
   if(req.body.admin == 'train'){
     admin.addTrainToMongo(req, json_object);
    }

    if(req.body.admin == 'bus'){
      admin.addBusToMongo(req, json_object);
    }


});


app.post(`/reviews`, (req, res) => {
		mongo.connect(connection, (error, database) => {
      database.collection('trip').find({creator :req.body.username ,name: `${req.body.tripname}`})
   		.toArray((error, result) =>{
        if(result.length == 1){
          database
          .collection('trip')
          .update(
         { name: `${req.body.tripname}`  },
         {
           $push: {
                reviews: {
                $each: [ {
                  user :`${req.body.username}`,
                  comment :`${req.body.comment}`,
                  creator: true,
                  date : date} ]
             }
           }
         }
        );
        }
        else {
          database
      		.collection('trip')
          .update(
         { name: `${req.body.tripname}`  },
         {
           $push: {
                reviews: {
                $each: [ {
                  user :`${req.body.name}`,
                  comment :`${req.body.comment}`,
                  date : date} ]
             }
           }
         }
      );
        }
    		var contactus_obj = {
    		'message' : 'success'
    	}
    	res.json(contactus_obj);
    });
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
//
// app.post( '/api/sendemail/', function(req, res){
//
//     var _name = req.body.name;
//     var _email = req.body.email;
//     var _subject = req.body.subject;
//     var _message = req.body.message;
//     console.log(req.body);
//     //implement your spam protection or checks.
//
//     sendEmail ( _name, _email, _subject, _message );
//
// });
//
// function sendEmail ( _name, _email, _subject, _message) {
//     mandrill('/messages/send', {
//         message: {
//             to: [{email: _email , name: _name}],
//             from_email: 'noreply@yourdomain.com',
//             subject: _subject,
//             text: _message
//         }
//     }, function(error, response){
//         if (error) console.log( error );
//         else console.log(response);
//     });
// }
//

//image
//app.use(ErrorHandler);
//function ErrorHandler(req, res, next) {
	//res.status(404).send('File not found');
//}

app.listen(1200, function() {
  console.log('Server running on port 1200...')
});
