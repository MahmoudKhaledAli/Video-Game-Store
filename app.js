/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var path = require('path');
var handlers = require('./request_handlers');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/static'));
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.use(sessions({
  cookieName: 'userSession', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

// serve the index page
app.get('/', handlers.homepage);
app.get('/registration', function(req, res) {
	res.render(path.join(__dirname + '/static/register.ejs'), { message: "" });
});

//Application routes
app.post('/register', handlers.register);
app.post('/login', handlers.login);
app.get('/users', handlers.viewUsers);
app.get('/logout', handlers.logout);
app.get('/banuser', handlers.ban);
app.get('/orders', handlers.viewOrders);
app.get('/myorders', handlers.myOrders);

// start server on the specified port and binding host
app.listen('8000', '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on 8000");
});
