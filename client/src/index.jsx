import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Score from './components/score.jsx';
import Ratings from './components/ratings.jsx';
import Reviews from './components/reviews.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: []
    }
  }

  componentDidMount() {
    $.ajax({
      type: 'GET',
      url: "http://127.0.0.1:3004/onload",
      success: (results) => {
        this.setState(() => ({reviews: results}));
      },
      error: () => {
        console.log('error in onload API call');
      }
    });
  }


render() {
  return (<div>
    <h1>AirBnB Reviews</h1>
    <Score />
    <Ratings />
    <Reviews />
  </div>)
}
}

ReactDOM.render(<App />, document.getElementById('app'));