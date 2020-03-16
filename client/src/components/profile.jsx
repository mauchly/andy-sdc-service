import React from 'react';

class Profile extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (<div>
      <img src={this.props.reviews.avatar}></img>
      {this.props.reviews.date}
      {this.props.reviews.username}
    </div>)
  }
}

export default Profile;