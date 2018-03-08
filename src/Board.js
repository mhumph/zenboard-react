import React, { Component } from 'react';
import './Board.css';
import Masthead from './Masthead';
import Row from './Row';
import { onBoardRefresh } from './services/serverEvents';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      cards: [
        {id:1, title:"Foo"},
        {id:2, title:"Bar"}
      ],
      cards2: [
        {id:3, title:"Foo2"},
        {id:4, title:"Bar2"}
      ]
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
  };

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
        self.setState( {
          rows: json,
          cards: json[0].cells[0].cards,
          cards2: json[0].cells[1].cards
        } );
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

        <DragDropContext onDragEnd={this.onDragEnd}>

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
