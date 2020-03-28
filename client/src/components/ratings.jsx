import React from 'react';

let divStyle = {
  'fontFamily': 'Roboto',
  'display': 'grid',
  'gridTemplateColumns': '1fr 1fr',
  'gridTemplateRows': '1fr 1fr 1fr',
}

let borderStyle = {
  'borderBottom': 'solid',
  'borderBottomWidth': '50%',
  'position': 'relative',
  'bottom': '10px',
  'left': '150px',
  'paddingLeft': '100px',
  'color': 'grey',
}

let numStyle = {
  'position': 'absolute',
  'left': '90%',
  'display': 'inLine',
  'fontSize': '12px',
  'padding': '5px'
}

let leftNumStyle = {
  'position': 'absolute',
  'left': '45%',
  'display': 'inLine',
  'fontSize': '12px',
  'padding': '5px'
};

let breakStyle = {
  'padding': '7px'
}

class Ratings extends React.Component {
  constructor(props) {
    super(props)

  }

  //Calculate positoning for individual number ratings
  border(value, attr) {
    return {
      'borderBottom': 'solid',
      'borderBottomWidth': '50%',
      'position': 'relative',
      'bottom': '10px',
      'left': '45px',
      'right': '105px',
      'paddingLeft': (((+this.attrScore(value, attr) * 20) + 5).toFixed(0) + 'px').toString(),
      'color': 'black',
    }
  }

  //Get score for single attribute
  attrScore(value, attr) {
    if (value.length === 0) {
      return 0;
    }
    let helperScore = 0;
    let reviews = value[0].reviews;
    for (let i = 0; i < reviews.length; i++) {
      let scores = reviews[i].scores[0];
      helperScore += +scores[attr];
    }
    return (helperScore / reviews.length);
  }

  render() {
    return (<div style={divStyle}>
      <div style={breakStyle}>Cleanliness&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={borderStyle}></span> <span style={this.border(this.props.reviews, 'cleanliness')}></span><div style={leftNumStyle}>{(this.attrScore(this.props.reviews, 'cleanliness')).toFixed(1)}</div></div>
      <div style={breakStyle}>Accuracy&nbsp;&nbsp;<span style={borderStyle}></span> <span style={this.border(this.props.reviews, 'accuracy')}></span><div style={numStyle}>{(this.attrScore(this.props.reviews, 'accuracy')).toFixed(1)}</div></div>
      <div style={breakStyle}>Communication<span style={borderStyle}></span> <span style={this.border(this.props.reviews, 'communication')}></span><div style={leftNumStyle}>{(this.attrScore(this.props.reviews, 'communication')).toFixed(1)}</div></div>
      <div style={breakStyle}>Location&nbsp;&nbsp;<span style={borderStyle}></span> <span style={this.border(this.props.reviews, 'location')}></span><div style={numStyle}>{(this.attrScore(this.props.reviews, 'location')).toFixed(1)}</div></div>
      <div style={breakStyle}>Check-In&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={borderStyle}></span> <span style={this.border(this.props.reviews, 'checkin')}></span><div style={leftNumStyle}>{(this.attrScore(this.props.reviews, 'checkin')).toFixed(1)}</div></div>
      <div style={breakStyle}>Value&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={borderStyle}></span> <span style={this.border(this.props.reviews, 'value')}></span><div style={numStyle}>{(this.attrScore(this.props.reviews, 'value')).toFixed(1)}</div></div>
    </div>)
  }
}

export default Ratings;