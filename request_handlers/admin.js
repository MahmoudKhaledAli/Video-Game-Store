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
      connection.release();
      console.log(rows[0].datecreated);
      res.render('../static/users.ejs', { users: rows });
    });
  });
};

var viewOrders = function(req, res) {
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    connection.query("SELECT * FROM `games`.`order` INNER JOIN product On `games`.`order`.idproduct = product.idproduct ORDER BY datecreated DESC, idorder",
    function(err, rows) {
      console.log(err);
      orders = [];
      orders.push({});
      if (rows.length == 0) {
        res.render('../static/orders.ejs', { orders: []} );
        return;
      }
      orders[0].idorder = rows[0].idorder;
      orders[0].status = rows[0].status;
      orders[0].username = rows[0].username;
      orders[0].datecreated = rows[0].datecreated;
      orders[0].total = rows[0].total
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
          orders[orders.length - 1].total = rows[i].total;
          orders[orders.length - 1].items = [{idproduct: rows[i].idproduct, name: rows[i].name, quantity: rows[i].quantity}];
        }
      }
      console.log(orders[0].items);
      connection.release();
      res.render('../static/orders.ejs', { orders: orders });
    });
  });
};

var updateOrder = function(req, res) {
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    connection.query("UPDATE `games`.`order` SET status = ? WHERE idorder = ?",
    [req.query.newStatus, req.query.idorder],
    function(err, rows) {
      console.log(err);
      connection.release();
      res.end()
    });
  });
};

module.exports = {
  viewUsers: viewUsers,
  viewOrders: viewOrders,
  updateOrder: updateOrder,
}
