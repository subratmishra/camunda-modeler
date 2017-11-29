import PropTypes from 'prop-types';

import React from 'react';

/**
 * A component that represents a placeholder within
 * a view to be filled in via a <Fill />.
 *
 * Must be instantiated with a constant name.
 */
export default class Slot extends React.Component {

  constructor(props) {
    super(props);

    this.fillListener = () => {
      this.forceUpdate();
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!nextProps.name) {
      throw new Error('must define props.name');
    }

    if (this.props.name !== nextProps.name) {
      throw new Error('must not change props.name');
    }
  }

  componentWillMount() {
    this.context.slotsManager.onFillChanged(this.props.name, this.fillListener);
  }

  componentWillUnmount() {
    this.context.slotsManager.offFillChanged(this.props.name, this.fillListener);
  }

  render() {

    var { name } = this.props;

    var fill = this.context.slotsManager.getFillByName(name);

    return fill || this.props.children || null;
  }

}

Slot.contextTypes = {
  slotsManager: PropTypes.object.isRequired
};