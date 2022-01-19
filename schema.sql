DROP TABLE IF EXISTS answers_photos;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;

CREATE TABLE questions(
  id SERIAL PRIMARY KEY,
  product_id INT,
  body text,
  date_written BIGINT,
  asker_name VARCHAR(100),
  asker_email VARCHAR(100),
  reported INT,
  helpful INT
);

CREATE TABLE answers(
  id SERIAL PRIMARY KEY,
  question_id INT references questions(id),
  body text,
  date_written BIGINT,
  answerer_name VARCHAR(100),
  answerer_email VARCHAR(100),
  reported INT,
  helpful INT
);

CREATE TABLE answers_photos(
  id SERIAL PRIMARY KEY,
  answer_id INT references answers(id),
  url VARCHAR(200)
);

\COPY questions FROM '/Users/derekwing/hr/sdc/QandAAPI/questions.csv' DELIMITER ',' CSV HEADER;
\COPY answers FROM '/Users/derekwing/hr/sdc/QandAAPI/answers.csv' DELIMITER ',' CSV HEADER;
\COPY answers_photos FROM '/Users/derekwing/hr/sdc/QandAAPI/answers_photos.csv' DELIMITER ',' CSV HEADER;

CREATE INDEX product_id_idx ON questions(product_id);
CREATE INDEX question_id_idx ON answers(question_id);
CREATE INDEX answers_photos_idx ON answers_photos(answer_id);

-- Before adding index:
-- getQuestion average query time: 2.5 seconds
-- getAnswer average query time: 900 ms