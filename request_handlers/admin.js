var sqlConnector = require('./sqlConnector.js');
var ejs = require('ejs');
var path = require('path');

var viewUsers = function(req, res) {
  console.log(req.body);
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    connection.query("SELECT * FROM user",
    function(err, rows) {
      console.log(err);
      console.log(rows[0]);
        res.render('../static/users.ejs', { users: rows })
    });
  });
};

module.exports = {
  viewUsers: viewUsers
}
