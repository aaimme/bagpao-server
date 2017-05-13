"use strict";
let mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
let connection = 'mongodb://localhost:27017/bagpaotravel';
var resemblance = require('resemblance');
var knn = require('alike');

    exports.multiply = function(result_obj){
  //    console.log("before",result_obj.beach,result_obj);
      result_obj.beach = result_obj.beach*2
      result_obj.zoo = result_obj.zoo*2
      result_obj.temple = result_obj.temple*2
      result_obj.market = result_obj.market*2
      result_obj.museum = result_obj.museum*2
      result_obj.amusementpark = result_obj.amusementpark*2
      result_obj.departmentstore = result_obj.departmentstore*2
      result_obj.nationalpark = result_obj.nationalpark*2
      result_obj.publicpark = result_obj.publicpark*2
  //    console.log("after",result_obj.beach,result_obj);
      return result_obj;
    }

    exports.addition = function(a , b){
      a.beach = a.beach + b.beach
      a.zoo = a.zoo + b.zoo
      a.temple = a.temple + b.temple
      a.market = a.market + b.market
      a.museum = a.museum + b.museum
      a.amusementpark = a.amusementpark + b.amusementpark
      a.departmentstore = a.departmentstore + b.departmentstore
      a.nationalpark = a.nationalpark + b.nationalpark
      a.publicpark = a.publicpark + b.publicpark
      return a;
    }

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

    exports.countLike = function(req , callback){
      var result_obj = {
         beach : 0,
         zoo : 0,
         temple : 0,
         market : 0,
         museum : 0,
         amusementpark : 0,
         departmentstore : 0,
         nationalpark : 0,
         publicpark : 0
      }
      mongo.connect(connection, (error, database) => {
        database.collection('trip').find({liker : `${req.body.username}`}).toArray((error, result) => {

          for(var i = 0; i < result.length; i++) {
            var place = result[i].place
          //  console.log('trip :' , result[i].name);
              for(var j = 0; j < place.length; j++) {
          //      console.log('category :' , place[j].category);

                if(place[j].category == 'beach'){
                   result_obj.beach += 1;
                }
                else if (place[j].category == 'zoo') {
                   result_obj.zoo += 1;
                }
                else if (place[j].category == 'temple') {
                   result_obj.temple += 1;
                }
                else if (place[j].category == 'market') {
                   result_obj.market += 1;
                }
                else if (place[j].category == 'museum') {
                   result_obj.museum += 1;
                }
                else if (place[j].category == 'amusement park') {
                   result_obj.amusementpark += 1;
                }
                else if (place[j].category == 'department store') {
                   result_obj.departmentstore += 1;
                }
                else if (place[j].category == 'national park') {
                   result_obj.nationalpark += 1;
                }
                else if (place[j].category == 'public park') {
                   result_obj.publicpark += 1;
                }
              }
          }
            callback(undefined, result_obj);
    				console.log('countLike');

        });
      });
    }

    exports.countFav = function(req , callback){
      var result_obj = {
         beach : 0,
         zoo : 0,
         temple : 0,
         market : 0,
         museum : 0,
         amusementpark : 0,
         departmentstore : 0,
         nationalpark : 0,
         publicpark : 0
      }
      mongo.connect(connection, (error, database) => {
        database.collection('trip').find({favorite : `${req.body.username}`}).toArray((error, result) => {
          for(var i = 0; i < result.length; i++) {
            var place = result[i].place
        //    console.log('trip :' , result[i].name);
              for(var j = 0; j < place.length; j++) {
        //        console.log('category :' , place[j].category);

                if(place[j].category == 'beach'){
                   result_obj.beach += 1;
                }
                else if (place[j].category == 'zoo') {
                   result_obj.zoo += 1;
                }
                else if (place[j].category == 'temple') {
                   result_obj.temple += 1;
                }
                else if (place[j].category == 'market') {
                   result_obj.market += 1;
                }
                else if (place[j].category == 'museum') {
                   result_obj.museum += 1;
                }
                else if (place[j].category == 'amusement park') {
                   result_obj.amusementpark += 1;
                }
                else if (place[j].category == 'department store') {
                   result_obj.departmentstore += 1;
                }
                else if (place[j].category == 'national park') {
                   result_obj.nationalpark += 1;
                }
                else if (place[j].category == 'public park') {
                   result_obj.publicpark += 1;
                }
              }
          }
          callback(undefined, result_obj);
    				console.log('countFav');
        });
      });
    }

    exports.countInterest = function(req, callback){
      var result_obj = {
         beach : 0,
         zoo : 0,
         temple : 0,
         market : 0,
         museum : 0,
         amusementpark : 0,
         departmentstore : 0,
         nationalpark : 0,
         publicpark : 0
      }
      mongo.connect(connection, (error, database) => {
        database.collection('member').find({username : `${req.body.username}`}).toArray((error, result) => {

          for(var i = 0; i < result.length; i++) {
            var interest = result[i].interest
        //    console.log('member :' , result[i].username);
              for(var j = 0; j < interest.length; j++) {
          //      console.log('category :' , interest[j]);

                if(interest[j] == 'beach'){
                   result_obj.beach += 1;
                }
                else if (interest[j] == 'zoo') {
                   result_obj.zoo += 1;
                }
                else if (interest[j] == 'temple') {
                   result_obj.temple += 1;
                }
                else if (interest[j] == 'market') {
                   result_obj.market += 1;
                }
                else if (interest[j] == 'museum') {
                   result_obj.museum += 1;
                }
                else if (interest[j] == 'amusement park') {
                   result_obj.amusementpark += 1;
                }
                else if (interest[j] == 'department store') {
                   result_obj.departmentstore += 1;
                }
                else if (interest[j] == 'national park') {
                   result_obj.nationalpark += 1;
                }
                else if (interest[j] == 'public park') {
                   result_obj.publicpark += 1;
                }

              }
          }
          callback(undefined, result_obj);
    				console.log('countInterest');

        });

      });
    }

     exports.updateTableUser = function(req ,result_obj) {
    //   console.log("update",result_obj);
      mongo.connect(connection, (error, database) => {
        database.collection('usertable').update({username : `${req.body.username}`},{
          $set: {
            beach : result_obj.beach,
            zoo : result_obj.zoo,
            temple : result_obj.temple,
            market : result_obj.market,
            museum : result_obj.museum,
            amusementpark : result_obj.amusementpark,
            departmentstore : result_obj.departmentstore,
            nationalpark : result_obj.nationalpark,
            publicpark : result_obj.publicpark
          }
        });
      });
    }


    exports.counttrip = function(req){
      var name = `${req.body.name}`;
      mongo.connect(connection, (error, database) => {
        database.collection('trip').find({name : name}).toArray((error, result) => {
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
    //        console.log('trip :' , result[i].name);
              for(var j = 0; j < place.length; j++) {
        //        console.log('category :' , place[j].category);

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

              }
          }
    				console.log('counttrip');

            database.collection('triptable').update({name : name},{
              $set: {
                beach : beach,
                zoo : zoo,
                temple : temple,
                market : market,
                museum : museum,
                amusementpark : amusementpark,
                departmentstore : departmentstore,
                nationalpark : nationalpark,
                publicpark : publicpark
              }
            });

        });
      });
    }

    var userTable = function (req , callback) {
      mongo.connect(connection, (error, database) => {
        database.collection('usertable').find({username : `${req.body.username}`}).toArray((error, result) => {
          callback(undefined,result);
        });
      });
    }

    var tripTable = function (req ,callback) {
      mongo.connect(connection, (error, database) => {
        database.collection('triptable').find({}).toArray((error, result) => {
          callback(undefined,result);
        });
      });
    }

    var weights = {
      username : 0,
      name : 0,
      beach : 1,
      zoo : 1,
      temple : 1,
      market : 1,
      museum : 1,
      amusementpark : 1,
      departmentstore : 1,
      nationalpark : 1,
      publicpark : 1
    };

    exports.recommendUser = function(req ,callback){
      userTable(req, (error, result) => {
      if (error) {
        console.log(error);
        var error_obj = {
          'message' : `${error}`
        }
        }
      else {
         var user = []
         for(var i = 0; i < result.length; i++) {
           var result_obj = {
             'username' : result[i].username,
             'beach' : result[i].beach,
             'zoo' : result[i].zoo,
             'temple' : result[i].temple,
             'market' : result[i].market,
             'museum' : result[i].museum,
             'amusementpark' : result[i].amusementpark,
             'departmentstore' : result[i].departmentstore,
             'nationalpark' : result[i].nationalpark,
             'publicpark' : result[i].publicpark
           }
           user[i] = result_obj
         }
    //     console.log("user",user);

         tripTable(req, (error, result) => {
         if (error) {
           console.log(error);
           var error_obj = {
             'message' : `${error}`
           }
           }
         else {
            var results = []
            for(var i = 0; i < result.length; i++) {
              var result_obj = {
                'name' : result[i].name,
                'beach' :result[i].beach,
                'zoo' : result[i].zoo,
                'temple' : result[i].temple,
                'market' : result[i].market,
                'museum' : result[i].museum,
                'amusementpark' : result[i].amusementpark,
                'departmentstore' : result[i].departmentstore,
                'nationalpark' : result[i].nationalpark,
                'publicpark' : result[i].publicpark
              }
              results[i] = result_obj
            }
        //   console.log("trip",results);
            var reccommenduser = resemblance.getSimilar(user, results, weights, 0.5);
            console.log("reccommenduser",reccommenduser);
            var triprecommend = [];
            for(var i = 0; i < 5 ; i++){
              var trip_obj = {
                "i" : i,
                "resemblance" : reccommenduser[i].resemblance,
                "name" : reccommenduser[i].obj.name
              }
              triprecommend[i] = trip_obj
            }

            console.log(triprecommend);
            var trip1 = triprecommend[0].name;
            var trip2 = triprecommend[1].name;
            var trip3 = triprecommend[2].name;
            console.log(trip1,trip2,trip3);
            mongo.connect(connection, (error, database) => {
              database.collection('trip').find({$or: [   {name : trip1},{name : trip2},{name : trip3} ]}).toArray((error, result) => {
                callback(undefined,result);
              });
            });
         }
         });
      }
      });

    }
