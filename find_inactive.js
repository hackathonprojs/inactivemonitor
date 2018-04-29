/**
 * go to database and find the address with tx time older than certain date.
 */

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var dbs = "inactivemonitor";
var url = 'mongodb://localhost:27017/';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  var dbo = db.db(dbs);

  findAllDocuments(dbo, function() {
    findDocuments(dbo, function() {
        db.close();
    })
  });

});


var findAllDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('last_tx_time');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('last_tx_time');
  // Find some documents
  collection.find({ "last_tx_time": {$lt: 1524970234 } }).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
}
