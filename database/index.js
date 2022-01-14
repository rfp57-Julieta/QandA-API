const res = require('express/lib/response');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'newuser',
  password: 'password',
  database: 'qanda',
  port: 5432,
});

pool
  .connect()
  .then((res) => {
    console.log('Connect to Postgres successfully!');
  })
  .catch((err) => {
    console.log(err);
  });

async function getQuestions(product_id) {
  let package = {
    product_id: product_id,
  };
  const query = `SELECT id, body, date_written, asker_name, reported, helpful FROM questions WHERE product_id=${product_id} LIMIT 3`;
  let questions_data = await pool.query(query);
  package['results'] = questions_data.rows;
  for (let question of questions_data.rows) {
    const question_id = question.id;
    const query = `SELECT * FROM answers WHERE question_id=${question_id} LIMIT 3`;
    let answers = {};
    let answers_data = await pool.query(query);
    for (let answer of answers_data.rows) {
      const answer_id = answer.id;
      const query = `SELECT * FROM answers_photos WHERE answer_id=${answer_id} LIMIT 3`;
      const photos_data = await pool.query(query);
      answers[answer_id] = {
        id: answer.id,
        body: answer.body,
        date: answer.date_written,
        answerer_name: answer.answerer_name,
        helpfulness: answer.helpful,
        photos: photos_data.rows,
      };
      question['answers'] = answers;
    }
  }
  return package;
}

module.exports = {
  pool,
  getQuestions,
};
