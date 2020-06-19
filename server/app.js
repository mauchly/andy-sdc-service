const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

//Database and redis
const db = require('../database/postgres/index');
const redis = require('redis');

//Compressors
const expressStaticGzip = require('express-static-gzip');
const postgresDataSyntax = require('./helpers/helpers');

//Controllers
const { getAvgScore, getListing } = require('./controllers/index');

const app = express();
app.use(cors());
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/',
  expressStaticGzip(path.join(__dirname + '/../public'), { enableBrotli: true })
);

const client = redis.createClient();

client.on('connect', function () {
  console.log('connected to redis');
});

const cacheGetListingMiddleWare = (req, res, next) => {
  let listId = req._parsedOriginalUrl.query.split('=')[1];

  client.get(listId, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

//For other services, Get avg score & # of reviews e.g. '2.78, 12 reviews'
// app.get('/averageScore/:id', getAvgScore);

//Get listing by id
app.get('/listing', cacheGetListingMiddleWare, getListing);

//====================================
//Post, Put, Delete
//====================================

//Post listing
app.post('/listing', async (req, res) => {
  // Create new {id} for new review
  let maxId = await (await db.query('SELECT max(id) FROM reviews')).rows[0].max;
  const newId = ++maxId;

  // Create new {listing_id} for new review
  let maxListingId = await (
    await db.query('SELECT max(listing_id) FROM reviews')
  ).rows[0].max;
  const newListingId = ++maxListingId;

  // Create query string for columns and values with new {id} and {listing_id}
  let columns = `id, listing_id, ${Object.keys(req.body).join(', ')}`;
  let values = `${newId}, ${newListingId}, ${Object.values(req.body)
    .map((entry, i) => (i < 4 ? `'${entry}'` : entry))
    .join(', ')}`;

  const queryResListing = await db.query(
    `INSERT INTO listings(id) VALUES(${newListingId})`
  );

  const queryResReview = await db.query(
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

  const response = await db.query(sqlString);

  res.send(response);
});

//delete listing
app.delete('/listing/:id', async (req, res) => {
  const response = await db.query(
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
