import React from 'react';
import { border, attrScore } from '../../helperFunc.js';

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


  render() {
    return (<div style={divStyle}>
      <div style={breakStyle}>Cleanliness&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={borderStyle}></span> <span style={border(this.props.reviews, 'cleanliness')}></span><div style={numStyle}>{(attrScore(this.props.reviews, 'cleanliness')).toFixed(1)}</div></div>
      <div style={breakStyle}>Accuracy&nbsp;&nbsp;<span style={borderStyle}></span> <span style={border(this.props.reviews, 'accuracy')}></span><div style={numStyle}>{(attrScore(this.props.reviews, 'accuracy')).toFixed(1)}</div></div>
      <div style={breakStyle}>Communication<span style={borderStyle}></span> <span style={border(this.props.reviews, 'communication')}></span><div style={numStyle}>{(attrScore(this.props.reviews, 'communication')).toFixed(1)}</div></div>
      <div style={breakStyle}>Location&nbsp;&nbsp;<span style={borderStyle}></span> <span style={border(this.props.reviews, 'location')}></span><div style={numStyle}>{(attrScore(this.props.reviews, 'location')).toFixed(1)}</div></div>
      <div style={breakStyle}>Check-In&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={borderStyle}></span> <span style={border(this.props.reviews, 'checkin')}></span><div style={numStyle}>{(attrScore(this.props.reviews, 'checkin')).toFixed(1)}</div></div>
      <div style={breakStyle}>Value&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={borderStyle}></span> <span style={border(this.props.reviews, 'value')}></span><div style={numStyle}>{(attrScore(this.props.reviews, 'value')).toFixed(1)}</div></div>
    </div>)
  }
}

export default Ratings;