var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';

 exports.uploadForm = (form, name) => {
   console.log('form:', form);
   console.log('name:',form);
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name

  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    console.log(file);
    mongo.connect(connection, (err, database) => {
			database
			.collection('member')
			.update({username: 'yuto' },
			{ $set : {
			picture:"`${file.name}`"
			}
			});
   		  });
  });

}
