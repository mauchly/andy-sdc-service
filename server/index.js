const express = require('express');
const path = require('path');
const { Reviews } = require('../database/index');

let app = express();

app.use(express.static('public'));
app.use(express.text());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  console.log('initial GET request');
  res.sendStatus(200);
});

app.get('/onload', (req, res) => {
  console.log('onload GET request');
  Reviews.find({id: 10001}, (err, result) => {
    if (err) {
      console.log('error in Reviews.find', err);
      res.sendStatus(404);
    } else {
      res.send(result);
    }
  })
});


app.listen(3004, () => {
  console.log('Express server for REVIEWS listening on port 3004');
});