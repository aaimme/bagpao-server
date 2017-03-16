"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';

exports.steptwo = function(db, req, callback) {
  var collection = db.collection('transportation');
  collection.find({origin:`${req.body.origin}`, destination:`${req.body.destination}`}).toArray(function(err, docs) {
    if (err) {
      callback('cannot connect to database', undefined);
    } else{
      if (docs.length !== 0) {
        callback(undefined, docs);
    } else{
           callback('cannot found',undefined);
          }
    }
  });
   }
