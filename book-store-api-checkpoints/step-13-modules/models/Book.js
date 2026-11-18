// models/Book.js: the Book schema and model
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    pages: { type: Number, required: true, min: 1 },
    fiction: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
