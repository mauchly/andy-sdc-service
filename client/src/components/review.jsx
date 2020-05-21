import React from 'react';
import ReviewText from './reviewtext.jsx';
import Profile from './profile.jsx';

let divStyle = {
  fontFamily: 'Roboto',
  padding: '20px',
  position: 'relative',
  right: '10px',
};

class Review extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={divStyle}>
        <div>
          <Profile reviews={this.props.reviews} />
          <br></br>
          <ReviewText reviews={this.props.reviews} />
        </div>
        <br></br>
      </div>
    );
  }
}

export default Review;
