import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 100, //stimulate how many virtual users
  duration: '15s', //how long you want it to run
};

//Below randomize the endpoints
const questionsURL = `http://localhost:3000/qa/questions?product_id=${
  Math.floor(Math.random() * (1000000 - 1 + 1)) + 1
}`;
const answersURL = `http://localhost:3000/qa/questions/:question_id/answers?question_id=${
  Math.floor(Math.random() * (1000000 - 1 + 1)) + 1
}`;

export default function () {
  const res = http.get(answersURL);
  sleep(1);
  check(res, {
    'transaction time < 200ms': (r) => r.timings.duration < 200,
    'transaction time < 500ms': (r) => r.timings.duration < 500,
    'transaction time < 1000ms': (r) => r.timings.duration < 1000,
    'transaction time < 2000ms': (r) => r.timings.duration < 2000,
  });
}
