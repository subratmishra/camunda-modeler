'use strict';

import { h, render } from 'preact';

var domReady = require('domready');

var debug = require('debug')('app-client');

var Config = require('./external/config'),
    Dialog = require('./external/dialog'),
    EventBus = require('./base/events'),
    FileSystem = require('./external/file-system'),
    Logger = require('./base/logger'),
    Menu = require('./external/window-menu'),
    ContextMenu = require('./external/context-menu'),
    Workspace = require('./external/workspace'),
    Plugins = require('./external/plugins');

import App from './new/app';

var browser = require('util/browser');

var remote = window.require('electron').remote,
    metaData = remote.getGlobal('metaData');

// get global modeler directory
// expose modeler and plugins directory through global getters
var modelerDirectory = remote.getGlobal('modelerDirectory');
var pluginsDirectory = modelerDirectory + '/plugins/';

window.getModelerDirectory = function() {
  return modelerDirectory;
};

window.getPluginsDirectory = function() {
  return pluginsDirectory;
};

domReady(function() {
  var eventBus = new EventBus();

  var globals = {
    config: new Config(),
    dialog: new Dialog(eventBus),
    eventBus: eventBus,
    fileSystem: new FileSystem(),
    logger: new Logger(),
    workspace: new Workspace(),
    plugins: new Plugins(),
    metaData: metaData
  };

  render(<App {...globals} />, document.querySelector('#app'));

  // Setting up external components
  // new Menu(app);
  // new ContextMenu(app);

  eventBus.on('app:ready', function() {
    debug('client is ready');

    browser.send('client:ready');
  });

  eventBus.on('app:should-quit', function() {
    debug('client is quitting');

    browser.send('app:quit-allowed');
  });

  browser.on('client:open-files', function(e, files) {
    debug('opening external files: ', files);

    // app.openFiles(files);
  });

  browser.on('client:window-focused', function(e) {
    debug('window focused');

    eventBus.emit('window:focused');
  });

  browser.on('dialog-overlay:toggle', function(e, isOpened) {
    debug('toggle dialog overlay', isOpened);

    // app.toggleOverlay(isOpened);
  });
});


require('debug').enable('*');
