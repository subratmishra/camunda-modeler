import React from 'react';


var k = 92721;

export default class SlotsManager {

  constructor() {
    this.fillsByName = {};
    this.fillListeners = {};
    this.fillsByKey = {};
  }

  onFillChanged(name, fn) {
    safeGet(this.fillListeners, name, []).push(fn);
  }

  offFillChanged(name, fn) {
    var listeners = safeGet(this.fillListeners, name, []);

    this.fillListeners = listeners.filter((fn) => fn !== fn);
  }

  fillChanged(name) {
    safeGet(this.fillListeners, name, []).forEach((fn) => fn());
  }

  getFillsByName(name) {
    var fills = this.fillsByName[name];

    if (!fills) {
      return [];
    }

    return fills.map(function(def) {
      return def.body;
    });
  }

  getFillByName(name) {
    var fills = this.fillsByName[name];

    if (!fills) {
      return null;
    }

    return (fills[0] || {}).body;
  }

  addFill(fill) {

    var {
      children,
      name
    } = fill.props;

    // ensure fill has unique, identifiable key
    var key = fill.key = (fill.key || k++);

    var body = children;

    var fills = safeGet(this.fillsByName, name, []);

    var existingDefinition = this.fillsByKey[key];
    if (existingDefinition) {
      Object.assign(existingDefinition, { body });
    } else {
      fills.push(this.fillsByKey[key] = {
        key,
        name,
        body
      });
    }

    this.fillChanged(name);
  }

  removeFill(fill) {

    var key = fill.key;
    var name = fill.props.name;

    if (!key) {
      throw new Error('fill has no #key');
    }

    var fillsByName = this.fillsByName[name];

    if (fillsByName) {
      this.fillsByName[name] = fillsByName.filter((f) => f.key !== key);
    }

    this.fillsByKey[key] = null;

    this.fillChanged(name);
  }

}


function safeGet(collection, key, defaultValue) {

  if (key in collection) {
    return collection[key];
  } else {
    collection[key] = defaultValue;

    return defaultValue;
  }

}