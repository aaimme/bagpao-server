"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://admin:admin@ds143081.mlab.com:43081/bagpao';
var fs = require('fs');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';


function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.findUser = function(req, callback) {
mongo.connect(connection, (err, database) => {
  database.collection('member').find({username:{ $regex: `${req.body.username}`,$options:"$i"}}).toArray(function(err, docs) {
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
});
}

exports.editProfile = function(req, callback) {
    var results = req.body.interest;
		mongo.connect(connection, (err, database) => {
			if (err) {
  			callback('cannot connect to database', undefined);
  			}
  			else {
  			callback(undefined, 'edit success');
  			database.collection('member')
			.update({username:`${req.body.username}` },
			{ $set : {
			password:encrypt(`${req.body.password}`),
			email:`${req.body.email}`,
			birthday: `${req.body.birthday}`,
			currentcity:`${req.body.currentcity}`,
			interest: [],
			bio:`${req.body.bio}`,
      picture: `${req.body.picture}`
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


    exports.editPassword = function(req, callback) {
    		mongo.connect(connection, (err, database) => {
    			if (err) {
      			callback('cannot connect to database', undefined);
      			}
      			else {
      			callback(undefined, 'edit success');
      			database.collection('member')
    			.update({username:`${req.body.username}` },
    			{ $set : {
    			password:encrypt(`${req.body.password}`)
    			}
    			});
          }
          console.log("Password has been changed");
        });
       	}



  exports.myTrips = function( req, callback) {
    mongo.connect(connection, (err, database) => {
      database.collection('trip').find({creator:`${req.body.username}`}).toArray(function(err, docs) {
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
  });
}


  exports.myFavorite = function( req, callback) {
    mongo.connect(connection, (err, database) => {
      database.collection('trip').find({favorite:`${req.body.username}`}).sort({name: 1}).toArray(function(err, docs) {
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
  });
  }

  exports.like = function( req) {
  if(req.body.username == ''){
    mongo.connect(connection, (err, database) => {
        database.collection('trip').update(
          { name : req.body.name},
          { $inc: { like: 1 } });
      });
      console.log("anonymous like");
  }
  else{
    mongo.connect(connection, (err, database) => {
    database.collection('trip').find({liker:`${req.body.username}`,name :req.body.name }).toArray(function(err, docs) {
    if (err) {
      callback('cannot connect to database', undefined);
    }else{
      if (docs.length == 0) {
            database.collection('trip').update(
              { name : req.body.name},
              { $inc: { like: 1 } ,
              	$push: {liker: `${req.body.username}`}});
          console.log(req.body.username ,"like");
    }else{
          console.log("member liked");
      }
    }
  });
  });
  }
}


  exports.addFavorite = function(req) {
    mongo.connect(connection, (err, database) => {
    database.collection('trip').find({favorite:`${req.body.username}`}).toArray(function(err, docs) {
    if (err) {
      callback('cannot connect to database', undefined);
    }else{
      if (docs.length == 0) {
            database.collection('trip').update(
              { name : req.body.name},
              {	$push: {favorite: `${req.body.username}`}});
          console.log("add favorite by :",req.body.username,"trip :",req.body.name);
    }else{
          console.log("member favorited");
      }
    }
  });
  });
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
