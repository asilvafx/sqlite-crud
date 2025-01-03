const express = require('express');
const { create, read, update, erase } = require('../crud');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Node.js Express"));

// Get all items from a specified table
app.get('/:tableName', (req, res) => {
    const tableName = req.params.tableName;
    read(tableName, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(data);
    });
});

// Create a new item in a specified table
app.post('/:tableName', (req, res) => {
    const tableName = req.params.tableName;
    const data = req.body;
    create(tableName, data, (err, result) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(201).send(`Item added with ID: ${result.id}`);
    });
});

// Update an item in a specified table
app.put('/:tableName/:id', (req, res) => {
    const tableName = req.params.tableName;
    const id = req.params.id;
    const data = req.body;
    update(tableName, id, data, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send(`Item updated with ID: ${id}`);
    });
});

// Delete an item from a specified table
app.delete('/:tableName/:id', (req, res) => {
    const tableName = req.params.tableName;
    const id = req.params.id;
    erase(tableName, id, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send(`Item deleted successfully.`);
    });
});

// Start the server
if (process.env.NODE_ENV !== 'production') {
    const PORT = parseInt(process.env.PORT) || 3000; // Use the PORT environment variable or default
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}!`);
    });
}

module.exports = app;