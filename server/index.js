const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';
const readDB = () => {
    
  const data = fs.readFileSync(DB_FILE);
  try { return JSON.parse(data); } catch { return { users: [], trips: [] }; }
};
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

if (!fs.existsSync(DB_FILE) || fs.readFileSync(DB_FILE).toString().trim() === '{}') {
  writeDB({ users: [], trips: [] });
}

// Auth
app.post('/api/signup', (req, res) => {
  const db = readDB();
  const { email, password, name } = req.body;
  if (db.users.find(u => u.email === email))
    return res.status(400).json({ error: 'User already exists' });
  const user = { id: uuidv4(), email, password, name };
  db.users.push(user);
  writeDB(db);
  res.json({ user: { id: user.id, email, name } });
});

app.post('/api/login', (req, res) => {
  const db = readDB();
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ user: { id: user.id, email: user.email, name: user.name } });
});

// Trips
app.get('/api/trips/:userId', (req, res) => {
  const db = readDB();
  res.json(db.trips.filter(t => t.userId === req.params.userId));
});

app.post('/api/trips', (req, res) => {
  const db = readDB();
  const trip = { id: uuidv4(), ...req.body, stops: [], createdAt: new Date() };
  db.trips.push(trip);
  writeDB(db);
  res.json(trip);
});

app.put('/api/trips/:id', (req, res) => {
  const db = readDB();
  const idx = db.trips.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Trip not found' });
  db.trips[idx] = { ...db.trips[idx], ...req.body };
  writeDB(db);
  res.json(db.trips[idx]);
});

app.delete('/api/trips/:id', (req, res) => {
  const db = readDB();
  db.trips = db.trips.filter(t => t.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

app.listen(3001, () => console.log('✅ Server running on http://localhost:3001'));