var sqlConnector = require('./sqlConnector.js');
var ejs = require('ejs');
var path = require('path');


var renderProduct = function(req, res, connection) {
	connection.query("SELECT * FROM product WHERE idproduct = ?", [req.params.id], function (err, rows) {
		console.log(rows);
		if(rows.length == 0) {
			res.send("product not found");
		}
		else {
			if (!req.userSession.username) {
		        res.render('../static/product.ejs', { username: 'Guest', product: rows });
		    }
		    else {
		        res.render('../static/product.ejs', { username: req.userSession.username, product: rows[0] });
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

module.exports = {
	viewProduct: viewProduct,
	allProducts: allProducts,
	updateProduct: updateProduct,
	deleteProduct: deleteProduct,
};
