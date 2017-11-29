
export default class TabProviders {

  constructor() {
    this._providers = {};
  }

  register(id, provider) {
    this._providers[id] = provider;
  }

  getById(id) {
    return this._providers[id];
  }

  getFromFile(file) {

    return Object.values(this._providers).find(function(p) {
      return p.canOpen(file);
    });
  }

  getComponent(tab) {
    return this.getById(tab.providerId).getComponent(tab.file);
  }

}