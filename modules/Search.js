"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';


exports.searchPlace = function(db, req, callback) {
  // Get the documents collection
  console.log(req.body);
  var collection = db.collection('place');
  // Find by name
  collection.find({$or : [
    {name:{ $regex: `${req.body.name}`,$options:"$i"}},
    {city:{ $regex: `${req.body.name}`,$options:"$i"}}
    ]}
    ).sort({name : 1}).toArray(function(err, docs) {
    if (err) {
      callback('cannot connect to database', undefined );
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
    { name: { $regex: `${req.body.name}`,$options:"$i"},privacy: 'public'},
    { creator: { $regex: `${req.body.name}`,$options:"$i"},privacy: 'public'},
    { destination: { $regex: `${req.body.name}`,$options:"$i"},privacy: 'public'}
    ]}
    ).sort({name : 1}).toArray(function(err, docs) {
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

   exports.searchTripAlladmin = function(db, req, callback) {
     // Get the documents collection
     var collection = db.collection('trip');
     // Find by name
     collection.find({$or : [
       { name: { $regex: `${req.body.name}`,$options:"$i"}},
       { creator: { $regex: `${req.body.name}`,$options:"$i"}},
       { destination: { $regex: `${req.body.name}`,$options:"$i"}}
       ]}
       ).sort({name : 1}).toArray(function(err, docs) {
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
