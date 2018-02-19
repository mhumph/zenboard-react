import React, { Component } from 'react';
import './Card.css';

class Card extends Component {

  render() {
    return (
      <div className="zbr-card" title={this.props.card.id}>{this.props.card.title}</div>
    )
  };
}

export default Card;