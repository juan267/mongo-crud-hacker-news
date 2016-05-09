var mongoClient = require('mongodb').MongoClient
var assert = require('assert')

function PostDAO(database) {
  'use strict';

  var posts = [
    {
      title: "Hola soy un post",
      body: "Body del post",
      author: "Juan gomez",
      created_at: new Date(),
      votes: 1
    },
    {
      title: "Hola soy el segundo Post",
      body: "Body del post",
      author: "Carolina Hernandez",
      created_at: new Date(),
      votes: 1
    }
  ]

  this.db = database

  this.getAllPosts = function(callback) {
    this.db.collection('posts').find().toArray(function(err, results){
      assert.equal(null, err)
      var posts = results
      callback(posts)
    })
  }

  this.insertMany = function(){
    this.db.collection('posts').insertMany(posts)
  }

  this.seedCollection = function(callback) {
    this.db.collection('posts').count(function(err, result){
      callback(result)
    })
  }
}

module.exports.PostDAO = PostDAO;
