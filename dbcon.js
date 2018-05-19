var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_ellisry',
  password        : '7412',
  database        : 'cs340_ellisry'
});

module.exports.pool = pool;
