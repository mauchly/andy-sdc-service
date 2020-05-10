//==================================
// GENERATE DATA AND ADD TO CSV
//==================================
const faker = require('faker');
const fs = require('fs');

//To prevent memory leak when dealing with multiple events
require('events').EventEmitter.defaultMaxListeners = 10;

let listingsStream = fs.createWriteStream('../../data/myOutputListings.csv');
let reviewsStream = fs.createWriteStream('../../data/myOutputReviews.csv');

//==================================
// Helper Funcs for randYear and decimal floats
//==================================
const randYear = () => {
  let years = [2015, 2016, 2017, 2018, 2019, 2020];
  let rand = Math.floor(Math.random() * Math.floor(6));
  return years[rand];
};

const floatNum = () => {
  let rand1 = Math.floor(Math.random() * Math.floor(5));
  let rand2 = Math.floor(Math.random() * Math.floor(9));
  let result = rand1 + '.' + rand2;
  return +result;
};

//==================================
// Create Listings Query String func
//==================================
const listingQueryStr = (startIdx, endIdx) => {
  let listingStr = '';

  for (let i = startIdx; i <= endIdx; i++) {
    listingStr += i + '\n';
  }

  listingStr = listingStr.slice(0, -1);

  return listingStr;
};

//==================================
// Create Reviews Query String func
//==================================
const createReviewQueryStr = (listingId, num) => {
  let reviewStr = '';

  for (let i = 0; i < num; i++) {
    let date = faker.date.month() + ' ' + randYear();
    reviewStr += `'${faker.internet.userName()}', '${date}', '${faker.image.avatar()}', '${faker.lorem.sentence()}', ${listingId}, ${floatNum()}, ${floatNum()}, ${floatNum()}, ${floatNum()}, ${floatNum()}, ${floatNum()}\n`;
  }

  return reviewStr;
};

const totalReviewsQueryString = (id) => {
  const random = () => Math.floor(Math.random() * (4 - 1 + 1) + 1);

  let reviewStrTotal = '';

  for (let i = 0; i < 10000; i++) {
    reviewStrTotal += createReviewQueryStr(i + id, random());
  }

  return reviewStrTotal;
};

//==================================
// Record Generator for CSV file
//==================================

const recordGenerator = (dataFunc, stream) => {
  let listingId = 1;
  for (let i = 0; i < 1000; i++) {
    if (i === 0) {
      let result = dataFunc(listingId);
      let write = stream.write(result);
      if (!write) {
        stream.once('drain', dataFunc);
      }
    } else {
      listingId += 10000;
      let data = dataFunc(listingId);
      let write = stream.write(data);
      if (!write) {
        stream.once('drain', dataFunc);
      }
    }
    console.log('listingId', listingId);
  }
  stream.end();
};

// recordGenerator(totalReviewsQueryString, reviewsStream);
// recordGenerator(listingQueryStr, listingsStream);

//==================================
// PSQL Command
//==================================
// copy reviews(username, date, avatar, text, listing_id, communication, checkin, value, accuracy, location, cleanliness) from {csvFile} DELIMITER ',' CSV;
