//==================================
// GENERATE DATA AND ADD TO CSV
//==================================
const faker = require('faker');
const fs = require('fs');

//To prevent memory leak when dealing with multiple events
require('events').EventEmitter.defaultMaxListeners = 10;

// let listingsStream = fs.createWriteStream('../../data/myOutputListings.csv');
let reviewsStream = fs.createWriteStream(
  '../../data/myOutputReviewsLargeCouch.csv'
);

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

const createCSV = (dataGenFunc, stream) => {
  let listId = 1;

  // First 10K entries
  let entryStr = dataGenFunc(listId);
  stream.write(reviewsHeader);
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

// createCSV(createReviews, reviewsStream);
// createCSV(listingQueryStr, listingsStream);

//==================================
// PSQL Command
//==================================
// copy reviews(id, username, date, avatar, text, listing_id, communication, checkin, value, accuracy, location, cleanliness) from '{filePath.csv}' DELIMITER ',' CSV HEADER;

//==================================
// CouchDB Command
//==================================
// create couchDB document
// curl -X PUT http://{username:password}@localhost:5984/{dbName}

// Seed couchDB from CSV
// cat {csvFilePath} | couchimport --url http://{username:password}@localhost:5984 --db abreviews
// cat myOutputReviewsLargeCouch.csv | couchimport --url http://{username:password}@localhost:5984 --db abreviews --delimiter ','
