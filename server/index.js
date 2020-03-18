const express = require('express');
const path = require('path');
const { Reviews } = require('../database/index');

let app = express();

app.use(express.static('public'));
app.use(express.text());
app.use(express.urlencoded());

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

app.get('/averageScore', (req, res) => {
  Reviews.find({id: 10001}, (err, result) => {
    if (err) {
      console.log('error in averageScore', err);
      res.sendStatus(404);
    } else {
      if (result.length === 0) {
        return 0;
      }
      let finalScore = 0;
      let helperScore = 0;
      let reviews = result[0].reviews;
      // console.log('value of reviews', reviews.length);
      for (let i = 0; i < reviews.length; i++) {
        let scores = reviews[i].scores[0];
        // console.log(scores);

        helperScore += +scores.cleanliness;
        helperScore += +scores.communication;
        helperScore += +scores.checkin;
        helperScore += +scores.accuracy;
        helperScore += +scores.location;
        helperScore += +scores.value;

        finalScore += (helperScore / 6);
        helperScore = 0;
      }
      res.end((finalScore / reviews.length).toFixed(2).toString());
    }
  })
})

app.get('/listing', (req, res) => {
  console.log('listing', req.query.data);
  let listId = req.query.data;
  Reviews.find({id: listId}, (err, result) => {
    if (err) {
      console.log('error in Reviews.find', err);
      res.sendStatus(404);
    } else {
      res.send(result);
    }
  })
});

app.get('/:id', (req, res) => {
  console.log('send file');
  res.sendFile(path.join(__dirname, '../public', '/index.html'));
});

app.listen(3004, () => {
  console.log('Express server for REVIEWS listening on port 3004');
});