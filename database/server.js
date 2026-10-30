let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "TaylorMadsen",
  password: ""
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE mydb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});