const Webflow = require("webflow-api")
const logger = require("../logger");


class Singleton {
  _instance = undefined

  constructor(object=undefined) {
    if (!this._instance) {
      this._instance = object || this;
    } else return this._instance;
  }
}

const WebflowClient = {
  api: new Webflow({token: process.env.WF_API_KEY}),
  siteId: process.env.WF_SITE_ID
}

class Collection extends Singleton {
  _cid = undefined;
  constructor() {
    super();
    this._wf = WebflowClient;
    try {
      this._collection = this._wf.api.collection({collectionId: this._cid})
          .then(resp => resp)
          .catch(e => logger.error(e))
    } catch (e) {
      logger.error(e);
    }

  }

  get data() {
    return this._collection
  }

  get id() {
    return this._cid
  }

  item(itemId, query = {}) {
    return this._wf.api.item({collectionId: this._cid, itemId: itemId}, query)
  }

  items(query = {}) {
    return this._wf.api.items({collectionId: this._cid}, query);
  }

  createItem(data, query = {}) {
    return this._wf.api.createItem({collectionId: this._cid, data: data}, query)
  }

  updateItem(itemId, data, query = {}) {
    return this._wf.api.updateItem({collectionId: this._cid, itemId: itemId, data: data}, query)
  }

  removeItem(itemId, query = {}) {
    return this._wf.api.removeItem({collectionId: this._cid, itemId: itemId}, query)
  }

  patchItem(itemId, data, query = {}) {
    return this._wf.api.patchItem({collectionId: this._cid, itemId: itemId, data: data}, query)
  }
}

module.exports = {
  WebflowClient,
  Collection
}
