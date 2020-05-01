const mongoose = require('mongoose');
mongoose.connect(
  'mongodb+srv://root:root@cluster0-3vond.mongodb.net/abreviews',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
); //127.0.0.1:27017

//check for DB connection...can be removed once DB is validated
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('connection established');
// });

let reviewsSchema = new mongoose.Schema({
  id: Number,
  name: String,
  reviews: [
    {
      username: String,
      date: String,
      text: String,
      avatar: String,
      scores: [
        {
          cleanliness: Number,
          communication: Number,
          checkin: Number,
          accuracy: Number,
          location: Number,
          value: Number,
        },
      ],
    },
  ],
});

let Reviews = mongoose.model('reviews', reviewsSchema);

module.exports = Reviews;
