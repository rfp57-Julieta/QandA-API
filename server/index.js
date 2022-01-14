const express = require('express');
const { ClientBase } = require('pg');
const { pool, getQuestions } = require('../database/index.js');

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  console.log('response from server on route: "/"');
  res.send('hey from server');
});

app.get('/qa/questions', async (req, res) => {
  let questions = await getQuestions(req.query.product_id);
  res.status(200).send(questions);
});

// app.get('/answers', (req, res) => {
//   console.log('Client is trying to get answers data...');
//   const query = `SELECT * FROM answers LIMIT 3`;
//   client.query(query, (err, data) => {
//     if (err) {
//       res.status(400).send(err);
//       console.log(
//         'Error sending back answers data from server to client:',
//         err
//       );
//     } else {
//       res.status(200).send(data.rows);
//       console.log('Success sending back answers data from server to client:');
//     }
//   });
// });
