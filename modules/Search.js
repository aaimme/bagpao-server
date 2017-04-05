"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';


exports.searchPlace = function(db, req, callback) {
  // Get the documents collection
  var collection = db.collection('place');
  // Find by name
  collection.find({$or : [
    {name:{ $regex: `${req.body.name}`}},
    {city:{ $regex: `${req.body.name}`}}
    ]}
    ).toArray(function(err, docs) {
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


exports.searchTripAll = function(db, req, callback) {
  // Get the documents collection
  var collection = db.collection('trip');
  // Find by name
  collection.find({$or : [
    { name: { $regex: `${req.body.name}`}},
    { creator: { $regex: `${req.body.name}`}},
    { place: { $regex: `${req.body.name}`}}
    ]}
    ).toArray(function(err, docs) {
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
