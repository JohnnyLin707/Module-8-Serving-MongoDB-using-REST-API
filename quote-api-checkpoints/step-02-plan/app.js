const express = require('express');

const app = express();

// ------------------------------------------------------------ the plan
// Send a GET request to /quotes to READ a list of quotes
// Send a GET request to /quotes/random to READ (view) a random quote
// Send a GET request to /quotes/:id to READ (view) a quote
// Send a POST request to /quotes to CREATE a new quote
// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
// Send a DELETE request to /quotes/:id to DELETE a quote

app.listen(3000, () => console.log('Quote API listening on http://localhost:3000'));
