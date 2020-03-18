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
      id: 10001,
      reviews: [],
      dataLoaded: false,
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

  // componentDidUpdate() {
  //   this.isLoaded();
  // }

  // handleChange(e) {
  //   e.preventDefault();
  //   let value = e.target.value;
  //   this.setState(() => ({id: value}));
  // }

  // isLoaded() {
  //   if (this.state.isLoaded === false && this.state.reviews !== []) {
  //     this.setState(() => ({dataLoaded: true}));
  //   }
  // }


render() {
  return (<div>
    {/* <select onChange={(e) => this.handleChange(e)}>
      {this.state.dataLoaded === true ? this.state.reviews.map((item, index) => {
        <option key={index}>Item: {item.id}</option>
      }): <option>Loading...</option>}
    </select> */}
    <Score reviews={this.state.reviews} />
    <br></br>
    <Ratings reviews={this.state.reviews} />
    <br></br>
    <Reviews reviews={this.state.reviews} />
  </div>)
}
}

ReactDOM.render(<App />, document.getElementById('app'));