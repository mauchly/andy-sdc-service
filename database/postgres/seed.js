//==================================
// POSTGRES DB SEED WITH SQL QUERY
//==================================
const client = require('./index');
const faker = require('faker');

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
    listingStr += `(${i}),`;
  }

  listingStr = listingStr.slice(0, -1);

  return `INSERT INTO listings (id)
  VALUES ${listingStr};`;
};

//==================================
// Create Reviews Query String func
//==================================
const createReviewQueryStr = (id, num) => {
  let reviewStr = '';

  for (let i = 0; i < num; i++) {
    reviewStr += `('${faker.internet.userName()}',
                  '${faker.date.month() + ' ' + randYear()}',
                  '${faker.lorem.paragraph()}',
                  '${faker.image.avatar()}',
                  ${floatNum()},
                  ${floatNum()},
                  ${floatNum()},
                  ${floatNum()},
                  ${floatNum()},
                  ${floatNum()},
                  ${id}),`;
  }

  return reviewStr;
};

const totalReviewsQueryString = (startId, endId) => {
  const random = () => Math.floor(Math.random() * (20 - 1 + 1) + 1);

  let reviewStrTotal = '';

  for (let i = startId; i <= endId; i++) {
    reviewStrTotal += createReviewQueryStr(i, random());
  }

  reviewStrTotal = reviewStrTotal.slice(0, -1);
  return `INSERT INTO reviews (username, date, text, avatar, communication, checkin, value, accuracy, location, cleanliness, listing_id)
          VALUES ${reviewStrTotal};`;
};

//==================================
// Add query strings to Database
//==================================

// let listingInputStr = listingQueryStr(10);
// let reviewsQueryString = totalReviewsQueryString(1, 20);

// const dataEntryThread = async (count) => {
//   let listingStr1 = listingQueryStr(count, count + 9999);
//   let reviewsStr1 = totalReviewsQueryString(count, count + 9999);

//   console.log(count, 'idx start');
//   console.log(count + 9999, 'idx end');

//   try {
//     let listingResponse = await client.query(listingStr1);
//   } catch (err) {
//     throw err;
//   }

//   if (listingResponse) {
//     try {
//       let queryResponse = await client.query(reviewsStr1);
//     } catch (err) {
//       throw err;
//     }
//   }
// };

//==================================
// Seed database with 100K listings and ~1M reviews
//==================================
const seedData = async () => {
  let count = 1;

  while (count <= 100000) {
    let listingStr1 = listingQueryStr(count, count + 9999);
    let reviewsStr1 = totalReviewsQueryString(count, count + 9999);

    console.log(count);

    let listingResponse = await client.query(listingStr1);
    if (listingResponse) {
      let queryResponse = await client.query(reviewsStr1);
    }

    count += 10000;
  }

  client.end();
  console.log('data seeded!');
};
