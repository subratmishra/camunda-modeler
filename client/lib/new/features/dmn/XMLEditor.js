import CodeMirror from 'codemirror';

import domify from 'min-dom/lib/domify';

// xml syntax highlighting
import 'codemirror/mode/xml/xml';

// auto close tags
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/edit/closetag';

// search addons
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/dialog/dialog';


export default class XMLEditor {

  constructor(opts) {

    this._el = domify('<div class="editor-parent"></div>');

    this._codeMirror = new CodeMirror((el) => {
      this._el.appendChild(el);
    }, {
      autofocus: true,
      lineNumbers: true,
      mode: {
        name: 'application/xml',
        htmlMode: false
      },
      tabSize: 2,
      lineWrapping: true,
      autoCloseTags: true
    });
  }

  setValue(value) {
    this._codeMirror.setValue(value);
  }

  getValue() {
    return this._codeMirror.getValue();
  }

  on(event, callback) {

    var cb;

    if (event === 'changes') {
      cb = (cm) => {

        if (!this._loaded) {
          this._loaded = true;

          // prevent undo beyond first entry
          cm.doc.clearHistory();

          return;
        }

        callback(cm);
      };
    }

    this._codeMirror.on(event, cb || callback);
  }

  off(event, callback) {
    this._codeMirror.off(event, callback);
  }

  attachTo(parentNode) {
    var codeMirror = this._codeMirror;

    parentNode.appendChild(this._el);

    codeMirror.refresh();
    codeMirror.focus();
  }

  detach() {

    var el = this._el;

    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

}