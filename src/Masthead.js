import React, { Component } from 'react';
import './Masthead.css';

class Masthead extends Component {
  render() {
    return (
      <header className="zbr-masthead">
        <h1 className="zbr-heading">Acme Dev Team</h1>
        <nav className="zbr-nav">
          <ul>
            <li className="zbr-nav-item zbr-add-row">+&nbsp;Add&nbsp;row</li>
            <li v-if="hasRows" className="zbr-nav-item zbr-add-card">+&nbsp;Add&nbsp;card</li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Masthead;
