const redis = require('redis');
require('dotenv').config({ path: '../../.env' });

const client = redis.createClient(process.env.REDISPORT, process.env.REDISURL);

client.on('connect', function () {
  console.log('connected to redis');
});

const cacheGetListingMiddleWare = (req, res, next) => {
  let listId = req.query.data;

  client.get(listId, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(data);
    } else {
      next();
    }
  });
};

module.exports = { client, cacheGetListingMiddleWare };
