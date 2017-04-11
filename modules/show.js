"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';

exports.home = function(callback){
  mongo.connect(connection, (err, database) => {
    var doc1, doc2;
    database.collection('place')
    .find({}).sort({ view : -1}).toArray(function(err, docs) {
  if (err) {
    callback('cannot connect to database', undefined);
    doc1 = docs;
    next();
  }else{
    if (docs.length !== 0) {
      callback(undefined, docs);
      doc1 = docs;
      next();
  }else{
      callback('please input data',undefined);
      doc1 = docs;
      next();
    }
  }
});

database.collection('trip').aggregate(
{
 $project:
   {
     name:"$name",
     creator:"$creator",
     picture:"$picture",
     totalAmount: { $sum: [ "$like", "$share" ]}
   }
},
{
  $limit : 3
},
{
  $sort : {totalAmount : -1}
}
).toArray(function(err, docs) {
if (err) {
callback('cannot connect to database', undefined);
doc2 = docs;
next();
}else{
if (docs.length !== 0) {
  callback(undefined, docs);
  doc2 = docs;
  next();
}else{
  callback('please input data',undefined);
  doc2 = docs;
  next();
}
}
});
function next(){
            if(doc1 && doc2){
                callback(null, [doc1, doc2]);
            }
        }
});
}

exports.placePopular = function(callback) {
    mongo.connect(connection, (err, database) => {
      database
      .collection('place')
      .find({}).sort({ view : -1}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('please input data',undefined);
  		}
  	}
  });
});
}

exports.placeCategories = function(req, callback) {
   console.log(req.body);
    mongo.connect(connection, (err, database) => {
      database
      .collection('place')
      .find({categories: req.body.categories}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('please input data',undefined);
  		}
  	}
  });
});
}

exports.tripsPopular = function(callback) {
    mongo.connect(connection, (err, database) => {
      database
      .collection('trip')
      .aggregate(
      {
       $project:
         {
           name:"$name",
           creator:"$creator",
           picture:"$picture",
           totalAmount: { $sum: [ "$like", "$share" ]}
         }
      },
      {
        $limit : 3
      },
      {
        $sort : {totalAmount : -1}
      }
      ).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('please input data',undefined);
  		}
  	}
  });
});
}

exports.tripsRecent = function(callback) {
    mongo.connect(connection, (err, database) => {
      database
      .collection('trip')
      .find().sort({datesubmit : -1}).toArray(function(err, docs) {
  	if (err) {
  		callback('cannot connect to database', undefined);
  	}else{
  		if (docs.length !== 0) {
  			callback(undefined, docs);
  	}else{
  			callback('please input data',undefined);
  		}
  	}
  });
});
}
