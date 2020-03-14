const express = require('express');
const path = require('path');

let app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('initial GET request');
  res.sendStatus(200);
});

app.listen(3004, () => {
  console.log('Express server for REVIEWS listening on port 3004');
});