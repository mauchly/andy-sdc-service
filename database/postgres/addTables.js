const client = require('./index');

const listingsQuery = `
CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY
);
`;

const reviewsQuery = `
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    username TEXT,
    date TEXT,
    avatar TEXT,
    text TEXT,
    listing_id INT,
    communication NUMERIC (2, 1),
    checkin NUMERIC (2, 1),
    value NUMERIC (2, 1),
    accuracy NUMERIC (2, 1),
    location NUMERIC (2, 1),
    cleanliness NUMERIC (2, 1),
    FOREIGN KEY(listing_id) REFERENCES listings(id)
);
`;

client
  .query(listingsQuery)
  .then(() => {
    console.log('Listing is successfully created');
  })
  .then(() => {
    client.query(reviewsQuery);
  })
  .then(() => {
    console.log('Reviews is successfully created');
    client.end();
  })
  .catch((err) => {
    console.error(err);
  });
