let mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
let connection = 'mongodb://localhost:27017/bagpaotravel';

var newUser;
var oldUser;
var member;
    mongo.connect(connection, req,(err, database) => {
        database.collection('member').find({ user : req.body.user }).toArray(function(err, docs) {
            if (err) {
              callback('cannot connect to database', undefined);
            } else{
              if (docs.length == 0) {
                callback(undefined, docs);
                 member = newUser;
              } else{
                callback('cannot found',undefined);
                  member = oldUser;
              }
            }
          });
        }
