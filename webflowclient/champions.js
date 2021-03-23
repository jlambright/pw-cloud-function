const { Collection } = require("./client");

module.exports = class ChampionsCollection extends Collection {
  constructor() {
    super();
    this._cId = process.env.WF_ROUNDS_ID;
  }
};
