var express = require('express') // Express Framework
var engines = require('consolidate') // Helps us set the templating engine 'nunjucks'
var mongoClient = require('mongodb').MongoClient // The Mongodb Driver
var assert = require('assert') // Assertion library to cath errors
var bodyParser = require('body-parser') // Middleware to parse url parameters
var PostDAO  = require('./post').PostDAO
var app = express() // Express app


app.engine('html', engines.nunjucks); // Set nunjucks as the templating engine to work on documents ending with the extension html
app.set('view engine', 'html') // Only use nunjucks on file ending with html
app.set('views', __dirname + '/views') // Where to find the view files
app.use('/static', express.static(__dirname + '/static')); // Use static files
app.use(bodyParser.urlencoded({extended: true})) // Url parser configuration

var databaseName = 'hacker-news' // Set to the mondodb database to be use

mongoClient.connect('mongodb://localhost:27017/'+databaseName, function(err, db){
  assert.equal(null, err);
  console.log('Successfully connected to mongodb database')

  // MODELS ***********************************
  var post = new PostDAO(db)
  post.seedCollection(function(count){
    if (count === 0) {
      post.insertMany()
    }
  })

  // ROUTES ***********************************

  app.get('/', function(req, res){

    post.getAllPosts(function(posts){
      res.render('index', {posts: posts})
    })
  })




  // Error Handling and Start running server
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

