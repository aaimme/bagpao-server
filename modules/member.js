"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';


exports.findUser = function(db, req, callback) {
  // Get the documents collection
 	 var collection = db.collection('member');
  // Find some documents
  collection.find({username:{ $regex: `${req.body.username}`,$options:"$i"}}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('cannot found data',undefined);
  		}
  	}
  });
}

exports.editProfile = function(req, callback) {
    var birthday = new Date();
    console.log(req.body);
		mongo.connect(connection, (err, database) => {
			if (err) {
  			callback('cannot connect to database', undefined);
  			}
  			else {
  			callback(undefined, 'edit success');
  			database
			.collection('member')
			.update({username:`${req.body.username}` },
			{ $set : {
			password:`${req.body.password}`,
			email:`${req.body.email}`,
			displayname:`${req.body.displayname}`,
			birthday: birthday,
			currentcity:`${req.body.currentcity}`,
			interest:`${req.body.interest}`,
			bio:`${req.body.bio}`
			}
			});
   		  }
		});
	}

  exports.addFavorrite = function(req) {
          mongo.connect(connection, (error, database) => {

              database.collection('trip').find({ name:`${req.body.name}`}).toArray(function(err, docs) {
                if (err) {
                  console.log('error:', err);
                }else{
                  if (docs.length == 1) {
                    var idtrip = docs[0]._id ;
                    database.collection('member').update({ username: `${req.body.username}`},
                   {
                     $push: {
                          favorite : {
                          $each: [ {
                            $ref : "trip",
                            $id : idtrip,
                            $db : "bagpaotravel"
                           }]
                       }
                     }
                   }
                  );


                }else{
                    console.log('error');
                  }
                }
              });


              });
          console.log('add favorite success');
  }
