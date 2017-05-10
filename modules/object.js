"use strict";
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function decrypt(text){
      var decipher = crypto.createDecipher(algorithm,password)
      var dec = decipher.update(text,'hex','utf8')
      dec += decipher.final('utf8');
      return dec;
    }

    var showtype = (error, result) => {
        if (error) {
          console.log(error);
          var error_obj = {
            'message' : `${error}`
          }
          res.json(error_obj);
        }
        else {
          res.json(result);
        }
      }


      var profile = (error, result) => {
      if (error) {
        console.log(error);
        var error_obj = {
          'message' : `${error}`
        }
        res.json(error_obj);
        }
      else {
         var results = []
         for(var i = 0; i < result.length; i++) {
           var result_obj = {
             '_id' : result[i].id,
             'username' : result[i].username,
             'password' : decrypt(result[i].password),
             'email' : result[i].email,
             'birthday' : result[i].birthday,
             'currentcity' : result[i].currentcity,
             'interest' : result[i].interest,
             'bio' : result[i].bio,
             'picture' : result[i].picture
           }
           results[i] = result_obj
         }
        res.json(results);
      }
      }
