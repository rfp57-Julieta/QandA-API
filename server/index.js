require('newrelic');
const express = require('express');
const {
  pool,
  getQuestions,
  getAnswers,
  postQuestion,
  postAnswer,
  markQuestion,
  markAnswer,
} = require('../database/index.js');

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
  let questions = await getQuestions(req.query.product_id, (err) => {
    if (err) {
      res.status(400).send(err);
    }
  });
  res.status(200).send(questions);
});

app.get('/qa/questions/:question_id/answers', async (req, res) => {
  // req.params and req.query depends on what the client(FEC) sends us
  // req.query comes from postman/thunderclient
  // console.log('req.params:', req.params);
  // console.log('req.query:', req.query);
  let answers = await getAnswers(req.query.question_id, (err) => {
    if (err) {
      res.status(400).send(err);
    }
  });
  res.status(200).send(answers);
});

app.post('/qa/questions', async (req, res) => {
  console.log('req.query:', req.query);
  await postQuestion(
    req.query.body,
    req.query.name,
    req.query.email,
    req.query.product_id,
    (err) => {
      if (err) {
        res.status(400).send(err);
      }
    }
  );
  res.status(201).send('Successfully posted question to server..');
});

app.post('/qa/questions/:question_id/answers', async (req, res) => {
  console.log('req.query:', req.query);
  let photos = [];
  let parsePhotos = req.query.photos.substring(1, req.query.photos.length - 1);
  console.log('parsePhotos:', parsePhotos);
  if (parsePhotos === '[]') {
    console.log('No photos');
  }
  if (parsePhotos.indexOf(',') < 0 && parsePhotos !== '[]') {
    console.log('Only one photo exists');
    photos.push(parsePhotos);
  }
  if (parsePhotos.indexOf(',') >= 0) {
    console.log('More than one photo exists');
    photos = parsePhotos.split(',');
  }
  // console.log('photos:', photos);
  await postAnswer(
    req.query.body,
    req.query.name,
    req.query.email,
    req.query.question_id,
    photos,
    (err) => {
      if (err) {
        res.status(400).send(err);
      }
    }
  );
  res.status(201).send('Successfully posted question to server..');
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  markQuestion('helpful', req.query.question_id);
  res.status(204).send('Successfully marked question as helpful');
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  markQuestion('report', req.query.question_id);
  res.status(204).send('Successfully reported question');
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  markAnswer('helpful', req.query.answer_id);
  res.status(204).send('Successfully marked answer as helpful');
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  markAnswer('report', req.query.answer_id);
  res.status(204).send('Successfully reported answer');
});
