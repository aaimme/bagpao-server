var express = require('express')
var multer  = require('multer')
var fs = require('fs')
var upload = multer({ dest: 'uploadsssss/' })

var app = express()

app.post('/profile', upload.single('pic'), function (req, res, next) {
  console.log(req.file);
  console.log(req.body);
  if (req.file) {
    fs.rename(`uploadsssss/${req.file.filename}`, `uploadsssss/${req.file.originalname}`, function(err) {
      if ( err ) console.log('ERROR: ' + err);
    });
  }
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});

app.listen(3001, function(){
  console.log('Server listening on port 3001');
});
