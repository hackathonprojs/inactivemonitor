var http = require('http');

var request = require('request');

var blockUrlTemplate = 'https://blockchain.info/block-height/{block-height}?format=json';

var endBlockHeight = 520363;
let numBlock = 10; // number of blocks to retrieve
var startBlockHeight = endBlockHeight - numBlock;
let currBlockHeight = startBlockHeight;

// for (let currBlockHeight = startBlockHeight; currBlockHeight < endBlockHeight; currBlockHeight++) {
//   retrieveBlockInfo(currBlockHeight);
// }



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
  }

  request(options, callback);

}
