// records.js: our "fake database".
// It keeps the quotes in data.json and gives app.js six functions to use.
// Every function is async (it returns a Promise), just like a real database would.
// In a later session we replace this file with MongoDB, and app.js hardly changes.
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'data.json');

function generateRandomId() {
  return Math.floor(Math.random() * 10000);
}

function save(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(FILE, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Gets all quotes
 * @returns {Promise<{records: Array}>} the whole file: { records: [ ... ] }
 */
function getQuotes() {
  return new Promise((resolve, reject) => {
    fs.readFile(FILE, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

/**
 * Gets a specific quote by ID
 * @param {number|string} id - the ID of the quote
 * @returns the quote object, or undefined when there is no such ID
 */
async function getQuote(id) {
  const quotes = await getQuotes();
  return quotes.records.find(record => record.id == id);
}

/**
 * Gets a random quote
 */
async function getRandomQuote() {
  const quotes = await getQuotes();
  const randNum = Math.floor(Math.random() * quotes.records.length);
  return quotes.records[randNum];
}

/**
 * Creates a new quote record
 * @param {Object} newRecord - { quote, author }. The id is added here.
 */
async function createQuote(newRecord) {
  const quotes = await getQuotes();
  newRecord.id = generateRandomId();
  quotes.records.push(newRecord);
  await save(quotes);
  return newRecord;
}

/**
 * Updates a single record
 * @param {Object} newQuote - { id, quote, author }
 */
async function updateQuote(newQuote) {
  const quotes = await getQuotes();
  const quote = quotes.records.find(item => item.id == newQuote.id);
  quote.quote = newQuote.quote;
  quote.author = newQuote.author;
  await save(quotes);
}

/**
 * Deletes a single record
 * @param {Object} record - the record to delete
 */
async function deleteQuote(record) {
  const quotes = await getQuotes();
  quotes.records = quotes.records.filter(item => item.id != record.id);
  await save(quotes);
}

module.exports = {
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  getRandomQuote
};
