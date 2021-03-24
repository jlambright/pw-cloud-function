const { Datastore } = require("@google-cloud/datastore");
const {
  BracketsCollection,
  MatchupsCollection,
  RoundsCollection,
} = require("./webflowclient");
const logger = require("./logger");

const datastore = new Datastore();

const getActiveBracket = () => {
  const bracketsCollection = new BracketsCollection();

  const key = datastore.key(["Active", "bracket"]);

  let activeBracket;

  bracketsCollection
    .items()
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
      datastore.save(entity, (err) => {
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
  const matchupsCollection = new MatchupsCollection();
  const roundsCollection = new RoundsCollection();

  const key = datastore.key(["Active", "round"]);

  let activeRound;

  roundsCollection
    .items()
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

      let matchupPromises = activeRound["matchups"].map((matchup_id) => {
        return matchupsCollection
          .item(matchup_id)
          .then((response) => {
            return {
              id: matchup_id,
              stories: {
                storyA: response["story-a-2"],
                storyB: response["story-b-2"],
              },
            };
          })
          .catch((reason) => {
            if (reason !== null) logger.error(reason);
          });
      });
      return Promise.all(matchupPromises)
        .then((results) => {
          let data = {
            _id: activeRound["_id"],
            start: activeRound["start-of-round"],
            end: activeRound["end-of-round"],
            type: activeRound["round-type"],
            matchups: {},
          };
          results.map((result) => {
            const { id, stories } = result;
            data["matchups"][id] = stories;
          });
          return data;
        })
        .catch((reason) => {
          if (reason !== null) logger.error(reason);
        });
    })
    .then((results) => {
      const entity = {
        key: key,
        data: results,
      };
      datastore.save(entity, (err) => {
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
