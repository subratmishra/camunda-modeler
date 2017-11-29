import find from 'lodash/collection/find';

import DmnJS from 'dmn-js/lib/Modeler';

import domQuery from 'min-dom/lib/query';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import { containsDi } from 'dmn-js-shared/lib/util/DiUtil';

export default class CamundaDmnEditor extends DmnJS {

  _getInitialView(views) {

    return find(views, function(view) {

      var element = view.element;

      // can open definitions with DI
      if (is(element, 'dmn:Definitions')) {
        return containsDi(element);
      }

      // can open decision, no problem
      if (is(element, 'dmn:Decision')) {
        return true;
      }

      return false;
    });
  }


  attachTo(el) {
    super.attachTo(el);

    this.focus();
  }

  focus() {
    var el = domQuery('.djs-direct-editing-parent [contenteditable]', this._container);

    if (el) {
      el.focus();
    }
  }

}