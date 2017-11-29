import React from 'react';


export default ({ onCreate }) => {

  return (
    <div className="empty-tab">
      <p className="buttons-create">
        <span>Create a </span>
        <button onClick={ () => onCreate('bpmn') }>BPMN diagram</button>
        <span> or </span>
        <button onClick={ () => onCreate('dmn') }>DMN diagram</button>
        <span> or </span>
        <button onClick={ () => onCreate('cmmn') }>CMMN diagram</button>
      </p>
    </div>
  );

};