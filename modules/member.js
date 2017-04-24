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
  			callback('cannot found User',undefined);
  		}
  	}
  });
}

exports.editProfile = function(req, callback) {
    var results = req.body.interest;
    console.log(req.body);
		mongo.connect(connection, (err, database) => {
			if (err) {
  			callback('cannot connect to database', undefined);
  			}
  			else {
  			callback(undefined, 'edit success');
  			database.collection('member')
			.update({username:`${req.body.username}` },
			{ $set : {
			password:`${req.body.password}`,
			email:`${req.body.email}`,
			birthday: `${req.body.birthday}`,
			currentcity:`${req.body.currentcity}`,
			interest: [],
			bio:`${req.body.bio}`,
      picture: `${req.body.picture}`,
      status: `public`
			}
			});

      for(var i = 0; i < results.length; i++) {
        var result_obj = results[i]
        results[i] = result_obj
        database.collection('member').update({ username:`${req.body.username}`},
              {	$push: {interest: {	$each: [results[i]]	}}});
        }
      }
      console.log("success");
    });
   	}


  exports.addFavorite = function(req) {
          mongo.connect(connection, (error, database) => {
            database.collection('trip').update({ name:`${req.body.name}`},
                {	$push: {favorite: `${req.body.username}`}});
          });
          console.log("add favorite by :",req.body.username,"trip :",req.body.name);
  }

  exports.removeFavorite = function(req) {
          mongo.connect(connection, (error, database) => {
            database.collection('trip').update(
                { name:`${req.body.name}`,favorite: `${req.body.username}`},
                { $pull: { favorite :`${req.body.username}` }
          });
          console.log("remove favorite by :",req.body.username,"trip :",req.body.name);
  });
}


  exports.myTrips = function(db, req, callback) {
    // Find some documents
    db.collection('trip').find({creator:`${req.body.username}`}).toArray(function(err, docs) {
    	if (err) {
    		callback('cannot connect to database', undefined);
    	}else{
    		if (docs.length !== 0) {
    			callback(undefined, docs);
    	}else{
    			callback('cannot found My trip',undefined);
    		}
    	}
    });
  }

  exports.myDraft = function(db, req, callback) {
    // Find some documents
    db.collection('trip').find({creator:`${req.body.username}`,status:'notactive'}).toArray(function(err, docs) {
    	if (err) {
    		callback('cannot connect to database', undefined);
    	}else{
    		if (docs.length !== 0) {
    			callback(undefined, docs);
    	}else{
    			callback('cannot found My draft',undefined);
    		}
    	}
    });
  }

  exports.myFavorite = function(db, req, callback) {
  // Find some documents
    db.collection('trip').find({favorite:`${req.body.username}`}).sort({name: 1}).toArray(function(err, docs) {
    	if (err) {
    		callback('cannot connect to database', undefined);
    	}else{
    		if (docs.length !== 0) {
          callback(undefined, docs);
    	}else{
    			callback('cannot found My favorite',undefined);
    		}
    	}
    });
  }
