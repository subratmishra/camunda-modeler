import React from 'react';

export default class EditorContainer extends React.Component {

  mount(el) {
    var editor = this.props.editor;

    if (el) {
      editor.attachTo(el);
    } else {
      editor.detach();
    }
  }

  render() {
    return (
      <div className="editor-container" ref={ (el) => this.mount(el) }>
      </div>
    );
  }

}