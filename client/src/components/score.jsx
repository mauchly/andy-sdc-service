import React from 'react';

class Score extends React.Component {
  constructor(props) {
    super(props)

  }

  score(value) {
    if (value.length === 0) {
      return 0;
    }
    let finalScore = 0;
    let helperScore = 0;
    let reviews = value[0].reviews;
    console.log('value of reviews', reviews.length);
    for (let i = 0; i < reviews.length; i++) {
      let scores = reviews[i].scores[0];
      console.log(scores);

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

  render() {
    return (<div>
      Score: {(this.score(this.props.reviews)).toFixed(1)}
    </div>)
  }
}

export default Score;