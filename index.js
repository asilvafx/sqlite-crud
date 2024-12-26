const express = require('express');
const { createItem, readItems, updateItem, deleteItem } = require('./crud');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/items', (req, res) => {
    readItems((err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(data);
    });
});

app.post('/items', (req, res) => {
    const { name, description } = req.body;
    createItem(name, description, (err, data) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(201).send(`Item added with ID: ${data.id}`);
    });
});

app.put('/items/:id', (req, res) => {
    const { name, description } = req.body;
    updateItem(req.params.id, name, description, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send(`Item updated with ID: ${req.params.id}`);
    });
});

app.delete('/items/:id', (req, res) => {
    deleteItem(req.params.id, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send(`Item deleted successfully.`);
    });
});

app.listen(3000, () => {
    console.log(`Server started on port 3000!`);
});