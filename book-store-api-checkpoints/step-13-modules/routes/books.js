// routes/books.js: every /api/books route
const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

// /api/books
router.route('/')
  .get(async (req, res) => {
    const filter = {};
    if (req.query.fiction) {
      filter.fiction = req.query.fiction === 'true';
    }
    const books = await Book.find(filter).sort({ title: 1 });
    res.json(books);
  })
  .post(async (req, res) => {
    const { title, author, pages, fiction } = req.body;
    const book = await Book.create({ title, author, pages, fiction });
    res.status(201).json(book);
  });

// /api/books/:id
router.route('/:id')
  .get(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.json(book);
  })
  .put(async (req, res) => {
    const { title, author, pages, fiction } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, pages, fiction },
      { returnDocument: 'after', runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.json(book);
  })
  .delete(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.status(204).end();
  });

module.exports = router;
