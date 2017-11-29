import { Component } from '../../di';

import { Fill } from '../../slot-fill';

import React from 'react';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';

import EditorContainer from './EditorContainer';

import DmnEditor from './CamundaDmnEditor';
import XMLEditor from './XMLEditor';

var XML_TAB = {
  name: 'XML',
  type: 'xml'
};

var DEFAULT_TABS = [
  { name: 'Diagram', type: 'none' },
  XML_TAB
];


export default class DmnTab extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      tabs: DEFAULT_TABS,
      // retrieve previous active tab (XML, or none)
      activeTab: props.cache.activeTab || DEFAULT_TABS[0]
    };

    this.onDmnViewsUpdated = this.onDmnViewsUpdated.bind(this);
    this.onModelerImport = this.onModelerImport.bind(this);
    this.onXMLChanged = this.onXMLChanged.bind(this);
  }

  componentWillMount() {

    var {
      file,
      cache
    } = this.props;

    var xmlEditor = this._xmlEditor = cache.xmlEditor = (cache.xmlEditor || new XMLEditor());

    var modeler = this._modeler = cache.modeler = (cache.modeler || new DmnEditor({ position: 'absolute' }));

    if (cache.xml !== file.contents) {

      modeler.importXML(file.contents);

      // need to re-import, i.e. due to file changes
      cache.xml = file.contents;
    } else {
      this.onDmnViewsUpdated({
        views: modeler.getViews(),
        activeView: modeler.getActiveView()
      });
    }

    xmlEditor.on('changes', this.onXMLChanged);

    modeler.on('views.changed', this.onDmnViewsUpdated);
    modeler.on('import.done', this.onModelerImport);
  }

  componentWillUnmount() {
    var modeler = this._modeler,
        xmlEditor = this._xmlEditor;

    xmlEditor.off('changes', this.importXML);
    modeler.off('views.changed', this.onDmnViewsUpdated);
    modeler.off('import.done', this.onModelerImport);
  }

  onXMLChanged() {
    var xml = this._xmlEditor.getValue();

    var modeler = this._modeler;

    modeler.importXML(xml, { open: false });
  }

  onModelerImport({ error, warnings }) {
    console.log('modeler import', error ? 'FAILED' : 'SUCCESS');

    if (error) {
      console.log('error', error);
    }

    if (warnings && warnings.length) {
      console.log('warnings', warnings);
    }
  }

  onDmnViewsUpdated({ views, activeView }) {

    var tabs = [
      ...views.map(function(view) {
        var element = view.element;

        return {
          name: element.name || element.id,
          view: view,
          type: is(element, 'dmn:Definitions') ? 'drd' : 'decision'
        };
      }),
      XML_TAB
    ];

    var { activeTab } = this.state;

    if (activeTab !== XML_TAB) {
      // find active tab from views
      activeTab = tabs.find(function(tab) {
        return tab.view === activeView;
      });
    }

    this.setState({
      tabs,
      activeTab
    });
  }

  switchTab(tab, options={ sync: true }) {

    var modeler = this._modeler,
        xmlEditor = this._xmlEditor;

    var {
      activeTab
    } = this.state;

    if (tab === activeTab) {
      return;
    }

    // switch tabs without content sync
    if (!options.sync) {
      return this.setState({
        activeTab: tab
      });
    }

    // switching to XML tab
    if (tab === XML_TAB) {

      modeler.saveXML({ format: true }, (err, xml) => {

        xmlEditor.setValue(xml);

        // switch to XML tab
        this.setState({
          activeTab: XML_TAB
        });

      });
    } else

    // switching from XML tab
    if (activeTab === XML_TAB) {

      let xml = xmlEditor.getValue();

      modeler.importXML(xml, { open: false }, (err, warnings) => {

        this.onDmnViewsUpdated({
          views: modeler.getViews(),
          activeView: modeler.getActiveView()
        });

        var newTab = this.state.tabs.find(function(t) {
          return t.view.element.id === tab.view.element.id;
        }) || this.state.tabs[0];

        this.setState({
          activeTab: newTab
        });

        modeler.open(newTab.view);
      });

      this.setState({
        activeTab: tab
      });
    }

    else {

      this.setState({
        activeTab: tab
      });

      this._modeler.open(tab.view);
    }

    // Persist active tab, if XML is shown
    this.props.cache.activeTab = tab === XML_TAB && XML_TAB;
  }

  render() {

    var {
      tabs,
      activeTab
    } = this.state;

    return (
      <div name="tab-content" className="multi-editor-tab tabbed">
        <Fill name="tab-buttons">
          <h3> HELL YEA</h3>
        </Fill>

        {
          activeTab === XML_TAB
          ? <EditorContainer key="xml" editor={ this._xmlEditor } />
          : <EditorContainer key="dmn" editor={ this._modeler } />
        }

        <div className="tabs">
          { tabs.map((tab, idx) => {
            return (
              <span key={ idx } className={ `tab ${tab === activeTab ? 'active' : ''}` }
                 onClick={ () => this.switchTab(tab) }>
                { tab.name }
              </span>
            );
          }) }
        </div>
      </div>
    );
  }

}