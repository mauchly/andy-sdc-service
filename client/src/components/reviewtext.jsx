import React from 'react';

let textStyle = {
  lineHeight: '1.5',
};

class ReviewText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div style={textStyle}>{this.props.reviews.text}</div>;
  }
}

export default ReviewText;
