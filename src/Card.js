import React, { Component } from 'react';
import './Card.css';
const bus = require('./lib/eventService');

class Card extends Component {

  openEditor(event) {
    console.log("Card:editCard", event);
    bus.emit('editCard', this.props.card);
  }

  render() {
    return (
      <div className="zbr-card" title={this.props.card.id}
        onClick={this.openEditor.bind(this)}>{this.props.card.title}</div>
    )
  };
}

export default Card;