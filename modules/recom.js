"use strict";
let mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
let connection = 'mongodb://localhost:27017/bagpaotravel';

    exports.createTripTable = function(req) {
      mongo.connect(connection, (err, database) => {
        if (err) {
          console.log('cannot connect to database');
          }
          else {
          database.collection('triptable').insert({
          name:`${req.body.name}`,
          beach: 0,
          zoo: 0,
          temple: 0,
          market: 0,
          museum: 0,
          amusementpark: 0,
          departmentstore: 0,
          nationalpark: 0,
          publicpark: 0
          });
          }
        });
        console.log('createTripTable success');
    }

    exports.createUserTable = function(req) {
      mongo.connect(connection, (err, database) => {
        if (err) {
          console.log('cannot connect to database');
          }
          else {
          database.collection('usertable').insert({
          username:`${req.body.username}`,
          beach: 0,
          zoo: 0,
          temple: 0,
          market: 0,
          museum: 0,
          amusementpark: 0,
          departmentstore: 0,
          nationalpark: 0,
          publicpark: 0
          });
          }
        });
        console.log('createUserTable success');
    }

    exports.countLike = function(req){
      mongo.connect(connection, (error, database) => {
        database.collection('trip').find({liker : `${req.body.username}`}).toArray((error, result) => {
          var beach = 0;
          var zoo = 0;
          var temple = 0;
          var market = 0;
          var museum = 0;
          var amusementpark = 0;
          var departmentstore = 0;
          var nationalpark = 0;
          var publicpark = 0;

          for(var i = 0; i < result.length; i++) {
            var place = result[i].place
            console.log('trip :' , result[i].name);
              for(var j = 0; j < place.length; j++) {
                console.log('category :' , place[j].category);

                if(place[j].category == 'beach'){
                   beach += 1;
                }
                else if (place[j].category == 'zoo') {
                   zoo += 1;
                }
                else if (place[j].category == 'temple') {
                   temple += 1;
                }
                else if (place[j].category == 'market') {
                   market += 1;
                }
                else if (place[j].category == 'museum') {
                   museum += 1;
                }
                else if (place[j].category == 'amusement park') {
                   amusementpark += 1;
                }
                else if (place[j].category == 'department store') {
                   departmentstore += 1;
                }
                else if (place[j].category == 'national park') {
                   nationalpark += 1;
                }
                else if (place[j].category == 'public park') {
                   publicpark += 1;
                }
                  console.log(beach,zoo,temple,market,museum,amusementpark,departmentstore,nationalpark,publicpark);
              }
          }

    				console.log('countLike');

        });
      });
    }

    exports.countFav = function(req){
      mongo.connect(connection, (error, database) => {
        database.collection('trip').find({favorite : `${req.body.username}`}).toArray((error, result) => {
          var beach = 0;
          var zoo = 0;
          var temple = 0;
          var market = 0;
          var museum = 0;
          var amusementpark = 0;
          var departmentstore = 0;
          var nationalpark = 0;
          var publicpark = 0;

          for(var i = 0; i < result.length; i++) {
            var place = result[i].place
            console.log('trip :' , result[i].name);
              for(var j = 0; j < place.length; j++) {
                console.log('category :' , place[j].category);

                if(place[j].category == 'beach'){
                   beach += 1;
                }
                else if (place[j].category == 'zoo') {
                   zoo += 1;
                }
                else if (place[j].category == 'temple') {
                   temple += 1;
                }
                else if (place[j].category == 'market') {
                   market += 1;
                }
                else if (place[j].category == 'museum') {
                   museum += 1;
                }
                else if (place[j].category == 'amusement park') {
                   amusementpark += 1;
                }
                else if (place[j].category == 'department store') {
                   departmentstore += 1;
                }
                else if (place[j].category == 'national park') {
                   nationalpark += 1;
                }
                else if (place[j].category == 'public park') {
                   publicpark += 1;
                }
                  console.log(beach,zoo,temple,market,museum,amusementpark,departmentstore,nationalpark,publicpark);
              }
          }
    				console.log('countFav');
        });
      });
    }

    exports.countInterest = function(req){
      mongo.connect(connection, (error, database) => {
        database.collection('member').find({username : `${req.body.username}`}).toArray((error, result) => {
          var beach = 0;
          var zoo = 0;
          var temple = 0;
          var market = 0;
          var museum = 0;
          var amusementpark = 0;
          var departmentstore = 0;
          var nationalpark = 0;
          var publicpark = 0;

          for(var i = 0; i < result.length; i++) {
            var interest = result[i].interest
            console.log('member :' , result[i].username);
              for(var j = 0; j < interest.length; j++) {
                console.log('category :' , interest[j]);

                if(interest[j] == 'beach'){
                   beach += 1;
                }
                else if (interest[j] == 'zoo') {
                   zoo += 1;
                }
                else if (interest[j] == 'temple') {
                   temple += 1;
                }
                else if (interest[j] == 'market') {
                   market += 1;
                }
                else if (interest[j] == 'museum') {
                   museum += 1;
                }
                else if (interest[j] == 'amusement park') {
                   amusementpark += 1;
                }
                else if (interest[j] == 'department store') {
                   departmentstore += 1;
                }
                else if (interest[j] == 'national park') {
                   nationalpark += 1;
                }
                else if (interest[j] == 'public park') {
                   publicpark += 1;
                }
                  console.log(beach,zoo,temple,market,museum,amusementpark,departmentstore,nationalpark,publicpark);
              }
          }

    				console.log('countInterest');

        });
      });
    }

    exports.counttrip = function(req){
      mongo.connect(connection, (error, database) => {
        database.collection('trip').find({name : `${req.body.name}`}).toArray((error, result) => {
          var beach = 0;
          var zoo = 0;
          var temple = 0;
          var market = 0;
          var museum = 0;
          var amusementpark = 0;
          var departmentstore = 0;
          var nationalpark = 0;
          var publicpark = 0;

          for(var i = 0; i < result.length; i++) {
            var place = result[i].place
            console.log('trip :' , result[i].name);
              for(var j = 0; j < place.length; j++) {
                console.log('category :' , place[j].category);

                if(place[j].category == 'beach'){
                   beach += 1;
                }
                else if (place[j].category == 'zoo') {
                   zoo += 1;
                }
                else if (place[j].category == 'temple') {
                   temple += 1;
                }
                else if (place[j].category == 'market') {
                   market += 1;
                }
                else if (place[j].category == 'museum') {
                   museum += 1;
                }
                else if (place[j].category == 'amusement park') {
                   amusementpark += 1;
                }
                else if (place[j].category == 'department store') {
                   departmentstore += 1;
                }
                else if (place[j].category == 'national park') {
                   nationalpark += 1;
                }
                else if (place[j].category == 'public park') {
                   publicpark += 1;
                }
                  console.log(beach,zoo,temple,market,museum,amusementpark,departmentstore,nationalpark,publicpark);
              }
          }

    				console.log('counttrip');

        });
      });
    }
