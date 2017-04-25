"use strict";
var assert = require('assert');
var express = require('express');
var app = express();
let mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
let connection = 'mongodb://localhost:27017/bagpaotravel';
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
      price:`${req.body.price}`
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
        latitude:`${req.body.latitude}`,
        longitude:`${req.body.longitude}`,
        category: req.body.category,
        picture:`${req.body.picture}`,
        description:`${req.body.description}`,
				contact:`${req.body.contact}`,
        view: 0
        });
   		  }
  		});
      console.log('add data success');
	}

	exports.updatePlaceToMongo = function(req, callback) {
    console.log(req.body);
		mongo.connect(connection, (err, database) => {
    		if (err) {
  			callback('cannot connect to database', undefined);
  			}
  			else {
          console.log(req.body.name);
              callback(undefined,'update data success');

              database.collection('place').update({ name : `${req.body.name}`},
                { $set: {
                  contact: `${req.body.contact}`,
                  city: `${req.body.city}`,
                  latitude: `${req.body.latitude}`,
                  longitude: `${req.body.longitude}`,
                  category: `${req.body.category}`,
                  picture: `${req.body.picture}`,
                  description: `${req.body.description}`
                      }
                }
            );
	      }
      });
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
            price:`${req.body.price}`
            }
          }
        );
        }
      });
      console.log('update data success');
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
    console.log('delete data success');
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
      console.log('delete data success');
  	}

  exports.deleteTrip = function(req, callback) {
  			mongo.connect(connection, (err, database) => {
  			if (err) {
    			callback('cannot connect to database', undefined);
    			}
    			else {
    			callback(undefined, 'delete data success');
    			database
  			.collection('trip')
        .remove({ name: `${req.body.name}` });
  			}
  		});
      console.log('delete data success');
  	}

    exports.deleteMember = function(req, callback) {
    			mongo.connect(connection, (err, database) => {
    			if (err) {
      			callback('cannot connect to database', undefined);
      			}
      			else {
      			callback(undefined, 'delete data success');
      			database
    			.collection('member')
          .remove({ username: `${req.body.name}` });
    			}
    		});
        console.log('delete data success');
    	}

  exports.showProblem = function(callback) {
      mongo.connect(connection, (err, database) => {
        database
        .collection('contactus')
        .find({}).toArray(function(err, docs) {
    	if (err) {
    		callback('cannot connect to database', undefined);
    	}else{
    		if (docs.length !== 0) {
    			callback(undefined, docs);
    	}else{
    			callback('no data',undefined);
    		}
    	}
    });
    });
  }

  exports.showTransportationAll = function(callback) {
      mongo.connect(connection, (err, database) => {
        database
        .collection('transportation')
        .find({}).toArray(function(err, docs) {
    	if (err) {
    		callback('cannot connect to database', undefined);
    	}else{
    		if (docs.length !== 0) {
    			callback(undefined, docs);
    	}else{
    			callback('no data',undefined);
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
          callback('no data',undefined);
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
      console.log('delete data success');
  	}

     exports.deleteReview = function(req, callback) {
    var query = req.body.index;
        mongo.connect(connection, (err, database) => {
        if (err) {
          callback('cannot connect to database', undefined);
          }
          else {
          callback(undefined, 'delete data success');
          database
          .collection('reviews')
          .remove({ reviews: query});
        }
      });
      console.log('delete data success');
    }
