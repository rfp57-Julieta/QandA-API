const express = require('express');
const client = require('../database/index.js');

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  console.log('response from server on route: "/"');
  res.send('hey from server');
});

app.get('/products', (req, res) => {
  console.log('Client is trying to get products data...');
  res.send('u get products data from our server');
  const query = `SELECT * FROM products LIMIT 3`;
  client.query(query, (err, data) => {
    if (err) {
      res.send('Error getting products:', err);
      console.log('Error getting prpducts:', err);
    } else {
      res.send('Success getting products data from server:', data);
      console.log('Success getting products data from server:');
    }
  });
});

app.get('/questions', (req, res) => {
  console.log('Client is trying to get questions data...');
  res.send('u get questions data from our server');
  const query = `SELECT * FROM questions LIMIT 3`;
  client.query(query, (err, data) => {
    if (err) {
      res.send('Error getting questions:', err);
      console.log('Error getting questions:', err);
    } else {
      res.send('Success getting questions data from server:', data);
      console.log('Success getting questions data from server:');
    }
  });
});
