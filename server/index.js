const express = require('express');
const { client } = require('../database/index.js');

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  console.log('response from server on route: "/"');
  res.send('hey from server');
});

app.get('/questions', (req, res) => {
  console.log('Client is trying to get questions data...');
  const query = `SELECT * FROM questions LIMIT 3`;
  client.query(query, (err, data) => {
    if (err) {
      res.status(400).send(err);
      console.log(
        'Error sending back questions data from server to client:',
        err
      );
    } else {
      res.status(200).send(data.rows);
      console.log('Success sending back questions data from server to client:');
    }
  });
});

app.get('/answers', (req, res) => {
  console.log('Client is trying to get answers data...');
  const query = `SELECT * FROM answers LIMIT 3`;
  client.query(query, (err, data) => {
    if (err) {
      res.status(400).send(err);
      console.log(
        'Error sending back answers data from server to client:',
        err
      );
    } else {
      res.status(200).send(data.rows);
      console.log('Success sending back answers data from server to client:');
    }
  });
});
