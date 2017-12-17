var sqlConnector = require('./sqlConnector.js');
var ejs = require('ejs');
var path = require('path');
var async = require('async');

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
  connection.query("SELECT * FROM product ORDER BY sales DESC LIMIT 4", function(err, rows_sellers) {
    console.log(rows_sellers);
    connection.query("SELECT product.*, AVG(reviews.score) FROM product LEFT JOIN reviews ON product.idproduct = reviews.idproduct GROUP BY product.idproduct ORDER BY AVG(reviews.score) DESC LIMIT 4",
    function(err, rows_rating) {
      console.log(rows_rating);
      if (!req.userSession.username) {
        res.render('../static/home.ejs', { username: 'Guest', sellers: rows_sellers, ratings: rows_rating });
      } else if (req.userSession.username != 'Admin') {
        res.render('../static/home.ejs', { username: req.userSession.username, sellers: rows_sellers, ratings: rows_rating });
      } else {
        res.sendFile(path.resolve(__dirname+'/../static/admin.html'));
      }
      connection.release();
    });
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
  if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
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
  if (!req.userSession.username) {
    res.status(404);
    res.end('Not found');
  }
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    connection.query("SELECT * FROM `games`.`order` INNER JOIN product On `games`.`order`.idproduct = product.idproduct WHERE username = ? ORDER BY datecreated DESC, idorder",
    [req.userSession.username],
    function(err, rows) {
      console.log(err);
      console.log(rows);
      if (rows.length == 0) {
        console.log('cond');
        connection.query("SELECT address FROM user WHERE username = ?",
        [req.userSession.username],
        function(err, rows_1) {
          console.log(err);
          connection.release();
          res.render('../static/account.ejs', { orders: [], username: req.userSession.username, address: rows_1[0].address });
          return;
        });
      } else {
        orders = [];
        orders.push({});
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
        console.log(orders[0]);
        connection.query("SELECT address FROM user WHERE username = ?",
        [req.userSession.username],
        function(err, rows) {
          console.log(err);
          console.log(rows[0]);
          connection.release();
          res.render('../static/account.ejs', { orders: orders, username: req.userSession.username, address: rows[0].address });
        });
      }
    });
  });
};

var updateAddress = function(req, res) {
  if (!req.userSession.username) {
    res.status(404);
    res.end('Not found');
  }
  sqlConnector.getConnection(function(err, connection) {
    connection.query("UPDATE user SET address = ? WHERE username = ?",
    [req.body.address, req.userSession.username],
    function() {
      connection.release();
      res.end();
    })
  });
};

var cart = function(req, res) {
  if (!req.userSession.username) {
    res.status(404);
    res.end('Not found');
  }
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    connection.query("SELECT * FROM `games`.`cart` INNER JOIN product On `games`.`cart`.idproduct = product.idproduct WHERE username = ?",
    [req.userSession.username],
    function(err, rows) {
      console.log(rows);
      total = 0;
      for (var i = 0; i < rows.length; i++) {
        total += rows[i].total = (100 - rows[i].sale) * rows[i].price * rows[i].quantity / 100;
      }
      res.render('../static/cart.ejs', { cart: rows, username: req.userSession.username, total: total });
      connection.release();
      return;
    });
  });
};

var updateItem = function(req, res) {
  if (!req.userSession.username) {
    res.status(404);
    res.end('Not found');
  }
  sqlConnector.getConnection(function(err, connection) {
    console.log('update item');
    console.log(err);
    connection.query("SELECT quantity FROM cart WHERE idproduct = ? AND username = ?",
    [req.body.id, req.userSession.username], function(err, rows) {
      oldQuantity = rows[0].quantity;
      connection.query("SELECT stock FROM product WHERE idproduct = ?",
      [req.body.id],
      function(err, rows) {
        console.log(rows[0].stock);
        if (rows[0].stock >= req.body.quantity - oldQuantity) {
          connection.query("UPDATE cart SET quantity = ? WHERE idproduct = ? AND username = ?",
          [req.body.quantity, req.body.id, req.userSession.username],
          function(err, rows) {
            console.log(rows);
            console.log(req.body.quantity - oldQuantity);
            connection.query("UPDATE product SET stock = stock - ? + ? WHERE idproduct = ?",
            [req.body.quantity, oldQuantity, req.body.id],
            function(err, rows) {
              connection.release();
              res.end('1');
            });
          });
        } else {
          connection.release();
          res.end('0');
        }
      });
    });
  });
};

var deleteItem = function(req, res) {
  if (!req.userSession.username) {
    res.status(404);
    res.end('Not found');
  }
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    console.log(req.query.id);
    connection.query('SELECT quantity FROM cart WHERE idproduct = ? AND username = ?',
    [req.query.id, req.userSession.username],
    function(err, rows) {
      quantity = parseInt(rows[0].quantity);
      console.log(quantity);
      connection.query("DELETE FROM cart WHERE idproduct = ? AND username = ?",
      [req.query.id, req.userSession.username],
      function(err, rows) {
        console.log(rows);
        connection.query("UPDATE product SET stock = stock + ? WHERE idproduct = ?",
        [quantity, req.query.id],
        function(err, rows) {
          console.log(rows);
          connection.release();
          res.end();
          return;
        });
      });
    });
  });
};

var placeOrder = function(req, res) {
  if (!req.userSession.username) {
    res.status(404);
    res.end('Not found');
  }
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    console.log(req.query.id);
    console.log(req.query.total);
    connection.query("SELECT MAX(idorder) FROM `games`.`order`",
    function(err, rows) {
      newID = rows[0]['MAX(idorder)'] + 1;
      console.log(newID);
      connection.query("SELECT * FROM cart WHERE username = ?",
      [req.userSession.username],
      function(err, rows1) {
        console.log(rows1);
        async.forEach(rows1, function(row, callback) {
          console.log(row);
          connection.query("INSERT INTO `games`.`order` (idorder, username, idproduct, quantity, status, datecreated, total) values (?,?,?,?,?,?,?)",
          [newID, req.userSession.username, row.idproduct, row.quantity, 0, new Date(), req.query.total], function(err, rows2) {
            console.log(rows2);
            connection.query("UPDATE `games`.`product` SET SALES = SALES + ? WHERE idproduct = ?",
            [row.quantity, row.idproduct],
            function(err, rows) {
              callback();
            });
          });
        }, function(err) {
          console.log("done");
          connection.query("DELETE FROM cart WHERE username = ?",
          [req.userSession.username],
          function (err, rows) {
            connection.release();
            res.end();
            return;
          });
        });
      });
    });
  });
};

var getCoupon = function(req, res) {
  sqlConnector.getConnection(function(err, connection) {
    console.log(err);
    console.log(req.query.coupon);
    connection.query("SELECT * FROM coupon WHERE idcoupon = ?",
    [req.query.coupon],
    function(err, rows) {
      console.log(rows);
      if (rows.length == 0) {
        connection.release();
        res.send('0');
      } else {
        connection.query("UPDATE coupon SET amount = amount - 1 WHERE idcoupon = ?",
        [req.query.coupon],
        function(err, rows2) {
          connection.query("DELETE FROM coupon WHERE amount = 0", function(err, rows3) {
            connection.release();
            console.log((rows[0]['discount']));
            res.send((rows[0]['discount']).toString());
          });
        });
      }
    });
  });
};

var browse = function(req, res) {
  sqlConnector.getConnection(function(err, connection) {
    console.log(req.query.platform);
    console.log(req.query.field);
    console.log(req.query.order);
    if (req.query.platform == -1) {
      connection.query("SELECT product.*, AVG(reviews.score) AS avg_score FROM product LEFT JOIN reviews ON product.idproduct = reviews.idproduct WHERE name LIKE ? GROUP BY product.idproduct ORDER BY " + req.query.field + " " + req.query.order,
      ['%' + req.query.name + '%'],
      function(err, rows) {
        console.log(err);
        connection.release();
        pageNo = req.query.no;
        pages = Math.ceil(rows.length / 6);
        console.log(rows);
        res.render('../static/browse.ejs', { username: (req.userSession.username)?req.userSession.username:'Guest', products: rows.splice(req.query.no*6, (req.query.no+1)*6), pageNo: pageNo, pages: pages, platform: req.query.platform, field: req.query.field, order: req.query.order, name: req.query.name });
      });
    } else {
      connection.query("SELECT product.*, AVG(reviews.score) AS avg_score FROM product LEFT JOIN reviews ON product.idproduct = reviews.idproduct WHERE platform = ? AND name LIKE ? GROUP BY product.idproduct ORDER BY " + req.query.field + " " + req.query.order,
      [req.query.platform, '%' + req.query.name + '%'],
      function(err, rows) {
        connection.release();
        pageNo = req.query.no;
        pages = Math.ceil(rows.length / 6);
        console.log(rows);
        res.render('../static/browse.ejs', { username: (req.userSession.username)?req.userSession.username:'Guest', products: rows.splice(req.query.no*6, (req.query.no+1)*6), pageNo: pageNo, pages: pages, platform: req.query.platform, field: req.query.field, order: req.query.order, name: req.query.name });
      });
    }
  });
}

module.exports = {
  register: register,
  login: login,
  homepage: homepage,
  logout: logout,
  ban: ban,
  account: account,
  updateAddress: updateAddress,
  cart: cart,
  updateItem: updateItem,
  deleteItem: deleteItem,
  placeOrder: placeOrder,
  getCoupon: getCoupon,
  browse: browse,
}
