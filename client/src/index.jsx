import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Score from './components/score.jsx';
import Ratings from './components/ratings.jsx';
import Reviews from './components/reviews.jsx';
import Dotenv from 'dotenv';
Dotenv.config();
const port = process.env.PORT || 3004;
const localApiUrl = `http://localhost:${port}/listing`;
const awsAPIUrl = `http://ec2-54-193-53-224.us-west-1.compute.amazonaws.com/listing`;

const imgStyle = {
  width: '80%',
  height: '80%',
  position: 'relative',
  right: '125px',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      dataLoaded: false,
    };
  }

  //get URL, split, pass data to get listing information and pass to state as reviews.
  componentDidMount() {
    let url = window.location.href;
    let listingId;
    if (url.split.length) {
      listingId = url.split('/').pop();
    } else {
      listingId = '10001';
    }

    $.ajax({
      type: 'GET',
      url: awsAPIUrl,
      data: { data: listingId },
      dataType: 'text',
      success: (results) => {
        let state = JSON.parse(results);
        this.setState(() => ({ reviews: state }));
      },
      error: () => {
        console.log('error in onload API call');
      },
    });
  }

  render() {
    return (
      <div>
        <div id='reviewSection'>
          <Score reviews={this.state.reviews} />
          <br></br>
          <Ratings reviews={this.state.reviews} />
          <br></br>
          <Reviews reviews={this.state.reviews} />
        </div>
        <img
          src='https://fec-photos-3004.s3-us-west-1.amazonaws.com/AfterReviewsHardcodePhoto2.png'
          style={imgStyle}
          alt='Hardcode2'
          id='Hardcode2'
        />
        <img
          src='https://fec-photos-3004.s3-us-west-1.amazonaws.com/AfterReviewsHardcodePhoto1.png'
          style={imgStyle}
          alt='Hardcode1'
          id='Hardcode1'
        />
        <img
          src='https://fec-photos-3004.s3-us-west-1.amazonaws.com/AfterReviewsHardcodePhoto3.png'
          style={imgStyle}
          alt='Hardcode3'
          id='Hardcode3'
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('reviews'));
