var express = require('express') // Express Framework
var engines = require('consolidate') // Helps us set the templating engine 'nunjucks'
var mongoClient = require('mongodb').MongoClient // The Mongodb Driver
var assert = require('assert') // Assertion library to cath errors
var bodyParser = require('body-parser') // Middleware to parse url parameters
var app = express() // Express app


app.engine('html', engines.nunjucks); // Set nunjucks as the templating engine to work on documents ending with the extension html
app.set('view engine', 'html') // Only use nunjucks on file ending with html
app.set('views', __dirname + '/views') // Where to find the view files
app.use(bodyParser.urlencoded({extended: true})) // Url parser configuration

mongoClient.connect('mongodb://localhost:27017/hacker-news', function(err, db){
  assert.equal(null, err);
  console.log('Succesfully connected to mongodb database')

  app.use(errorHandler)

  function errorHandler(err, req, res, next) {
      console.error(err.message);
      console.error(err.stack);
      res.status(500).render('errorTemplate', { error: err });
  }

  var server = app.listen(3000, function(){
    var port = server.address().port
     console.log('Express server listening on port %s.', port);
  })
})
