var sqlConnector = require('./sqlConnector.js');
var ejs = require('ejs');
var path = require('path');

var register = function(req, res) {
  console.log(req.body);
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    connection.query("SELECT * FROM user WHERE username = ?",
    [req.body.username],
    function(err, rows) {
      if (rows.length == 0) {
        connection.query("SELECT * FROM user WHERE email = ?",
        [req.body.email],
        function(err, rows) {
          if (rows.length == 0) {
            connection.query("Insert into user values (?, ?, ?, ?, ?, ?)",
            [req.body.username, req.body.password, req.body.email, req.body.address, 0, new Date()],
            function(err, rows) {
              console.log(err);
              req.userSession.username = req.body.username;
              connection.release();
              res.send('2');
            });
          } else {
            connection.release();
            res.send('1');
          }
        });
      } else {
        connection.release();
        res.send('0');
      }
    });

  });
};

var login = function(req, res) {
  console.log(req.body);
  if (req.body.username == 'Admin' && req.body.password == 'password') {
    req.userSession.username = 'Admin';
    res.send('2');
    return;
  }
  sqlConnector.getConnection(function(err, connection) {
    connection.query("Select username, password, banned FROM user WHERE username = ? and password = ?",
    [req.body.username, req.body.password],
    function(err, rows) {
      console.log(rows);
      if (rows.length == 0) {
        connection.release();
        res.send('0');
      } else if (rows[0].banned != 0) {
        connection.release();
        res.send('1');
      } else {
        req.userSession.username = req.body.username;
        connection.release();
        res.send('2');
      }
    });
  });
};

function renderHomePage(req, res, connection) {
  console.log(req.userSession)
  connection.query("SELECT * FROM product ORDER BY sales DESC", function(err, rows) {
      if (!req.userSession.username) {
        res.render('../static/home.ejs', { username: 'Guest', sellers: rows });
      } else if (req.userSession.username != 'Admin') {
        res.render('../static/home.ejs', { username: req.userSession.username, sellers: rows });
      } else {
        res.sendFile(path.resolve(__dirname+'/../static/admin.html'));
      }
      connection.release();
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

var ban = function(req, res) {
  console.log(req.query.username);
  sqlConnector.getConnection(function(err, connection) {
    connection.query("UPDATE user SET banned = banned ^ 1 WHERE username = ?",
    [req.query.username],
    function() {
      console.log('heere');
      connection.release();
      res.end();
    })
  });
}

var account = function(req, res) {
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    connection.query("SELECT * FROM `games`.`order` INNER JOIN product On `games`.`order`.idproduct = product.idproduct WHERE username = ? ORDER BY datecreated DESC, idorder",
    [req.userSession.username],
    function(err, rows) {
      console.log(err);
      orders = [];
      orders.push({});
      orders[0].idorder = rows[0].idorder;
      orders[0].status = rows[0].status;
      orders[0].username = rows[0].username;
      orders[0].datecreated = rows[0].datecreated;
      orders[0].items = [];
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].idorder == orders[orders.length - 1].idorder) {
          orders[orders.length - 1].items.push({idproduct: rows[i].idproduct, name: rows[i].name, quantity: rows[i].quantity});
        } else {
          orders.push({});
          orders[orders.length - 1].idorder = rows[i].idorder;
          orders[orders.length - 1].status = rows[i].status;
          orders[orders.length - 1].username = rows[i].username;
          orders[orders.length - 1].datecreated = rows[i].datecreated;
          orders[orders.length - 1].items = [{idproduct: rows[i].idproduct, name: rows[i].name, quantity: rows[i].quantity}];
        }
      }
      console.log(orders[0].items);
      connection.query("SELECT address FROM user WHERE username = ?",
      [req.userSession.username],
      function(err, rows) {
        console.log(err);
        console.log(rows[0]);
        connection.release();
        res.render('../static/account.ejs', { orders: orders, username: req.userSession.username, address: rows[0].address });
      });
    });
  });
};

var updateAddress = function(req, res) {
  sqlConnector.getConnection(function(err, connection) {
    connection.query("UPDATE user SET address = ? WHERE username = ?",
    [req.body.address, req.userSession.username],
    function() {
      connection.release();
      res.end();
    })
  });
};

module.exports = {
  register: register,
  login: login,
  homepage: homepage,
  logout: logout,
  ban: ban,
  account: account,
  updateAddress: updateAddress,
}
