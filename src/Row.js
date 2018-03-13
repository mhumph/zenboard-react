import React, { Component } from 'react';
import './Row.css';
import Cell from './Cell'

const reducer = function(accumulator, card) {
  return accumulator + ',' + card.id + '/' + card.title;
}

class Row extends Component {

  render() {
    const cells = this.props.row.cells.map((cell, i) => {
      let hash = '' + i + ':';
      if (cell.cards.length > 0) {
        hash = cell.cards.reduce(reducer, hash);
      }
      return <Cell cell={cell} key={hash} rowId={this.props.row.id} />
    })
    console.log('Row.render()', this.props.row)
    return (
      <tr className="zbr-row zbr-table-bg">
        <th>
          <div className="zro-title-container">
            <div className="zro-title">{this.props.row.title}</div>
          </div>
          <div v-if="hover" className="zro-button">+&nbsp;Add&nbsp;card</div>
        </th>

        {cells}
      </tr>
    )
  };
}

export default Row;