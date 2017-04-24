"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://127.0.0.1:27017/bagpaotravel';


exports.searchPlace = function( req, callback) {
    mongo.connect(connection, (error, database) => {
      database.collection('place').find({$or : [
    {name:{ $regex: `${req.body.name}`,$options:"$i"}},
    {city:{ $regex: `${req.body.name}`,$options:"$i"}},
    {category: req.body.name}
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
    });
   }


exports.searchTripAll = function( req, callback) {
  mongo.connect(connection, (error, database) => {
    database.collection('trip').find({$or : [
    { name: { $regex: `${req.body.name}`,$options:"$i"},privacy: 'public'},
    { creator: { $regex: `${req.body.name}`,$options:"$i"},privacy: 'public'},
    { destination: { $regex: `${req.body.name}`,$options:"$i"},privacy: 'public'},
    { tags: req.body.name}
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
    });
   }

   exports.searchTripAlladmin = function( req, callback) {
     mongo.connect(connection, (error, database) => {
        database.collection('trip').find({$or : [
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
       });
      }
