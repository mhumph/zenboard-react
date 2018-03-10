import React, { Component } from 'react';
import './Board.css';
import Masthead from './Masthead';
import Row from './Row';
import { onBoardRefresh } from './services/serverEvents';
import { DragDropContext } from 'react-beautiful-dnd';
const BoardUpdater = require('./lib/BoardUpdater');

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragStart = () => {
    console.log('onDragStart');
  };
  onDragUpdate = () => {
    console.log('onDragUpdate');
  }
  onDragEnd = (result) => {
    // onDragEnd is the only handler that is required
    console.log('onDragEnd', result);

    if (('CARD' === result.type) && (result.reason !== 'CANCEL') && (result.destination != null)) {
      const cardId = result.draggableId;
      const rowId = this.extractRowId(result.destination.droppableId);
      const colId = this.extractColId(result.destination.droppableId);
      const position = result.destination.index;

      let payload = {
        id: parseInt(cardId),     // cardId
        rowId: parseInt(rowId),   // toRowId
        colId: parseInt(colId),   // toColId
        position: parseInt(position) + 1    // toPosition
      }
      const boardUpdater = new BoardUpdater(this.state.rows, cardId);
      const updatedRows = boardUpdater.updateLocalRows(payload);
      this.setState({rows: updatedRows});

      fetch('http://localhost:3001/api/cards/move', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(payload)

      }).then(function (response) {
        if (response.ok) {
          console.log('Card moved', response);
        } else {
          throw Error(response.statusText)
        }
      }).catch(err => alert('Sorry, something went wrong\n\n' + err))
    }
  };

  extractRowId(droppableId) {
    return this.extractIds(droppableId)[0];
  };

  extractColId(droppableId) {
    return this.extractIds(droppableId)[1];
  };

  extractIds(droppableId) {
    const tokens = droppableId.match(/\d{1,}/g);
    if (2 !== tokens.length) {
      throw new Error("Expected exactly two numbers in droppableId");
    }
    return tokens;
  }

  componentDidMount() {
    let self = this;
    onBoardRefresh((board) => {
      console.log('Board:onBoardRefresh', board);
      self.setState( {rows: board.rows} );
    })

    fetch('http://localhost:3001/api/rows/deep').then( (response) => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      response.json().then(function (json) {
        self.setState({rows: json});
        console.log('State has been set', json);
        //self.loadTitle()
      })
    }).catch(function (err) {
      console.error(err)
      alert('Sorry, something went wrong\n\n' + err)
    })
  }

  

  render() {
    console.log('Rendering!');
    const rows = this.state.rows.map((row) =>
      <Row row={row} key={row.id} />
    );
    return (
      <div className="zbr-container">
        <Masthead />

        <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart} onDragUpdate={this.onDragUpdate }>

          <table className="zbr-main">
            <tbody>
              <tr>
                <td className="zbr-col-empty">
                </td>
                <th className="zbr-col-heading zbr-todo">To do
                </th>
                <th className="zbr-col-heading zbr-blocked">Blocked
                </th>
                <th className="zbr-col-heading zbr-inprogress">In progress
                </th>
                <th className="zbr-col-heading zbr-done">Done <span className="fa fa-check-circle"></span>
                </th>
              </tr>

              {rows}

            </tbody>
          </table>
        </DragDropContext>
      </div>
    );
  }
}

export default Board;
