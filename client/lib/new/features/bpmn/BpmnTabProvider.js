import EditorTabProvider from '../base/EditorTabProvider';

import BpmnTab from './BpmnTab';

export default class BpmnTabProvider extends EditorTabProvider {

  constructor(tabProviders) {
    super(tabProviders, 'bpmn', BpmnTab);
  }

  getInitialContents(options={}) {
    return require('./diagram.bpmn');
  }

}


BpmnTabProvider.$inject = [ 'tabProviders' ];