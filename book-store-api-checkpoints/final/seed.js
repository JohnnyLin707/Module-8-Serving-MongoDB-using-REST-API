// seed.js: fill the books collection with sample data.  Run:  npm run seed
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Book = require('./models/Book');

const books = [
  { title: 'Clean Code', author: 'Robert C. Martin', pages: 464, fiction: false },
  { title: 'The Pragmatic Programmer', author: 'David Thomas', pages: 352, fiction: false },
  { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', pages: 472, fiction: false },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: 310, fiction: true },
  { title: 'Dune', author: 'Frank Herbert', pages: 412, fiction: true },
  { title: 'Project Hail Mary', author: 'Andy Weir', pages: 476, fiction: true }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Book.deleteMany({});                 // start from an empty collection
  const saved = await Book.insertMany(books);
  console.log(`Added ${saved.length} books`);
  await mongoose.disconnect();               // a script must close the connection to finish
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
