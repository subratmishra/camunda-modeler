'use strict';

import dropdown from './dom/dropdown';

import React from 'react';

export default ({ choices, disabled }) => {

  var dropdownWidget = null;

  var primaryChoice = choices[0];

  if (!disabled) {
    dropdownWidget = (
      <div className="dropdown-container">
        <span className="caret"></span>

        <ul className="dropdown">
          {
            choices.map(c => {
              return <li className="entry" onMouseUp={ c.action } key={ c.name }>
                { c.name }
              </li>;
            })
          }
        </ul>
      </div>
    );

  }

  return (
    <button className={ 'multi-button ' + disabled } onMouseDown={ dropdown('multi-button') }>
      <span className="primary"
            title={ primaryChoice.name || '' }>
        <span className={ primaryChoice.icon }></span>
      </span>

      { dropdownWidget }
    </button>
  );

};