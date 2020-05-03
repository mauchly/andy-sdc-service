import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Score from './components/score.jsx';
import Ratings from './components/ratings.jsx';
import Reviews from './components/reviews.jsx';
const port = 5000;
// import pic1 from '!file-loader!../../img/AfterReviewsHardcodePhoto1.png';
// import pic2 from '!file-loader!../../img/AfterReviewsHardcodePhoto2.png';
// import pic3 from '!file-loader!../../img/AfterReviewsHardcodePhoto3.png';

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
      url: `http://localhost:${port}/listing`,
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
