import React from 'react';

import { Slot } from './slot-fill';

import MultiButton from './MultiButton';

function noop() { }


export default ({
  onCreate=noop,
  onOpen=noop
}) => {

  return (
    <div className="menu-bar">
      <Slot name="menu-buttons">
        <div className="group default">
          <div className="entry">
            <MultiButton choices={[
              {
                name: 'Create new BPMN Diagram',
                action: (e) => onCreate('bpmn'),
                icon: 'icon-new'
              },
              {
                name: 'Create new DMN Table',
                action: (e) => onCreate('dmn', { type: 'table' })
              },
              {
                name: 'Create new DMN Diagram (DRD)',
                action: (e) => onCreate('dmn')
              },
              {
                name: 'Create new CMMN Diagram',
                action: (e) => onCreate('cmmn')
              }
            ]} />
          </div>
          <div className="entry">
            <button title="Open a Diagram" onClick={ onOpen }>
              <span className="icon-open"></span>
            </button>
          </div>
        </div>

        <Slot name="tab-buttons" />
      </Slot>
    </div>
  );
};