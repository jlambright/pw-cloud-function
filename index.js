const { Datastore } = require("@google-cloud/datastore");
const {
  BracketsCollection,
  MatchupsCollection,
  RoundsCollection,
} = require("./webflowclient");
const logger = require("./logger");

const ds = new Datastore();

const getActiveBracket = () => {
  const bc = new BracketsCollection();

  const key = ds.key(["Active", "bracket"]);

  let activeBracket;

  bc.items()
    .then((response) => {
      const brackets = response.items;
      brackets.forEach((bracket) => {
        if (
          bracket["active"] === true &&
          bracket["_archived"] === false &&
          bracket["_draft"] === false
        ) {
          activeBracket = bracket;
        }
      });

      const rounds = {};

      Object.keys(activeBracket).forEach((key) => {
        if (key.startsWith("round-")) rounds[key] = activeBracket[key];
      });

      const entity = {
        key: key,
        data: {
          _id: activeBracket["_id"],
          start: activeBracket["start"],
          end: activeBracket["end"],
          ...rounds,
        },
      };
      ds.save(entity, (err) => {
        if (err !== null) {
          logger.error(key.path);
          logger.error(key.namespace);
        }
      });
    })
    .catch((reason) => {
      if (reason !== null) logger.error(reason);
    });
};

const getActiveRound = () => {
  const rc = new RoundsCollection();

  const key = ds.key(["Active", "round"]);

  let activeRound;

  rc.items()
    .then((response) => {
      const rounds = response.items;
      rounds.forEach((round) => {
        if (
          round["active-round"] === true &&
          round["_archived"] === false &&
          round["_draft"] === false
        ) {
          activeRound = round;
        }
      });
      const entity = {
        key: key,
        data: {
          _id: activeRound["_id"],
          start: activeRound["start-of-round"],
          end: activeRound["end-of-round"],
          type: activeRound["round-type"],
          matchups: activeRound["matchups"],
        },
      };
      ds.save(entity, (err) => {
        if (err !== null) {
          logger.error(key.path);
          logger.error(key.namespace);
        }
      });
    })
    .catch((reason) => {
      if (reason !== null) logger.error(reason);
    });
};

const getActiveMatchups = () => {
  const mc = new MatchupsCollection();

  const key = ds.key(["Active", "matchups"]);

  let activeMatchups;

  mc.items()
    .then((response) => {
      const rounds = response.items;
      rounds.forEach((round) => {
        if (
          round["active-round"] === true &&
          round["_archived"] === false &&
          round["_draft"] === false
        ) {
          activeMatchups = round;
        }
      });
      const entity = {
        key: key,
        data: {
          _id: activeMatchups["_id"],
          start: activeMatchups["start-of-round"],
          end: activeMatchups["end-of-round"],
          type: activeMatchups["round-type"],
          matchups: activeMatchups["matchups"],
        },
      };
      ds.save(entity, (err) => {
        if (err !== null) {
          logger.error(key.path);
          logger.error(key.namespace);
        }
      });
    })
    .catch((reason) => {
      if (reason !== null) logger.error(reason);
    });
};

getActiveBracket();
getActiveRound();
