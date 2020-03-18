import React from 'react';

class ReviewText extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (<div>
      {this.props.reviews.text}
    </div>)
  }
}

export default ReviewText;