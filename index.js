const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'acpt',
    database: 'customer_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Routes

// Get all customers
app.get('/customers', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Get customer by ID
app.get('/customers/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM customers WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send({ message: 'Customer not found' });
        res.json(results[0]);
    });
});

// Add customer
app.post('/customers', (req, res) => {
    const { name, email, phone } = req.body;
    db.query('INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)', [name, email, phone], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'Customer added', id: result.insertId });
    });
});

// Update customer
app.put('/customers/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    db.query('UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send({ message: 'Customer not found' });
        res.send({ message: 'Customer updated' });
    });
});

// Delete customer
app.delete('/customers/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM customers WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send({ message: 'Customer not found' });
        res.send({ message: 'Customer deleted' });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
