const {Collection} = require('./client')

module.exports = class StoriesCollection extends Collection {

  constructor() {
    super();
    this._cid = process.env.WF_STORIES_ID_;
  }
}
