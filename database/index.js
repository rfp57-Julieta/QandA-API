const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'newuser',
  password: 'password',
  database: 'qanda',
  port: 5432,
});

client
  .connect()
  .then((res) => {
    console.log('Connect to Postgres successfully!');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  client,
};
