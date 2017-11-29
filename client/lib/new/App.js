import React from 'react';

import { Slots } from './slot-fill';
import { Component } from './di';

import EmptyTab from './EmptyTab';

import MenuBar from './MenuBar';
import Footer from './Footer';


export default class App extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      tabs: []
    };

    this._tabProviders = this.get('tabProviders');
    this._tabCache = this.get('tabCache');
  }

  newTab(type, options) {

    var provider = this._tabProviders.getById(`${ type }-editor`);

    if (!provider) {
      throw new Error(`no provider for <${ type }> tab`);
    }

    var tab = provider.createNewTab(options);

    this.setState({
      ...this.state,
      tabs: [ ...this.state.tabs, tab ],
      activeTab: tab
    });
  }

  showTab(tab) {
    this.setState({
      ...this.state,
      activeTab: tab
    });
  }

  render() {

    var {
      tabs,
      activeTab
    } = this.state;

    var ActiveTab = null;
    var cache = {};

    if (activeTab) {
      cache = this._tabCache.get(activeTab);
      ActiveTab = this._tabProviders.getComponent(activeTab);
    }

    return (
      <Slots>
        <div className="app" onDragOver={ (event) => this.openFiles(event) }>
          <MenuBar onCreate={ this.newTab.bind(this) } />

          <div className="main tabbed">
            <div className="tabs">
              <div className="scroll-tabs-button scroll-tabs-left" data-direction="-1">‹</div>
              <div className="scroll-tabs-button scroll-tabs-right" data-direction="1">›</div>
              <div className="tabs-container">
                {
                  tabs.map((tab) => {
                    return (
                      <div key={ tab.id }
                           className={ `${ tab === activeTab ? 'active' : ''} tab`}
                           title={ tab.title }
                           tabIndex="0"
                           draggable="false"
                           onClick={ () => this.showTab(tab) }>{ tab.name }</div>
                    );
                  })
                }
                <div className={`${ !activeTab ? 'active' : '' } tab empty`}
                     title="Create new BPMN Diagram"
                     tabIndex="0"
                     draggable="false" onClick={ () => this.newTab('bpmn') }>+</div>
              </div>
            </div>

            <div className="content">
              {
                activeTab
                  ? <ActiveTab key={ activeTab.id } file={ activeTab.file } cache={ cache } />
                  : <EmptyTab key={ '__empty' } onCreate={ (type) => this.newTab(type) } />
              }
            </div>
          </div>

          <Footer />
        </div>
      </Slots>
    );
  }

}