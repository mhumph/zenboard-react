import React, { Component } from 'react';
import Card from './Card';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(Card);

const SortableList = SortableContainer(({cards}) => (
  <td>
    {cards.map(({card}, index) => (
      <SortableItem key={`item-${card.id}`} index={index} card={card} />
    ))}
  </td>
));

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: props.cell.cards.map((card) => {
        return {
          card: card
        };
      })
    };
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    let {cards} = this.state;

    this.setState({
      cards: arrayMove(cards, oldIndex, newIndex)
    });
  };
  render() {
    return <SortableList cards={this.state.cards} onSortEnd={this.onSortEnd} />;
  }
}

export default Cell;