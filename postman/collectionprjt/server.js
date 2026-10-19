const express = require('express');
const app = express();
const port = 3000;
/// server to read json request body
app.use(express.json());
///server frontend files
app.use(express.static('public'));
/// collection
let veggies =[
    {
        id: 1,
        name: "carrot"
    },
    {
        id: 2,
        name: "broccoli"
    },
    {
        id: 3,
        name: "lettuce"
    }
];
let nextId = 4;
//get all veggies
app.get('/veggies', (req, res) => {
    res.json(veggies);
});
/// get one veggie by id
app.get('/veggies/:id', (req, res) => {
    const id = Number(req.params.id);
    const veggie = veggies.find(v => v.id === id);
    if (!veggie) {return res.status(404).send('Veggie not found'); }
    res.json(veggie);
 
});
/// add new veggies
app.post('/veggies', (req, res) => {
    const { name } = req.body;
    if (!name) {return res.status(400).json({ message:'veggie is required'
});
}
const newVeggie = { id: nextId++, name };
veggies.push(newVeggie);
res.status(201).json(newVeggie);
});
/// update a veggie by id
app.put('/veggies/:id', (req, res) => {
    const id = Number(req.params.id);
    const veggie = veggies.find(v => v.id === id);
    if (!veggie) {return res.status(400).send('Veggie not found'); }
    const { name } = req.body;
    if (!name) {return res.status(400).json({ message:'veggie is required' }); }
veggie.name = name;
res.json(veggie);
});
/// delete veggie
app.delete('/veggies/:id', (req, res) => {
    const id= Number(req.params.id);
    const veggieExists = veggies.some(v => v.id === id);
    if (!veggieExists) {return res.status(404).json({message: 'Veggie not found' }); }
    veggies = veggies.filter(v => v.id !== id);
    res.json({ message: 'Veggie deleted successfully' });
});
/// start server
app.listen(port, () => {
    console.log("Server is running on http://localhost:"+ port);
});
   
