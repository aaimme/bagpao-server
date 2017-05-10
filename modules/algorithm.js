let mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
let connection = 'mongodb://localhost:27017/bagpaotravel';


var newUser;
var oldUser;
var member;
exports.checksUser = function(req, callback) {
    mongo.connect(connection, req,(err, database) => {
        database.collection('member').find({ username : req.body.user, mytrip :''}).toArray(function(err, docs) {
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
        });
      }

exports.recommendNewUser = function(req, callback) {
            mongo.connect(connection, (err, database) => {
              database
              .collection('trip')
              .aggregate([
              {$match:
                  { destination : req.body.destination }
              },
              {
               $project:
                 {
                   name:"$name",
                   creator:"$creator",
                   picture:"$picture",
                   totalAmount:  "$like"
                 }
              },
              {
                $sort : {totalAmount : -1}
              },
              {
                $limit : 3
              }
            ]).toArray(function(err, docs) {
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

      exports.recommendInterestUser = function(req, callback) {
                  mongo.connect(connection, (err, database) => {
                    database.collection('member').find({username: req.body.username}).toArray(function(err, docs){
                      if (err) {
                        		callback('cannot connect to database', undefined);
                        	}else{
                        		if (docs.length !== 0) {
                              console.log(docs[0].interest);
                              var results = docs[0].interest;
                              for(var i = 0; i < results.length; i++) {
                                  database.collection('trip').find({tag: results[i]}).toArray(function(err, docs2){
                                  callback(undefined,docs2);
                                  });
                              }
                            }
                          }
                    });
                  });


              //       database
              //       .collection('trip')
              //       .find([
              //       {$match:
              //           { destination : req.body.destination,
              //            category : docs.category }
              //       },
              //       {
              //        $project:
              //          {
              //            name:"$name",
              //            creator:"$creator",
              //            picture:"$picture"
              //          }
              //       },
              //       {
              //         $limit : 3
              //       }
              //     ]).toArray(function(err, docs) {
              //   	if (err) {
              //   		callback('cannot connect to database', undefined);
              //   	}else{
              //   		if (docs.length !== 0) {
              //   			callback(undefined, docs);
              //   	}else{
              //   			callback('no data',undefined);
              //   		}
              //   	}
              //   });
              // });
            }
