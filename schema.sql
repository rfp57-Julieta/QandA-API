DROP TABLE IF EXISTS answers_photos;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS products;

CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  slogan text,
  description text,
  category VARCHAR(100),
  default_price VARCHAR(100)
);

CREATE TABLE questions(
  id SERIAL PRIMARY KEY,
  product_id INT references products(id),
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

COPY products
FROM '/Users/derekwing/hr/sdc/QandAAPI/products.csv'
DELIMITER ',' CSV HEADER;
COPY questions
FROM '/Users/derekwing/hr/sdc/QandAAPI/questions.csv'
DELIMITER ',' CSV HEADER;
COPY answers
FROM '/Users/derekwing/hr/sdc/QandAAPI/answers.csv'
DELIMITER ',' CSV HEADER;
COPY answers_photos
FROM '/Users/derekwing/hr/sdc/QandAAPI/answers_photos.csv'
DELIMITER ',' CSV HEADER;