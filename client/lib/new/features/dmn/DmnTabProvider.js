import EditorTabProvider from '../base/EditorTabProvider';

import DmnTab from './DmnTab';

export default class DmnTabProvider extends EditorTabProvider {

  constructor(tabProviders) {
    super(tabProviders, 'dmn', DmnTab);
  }

  getInitialContents(options={}) {
    var type = options.type;

    if (type === 'table') {
      return require('./table.dmn');
    } else {
      return require('./diagram.dmn');
    }
  }

}


DmnTabProvider.$inject = [ 'tabProviders' ];