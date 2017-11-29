
export default class TabCache {

  constructor() {
    this._entries = {};
  }

  get(tab) {

    var key = tabKey(tab);

    if (key in this._entries) {
      return this._entries[key];
    }

    return (this._entries[key] = {});
  }

  purge(tab) {
    var key = tabKey(tab);

    delete this._entries[key];
  }

}


function tabKey(tab) {
  return tab.id;
}