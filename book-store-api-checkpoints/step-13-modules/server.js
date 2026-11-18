// server.js: Book Store API (Express + MongoDB + Mongoose)
require('dotenv').config({ quiet: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/books');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());            // let a React app on another port call this API
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Book Store API' });
});

app.use('/api/books', bookRoutes);   // every route in routes/books.js starts with /api/books

// ---------------------------------------------------------------- errors
// No route matched: 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// The error handler (4 parameters): every error ends up here, as JSON
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ error: { message: 'That is not a valid book id.' } });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: { message: err.message } });
  }
  res.status(err.status || 500).json({ error: { message: err.message } });
});

// ---------------------------------------------------------------- start
// Connect to MongoDB first; only then start listening for requests
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Book Store API listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
