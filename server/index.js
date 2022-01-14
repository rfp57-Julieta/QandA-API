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
  res.status(400).send(questions);
  // let package = {
  //   product_id: req.query.product_id,
  // };
  // const query = `SELECT * FROM questions WHERE product_id=${req.query.product_id} LIMIT 3`;
  // pool.query(query, async (err, data) => {
  //   if (err) {
  //     res.status(400).send(err);
  //   } else {
  //     package['results'] = data.rows;
  //     const questions = data.rows;
  //     let answers = [];
  //     await questions.forEach(async (question) => {
  //       const question_id = question.id;
  //       const query = `SELECT * FROM answers WHERE question_id=${question_id} LIMIT 3`;
  //       await pool.query(query, (err, data) => {
  //         if (err) {
  //           res.status(400).send(err);
  //         } else {
  //           answers.push(data.rows);
  //           question['answers'] = data.rows;
  //         }
  //       });
  //     });
  //     for (let i = 0; i < questions.length; i++) {
  //       questions[i]['answers'] = answers[i];
  //     }
  //     console.log('answers:', answers);
  //     res.status(200).send(package);
  //   }
  // });
  // const product_id = req.query.product_id;
  // const query = `SELECT * FROM questions WHERE product_id=${product_id} LIMIT 3`;
  // client.query(query, async (err, data) => {
  //   if (err) {
  //     res.status(400).send(err);
  //   } else {
  //     let questions = data.rows;
  //     let answers = {};
  //     await questions.forEach(async (question) => {
  //       const question_id = question.id;
  //       const query = `SELECT * FROM answers WHERE question_id=${question_id} LIMIT 3`;
  //       await client.query(query, async (err, data) => {
  //         if (err) {
  //           res.status(400).send(err);
  //         } else {
  //           let answers = data.rows;
  //           console.log('answers:', answers);
  //           await answers.forEach(async (answer) => {
  //             const answer_id = answer.id;
  //             const query = `SELECT * FROM answers_photos WHERE answer_id=${answer_id} LIMIT 3`;
  //             await client.query(query, async (err, data) => {
  //               if (err) {
  //                 res.status(400).send(err);
  //               } else {
  //                 answer['photos'] = data.rows;
  //                 answers[answer_id] = answer;
  //               }
  //             });
  //           });
  //         }
  //       });
  //       question['answers'] = answers;
  //     });
  //     const queryResult = {
  //       product_id: product_id,
  //       results: questions,
  //     };
  //     res.status(200).send(queryResult);
  //   }
  // });
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
