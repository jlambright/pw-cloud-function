const { Collection } = require("./client");

module.exports = class BracketsCollection extends Collection {
  constructor() {
    super();
    this._cid = process.env.WF_BRACKETS_ID;
  }
};
