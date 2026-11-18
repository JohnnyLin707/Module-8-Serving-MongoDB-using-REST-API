const express = require('express');
const records = require('./records');

const app = express();

// ------------------------------------------------------------ the plan
// Send a GET request to /quotes to READ a list of quotes
// Send a GET request to /quotes/random to READ (view) a random quote
// Send a GET request to /quotes/:id to READ (view) a quote
// Send a POST request to /quotes to CREATE a new quote
// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
// Send a DELETE request to /quotes/:id to DELETE a quote

// A first JSON route
app.get('/greetings', (req, res) => {
  res.json({ greeting: 'Hello World!!!' });
});

// Send a GET request to /quotes to READ a list of quotes
app.get('/quotes', async (req, res) => {
  const data = await records.getQuotes();
  res.json(data.records);
});

// Send a GET request to /quotes/:id to READ (view) a quote
app.get('/quotes/:id', async (req, res) => {
  const quote = await records.getQuote(req.params.id);
  res.json(quote);
});

app.listen(3000, () => console.log('Quote API listening on http://localhost:3000'));
