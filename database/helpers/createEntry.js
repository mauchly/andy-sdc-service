const faker = require("faker");
// const Reviews = require("./index.js");
// const mongoose = require("mongoose");

//TODO: Both rand functions are not optimized and may not be completely random
let randYear = () => {
  let years = [2015, 2016, 2017, 2018, 2019, 2020];
  let rand = Math.floor(Math.random() * Math.floor(6));
  return years[rand];
};

//Random rating number generator
let floatNum = () => {
  let rand1 = Math.floor(Math.random() * Math.floor(5));
  let rand2 = Math.floor(Math.random() * Math.floor(9));
  let result = rand1 + "." + rand2;
  return +result;
};

let sampleData = [];
let idIndex = 10101;
let names = ["Online_Bus_Integrated_house_4"];
let nameIndex = 0;


const createEntry = (idIndex, name, numberOfReviews) => {
//create reviews first
  let allReviews = [];
  // let reviewNum = Math.floor(Math.random() * Math.floor(20));
  let reviewNum = numberOfReviews;
  while (reviewNum > 0) {
    allReviews.push({
      username: faker.name.findName(),
      date: faker.date.month() + " " + randYear(),
      text: faker.lorem.paragraph(),
      avatar: faker.image.avatar(),
      scores: [],
    });
    reviewNum--;
  }

  //push to dataset
  sampleData.push({
    id: idIndex,
    name: name,
    reviews: allReviews,
  });

  return sampleData;
};


const entry = createEntry(10102, names[0], 14);

console.log(JSON.stringify(entry[0]));

//Clears DB and adds new data to DB
// Reviews.deleteMany({ id: { $gt: 1 } }, (err) => {
//   if (err) {
//     console.log("Error in DB clear");
//   } else {
//     console.log("DB cleared");
// Reviews.insertMany(sampleData, (err, result) => {
//   if (err) {
//     console.log("Error in sample data insert");
//   } else {
//     console.log("Successful sample data insert");
//     mongoose.connection.close();
//   }
// });
//   }
// });

//TODO: Is there a way to conclude a file running to give control back to command line?
