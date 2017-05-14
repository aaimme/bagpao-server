"use strict";
var assert = require('assert');
var express = require('express');
var app = express();
let mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
let connection = 'mongodb://admin:admin@ds143081.mlab.com:43081/bagpao';
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


  exports.addTransToMongo = function(req, callback) {
  console.log(req.body);
  mongo.connect(connection, (err, database) => {
    if (err) {
      callback('cannot connect to database', undefined);
      }
      else {
      callback(undefined, 'add data success');
      database
    .collection('transportation')
    .insert({
      type:`${req.body.type}`,
      route:`${req.body.route}`,
      name: `${req.body.name}`,
      origin:`${req.body.origin}`,
      stationstart:`${req.body.stationstart}`,
      depart:`${req.body.depart}`,
      destination:`${req.body.destination}`,
      stationend:`${req.body.stationend}`,
      arrive:`${req.body.arrive}`,
      price: req.body.price
    });
      }
    });
    console.log('add data success');
}

  exports.addPlaceToMongo = function(req, callback) {
		mongo.connect(connection, (err, database) => {
			if (err) {
  			callback('cannot connect to database', undefined);
  			}
  			else {
  			callback(undefined, 'add data success');
  			database
			.collection('place')
			.insert({
				name:`${req.body.name}`.split(","),
        city:`${req.body.city}`.split(","),
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        category: req.body.category,
        picture:`${req.body.picture}`,
        description:`${req.body.description}`,
				contact:`${req.body.contact}`,
        price: req.body.price,
        view: 0
        });
   		  }
  		});
      console.log('add place success');
	}

	exports.updatePlaceToMongo = function(req, callback) {
    console.log(req.body);
		mongo.connect(connection, (err, database) => {
    		if (err) {
  			callback('cannot connect to database', undefined);
  			}
  			else {
              callback(undefined,'update data success');

              database.collection('place').update({ name : `${req.body.name}`},
                { $set: {
                  contact: `${req.body.contact}`,
                  city: `${req.body.city}`.split(","),
                  latitude: req.body.latitude,
                  longitude: req.body.longitude,
                  category: `${req.body.category}`,
                  picture: `${req.body.picture}`,
                  description: `${req.body.description}`,
                  price: req.body.price
                      }
                }
            );
	      }
      });
    console.log('update place success');
    }

   exports.updateTransportation = function(req, callback) {
     var query = ObjectId(req.body['id']);
     mongo.connect(connection, (err, database) => {
        if (err) {
        	callback('cannot connect to database', undefined);
        }
        else {
          callback(undefined,'update data success');
          database.collection('transportation').update({ _id : query},
          { $set: {
            type:`${req.body.type}`,
            route:`${req.body.route}`,
            name: `${req.body.name}`,
            origin:`${req.body.origin}`,
            stationstart:`${req.body.stationstart}`,
            depart:`${req.body.depart}`,
            destination:`${req.body.destination}`,
            stationend:`${req.body.stationend}`,
            arrive:`${req.body.arrive}`,
            price: req.body.price
            }
          }
        );
        }
      });
      console.log('update transportation success');
    }

  exports.deletePlace = function(req, callback) {
			mongo.connect(connection, (err, database) => {
			if (err) {
  			callback('cannot connect to database', undefined);
  			}
  			else {
  			callback(undefined, 'delete data success');
  			database
			.collection('place')
      .remove({ name: `${req.body.name}` });

			}
		});
    console.log('delete place success');
	}

  exports.deleteTransportation = function(req, callback) {
      var query = ObjectId(req.body['id']);
  			mongo.connect(connection, (err, database) => {
  			if (err) {
    			callback('cannot connect to database', undefined);
    			}
    			else {
    			callback(undefined, 'delete data success');
    			database
  			  .collection('transportation')
          .remove({ _id : query });
  			}
  		});
      console.log('delete transportation success');
  	}

  exports.deleteTrip = function(req, callback) {
  		mongo.connect(connection, (err, database) => {
  			if (err) {
    			callback('cannot connect to database', undefined);
    			}
    			else {
    			callback(undefined, 'delete data success');
    			database.collection('trip').remove({ name: `${req.body.name}` });
            console.log("delete trips");
          database.collection('reviews').remove({ trip: `${req.body.name}` });
            console.log("delete reviews");
            database.collection('triptable').remove({ name: `${req.body.name}` });
            console.log("delete triptable");
  			}
  		});
      console.log('delete trip success');
  	}

    exports.deleteMember = function(req, callback) {
    		mongo.connect(connection, (err, database) => {
    			if (err) {
      			callback('cannot connect to database', undefined);
      		}
      		else {
      			callback(undefined, 'delete data success');
      			database.collection('member').remove({ username: `${req.body.name}` });
            database.collection('usertable').remove({ username: `${req.body.name}` });
    			}
    		});
        console.log('delete member success');
    	}

  exports.showProblem = function(callback) {
      mongo.connect(connection, (err, database) => {
        database.collection('contactus').find({}).toArray(function(err, docs) {
    	if (err) {
    		callback('cannot connect to database', undefined);
    	}else{
    		if (docs.length !== 0) {
    			callback(undefined, docs);
    	}else{
    			callback('no data problem',undefined);
    		}
    	}
    });
    });
  }

  exports.showTransportationAll = function(callback) {
    mongo.connect(connection, (err, database) => {
        database.collection('transportation').find({}).toArray(function(err, docs) {
    	   if (err) {
    		  callback('cannot connect to database', undefined);
    	   }else{
    		      if (docs.length !== 0) {
    			       callback(undefined, docs);
    	        }else{
    			       callback('no data transportation',undefined);
    		      }
    	 }
      });
    });
  }

  exports.showTransportation = function(req, callback) {
      var query = ObjectId(req.body['id']);
      mongo.connect(connection, (err, database) => {
        database
        .collection('transportation')
        .find({ _id : query}).toArray(function(err, docs) {
      if (err) {
        callback('cannot connect to database', undefined);
      }else{
        if (docs.length !== 0) {
          callback(undefined, docs);
      }else{
          callback('no data transportation',undefined);
        }
      }
    });
    });
  }

  exports.deleteProblem = function(req, callback) {
    var query = ObjectId(req.body['id']);
        mongo.connect(connection, (err, database) => {
  			if (err) {
    			callback('cannot connect to database', undefined);
    			}
    			else {
    			callback(undefined, 'delete data success');
    			database
  			  .collection('contactus')
          .remove({ _id : query});
  			}
      });
      console.log('delete problem success');
  	}

     exports.deleteReview = function(req, callback) {
      var query = req.body.comment;
      mongo.connect(connection, (err, database) => {
        if (err) {
          callback('cannot connect to database', undefined);
          }
          else {
          callback(undefined, 'delete data success');
          database.collection('reviews').update(
            { trip : req.body.name },
            { $pull: { reviews : {comment : query}}}
          );
        }
    });
      console.log('delete reviews success');
    }
