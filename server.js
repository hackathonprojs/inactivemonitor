var express = require('express')
var app = express()

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var dbs = "inactivemonitor";
var url = 'mongodb://localhost:27017/';

let dbo;
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  dbo = db.db(dbs);

});

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

app.get('/groupbytime', function (req, res) {

  aggregate(dbo, function(docs) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(docs));
  });
})

app.use(express.static('public'));

app.listen(8000, function () {
  console.log('listening on port 8000!')
})


//========================


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
