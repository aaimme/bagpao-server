"use strict";
var assert = require('assert');
var express = require('express');
var app = express();
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';

exports.searchPlace = function(db, req, callback) {
  // Get the documents collection
  var collection = db.collection('place');
  // Find by name
  collection.find({name:`${req.body.name}`}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	} else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	} else{
           //Find by city
           collection.find({city:`${req.body.name}`}).toArray(function(err, docs) {
           if (err) {
               callback('cannot connect to database', undefined);
            } else{
                if (docs.length !== 0) {
                    callback(undefined, docs);
                 } else{
                     callback('cannot found this place',undefined);
                }
            }
            });
  		}
  	}
});
}


exports.searchTrip = function(db, req, callback) {
  // Get the documents collection
  var collection = db.collection('trip');
  // Find by name
  collection.find({name:`${req.body.name}`}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	} else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	} else{
        //Find by username
           collection.find({by:`${req.body.name}`}).toArray(function(err, docs) {
           if (err) {
               callback('cannot connect to database', undefined);
            } else{
                if (docs.length !== 0) {
                    callback(undefined, docs);
                 } else{
                    //Find by place
                     collection.find({place:`${req.body.name}`}).toArray(function(err, docs) {
                     if (err) {
                        callback('cannot connect to database', undefined);
                     } else{
                     if (docs.length !== 0) {
                        callback(undefined, docs);
                      } else{
                          callback('cannot found this trip',undefined);
                      }
                      }
                    });
                  }
                 }
            });	
  	}
  	}
  });
}
