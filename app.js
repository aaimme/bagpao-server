"use strict";
var assert = require('assert');
var express = require('express');
var app = express();
var path = require('path');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';
var formidable = require('formidable');
var fs = require('fs');
let body    = require('body-parser');
app.use( body.json() );       // to support JSON-encoded bodies
app.use(body.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(path.join(__dirname, 'modules/uploads')));

const jwt = require('express-jwt');
const authCheck = jwt({
  secret: 'k7w9mXU_l1KzIHon0kw1o5T3fegHny2iSeeZ-oPcr-C52wuPX8ALMCz_3u4Kbw-M',
  audience: '39OEQrij8jRT7q2s7SxGPJzxzp64ZcAx'
});

var isodate = require("isodate");
var date = new Date();

var search = require('./modules/search');
var login = require('./modules/login');
var admin = require('./modules/admin');
var member = require('./modules/member');
var plan = require('./modules/planning');
var show = require('./modules/show');
var algorithm = require('./modules/algorithm');
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
    else if(req.body.do == "th"){
    show.tripsPopularHome(showtype);
    }
    else if (req.body.do == "mem"){
      mongo.connect(connection, (error, database) => {
        member.findUser(database ,req , showtype);
        // if(mytrip){
        //   member.myTrip(database ,req , showtype);
        // }
        // if(mydraft){
        //   member.myDraft(database ,req , showtype);
        // }
        // if(myFavorite){
        //   member.myFavorite(database ,req , showtype);
        // }
      });
   }
   else if (req.body.do == "detailtrip"){
     mongo.connect(connection, (error, database) => {
       show.searchTripAll(database, req, showtype);
     });
  }
  else if (req.body.do == "detailplace"){
    mongo.connect(connection, (error, database) => {
      search.searchPlace(database, req, showtype);
    });
 }

});

app.post(`/signup`, (req, res) => {
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
     }
      res.json(result_obj);
      // if(mytrip){
      //   member.myTrip(database ,req ,  (error, result) => {
      //     if (error) {
      //       console.log(error);
      //       var error_obj = {
      //         'message' : `${error}`
      //       }
      //       res.json(error_obj);
      //       }
      //     else {
      //       res.json(result);
      //       }
      //     });
      // }
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
                'picture' : result[i].picture
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
               'placeid' : result[i]._id,
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
                 'placeid' : result[i]._id,
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
    console.log('admin :',req.body.admin);
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

   }
   }

     if(req.body.admin == 'add'){
       if(req.body.types == 'place'){
         admin.addPlaceToMongo(req,json_object);
       }
       else if (req.body.types == 'trans') {
         admin.addTransToMongo(req, json_object);
       }
     }
    if(req.body.admin == 'show'){
      if(req.body.types == 'pb'){
        admin.showProblem(json_object);
      }
      else if (req.body.types == 'trans') {
        admin.showTransportation(json_object);
      }
    }
    if(req.body.admin == 'delete'){
      if(req.body.types == 'place'){
        admin.deletePlace(req, json_object);
      }
      else if (req.body.types == 'trans') {
        admin.deleteTransportation(req, json_object);
      }
      else if (req.body.types == 'trip') {
        admin.deleteTrip(req, json_object);
      }
      else if (req.body.types == 'pb') {
        admin.deleteProblem(req, json_object);
      }
      else if (req.body.types == 'member') {
        admin.deleteMember(req, json_object);
      }
      }
    if(req.body.admin == 'update'){
      if(req.body.types == 'place'){
        admin.updatePlaceToMongo(req, json_object);
      }
      else if (req.body.types == 'trans') {
        admin.updateTransportation(req, json_object);
      }


    }


});

app.post(`/like`, (req, res) => {
  mongo.connect(connection, (err, database) => {
      database.collection('trip').update({ name : req.body.name},{ $inc: { like: 1 } });
    });
    console.log("like");
});

app.post(`/share`, (req, res) => {
  mongo.connect(connection, (err, database) => {
      database.collection('trip').update({ name : req.body.name},{ $inc: { share: 1 } });
    });
});

app.post(`/reviews`, (req, res) => {
		mongo.connect(connection, (error, database) => {
      plan.review(database, req);
    		var contactus_obj = {
    		'message' : 'success'
    	}
    	res.json(contactus_obj);
      });
    });

app.post(`/contactus`, (req, res) => {

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


//connect API
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8'
});

app.get(`/apidistance`, (req, res) =>{
  var request = require('request');
  var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?&origins='+req.query.origin+'&destinations='+req.query.destination+'&key=AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8'
  request(url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    body = JSON.parse(body);
    console.log(body);
    res.send(body);
    });
    });


app.get(`/apigeo`, (req, res) =>{
  var request = require('request');
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+req.query.address+'&key=AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8'
  request(url, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    body = JSON.parse(body);
    console.log(body);
    res.send(body);

    });
  });

//image
app.post('/upload', function(req, res){
    var name = req.body.username;
    var form = new formidable.IncomingForm();
    path.uploadForm(form , name);
});

app.listen(1200, function() {
  console.log('Server running on port 1200...')
});
