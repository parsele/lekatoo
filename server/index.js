const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
const dbPath = path.join(__dirname, 'trees.db');
const db = new sqlite3.Database(dbPath);

// Create trees table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS trees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    species TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    planted_date TEXT NOT NULL,
    planter_name TEXT,
    notes TEXT,
    status TEXT DEFAULT 'healthy',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// API Routes

// Get all trees
app.get('/api/trees', (req, res) => {
  db.all('SELECT * FROM trees ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single tree by ID
app.get('/api/trees/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM trees WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Tree not found' });
      return;
    }
    res.json(row);
  });
});

// Create new tree
app.post('/api/trees', (req, res) => {
  const { species, latitude, longitude, planted_date, planter_name, notes, status } = req.body;
  
  if (!species || !latitude || !longitude || !planted_date) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  db.run(
    `INSERT INTO trees (species, latitude, longitude, planted_date, planter_name, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [species, latitude, longitude, planted_date, planter_name || null, notes || null, status || 'healthy'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Tree added successfully' });
    }
  );
});

// Update tree
app.put('/api/trees/:id', (req, res) => {
  const id = req.params.id;
  const { species, latitude, longitude, planted_date, planter_name, notes, status } = req.body;

  db.run(
    `UPDATE trees 
     SET species = ?, latitude = ?, longitude = ?, planted_date = ?, 
         planter_name = ?, notes = ?, status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [species, latitude, longitude, planted_date, planter_name, notes, status, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Tree not found' });
        return;
      }
      res.json({ message: 'Tree updated successfully' });
    }
  );
});

// Delete tree
app.delete('/api/trees/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM trees WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Tree not found' });
      return;
    }
    res.json({ message: 'Tree deleted successfully' });
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  db.all(`
    SELECT 
      COUNT(*) as total_trees,
      COUNT(DISTINCT species) as species_count,
      COUNT(CASE WHEN status = 'healthy' THEN 1 END) as healthy_trees,
      COUNT(CASE WHEN status = 'needs_attention' THEN 1 END) as needs_attention
    FROM trees
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

