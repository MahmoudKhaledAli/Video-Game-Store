var sqlConnector = require('./sqlConnector.js');
var ejs = require('ejs');
var path = require('path');

var register = function(req, res) {
  console.log(req.body);
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    connection.query("Insert into user values (?, ?, ?, ?)",
    [req.body.username, req.body.password, req.body.email, req.body.address],
    function(err, rows) {
      console.log(err);
        renderHomePage(req, res, connection);
    });
  });
};

var login = function(req, res) {
  console.log(req.body);
  if (req.body.username == 'Admin' && req.body.password == 'password') {
    req.userSession.username = 'Admin';
    res.sendFile(path.resolve(__dirname+'/../static/admin.html'));
    return;
  }
  sqlConnector.getConnection(function(err, connection) {
    connection.query("Select username, password FROM user WHERE username = ? and password = ?",
    [req.body.username, req.body.password],
    function(err, rows) {
      if (rows.length == 0) {
        res.render('../static/register.ejs', { message: "Incorrect Username and/or Password"});
      } else {
        req.userSession.username = req.body.username;
        renderHomePage(req, res, connection);
      }
    });
  });
};

function renderHomePage(req, res, connection) {
  console.log(req.userSession)
  connection.query("SELECT * FROM product ORDER BY sales DESC", function(err, rows) {
      if (req.userSession.username) {
        res.render('../static/home.ejs', { username: req.userSession.username, sellers: rows });
      } else {
        res.render('../static/home.ejs', { username: 'Guest', sellers: rows });
      }
      connection.release()
  });
}

var homepage = function(req, res) {
  sqlConnector.getConnection(function(err, connection) {
    renderHomePage(req, res, connection);
  });
};

var logout = function(req, res) {
  req.userSession.destroy();
  sqlConnector.getConnection(function(err, connection) {
    renderHomePage(req, res, connection);
  });
};

module.exports = {
  register: register,
  login: login,
  homepage: homepage,
  logout: logout,
}
