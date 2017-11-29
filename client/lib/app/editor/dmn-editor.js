'use strict';

var inherits = require('inherits');

var assign = require('lodash/object/assign'),
    find = require('lodash/collection/find'),
    some = require('lodash/collection/some');

var DiagramEditor = require('./diagram-editor');

var WarningsOverlay = require('base/components/warnings-overlay');

var getWarnings = require('app/util/get-warnings');

var diagramOriginModule = require('diagram-js-origin');

var generateImage = require('app/util/generate-image'),
    isInputActive = require('util/dom/is-input').active;

import DmnJS from 'dmn-js/lib/Modeler';

var debug = require('debug')('dmn-editor');


/**
 * A DMN 1.1 diagram editing component.
 *
 * @param {Object} options
 */
function DmnEditor(options) {
  DiagramEditor.call(this, options);

  this.name = 'dmn';

  this._stackIdx = -1;
}

inherits(DmnEditor, DiagramEditor);

module.exports = DmnEditor;

// Need to replace the method from DiagramEditor,
// so that we trigger the correct commandStack undo/redo
DmnEditor.prototype.triggerAction = function(action, options) {
  var opts = options || {};

  var modeler = this.getModeler();

  modeler = modeler.getActiveEditor();

  var editorActions = modeler.get('editorActions', false);

  if (!editorActions) {
    return;
  }

  if (action === 'clauseAdd') {
    opts = options.type;
  }


  debug('editor-actions', action, options);

  // ignore all editor actions if there's a current active input or textarea
  if ([ 'insertNewLine', 'selectNextRow', 'selectPreviousRow' ].indexOf(action) === -1 && isInputActive()) {
    return;
  }

  // forward other actions to editor actions
  editorActions.trigger(action, opts);
};


/**
 * Update editor state after changes in the
 * underlying diagram or XML.
 */
DmnEditor.prototype.updateState = function() {

  var modeler = this.getModeler();

  var stateContext = {
    undo: false,
    dirty: false,
    redo: false,
    views: modeler && modeler.getViews() || []
  };

  this.emit('state-updated', stateContext);
};

DmnEditor.prototype.getStackIndex = function() {

  // TODO(nikku): to be rewritten
  return -1;
};

DmnEditor.prototype.getActiveEditorName = function() {
  var modeler = this.getModeler();

  var activeView = modeler.getActiveView();

  switch (activeView.type) {
  case 'drd': return 'diagram';
  case 'decision-table': return 'table';
  case 'literal-expression': return 'literal-expression';
  }

};


DmnEditor.prototype.getModeler = function() {

  if (!this.modeler) {

    // lazily instantiate and cache
    this.modeler = this.createModeler(this.$el);

    this.modeler.on('viewer.created', ({ viewer }) => {

      // hook up state updates
      viewer.on([
        'selection.changed',
        'commandStack.changed'
      ], this.updateState, this);

      // log errors into log
      viewer.on('error', ({ error }) => {
        this.emit('log', [[ 'error', error ]]);
        this.emit('log:toggle', { open: true });
      });
    });

  }

  return this.modeler;
};

DmnEditor.prototype.createModeler = function($el) {

  return new CamundaDmnEditor({
    position: 'absolute',
    container: $el,
    'decision-table': {
      minColWidth: 200,
      tableName: 'DMN Table'
    },
    drd: {
      additionalModules: [
        diagramOriginModule
      ]
    }
  });
};

DmnEditor.prototype.resize = function() {
  var modeler = this.getModeler(),
      sheetOrCanvas;

  if (!isImported(modeler)) {
    return;
  }

  try {
    if (this.getActiveEditorName() === 'diagram') {
      sheetOrCanvas = modeler.getActiveViewer().get('canvas');
    } else {
      sheetOrCanvas = modeler.getActiveViewer().get('sheet');
    }

    sheetOrCanvas.resized();

  } catch (e) {
    console.warn('not implemented: #resize on ' + modeler.getActiveViewer().constructor);
  }
};

DmnEditor.prototype.exportAs = function(type, done) {
  var modeler = this.getModeler();

  modeler.saveSVG((err, svg) => {
    var file = {};

    if (err) {
      return done(err);
    }

    if (type !== 'svg') {
      try {
        assign(file, { contents: generateImage(type, svg) });
      } catch (err) {
        return done(err);
      }
    } else {
      assign(file, { contents: svg });
    }

    done(null, file);
  });
};

DmnEditor.prototype.saveXML = function(done) {
  var modeler = this.getModeler(),
      commandStackIdx = this.getStackIndex();

  this._saveXML(modeler, commandStackIdx, done);
};

DmnEditor.prototype.render = function() {
  var warnings = getWarnings(this.lastImport);

  return (
    <div className="dmn-editor" key={ this.id }>
      <div className="editor-container"
           onAppend={ this.compose('mountEditor') }
           onRemove={ this.compose('unmountEditor') }>
      </div>
      <WarningsOverlay warnings={ warnings }
                       onOpenLog={ this.compose('openLog') }
                       onClose={ this.compose('hideWarnings') } />
    </div>
  );
};

function isImported(modeler) {
  return !!modeler._definitions;
}


import { is } from 'dmn-js-shared/lib/util/ModelUtil';

function hasDi(element) {

  var extensions = element.extensionElements;

  var values = extensions && extensions.values;

  return values && find(values, function(v) {
    return is(v, 'biodi:Bounds');
  });
}


class CamundaDmnEditor extends DmnJS {

  _getInitialView(views) {

    return find(views, function(view) {

      var element = view.element;

      // can open decision, no problem
      if (is(element, 'dmn:Decision')) {
        return true;
      }

      // can open drd, if di exists
      return some(element.drgElements, hasDi);
    });
  }
}