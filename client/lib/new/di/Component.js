import React from 'react';

import PropTypes from 'prop-types';

/**
 * A DI aware component.
 */
export default class DiAwareComponent extends React.Component {

  get(name, optional) {
    return this.context.injector.get(name, optional);
  }

}

DiAwareComponent.contextTypes = {
  injector: PropTypes.object.isRequired
};