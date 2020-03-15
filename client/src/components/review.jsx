import React from 'react';
import ReviewText from './reviewtext.jsx';
import Profile from './profile.jsx';

class Review extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (<div>
      <Profile />
      <ReviewText />
    </div>)
  }
}

export default Review;