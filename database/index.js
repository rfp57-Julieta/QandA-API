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

async function getQuestions(product_id, cb) {
  try {
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
  } catch (err) {
    cb(err);
  }
}

async function getAnswers(question_id, cb) {
  try {
    let package = {
      question: question_id,
      page: 0,
      count: 5,
    };
    const query = `SELECT id,body,date_written,answerer_name,helpful FROM answers WHERE question_id=${question_id} LIMIT 3`;
    const answers_data = await pool.query(query);
    for (let answer of answers_data.rows) {
      // console.log('answer:', answer);
      const answer_id = answer.id;
      const query = `SELECT * FROM answers_photos WHERE answer_id=${answer_id} LIMIT 3`;
      const photos_data = await pool.query(query);
      // Reformatting answer object with new property names to match FEC data
      // answer = {
      //   answer_id: answer.id,
      //   body: answer.body,
      //   date: answer.date_written,
      //   answerer_name: answer.answerer_name,
      //   helpfulness: answer.helpful,
      //   photos: photos_data.rows,
      // };
      answer['photos'] = photos_data.rows;
    }
    package['results'] = answers_data.rows;
    return package;
  } catch (err) {
    cb(err);
  }
}

async function postQuestion(body, name, email, product_id, cb) {
  try {
    const query = `INSERT INTO questions(id,product_id,body,date_written,asker_name,asker_email,reported,helpful) VALUES ((SELECT id+1 FROM questions ORDER BY id DESC LIMIT 1),${product_id},'${body}',123821,'${name}','${email}',0,0)`;
    await pool.query(query);
  } catch (err) {
    cb(err);
  }
}

async function postAnswer(body, name, email, question_id, photos, cb) {
  try {
    console.log('name:', name);
    const getNewId = `SELECT id+1 FROM answers ORDER BY id DESC LIMIT 1`;
    let newIdObj = await pool.query(getNewId);
    let newId = newIdObj.rows[0]['?column?'];
    console.log('newId:', newId);
    const query = `INSERT INTO answers(id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful) VALUES (${newId},${question_id},'${body}',123821,'${name}','${email}',0,0)`;
    await pool.query(query);
    for (let photo of photos) {
      console.log('photo in loop:', photo);
      console.log(typeof photo);
      const query = `INSERT INTO answers_photos(id,answer_id,url) VALUES((SELECT id+1 FROM answers_photos ORDER BY id DESC LIMIT 1),${newId},'${photo}')`;
      await pool.query(query);
    }
  } catch (err) {
    cb(err);
  }
}

async function markQuestion(type, question_id, cb) {
  try {
    console.log('type:', type);
    console.log('question_id:', question_id);
    if (type === 'helpful') {
      const query = `UPDATE questions SET helpful=helpful+1 WHERE id=${question_id}`;
      await pool.query(query);
    }
  } catch (err) {
    cb(err);
  }
}

module.exports = {
  pool,
  getQuestions,
  getAnswers,
  postQuestion,
  postAnswer,
  markQuestion,
};
