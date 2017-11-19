var sqlConnector = require('./sqlConnector.js');
var ejs = require('ejs');

var register = function(req, res) {
  console.log(req.body);
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    connection.query("Insert into user values (?, ?, ?, ?, ?)",
    [req.body.username, req.body.password, req.body.email, new Date(), req.body.address],
    function(err, rows) {
        res.render('../static/index.ejs', { username: req.body.username});
        connection.release();
    });
  });
};

var login = function(req, res) {
  console.log(req.body);
  sqlConnector.getConnection(function(err, connection) {
    connection.query("Select username, password FROM user WHERE username = ? and password = ?",
    [req.body.username, req.body.password],
    function(err, rows) {
      console.log(rows);
      if (rows.length == 0) {
        res.render('../static/register.ejs', { message: "Incorrect Username and/or Password"});
      } else {
        req.userSession.username = req.body.username;
        res.render('../static/index.ejs', { username: req.userSession.username});
      }
      connection.release();
    });
  });
};

var homepage = function(req, res) {
  if (req.userSession) {
    res.render('../static/index.ejs', { username: req.userSession.username});
  } else {
    res.render('../static/index.ejs', { username: 'Guest'});
  }
}

module.exports = {
  register: register,
  login: login,
  homepage: homepage
}
