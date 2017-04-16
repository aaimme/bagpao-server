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


	exports.addPlaceToMongo = function(req, callback) {
		console.log(req.body);
		mongo.connect(connection, (err, database) => {
			if (err) {
  			callback('cannot connect to database', undefined);
  			}
  			else {
  			callback(undefined, 'add data success');
  			database
			.collection('place')
			.insert({
				idplace:`${req.body.idplace}`,
				name:`${req.body['name']}`,
        city:`${req.body['city']}`,
        latitude:`${req.body.latitude}`,
        longitude:`${req.body.longitude}`,
        category:`${req.body.category}`,
        picture:`${req.body.picture}`,
        description:`${req.body.description}`,
				contact:`${req.body.contact}`,
        view: 0
			});
   		  }
  		});
	}

	exports.updatePlaceToMongo = function(req, callback) {
		console.log(req.body);
		mongo.connect(connection, (err, database) => {
			if (err) {
  			callback('cannot connect to database', undefined);
  			}
  			else {
  			callback(undefined, 'update data success');
  			database
			.collection('place')
			.update({ name:`${req.body.name}` },
			{ $set : {
				idplace:`${req.body.idplace}`,
				name:`${req.body['name']}`,
        zone:`${req.body.zone}`,
				contact:`${req.body.contact}`,
				city:`${req.body.city}`,
				latitude:`${req.body.latitude}`,
				longitude:`${req.body.longitude}`,
				categories:`${req.body.categories}`,
				picture:`${req.body.picture}`,
				description:`${req.body.description}`
				}
			});
   		  }
		});
	}

exports.deletePlaceToMongo = function(req, callback) {
		console.log(req.body);
		mongo.connect(connection, (err, database) => {
			if (err) {
  			callback('cannot connect to database', undefined);
  			}
  			else {
  			callback(undefined, 'delete data success');
  			database
			.collection('place')
			.delete({ name:`${req.body.name}` });
			}
		});
	}

  exports.addBusToMongo = function(req, callback) {
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
        type:`bus`,
        name:`${req.body.name}`,
        origin:`${req.body.origin}`,
        stationstart:`${req.body.stationstart}`,
        depart:`${req.body.depart}`,
        destination:`${req.body.destination}`,
        stationend:`${req.body.stationend}`,
        arrive:`${req.body.arrive}`,
        class:`${req.body.class}`,
        price:`${req.body.price}`
			});
   		  }
  		});
	}

  exports.addTrainToMongo = function(req, callback) {
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
        type:`train`,
        route:`${req.body.route}`,
        origin:`${req.body.origin}`,
        stationstart:`${req.body.stationstart}`,
        depart:`${req.body.depart}`,
        destination:`${req.body.destination}`,
        stationend:`${req.body.stationend}`,
        arrive:`${req.body.arrive}`,
        class:`${req.body.class}`,
        trainnumber:`${req.body.number}`,
        price:`${req.body.price}`
      });
        }
      });
  }
