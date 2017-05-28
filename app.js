"use strict";
var assert = require('assert');
var express = require('express');
var app = express();
var path = require('path');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://admin:admin@ds143081.mlab.com:43081/bagpao';
var fs = require('fs');
let body = require('body-parser');
app.use( body.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app.use(body.urlencoded({     // to support URL-encoded bodies
  limit: '50mb',
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

var isodate = require("isodate");
var date = new Date();

var search = require('./modules/search');
var login = require('./modules/login');
var admin = require('./modules/admin');
var member = require('./modules/member');
var plan = require('./modules/planning');
var show = require('./modules/show');
var recom = require('./modules/recom');
//var callbackClass = require('./modules/object');

//can recieve api from another domain
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post(`/recommend`, (req,res) =>{
  if(req.body.username == null){
    console.log("no user");
  }
  else {
// Table User relation
console.log(req.body);
  recom.countLike ( req,(error, result) => {
    recom.countFav(req,(error, result2) => {
      var mulobj2 = recom.multiply(result2);
      var old_result_obj = recom.addition(result,mulobj2);
      recom.countInterest (req,(error, result3) => {
         var mulobj3 = recom.multiply(result3);
         var final_result_obj = recom.addition(old_result_obj,mulobj3);
        recom.updateTableUser(req ,final_result_obj);
      });
    });
  });

  //find trip
  recom.recommendUser(req,(error, result) => {

      if (error) {
         console.log(error);
         var error_obj = {
           'message' : `${error}`
         }
         res.json(error_obj);
       }
       else {
          var results = []
          for(var i = 0; i < result.length; i++) {
            var result_obj = {
              'name' : result[i].name,
              'creator' : result[i].creator,
              'prices' : result[i].prices,
              'days' : result[i].daytrip,
              'picture' : result[i].picture
            }
            results[i] = result_obj
          }
         res.json(results);
       }
  });
  }
});

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function decrypt(text){
      var decipher = crypto.createDecipher(algorithm,password)
      var dec = decipher.update(text,'hex','utf8')
      dec += decipher.final('utf8');
      return dec;
    }

app.post(`/show`, (req, res) =>{
 console.log(req.body);
 var profile = (error, result) => {
 if (error) {
   console.log(error);
   var error_obj = {
     'message' : `${error}`
   }
   res.json(error_obj);
   }
 else {
    var results = []
    for(var i = 0; i < result.length; i++) {
      var result_obj = {
        '_id' : result[i].id,
        'username' : result[i].username,
        'password' : decrypt(result[i].password),
        'email' : result[i].email,
        'birthday' : result[i].birthday,
        'currentcity' : result[i].currentcity,
        'interest' : result[i].interest,
        'bio' : result[i].bio,
        'picture' : result[i].picture
      }
      results[i] = result_obj
    }
   res.json(results);
 }
 }

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
        member.findUser(req , profile);
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
        'picture': result[0].picture
     }
      res.json(result_obj);
    }
  });
});

app.post('/editprofile',function (req, res, next) {
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

app.post('/editpassword',function (req, res, next) {
    member.editPassword(req, (error, result) => {
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
               'category' : result[i].category,
               'price' : result[i].price
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
                 'category' : result[i].category,
                 'price' : result[i].price
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
       else if (req.body.types == 'reviews') {
        admin.deleteReview(req, json_object);
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
  console.log(req.body);
  member.like(req)
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
    if(req.body.comment == ''){
        var contactus_obj = {
        'message' : 'No comment'
      }
      res.json(contactus_obj);
    }
    else{
      plan.addReview( req);
        var contactus_obj = {
        'message' : 'success'
      }
      res.json(contactus_obj);
      }
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



app.listen(1200, function() {
  console.log('Server running on port 1200...')
});
