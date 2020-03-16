import React from 'react';
import ReviewText from './reviewtext.jsx';
import Profile from './profile.jsx';

class Review extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (<div>
      <Profile reviews={this.props.reviews}/>
      <ReviewText reviews={this.props.reviews}/>
    </div>)
  }
}

export default Review;