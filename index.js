const {Datastore} = require("@google-cloud/datastore")
const {RoundsCollection} = require("./webflowclient")
const logger = require("./logger");

const processRounds = () => {
    const rc = new RoundsCollection();
    const ds = new Datastore()

    const key = ds.key({
        path: ["Active", "round"]
    });

    let active_round;

    rc.items().then(response => {
        const rounds = response.items;
        rounds.forEach(round => {
            if (round["active-round"] === true && round["_archived"] === false && round["_draft"] === false) {
                active_round = round;
            }
        });
        const entity = {
            key: key,
            data: {
                _id: active_round["_id"],
                start: active_round["start-of-round"],
                end: active_round["end-of-round"],
                type: active_round["round-type"],
                matchups: active_round["matchups"]
            }
        };
        ds.save(entity, (err) => {
            if (err !== null) {
                logger.error(key.path);
                logger.error(key.namespace);
            }
        })
    }).catch(reason => {
        if (reason !== null) logger.error(reason)
    });
}

processRounds();