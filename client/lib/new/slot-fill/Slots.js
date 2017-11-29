import PropTypes from 'prop-types';

import React from 'react';

import SlotsManager from './SlotsManager';


/**
 * The parent component spawning a context in which
 * <Slot> and <Fill> can be used.
 */
export default class Slots extends React.Component {

  constructor(props) {
    super(props);

    this.slotsManager = new SlotsManager();
  }

  getChildContext() {
    return {
      slotsManager: this.slotsManager
    };
  }

  render() {
    return this.props.children;
  }

}

Slots.childContextTypes = {
  slotsManager: PropTypes.object
};