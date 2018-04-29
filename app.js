var http = require('http');

var request = require('request');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


var blockUrlTemplate = 'https://blockchain.info/block-height/{block-height}?format=json';

var endBlockHeight = 520363;
let numBlock = 1; // number of blocks to retrieve
var startBlockHeight = endBlockHeight - numBlock;
let currBlockHeight = startBlockHeight;

// Connection URL
var dbs = "inactivemonitor";
var url = 'mongodb://localhost:27017/';
let dbo;
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  dbo = db.db(dbs);
  // insertDocuments(dbo, function() {
  //   findAllDocuments(dbo, function() {
  //     findDocuments(dbo, function() {
  //         db.close();
  //     })
  //   });
  // });
  let lastTxTime = dbo.collection('last_tx_time');
  // create unique index.  don't do this anymore.
  //lastTxTime.createIndex( { "addr": 1 }, { unique: true } );
});


setInterval(incrementBlockHeight, 1000);

function incrementBlockHeight() {
    if (currBlockHeight < endBlockHeight) {
      retrieveBlockInfo(currBlockHeight);
      currBlockHeight++;
    }
}

function retrieveBlockInfo(blockHeight) {

  var blockUrl = blockUrlTemplate.replace("{block-height}", blockHeight);

  console.log("get block: " + blockUrl);

  // request(blockUrl, function (error, response, body) {
  //   console.log('error:', error); // Print the error if one occurred
  //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //   console.log('body:', body); // Print the HTML for the Google homepage.
  // });

  var options = {
    url: blockUrl,
    headers: {
      'User-Agent': 'request'
    }
  };

  function callback(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.

    let bodyObj = JSON.parse(body);
    let blocks = bodyObj.blocks; // array
    let block = blocks[0];
    let blockTime = block.time; // block time.  using this instead of received_time
    let txs = block.tx; // array
    for (let i = 0; i < txs.length; i++) {
      let tx = txs[i];
      let outs = tx.out; // array
      for (let outIdx = 0; outIdx < outs.length; outIdx++) {
        let out = outs[outIdx];
        if (typeof out.addr !== "undefined") {
          let addr = out.addr;

          // write addr, blockTime to the db.
          let writeObj = {
            "_id": addr,
            "last_tx_time": blockTime,
          }

          insertLastTxTime(dbo, writeObj, function(result) {
            console.log("write obj: ", result);
          });
        }
      }
    }
  }

  request(options, callback);

}




var insertLastTxTime = function(db, obj, callback) {
  // Get the documents collection
  var collection = db.collection('last_tx_time');
  console.log("adding last_tx_time: ", obj);
  // Insert some documents
  collection.replaceOne({"_id": obj._id}, obj, {upsert: true}, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted last_tx_time into the collection: ", obj);
    callback(result);
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

var findDocumentsByAddr = function(db, addr, callback) {
  // Get the documents collection
  var collection = db.collection('last_tx_time');
  // Find some documents
  collection.find({'addr': addr}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records from addr: ", addr);
    console.log(docs);
    callback(docs);
  });
}
