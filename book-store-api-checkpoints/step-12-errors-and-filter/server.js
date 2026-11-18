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

// GET /api/books -> every book (optional ?fiction=true or ?fiction=false)
app.get('/api/books', async (req, res) => {
  const filter = {};
  if (req.query.fiction) {
    filter.fiction = req.query.fiction === 'true';
  }
  const books = await Book.find(filter).sort({ title: 1 });
  res.json(books);
});

// GET /api/books/:id -> one book, or 404
app.get('/api/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  res.json(book);
});

// POST /api/books -> create a book (201)
app.post('/api/books', async (req, res) => {
  const { title, author, pages, fiction } = req.body;
  const book = await Book.create({ title, author, pages, fiction });
  res.status(201).json(book);
});

// PUT /api/books/:id -> update a book, send back the new version
app.put('/api/books/:id', async (req, res) => {
  const { title, author, pages, fiction } = req.body;
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { title, author, pages, fiction },
    { returnDocument: 'after', runValidators: true }   // send back the updated book; check the schema rules
  );
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  res.json(book);
});

// DELETE /api/books/:id -> remove a book (204)
app.delete('/api/books/:id', async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  res.status(204).end();
});

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
