
const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

function readCustomers() {
    return JSON.parse(fs.readFileSync("customers.json"));
}

function saveCustomers(customers) {
    fs.writeFileSync("customers.json", JSON.stringify(customers, null, 2));
}

// READ all customers
app.get("/customers", (req, res) => {
    res.json(readCustomers());
});

// CREATE a customer
app.post("/customers", (req, res) => {
    let customers = readCustomers();

    let customer = {
        id: Date.now(),
        name: req.body.name,
        email: req.body.email
    };

    customers.push(customer);
    saveCustomers(customers);

    res.json(customer);
});

// UPDATE a customer
app.put("/customers/:id", (req, res) => {
    let customers = readCustomers();

    let customer = customers.find(c => c.id == req.params.id);

    if (!customer) {
        return res.send("Customer not found");
    }

    customer.name = req.body.name;
    customer.email = req.body.email;

    saveCustomers(customers);
    res.json(customer);
});

// DELETE a customer
app.delete("/customers/:id", (req, res) => {
    let customers = readCustomers();

    customers = customers.filter(c => c.id != req.params.id);

    saveCustomers(customers);
    res.send("Customer deleted");
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
