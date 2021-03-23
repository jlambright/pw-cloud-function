const {Collection} = require('./client')

module.exports = class MatchupsCollection extends Collection {

  constructor() {
    super();
    this._cid = process.env.WF_MATCHES_ID;
  }
}
