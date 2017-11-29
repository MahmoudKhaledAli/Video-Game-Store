/**
 * Created by Ahmkel on 12/5/2015.
 */

//Create the connection
var mysql = require('mysql');

var LocaldbConfig = {
    host:"localhost",
    user:"root",
    password:"",
    database:"games",
    dateStrings: 'date'
};

//module.exports = mysql.createPool(OnlinedbConfig);

module.exports = mysql.createPool(LocaldbConfig);

//module.exports = mysql.createPool(LocaldbConfig);
