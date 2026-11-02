
let mysql = require('mysql2');

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Wayout10!?"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    con.query("CREATE DATABASE IF NOT EXISTS customerdb", function(err, result) {
        if (err) throw err;
        console.log("Database created!");

        con.changeUser({database: "customerdb"}, function(err) {
            if (err) throw err;

            let sql = "CREATE TABLE IF NOT EXISTS customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(100), phone VARCHAR(20))";

            con.query(sql, function(err, result) {
                if (err) throw err;
                console.log("Customer table created!");
            });
        });
    });
});
