/**
 * go to database and do an aggregate to group data by date.
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

  aggregate(dbo, function() {

  });

});

var aggregate = function(dbo, callback) {
  var collection = dbo.collection('last_tx_time');

  collection.aggregate([{"$group" : {_id:"$last_tx_time", count:{$sum:1}}}])
    .toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs)
      callback(docs);
  });
}

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
