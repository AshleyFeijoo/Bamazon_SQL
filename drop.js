var mysql = require('mysql');

var con = mysql.createConnection({
  host: '127.0.0.1',
  user: "root",
  port: '8889',
  password: "root",
  database: "blamazon_db"
});

con.connect(function(err) {
    if (err) throw err;
    var sql = "DROP TABLE products";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table deleted");
    });
  });