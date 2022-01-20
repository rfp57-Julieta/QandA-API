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
    // console.log('hey');
    // let package = {
    //   product_id: product_id,
    // };

    // const agg_query = `
    //   SELECT json_build_object(
    //     'product_id', ${product_id},
    //     'results', (SELECT json_agg(json_build_object(
    //       question_id
    //     )) FROM (SELECT id AS question_id, body as question_body, date_written as question_date, asker_name, helpful as question_helpfulness,reported FROM questions WHERE product_id=${product_id} LIMIT 3) as questions)
    //   )
    // `;

    // const agg_query = `
    //   SELECT json_build_object(
    //     'product_id', ${product_id},
    //     'results', (SELECT json_agg(questions) FROM (SELECT id AS question_id, body as question_body, date_written as question_date, asker_name, helpful as question_helpfulness,reported FROM questions WHERE product_id=${product_id} LIMIT 3) as questions)
    //   )
    // `;

    // const agg_query = `
    //   SELECT json_agg(questions)
    //   FROM (SELECT id AS question_id, body as question_body, date_written as question_date, asker_name, helpful as question_helpfulness,reported FROM questions WHERE product_id=${product_id} LIMIT 3) as questions;
    // `;

    // let agg_questions_data = await pool.query(agg_query);
    // console.log(
    //   'agg_questions_data.rows:',
    //   agg_questions_data.rows[0].json_build_object
    // );
    // let package = agg_questions_data.rows[0].json_build_object;
    // package['results'] = agg_questions_data.rows[0].json_agg;

    // for (let question of agg_questions_data.rows[0].json_agg) {
    //   const question_id = question.question_id;
    //   console.log('question_id:', question_id);
    //   const agg_query = `SELECT json_build_object('id', id) FROM (SELECT id FROM answers WHERE question_id=${question_id} LIMIT 3) as answers`;
    //   let agg_answers_data = await pool.query(agg_query);
    //   console.log('agg_answers_data.rows:', agg_answers_data.rows);
    // }

    // Below is original code before applying json_agg
    let package = {
      product_id: product_id,
    };
    let results = [];
    const query = `SELECT id, body, TO_TIMESTAMP(date_written/1000), asker_name, helpful, reported FROM questions WHERE product_id=${product_id}`;
    let questions_data = await pool.query(query);
    for (let question of questions_data.rows) {
      let reported = false;
      if (question.reported > 0) {
        reported = true;
      }
      let question1 = {
        question_id: question.id,
        question_body: question.body,
        question_date: question.to_timestamp,
        asker_name: question.asker_name,
        question_helpfulness: question.helpful,
        reported: reported,
      };
      const question_id = question.id;
      const query = `SELECT id,body,TO_TIMESTAMP(date_written/1000),answerer_name,helpful FROM answers WHERE question_id=${question_id}`;
      let answers = {};
      let answers_data = await pool.query(query);
      for (let answer of answers_data.rows) {
        const answer_id = answer.id;
        const query = `SELECT * FROM answers_photos WHERE answer_id=${answer_id}`;
        const photos_data = await pool.query(query);
        let photos_urls = [];
        for (let photo of photos_data.rows) {
          photos_urls.push(photo.url);
        }
        answers[answer_id] = {
          id: answer.id,
          body: answer.body,
          date: answer.to_timestamp,
          answerer_name: answer.answerer_name,
          helpfulness: answer.helpful,
          photos: photos_urls,
        };
        question1['answers'] = answers;
        results.push(question1);
      }
    }
    package['results'] = results;
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
    let results = [];
    const query = `SELECT id,body,TO_TIMESTAMP(date_written/1000),answerer_name,helpful FROM answers WHERE question_id=${question_id}`;
    const answers_data = await pool.query(query);
    for (let answer of answers_data.rows) {
      answer1 = {
        answer_id: answer.id,
        body: answer.body,
        date: answer.to_timestamp,
        answerer_name: answer.answerer_name,
        helpfulness: answer.helpful,
      };
      let photos_urls = [];
      const answer_id = answer.id;
      const query = `SELECT * FROM answers_photos WHERE answer_id=${answer_id}`;
      const photos_data = await pool.query(query);
      for (let photo of photos_data.rows) {
        let photo1 = {
          id: photo.id,
          url: photo.url,
        };
        photos_urls.push(photo1);
      }
      answer1['photos'] = photos_urls;
      results.push(answer1);
    }
    package['results'] = results;
    return package;
  } catch (err) {
    cb(err);
  }
}

async function postQuestion(body, name, email, product_id, cb) {
  try {
    let currentDate = new Date() * 1000;
    const query = `INSERT INTO questions(id,product_id,body,date_written,asker_name,asker_email,reported,helpful) VALUES ((SELECT id+1 FROM questions ORDER BY id DESC LIMIT 1),${product_id},'${body}',${currentDate},'${name}','${email}',0,0)`;
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
    let currentDate = new Date() * 1000;
    const query = `INSERT INTO answers(id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful) VALUES (${newId},${question_id},'${body}',${currentDate},'${name}','${email}',0,0)`;
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
    if (type === 'report') {
      const query = `UPDATE questions SET reported=reported+1 WHERE id=${question_id}`;
      await pool.query(query);
    }
  } catch (err) {
    cb(err);
  }
}

async function markAnswer(type, answer_id, cb) {
  try {
    console.log('type:', type);
    console.log('answer_id:', answer_id);
    if (type === 'helpful') {
      const query = `UPDATE answers SET helpful=helpful+1 WHERE id=${answer_id}`;
      await pool.query(query);
    }
    if (type === 'report') {
      const query = `UPDATE answers SET reported=reported+1 WHERE id=${answer_id}`;
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
  markAnswer,
};
