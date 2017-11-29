import PropTypes from 'prop-types';

import React from 'react';

/**
 * A component representing the actual content
 * to be provided for a given <Slot />.
 *
 * You must provide the name via props.
 */
export default class Fill extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps, nextState) {

    if (!nextProps.name) {
      throw new Error('must define props.name');
    }

    if (this.props.name !== nextProps.name) {
      throw new Error('must not change props.name');
    }
  }

  componentDidUpdate() {
    this.context.slotsManager.addFill(this);
  }

  componentDidMount() {
    this.context.slotsManager.addFill(this);
  }

  componentWillUnmount() {
    this.context.slotsManager.removeFill(this);
  }

  render() {
    return null;
  }

}


Fill.contextTypes = {
  slotsManager: PropTypes.object.isRequired
};