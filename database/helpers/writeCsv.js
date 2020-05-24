//==================================
// GENERATE DATA AND ADD TO CSV
//==================================
const faker = require('faker');
const fs = require('fs');

//To prevent memory leak when dealing with multiple events
require('events').EventEmitter.defaultMaxListeners = 10;

let listingsStream = fs.createWriteStream('../../data/myOutputListings.csv');
let reviewsStream = fs.createWriteStream('../../data/myOutputReviewsLarge.csv');

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
let listingHeader = `id\n`;

const listingQueryStr = (startIdx) => {
  let listingStr = '';
  let endIdx = startIdx + 9999;
  for (let i = startIdx; i <= endIdx; i++) {
    listingStr += i + '\n';
  }

  return listingStr;
};

//==================================
// Create Reviews Query String func
//==================================
let reviewsHeader =
  'id,username,date,avatar,text,listing_id,communication,checkin,value,accuracy,location,cleanliness\n';

const reviewStrGen = (reviewId, listingId) => {
  let date = faker.date.month() + ' ' + randYear();
  return `${reviewId},${faker.internet.userName()},${date},${faker.image.avatar()},${faker.lorem.sentence()},${listingId},${floatNum()},${floatNum()},${floatNum()},${floatNum()},${floatNum()},${floatNum()}\n`;
};

let reviewIdGlobal = 1;

const createReviews = (idxBlock) => {
  let reviewStr = '';
  const random = () => Math.floor(Math.random() * (4 - 1 + 1) + 1);

  for (let i = 0; i < 10000; i++) {
    let randomNum = random();

    for (let j = 0; j < randomNum; j++) {
      reviewStr += reviewStrGen(reviewIdGlobal, idxBlock + i);
      reviewIdGlobal++;
    }
  }
  return reviewStr;
};

//==================================
// CSV Generator for CSV file
//==================================

const createCSV = (dataGenFunc, stream, header) => {
  let listId = 1;

  // First 10K entries
  let entryStr = dataGenFunc(listId);
  stream.write(header);
  let ok = stream.write(entryStr);
  if (!ok) {
    stream.once('drain', dataGenFunc);
  }

  for (let i = 1; i < 1000; i++) {
    listId += 10000;
    let entryStr = dataGenFunc(listId);
    let ok = stream.write(entryStr);
    if (!ok) {
      stream.once('drain', dataGenFunc);
    }

    console.log('Current iterations: ', listId);
    if (reviewIdGlobal > 30000000) {
      break;
    }
  }

  stream.end();
};

// createCSV(createReviews, reviewsStream, reviewsHeader);
// createCSV(listingQueryStr, listingsStream, listingHeader);

//==================================
// PSQL Command
//==================================
// copy reviews(id, username, date, avatar, text, listing_id, communication, checkin, value, accuracy, location, cleanliness) from '{reviewsFilePath.csv}' DELIMITER ',' CSV HEADER;
// copy listings(id) from '{listingsFilePath.csv}' DELIMITER ',' CSV HEADER;
