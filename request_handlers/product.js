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
		    else if (req.userSession.username != 'Admin') {
		        res.render('../static/product.ejs', { username: req.userSession.username, product: rows[0] });
		    }
		    else {
		        res.sendFile(path.resolve(__dirname+'/../static/admin.html'));
		    }
		}
		connection.release();
	});

}

var viewProduct = function (req, res) {
	sqlConnector.getConnection(function(err, connection) {
    renderProduct(req, res, connection);
  });
}

module.exports = {
	viewProduct: viewProduct,

};