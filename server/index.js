const express = require('express');
const client = require('../database/index.js');

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
