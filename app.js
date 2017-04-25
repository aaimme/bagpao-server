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
        member.findUser(req , showtype);

   }
   else if (req.body.do == "detailtrip"){
       search.searchTripAlladmin( req, showtype);
  }
  else if (req.body.do == "showdetailtrip"){
      show.searchTripDetail( req, showtype);
 }
  else if (req.body.do == "detailplace"){
      search.searchPlace( req, showtype);
 }

});

app.post(`/signup`, (req, res) => {
	mongo.connect(connection, (error, database) => {
	login.checkUserSignup( req, (error, result) => {
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

	console.log("login: ",req.body);
  	login.checkUserLogin( req, (error, result) => {
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
    }
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

     search.searchPlace( req, (error, result) => {
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

app.post(`/trips`, (req, res) => {
     search.searchTripAll( req, (error, result) => {
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

app.post(`/planning`, (req, res) =>{
      if(req.body.numstep == 1){
        plan.transportation( req, (error, result) => {
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
        plan.plan( req, (error, result) => {
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
          search.searchPlace( req, (error, result) => {
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

app.post(`/getplaces`, (req, res) => {
		mongo.connect(connection, (error, database) => {
      plan.getplaces( req, (error, result) => {
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
      });
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
        admin.showTransportationAll(json_object);
      }
      else if (req.body.types == 'transport') {
        admin.showTransportation(req, json_object);
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

app.post(`/view`, (req, res) => {
  mongo.connect(connection, (err, database) => {
      database.collection('place').update({ name : req.body.name},{ $inc: { view: 1 } });
    });
});

app.post(`/favorite`, (req, res) => {
      if(req.body.add == "add"){
        member.addFavorite(req);
        res.send("add success");
      }
      else{
        member.removeFavorite(req);
        res.send("remove success");
      }
  });

app.post(`/mytrips`, (req, res) => {
  	mongo.connect(connection, (error, database) => {
      member.myTrips(req, (error, result) => {
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
        });
      });
    });

app.post(`/myfavorite`, (req, res) => {
		mongo.connect(connection, (error, database) => {
      member.myFavorite(req, (error, result) => {
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
      });
    });
  });


app.post(`/addreviews`, (req, res) => {

      plan.addReview( req);
    		var contactus_obj = {
    		'message' : 'success'
    	}
    	res.json(contactus_obj);

    });

    app.post(`/reviews`, (req, res) => {
          plan.review( req, (error, result) => {
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
//    console.log(body);
    res.send(body);
    });
    });


app.get(`/apigeo`, (req, res) =>{
  var request = require('request');
  var latlng = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+req.query.lat+','+req.query.lng+'&key=AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8'
  var address = 'https://maps.googleapis.com/maps/api/geocode/json?address='+req.query.address+'&key=AIzaSyDGFpo_nftbMYEro-Ff0lkXNdQV7sEwKN8'
  request(latlng, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    body = JSON.parse(body);
//    console.log(body);
    res.send(body);

    });
  });

//image
// app.post('/upload', function(req, res){
//   // create an incoming form object
//   var form = new formidable.IncomingForm();
//   // specify that we want to allow the user to upload multiple files in a single request
//   form.multiples = true;
//   // store all uploads in the /uploads directory
//   form.uploadDir = path.join(__dirname, '/uploads');
//   // every time a file has been uploaded successfully,
//   // rename it to it's orignal name
//   form.on('file', function(field, file) {
//     fs.rename(file.path, path.join(form.uploadDir, file.name));
//   });
//   // log any errors that occur
//   form.on('error', function(err) {
//     console.log('An error has occured: \n' + err);
//   });
//   // once all the files have been uploaded, send a response to the client
//   form.on('end', function() {
//     res.end('success');
//   });
//   // parse the incoming request containing the form data
//   form.parse(req);
// });

app.listen(1200, function() {
  console.log('Server running on port 1200...')
});
