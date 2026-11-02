
const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Wayout10!?",
    database: "customerdb"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

// READ ALL CUSTOMERS
app.get("/customers", function(req, res) {
    db.query("SELECT * FROM customers", function(err, results) {
        if (err) throw err;
        res.json(results);
    });
});

// READ ONE CUSTOMER
app.get("/customers/:id", function(req, res) {
    db.query(
        "SELECT * FROM customers WHERE id = ?",
        [req.params.id],
        function(err, results) {
            if (err) throw err;
            res.json(results);
        }
    );
});

// CREATE CUSTOMER
app.post("/customers", function(req, res) {
    const customer = req.body;

    db.query(
        "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)",
        [customer.name, customer.email, customer.phone],
        function(err, result) {
            if (err) throw err;
            res.json({ message: "Customer added!", id: result.insertId });
        }
    );
});

// UPDATE CUSTOMER
app.put("/customers/:id", function(req, res) {
    const customer = req.body;

    db.query(
        "UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?",
        [customer.name, customer.email, customer.phone, req.params.id],
        function(err, result) {
            if (err) throw err;
            res.json({ message: "Customer updated!" });
        }
    );
});

// DELETE CUSTOMER
app.delete("/customers/:id", function(req, res) {
    db.query(
        "DELETE FROM customers WHERE id = ?",
        [req.params.id],
        function(err, result) {
            if (err) throw err;
            res.json({ message: "Customer deleted!" });
        }
    );
});

// START SERVER
app.listen(5500, function() {
    console.log("Server running at http://localhost:5500");
});
