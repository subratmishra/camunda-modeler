import Ids from 'ids';

import { unsavedPath } from '../../file';

var ids = new Ids([ 32, 36, 1 ]);


export default class EditorTabProvider {

  constructor(tabProviders, type, component) {

    this._type = type;
    this._id = `${ type }-editor`;

    this._component = component;

    this._createdFiles = 0;

    tabProviders.register(this._id, this);
  }

  canOpen(file) {
    return file.fileType === this._type;
  }

  createNewTab(options={}) {

    var xml = this.getInitialContents(options);

    // ensure unique IDs for definitions element
    xml = xml.replace('{{ ID }}', ids.next());

    return this.createTabFromFile({
      fileType: this._type,
      name: `diagram_${ this._createdFiles++ }.${ this._type }`,
      path: unsavedPath,
      contents: xml
    });
  }

  createTabFromFile(file) {
    return {
      id: ids.next(),
      providerId: this._id,
      type: this._type,
      file: file,
      get name() {
        return this.file.name;
      },
      get title() {
        return this.file.path;
      }
    };
  }

  getComponent(file) {
    return this._component;
  }

}