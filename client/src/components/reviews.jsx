import React from 'react';
import Review from './review.jsx';

let divStyle = {
  'fontFamily': 'Roboto',
  'display': 'grid',
  'gridTemplateColumns': '1fr 1fr',
  'gridTemplateRows': '1fr',
}

class Reviews extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (<div style={divStyle}>
      {this.props.reviews.length > 0 &&
        this.props.reviews[0].reviews.map((item, index) => {
        return <Review key={index} reviews={item} />
      })}
    </div>)
  }
}

export default Reviews;