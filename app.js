/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var path = require('path');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// serve the index page
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

// start server on the specified port and binding host
app.listen('8000', '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on 8000");
});
