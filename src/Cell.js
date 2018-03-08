import React, { Component } from 'react';
import Card from './Card';
import { Droppable, Draggable } from 'react-beautiful-dnd';

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: props.cell.cards
    };
  }

  render() {
    const droppableId = 'droppableCell-' + this.props.rowId + '-' + this.props.cell.colId;
    return (
      <td>
        <Droppable droppableId={droppableId} type="CARD">
          {(provided, snapshot) => (
            
            <div
              ref={provided.innerRef}
            >
              {this.state.cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index} type="CARD">
                  {(provided, snapshot) => (
                    <div>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {card.title}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </td>
    );
  }
}

export default Cell;