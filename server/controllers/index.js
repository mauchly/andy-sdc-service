const db = require('../../database/postgres/index');
const postgresDataSyntax = require('../helpers/helpers');

const redis = require('redis');
const client = redis.createClient();

client.on('connect', function () {
  console.log('connected to redis');
});

const setAvgResponse = (finalScore, reviews, reviewNumber) => {
  return `${(finalScore / reviews.length)
    .toFixed(2)
    .toString()}, (${reviewNumber} reviews)`;
};

const getAvgScore = (req, res, next) => {
  let listId = req.params.id;
  db.query(
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

        let avgScoreData = setAvgResponse(finalScore, reviews, reviewNumber);

        res.send(avgScoreData);
      }
    }
  );
};

const getListing = async (req, res, next) => {
  let listId = req.query.data || 10001;

  const data = await db.query(
    `SELECT * FROM reviews where listing_id = ${listId};`
  );

  let reviews = postgresDataSyntax(data.rows);

  client.setex(listId, 3600, JSON.stringify(reviews));

  res.send(reviews);
};

module.exports = { getAvgScore, getListing };
