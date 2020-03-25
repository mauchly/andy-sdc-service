//score.jsx
const score = (value) => {
  if (value.length === 0) {
    return 0;
  }
  let finalScore = 0;
  let helperScore = 0;
  let reviews = value[0].reviews;
  // console.log('value of reviews', JSON.stringify(value));
  for (let i = 0; i < reviews.length; i++) {
    let scores = reviews[i].scores[0];
    // console.log(scores);

    helperScore += +scores.cleanliness;
    helperScore += +scores.communication;
    helperScore += +scores.checkin;
    helperScore += +scores.accuracy;
    helperScore += +scores.location;
    helperScore += +scores.value;

    finalScore += (helperScore / 6);
    helperScore = 0;
  }
  return (finalScore / reviews.length);
}

const totalReviews = (value) => {
  if (value.length === 0) {
    return 0;
  } else {
    return value[0].reviews.length;
  }
}

//ratings.jsx

const border = (value, attr) => {
  console.log(((+attrScore(value, attr) * 20).toFixed(0) + '%').toString())
  return {
    'borderBottom': 'solid',
    'borderBottomWidth': '50%',
    'position': 'relative',
    'bottom': '10px',
    'left': '45px',
    'right': '105px',
    'paddingLeft': (((+attrScore(value, attr) * 20) + 5).toFixed(0) + 'px').toString(),
    'color': 'black',
  }
}

const attrScore = (value, attr) => {
  if (value.length === 0) {
    return 0;
  }
  let helperScore = 0;
  let reviews = value[0].reviews;
  // console.log('value of reviews', reviews.length);
  for (let i = 0; i < reviews.length; i++) {
    let scores = reviews[i].scores[0];
    // console.log(scores);
    helperScore += +scores[attr];
  }
  return (helperScore / reviews.length);
}

module.exports = {
  score,
  totalReviews,
  border,
  attrScore
}