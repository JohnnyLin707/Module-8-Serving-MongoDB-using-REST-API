const express = require('express');
const records = require('./records');

const app = express();

// Middleware: turn a JSON request body into the object req.body
app.use(express.json());

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
// Optional query string: /quotes?author=dijkstra
app.get('/quotes', async (req, res, next) => {
  try {
    const data = await records.getQuotes();
    let quotes = data.records;
    if (req.query.author) {
      const search = req.query.author.toLowerCase();
      quotes = quotes.filter(q => q.author.toLowerCase().includes(search));
    }
    res.json(quotes);
  } catch (err) {
    next(err);
  }
});

// Send a GET request to /quotes/random to READ (view) a random quote
// It must come BEFORE /quotes/:id, or :id would catch the word 'random'
app.get('/quotes/random', async (req, res, next) => {
  try {
    const quote = await records.getRandomQuote();
    res.json(quote);
  } catch (err) {
    next(err);
  }
});

// Send a GET request to /quotes/:id to READ (view) a quote
app.get('/quotes/:id', async (req, res, next) => {
  try {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ message: 'Quote not found.' });
    }
  } catch (err) {
    next(err);
  }
});

// Send a POST request to /quotes to CREATE a new quote
app.post('/quotes', async (req, res, next) => {
  try {
    if (req.body.quote && req.body.author) {
      const quote = await records.createQuote({
        quote: req.body.quote,
        author: req.body.author
      });
      res.status(201).json(quote);
    } else {
      res.status(400).json({ message: 'Quote and author required.' });
    }
  } catch (err) {
    next(err);
  }
});

// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
app.put('/quotes/:id', async (req, res, next) => {
  try {
    const quote = await records.getQuote(req.params.id);
    if (!quote) {
      res.status(404).json({ message: 'Quote not found.' });
    } else if (!req.body.quote || !req.body.author) {
      res.status(400).json({ message: 'Quote and author required.' });
    } else {
      quote.quote = req.body.quote;
      quote.author = req.body.author;
      await records.updateQuote(quote);
      res.status(204).end();
    }
  } catch (err) {
    next(err);
  }
});

// Send a DELETE request to /quotes/:id to DELETE a quote
app.delete('/quotes/:id', async (req, res, next) => {
  try {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      await records.deleteQuote(quote);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Quote not found.' });
    }
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------ error handling
// 1. No route above matched: make a 404 error and pass it on
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 2. The error handler (4 parameters): every next(err) ends up here
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

app.listen(3000, () => console.log('Quote API listening on http://localhost:3000'));
