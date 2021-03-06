var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://admin:admin@ds143081.mlab.com:43081/bagpao';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    console.log(file.name);
    mongo.connect(connection, (err, database) => {
      if(req.body.table == 'member'){
        database
  			.collection('member')
  			.update({username: req.body.name },
  			{ $set : {
  			picture: "http://localhost:1200/"+`${file.name}`
  			}
  			});
      }
      else if (req.body.table == 'trip') {
        database.collection('trip').update({name: req.body.name },
  			{ $set : {
  			picture:"http://localhost:1200/"+`${file.name}`
  			}
  			});
        }
    });
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
