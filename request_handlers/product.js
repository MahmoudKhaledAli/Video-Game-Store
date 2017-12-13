var sqlConnector = require('./sqlConnector.js');
var ejs = require('ejs');
var path = require('path');


var renderProduct = function(req, res, connection) {
	connection.query("SELECT product.*, reviews.* FROM product LEFT JOIN reviews ON product.idproduct = reviews.idproduct WHERE product.idproduct = ? ", [req.params.id], function (err, rows) {
		console.log(rows);
		if(rows.length == 0) {
			res.send("product not found");
		}
		else {
			score = 0;
			for (var i = 0; i < rows.length; i++) {
				score += rows[i].score;
			}
			rows[0].avg_score = score / rows.length;
			rows[0].idproduct = req.params.id;
			if (!req.userSession.username) {
				console.log(rows[0]);
        res.render('../static/product.ejs', { username: 'Guest', product: rows[0], reviews: rows });
	    }
	    else {
				console.log(rows[0]);
        res.render('../static/product.ejs', { username: req.userSession.username, product: rows[0], reviews: rows });
	    }
		}
		connection.release();
	});

};

var viewProduct = function (req, res) {
	sqlConnector.getConnection(function(err, connection) {
    renderProduct(req, res, connection);
  });
};

var allProducts = function(req, res) {
	if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
	console.log(req.query.name);
	sqlConnector.getConnection(function(err, connection) {
		connection.query("SELECT * FROM product WHERE name LIKE ?",
		['%' + req.query.name + '%'],
		function (err, rows) {
			console.log(rows);
			connection.release();
			res.render('../static/products.ejs', { products: rows });
		});
	});
};

var updateProduct = function(req, res) {
	if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
	console.log(req.body);
	sqlConnector.getConnection(function(err, connection) {
		connection.query("UPDATE product SET price = ?, stock = ?, sale = ? WHERE idproduct = ?",
		[req.body.price, req.body.stock, req.body.sale, req.body.id],
		function (err, rows) {
			console.log(rows);
			connection.release();
			res.end();
		});
	});
};

var deleteProduct = function(req, res) {
	if (req.userSession.username != 'Admin') {
    res.status(404);
    res.end('Not found');
  }
	console.log(req.body);
	sqlConnector.getConnection(function(err, connection) {
		connection.query("DELETE FROM product WHERE idproduct = ?",
		[req.query.id],
		function (err, rows) {
			console.log(rows);
			connection.release();
			res.end();
		});
	});
};

var addToCart = function(req, res) {
	if (!req.userSession.username) {
		res.status(404);
    res.end('Not found');
	}
	console.log(req.query.id);
	console.log('adding to cart');
	sqlConnector.getConnection(function(err, connection) {
		connection.query("SELECT stock FROM product WHERE idproduct = ?",
		[req.query.id],
		function (err, rows) {
			console.log(rows);
			if (rows[0].stock >= req.query.quantity) {
				connection.query("INSERT INTO cart (username, idproduct, quantity) values (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?",
				[req.userSession.username, req.query.id, req.query.quantity, req.query.quantity],
				function(err, rows_2) {
					connection.query("UPDATE product SET stock = stock - ? WHERE idproduct = ?",
					[req.query.quantity, req.query.id],
					function(err, rows_3) {
						connection.release();
						res.end('1');
					}
				)
				});
			} else {
				connection.release();
				res.end('0');
			}
		});
	});
};

var addReview = function(req, res) {
	if (!req.userSession.username) {
		res.status(404);
    res.end('Not found');
	}
	sqlConnector.getConnection(function(err, connection) {
		connection.query("INSERT INTO reviews (username, idproduct, score, comment) VALUES (?, ?, ?, ?)",
		[req.userSession.username, req.body.id, req.body.score, req.body.comment],
		function (err, rows) {
			console.log(rows);
			console.log(err);
			if (err) {
				connection.release();
				res.end('0');
			}
			connection.release();
			res.end('1');
		});
	});
};

var deleteReview = function(req, res) {
	if (!req.userSession) {
		console.log('wat1');
		res.status(404);
    res.end('Not found');
	}
	console.log(req.userSession.username);
	console.log(req.query.username);
	if (req.userSession.username != req.query.username && req.userSession.username != 'Admin') {
		console.log('wat2');
		res.status(404);
    res.end('Not found');
	}
	sqlConnector.getConnection(function(err, connection) {
		connection.query("DELETE FROM reviews WHERE username = ? AND idproduct = ?",
		[req.query.username, req.query.id],
		function (err, rows) {
			console.log(rows);
			console.log(err);
			if (err) {
				connection.release();
				res.end('0');
			}
			connection.release();
			res.end('1');
		});
	});
}

module.exports = {
	viewProduct: viewProduct,
	allProducts: allProducts,
	updateProduct: updateProduct,
	deleteProduct: deleteProduct,
	addToCart: addToCart,
	addReview: addReview,
	deleteReview: deleteReview,
};
