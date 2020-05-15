const express = require('express');
const path = require('path');
const cors = require('cors');
// const Reviews = require('../database/mongo');
const client = require('../database/postgres/index');
var expressStaticGzip = require('express-static-gzip');
const postgresDataSyntax = require('./helpers');

let app = express();
app.use(cors());
// app.use(express.static('public'));
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(
  '/',
  expressStaticGzip(path.join(__dirname + '/../public'), { enableBrotli: true })
);

//For other services, Get avg score & # of reviews e.g. '2.78, 12 reviews'
app.get('/averageScore/:id', (req, res) => {
  let listId = req.params.id;

  //=======================================
  // POSTGRES QUERY
  //=======================================
  client.query(
    `SELECT * FROM reviews where listing_id = ${listId};`,
    (err, result) => {
      result = postgresDataSyntax(result.rows);

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
        let reviewNumber = reviews.length;
        for (let i = 0; i < reviews.length; i++) {
          let scores = reviews[i].scores[0];
          helperScore += +scores.cleanliness;
          helperScore += +scores.communication;
          helperScore += +scores.checkin;
          helperScore += +scores.accuracy;
          helperScore += +scores.location;
          helperScore += +scores.value;
          finalScore += helperScore / 6;
          helperScore = 0;
        }
        res.end(
          `${(finalScore / reviews.length)
            .toFixed(2)
            .toString()}, (${reviewNumber} reviews)`
        );
      }
    }
  );

  //=======================================
  // MONGO QUERY
  //=======================================

  // Reviews.find({ id: listId }, (err, result) => {
  //   if (err) {
  //     console.log('error in averageScore', err);
  //     res.sendStatus(404);
  //   } else {
  //     if (result.length === 0) {
  //       return 0;
  //     }
  //     let finalScore = 0;
  //     let helperScore = 0;
  //     let reviews = result[0].reviews;
  //     let reviewNumber = reviews.length;
  //     for (let i = 0; i < reviews.length; i++) {
  //       let scores = reviews[i].scores[0];

  //       helperScore += +scores.cleanliness;
  //       helperScore += +scores.communication;
  //       helperScore += +scores.checkin;
  //       helperScore += +scores.accuracy;
  //       helperScore += +scores.location;
  //       helperScore += +scores.value;

  //       finalScore += helperScore / 6;
  //       helperScore = 0;
  //     }
  //     res.end(
  //       `${(finalScore / reviews.length)
  //         .toFixed(2)
  //         .toString()}, (${reviewNumber} reviews)`
  //     );
  //   }
  // });
});

//Get listing by id
app.get('/listing', async (req, res) => {
  let listId = req.query.data || 10001;

  let reg = /\d{5}/;
  //test to see if id num or listing string
  let result = reg.test(listId);

  //=======================================
  // POSTGRES QUERY
  //=======================================
  const data = await client.query(
    `SELECT * FROM reviews where listing_id = ${listId};`
  );

  let reviews = postgresDataSyntax(data.rows);
  res.send(reviews);

  //=======================================
  // MONGO QUERY
  //=======================================

  //if text of listing...
  // if (!result) {
  //   Reviews.find({ name: listId }, (err, result) => {
  //     if (err) {
  //       console.log('error in Reviews.find', err);
  //       res.sendStatus(404);
  //     } else {
  //       res.send(result);
  //     }
  //   });
  //   //else if id of listing...
  // } else {
  //   Reviews.find({ id: listId }, (err, result) => {
  //     if (err) {
  //       console.log('error in Reviews.find', err);
  //       res.sendStatus(404);
  //     } else {
  //       res.send(result);
  //     }
  //   });
  // }
});

//Post listing
app.post('/listing', async (req, res) => {
  //=======================================
  // POSTGRES QUERY
  //=======================================

  // Create new {id} for new review
  let maxId = await (await client.query('SELECT max(id) FROM reviews')).rows[0]
    .max;
  const newId = ++maxId;

  // Create new {listing_id} for new review
  let maxListingId = await (
    await client.query('SELECT max(listing_id) FROM reviews')
  ).rows[0].max;
  const newListingId = ++maxListingId;

  // Create query string for columns and values with new {id} and {listing_id}
  let columns = `id, listing_id, ${Object.keys(req.body).join(', ')}`;
  let values = `${newId}, ${newListingId}, ${Object.values(req.body)
    .map((entry, i) => (i < 4 ? `'${entry}'` : entry))
    .join(', ')}`;

  console.log(`INSERT INTO reviews(${columns}) VALUES(${values});`);
  // const queryResListing = await client.query(
  //   `INSERT INTO listings(id) VALUES(${newListingId})`
  // );

  // const queryResReview = await client.query(
  //   `INSERT INTO reviews(${columns}) VALUES(${values});`
  // );

  // res.send([queryResListing, queryResReview]);

  //=======================================
  // MONGO QUERY
  //=======================================

  // Reviews.create(req.body, (err, entry) => {
  //   if (err) {
  //     console.log(err);
  //     res.sendStatus(400);
  //   } else {
  //     res.send(entry);
  //   }
  // });
});

//put listing
app.put('/listing/:id', (req, res) => {
  Reviews.findOneAndUpdate({ id: req.params.id }, req.body, (err, entry) => {
    if (err) {
      res.send(400);
      console.log(err);
    } else {
      res.send(entry);
      console.log('Update Success!');
    }
  });
});

//delete listing
app.delete('/listing/:id', (req, res) => {
  console.log(req.params.id);

  Reviews.findOneAndDelete({ id: req.params.id }, (err, entry) => {
    if (err) {
      res.send(400);
      console.log(err);
    } else {
      res.send(entry);
      console.log('Delete Success!');
    }
  });
});

//Route to get index.html back after updating state
app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/index.html'));
});

const port = process.env.PORT || 3004;

app.listen(port, () => {
  console.log(`Express server for REVIEWS listening on port ${port}`);
});

module.exports = app;
