// Book Store API: Express + MongoDB + Mongoose
require('dotenv').config({ quiet: true });   // reads .env into process.env
const express = require('express');
const mongoose = require('mongoose');

// ---------------------------------------------------------------- the model
// A schema describes what every book document must look like
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    pages: { type: Number, required: true, min: 1 },
    fiction: { type: Boolean, default: false }
  },
  { timestamps: true }   // adds createdAt and updatedAt
);

// The model is the tool we use to read and write the "books" collection
const Book = mongoose.model('Book', bookSchema);

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
