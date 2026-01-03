const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Default XAMPP MySQL username
  password: '', // Default XAMPP MySQL password is empty
  database: 'todoapp', // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test MySQL connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
    connection.release(); // Release the connection back to the pool
  }
});

// Test route to check if API is working
app.get('/', (req, res) => {
  res.send('To-Do List API');
});

// Route to get tasks from MySQL database
app.get('/api/tasks', (req, res) => {
  pool.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Route to add a new task (POST)
app.post('/api/tasks', (req, res) => {
  const { task } = req.body;

  pool.query('INSERT INTO tasks (task) VALUES (?)', [task], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, task });
  });
});

// Route to delete a task (DELETE)
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  });
});

// Route to update a task's completion status (PUT)
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  pool.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ id, completed });
  });
});

// Define port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

