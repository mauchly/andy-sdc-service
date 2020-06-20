const redis = require('redis');

const client = redis.createClient();

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
