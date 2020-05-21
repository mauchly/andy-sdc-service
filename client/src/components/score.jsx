import React from 'react';
// import star from '!file-loader!../../../img/airbnb_star.png';
import { score, totalReviews } from '../../helperFunc.js';

let divStyle = {
  fontFamily: 'Roboto',
  fontSize: '18px',
  fontWeight: 'bold',
};

let imgStyle = {
  width: '23px',
  height: '23px',
  position: 'relative',
  top: '4px',
};

class Score extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={divStyle}>
        <img
          src='https://fec-photos.s3-us-west-1.amazonaws.com/otherPics/airbnb_star.png'
          alt='Star'
          style={imgStyle}
        />{' '}
        {score(this.props.reviews).toFixed(2)} (
        {totalReviews(this.props.reviews)} reviews)
      </div>
    );
  }
}

export default Score;
