const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Default XAMPP MySQL username
  password: '', // Default XAMPP MySQL password is empty
  database: 'todoapp' // Your database name
});

db.connect((err) => {
  if (err) {
    console.error('error connecting to MySQL:', err);
  } else {
    console.log('connected to MySQL');
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('To-Do List API');
});

// Route to get tasks from MySQL database
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

