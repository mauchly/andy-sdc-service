const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const client = require('../database/postgres/index');
const expressStaticGzip = require('express-static-gzip');
const postgresDataSyntax = require('./helpers/helpers');

const app = express();
app.use(cors());
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/',
  expressStaticGzip(path.join(__dirname + '/../public'), { enableBrotli: true })
);

//For other services, Get avg score & # of reviews e.g. '2.78, 12 reviews'
app.get('/averageScore/:id', (req, res) => {
  let listId = req.params.id;

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
});

//Get listing by id
app.get('/listing', async (req, res) => {
  let listId = req.query.data || 10001;

  const data = await client.query(
    `SELECT * FROM reviews where listing_id = ${listId};`
  );

  let reviews = postgresDataSyntax(data.rows);

  res.send(reviews);
});

//Post listing
app.post('/listing', async (req, res) => {
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

  const queryResListing = await client.query(
    `INSERT INTO listings(id) VALUES(${newListingId})`
  );

  const queryResReview = await client.query(
    `INSERT INTO reviews(${columns}) VALUES(${values});`
  );

  res.send([queryResListing, queryResReview]);
});

//put listing
app.put('/listing/:id', async (req, res) => {
  const reviewId = parseInt(req.params.id);
  const sqlSetString = Object.entries(req.body)
    .map((entry) => {
      if (
        entry[0] === 'username' ||
        entry[0] === 'date' ||
        entry[0] === 'avatar' ||
        entry[0] === 'text'
      ) {
        return [`${entry[0]} = '${entry[1]}'`];
      } else {
        return entry.join(' = ');
      }
    })
    .join(', ');

  const sqlString = `UPDATE reviews SET ${sqlSetString} WHERE id = ${reviewId};`;

  const response = await client.query(sqlString);

  res.send(response);
});

//delete listing
app.delete('/listing/:id', async (req, res) => {
  const response = await client.query(
    `DELETE from reviews where listing_id = ${parseInt(req.params.id)}`
  );

  res.send(response);
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
