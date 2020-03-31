import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Score from './components/score.jsx';
import Ratings from './components/ratings.jsx';
import Reviews from './components/reviews.jsx';
import pic1 from '!file-loader!../../AfterReviewsHardcodePhoto1.png';
import pic2 from '!file-loader!../../AfterReviewsHardcodePhoto2.png';
import pic3 from '!file-loader!../../AfterReviewsHardcodePhoto3.png';

const imgStyle = {
  'width': '100%',
  'height': '100%',
  'position': 'relative',
  'right': '200px'
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      dataLoaded: false,
    }
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
      url: "http://127.0.0.1:3004/listing",
      data: {data: listingId},
      dataType: 'text',
      success: (results) => {
        let state = JSON.parse(results);
        this.setState(() => ({reviews: state}));
      },
      error: () => {
        console.log('error in onload API call');
      }
    });
  }

render() {
  return (<div>
    <Score reviews={this.state.reviews} />
    <br></br>
    <Ratings reviews={this.state.reviews} />
    <br></br>
    <Reviews reviews={this.state.reviews} />
    <img src={pic1} style={imgStyle} alt='Hardcode1' />
    <img src={pic2} style={imgStyle} alt='Hardcode2' />
    <img src={pic3} style={imgStyle} alt='Hardcode3' />
  </div>)
}
}

ReactDOM.render(<App />, document.getElementById('reviews'));