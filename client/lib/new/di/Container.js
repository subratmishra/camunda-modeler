import { Injector } from 'didi';

import PropTypes from 'prop-types';

import React from 'react';


export default class DiContainer extends React.Component {

  constructor(props) {
    super(props);

    var {
      modules,
      globals
    } = props;

    var actualModules = [].concat(
      modules || [],
      [
        Object.keys(globals).reduce(function(mod, key) {
          mod[key] = [ 'value', globals[key] ];
          return mod;
        }, {})
      ]
    );

    this._injector = bootstrap(actualModules);
  }

  getChildContext() {
    return {
      injector: this._injector
    };
  }

  render() {
    return this.props.children;
  }

}

DiContainer.childContextTypes = {
  injector: PropTypes.object
};

/**
 * Bootstrap an injector from a list of modules, instantiating a
 * number of default components
 *
 * @param {Array<didi.Module>} bootstrapModules
 *
 * @return {didi.Injector} a injector to use to access the components
 */
function bootstrap(bootstrapModules) {

  var modules = [],
      components = [];

  function hasModule(m) {
    return modules.indexOf(m) >= 0;
  }

  function addModule(m) {
    modules.push(m);
  }

  function visit(m) {
    if (hasModule(m)) {
      return;
    }

    (m.__depends__ || []).forEach(visit);

    if (hasModule(m)) {
      return;
    }

    addModule(m);

    (m.__init__ || []).forEach(function(c) {
      components.push(c);
    });
  }

  bootstrapModules.forEach(visit);

  var injector = new Injector(modules);

  components.forEach(function(c) {

    try {
      // eagerly resolve component (fn or string)
      injector[typeof c === 'string' ? 'get' : 'invoke'](c);
    } catch (e) {
      console.error('Failed to instantiate component');
      console.error(e.stack);

      throw e;
    }
  });

  return injector;
}