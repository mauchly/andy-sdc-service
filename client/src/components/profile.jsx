import React from 'react';

class Profile extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (<div>
      {this.props.reviews.date}
      {this.props.reviews.username}
      {this.props.reviews.text}
    </div>)
  }
}

export default Profile;