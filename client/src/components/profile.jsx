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
  'height': '60px',
  'width': '60px'
}

let dateStyle = {
  'color': 'grey',
  'fontSize': '14px'
}

let textStyle = {
  'position': 'relative',
  'top': '14px',
  'lineHeight': '1.3'
}

class Profile extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (<div style={divStyle}>
      <img src={this.props.reviews.avatar} style={imgStyle}></img>
      <div style={textStyle}><b>{this.props.reviews.username.split(' ')[0]}</b>
      <br></br>
      <div style={dateStyle}>{this.props.reviews.date}</div></div>
    </div>)
  }
}

export default Profile;