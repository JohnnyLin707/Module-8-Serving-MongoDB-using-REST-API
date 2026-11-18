// Book Store API: Express + MongoDB + Mongoose
require('dotenv').config({ quiet: true });   // reads .env into process.env
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());   // reads JSON request bodies into req.body

// A first route, to check the server is up
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Book Store API' });
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
