import React from 'react';

let divStyle = {
  'fontFamily': 'Roboto',
  'textAlign': 'justify',
  'display': 'grid',
  'gridTemplateColumns': '1fr 5fr',
  'gridTemplateRows': '1fr'
}

let imgStyle = {
  'borderRadius': '50%',
  'height': '50px',
  'width': '50px'
}

let dateStyle = {
  'color': 'grey',
  'fontSize': '14px'
}

class Profile extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (<div style={divStyle}>
      <img src={this.props.reviews.avatar} style={imgStyle}></img>
      <div><b>{this.props.reviews.username.split(' ')[0]}</b>
      <br></br>
      <div style={dateStyle}>{this.props.reviews.date}</div></div>
    </div>)
  }
}

export default Profile;