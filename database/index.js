const mongoose = require('mongoose');
const dbUrl = require('./database.config');
mongoose.connect(
  dbUrl,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

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
