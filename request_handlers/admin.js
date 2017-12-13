var sqlConnector = require('./sqlConnector.js');
var ejs = require('ejs');
var path = require('path');

var viewUsers = function(req, res) {
  if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
  console.log(req.body);
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    connection.query("SELECT * FROM user",
    function(err, rows) {
      console.log(err);
      console.log(rows[0]);
      connection.release();
      res.render('../static/users.ejs', { users: rows });
    });
  });
};

var viewOrders = function(req, res) {
  if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
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
      connection.release();
      res.render('../static/orders.ejs', { orders: orders });
    });
  });
};

var updateOrder = function(req, res) {
  if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
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

var addCoupon = function(req, res) {
  // console.log(req.body);
  if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
  sqlConnector.getConnection(function(err, connection) {
    connection.query("INSERT INTO coupon (idcoupon, discount, amount) values (?, ?, ?)",
    [req.body.name, req.body.discnt, req.body.amnt],
    function(err, rows) {
      console.log(err);
      if (err) {
        connection.release();
        res.send('0');
        return;
      }
      connection.release();
      res.send('1');
    });
  });
};

var addCouponPage = function(req, res) {
  if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
  sqlConnector.getConnection(function(err, connection) {
		connection.query("SELECT * FROM coupon",
		function (err, rows) {
			console.log(rows);
      res.render('../static/addcoupon.ejs', {coupons: rows})
			connection.release();
			res.end();
		});
	});
};

var deleteCoupon = function(req, res) {
  if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
	console.log(req.body);
	sqlConnector.getConnection(function(err, connection) {
		connection.query("DELETE FROM coupon WHERE idcoupon = ?",
		[req.query.id],
		function (err, rows) {
			console.log(rows);
			connection.release();
			res.end();
		});
	});
};

var updateCoupon = function(req, res) {
  if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
	console.log(req.body);
	sqlConnector.getConnection(function(err, connection) {
		connection.query("UPDATE coupon SET amount = ?, discount = ? WHERE idcoupon = ?",
		[req.body.amount, req.body.discount, req.body.id],
		function (err, rows) {
			console.log(rows);
			connection.release();
			res.end();
		});
	});
};

var addProduct = function(req, res) {
  if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
  console.log(req.body);
  sqlConnector.getConnection(function(err, connection) {
    connection.query("INSERT INTO product (name, price, stock, imgpath, platform, descripton) values (?, ?, ?, ?, ?, ?)",
    [req.body.name, req.body.price, req.body.stock, req.body.img, req.body.platform, req.body.description],
    function(err, rows) {
      console.log(err);
      if (err) {
        connection.release();
        res.send('0');
        return;
      }
      connection.release();
      res.send('1');
    });
  });
};

var addProductPage = function(req, res) {
  if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
  res.sendFile(path.resolve(__dirname+'/../static/addproduct.html'));
};

module.exports = {
  viewUsers: viewUsers,
  viewOrders: viewOrders,
  updateOrder: updateOrder,
  addCoupon: addCoupon,
  addCouponPage: addCouponPage,
  deleteCoupon: deleteCoupon,
  updateCoupon: updateCoupon,
  addProduct: addProduct,
  addProductPage: addProductPage,
}
