var express = require('express')
var app = express()

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

app.use(express.static('public'));

app.listen(8000, function () {
  console.log('listening on port 8000!')
})
