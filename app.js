var express = require('express') // Express Framework
var engines = require('consolidate') // Helps us set the templating engine 'nunjucks'
var mongoClient = require('mongodb').MongoClient // The Mongodb Driver
var assert = require('assert') // Assertion library to cath errors
var bodyParser = require('body-parser') // Middleware to parse url parameters
var PostDAO  = require('./post').PostDAO
var UserDAO = require('./user').UserDAO
var mongoose = require('mongoose');
var app = express() // Express app

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

console.log('Enviroment', process.argv[2])

app.engine('html', engines.nunjucks); // Set nunjucks as the templating engine to work on documents ending with the extension html
app.set('view engine', 'html') // Only use nunjucks on file ending with html
app.set('views', __dirname + '/views') // Where to find the view files
app.use('/static', express.static(__dirname + '/static')); // Use static files
app.use(bodyParser.urlencoded({extended: true})) // Url parser configuration


if (process.argv[2] == 'production') {
  var mongoAddress = "mongodb://heroku_mhh9gqnm:41m182bd1mnlv9mhfreu8di60m@ds021182.mlab.com:21182/heroku_mhh9gqnm"
} else {
  var mongoAddress = 'mongodb://localhost:27017/'+databaseName
};

var databaseName = 'hacker-news' // Set to the mondodb database to be use
mongoose.connect(mongoAddress);

mongoClient.connect(mongoAddress, function(err, db){
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

  // INDEX
  app.get('/', function(req, res){
    post.getAllPosts(function(posts){
      res.render('index', {posts: posts, user: req.user, message: req.flash('message')})
    })
  })

  // CREATE POST
  app.post('/posts', function(req, res){
    var title = req.body.title
    var author = req.body.author
    var url = req.body.url
    post.addPost(title, author, url, function(postDoc){
      // postDoc.ops[0].index = parseInt(req.body.index) + 1
      post.getAllPosts(function(posts){
        res.render('_post', {posts: posts})
      })
    })
  })

  // EDIT POST
  app.get('/posts/:id/edit', function(req, res){
    var id = req.params.id
    post.getPost(id, function(postDoc){
      res.render('edit', {post: postDoc})
    })
  })

  // UPDATE POST
  app.post('/posts/:id/update', function(req, res){
    var id = req.params.id
    var title = req.body.title
    var author = req.body.author
    var url = req.body.url
    post.updatePost(id, title, author, url, function(postDoc){
      res.redirect('/')
    })
  })

  // DELETE POST
  app.get('/posts/:id/delete', function(req, res){
    var id = req.params.id
    post.deletePost(id, function(postDoc){
      post.getAllPosts(function(posts){
        res.render('_post', {posts: posts})
      })
    })
  })

  // CREATE VOTE
  app.get('/posts/:id/votes', function(req, res){
    var id = req.params.id
    post.addPostVote(id, function(postDoc){
      post.getPost(id, function(postDoc){
        res.setHeader('Content-type', 'application/json')
        res.send(JSON.stringify(postDoc))
      })
    })
  })

  // NEW LOGIN
  app.get('/login', function(req, res){
    res.render('login', {message: req.flash("message")})
  })

  //CREATE SESSION
  app.post('/login', passport.authenticate('login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash : true
  }));

  // DELETE SESSION
  app.get('/logout', function(req, res){
    req.logout()
    res.redirect('/');
  })

  // NEW USER
  app.get('/signup', function(req, res){
    res.render('signup',{message: req.flash("message")})
  })

  // CREATE USER
  app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash : true
  }))


  // Error Handling and Start running server
  app.use(errorHandler)

  function errorHandler(err, req, res, next) {
      console.error(err.message);
      console.error(err.stack);
      res.status(500).render('errorTemplate', { error: err });
  }

  var server = app.listen(process.env.PORT || 3000, function(){
    var port = server.address().port
     console.log('Express server listening on port %s.', port);
  })
})

