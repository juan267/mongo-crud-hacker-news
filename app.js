var express = require('express') // Express Framework
var engines = require('consolidate') // Helps us set the templating engine 'nunjucks'
var mongoClient = require('mongodb').MongoClient // The Mongodb Driver
var assert = require('assert') // Assertion library to cath errors
var bodyParser = require('body-parser') // Middleware to parse url parameters
var app = express() // Express app


app.engine('html', engines.nunjucks); // Set nunjucks as the templating engine to work on documents ending with the extension html
app.set('view engine', 'html') // Only use nunjucks on file ending with html
app.set('views', __dirname + '/views') // Where to find the view files
app.use(bodyParser.urlenconded({extended: true})) // Url parser configuration


