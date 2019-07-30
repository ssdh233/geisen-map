import express from "express";
import GameCenterModel, { GameCenter, Info } from "../models/gameCenter";

// TODO get this info from mongodb
const SOURCE_RANK = {
  taiko_official: 1,
  popn_official: 1
};

const NAME_MAP = {
  taiko: "太鼓の達人",
  popn: "ポップンミュージック"
};

const gameCenterApi = (app: express.Express) => {
  app.get("/gamecenter/:id", async (req, res) => {
    const { id } = req.params;

    const rawResult = await GameCenterModel.findOne({ id });

    if (rawResult) {
      const result = processRawResult(rawResult);
      res.json(result);
    } else {
      res.status(204);
      res.json();
    }
  });

  app.get("/gamecenters", async (req, res) => {
    const result = await GameCenterModel.aggregate([
      { $match: {} },
      {
        $project: {
          _id: 0,
          id: 1,
          geo: 1,
          infos: {
            $filter: {
              input: "$infos",
              as: "info",
              cond: { $eq: ["$$info.infoType", "name"] }
            }
          },
          games: { $map: { input: "$games", as: "game", in: "$$game.name" } }
        }
      },
      {
        $project: {
          id: 1,
          geo: 1,
          name: {
            $arrayElemAt: [
              { $map: { input: "$infos", as: "info", in: "$$info.text" } },
              0
            ]
          },
          games: 1
        }
      }
    ]);
    res.json(result);
  });
};

// XXX: mutating rawResult
function processRawResult(rawResult: GameCenter) {
  const infoResult = {} as { [infoType: string]: Info };
  rawResult.infos.forEach(info => {
    if (infoResult[info.infoType]) {
      const currentInfo = infoResult[info.infoType];
      // @ts-ignore
      if (SOURCE_RANK[info.sourceId] > SOURCE_RANK[currentInfo.sourceId]) {
        infoResult[info.infoType] = info;
      }
    } else {
      infoResult[info.infoType] = info;
    }
  });

  const games = rawResult.games.map(game => {
    const gameinfoResult = {} as { [infoType: string]: Info };
    game.infos.forEach(gameInfo => {
      if (gameInfo.infoType === "main") return;
      if (!gameinfoResult[gameInfo.infoType]) {
        gameinfoResult[gameInfo.infoType] = gameInfo;
      } else {
        const currentGameInfo = gameinfoResult[gameInfo.infoType];
        if (
          // @ts-ignore
          SOURCE_RANK[gameInfo.sourceId] > SOURCE_RANK[currentGameInfo.sourceId]
        ) {
          gameinfoResult[gameInfo.infoType] = gameInfo;
        }
      }
    });
    return {
      // @ts-ignore
      name: NAME_MAP[game.name],
      infos: Object.values(gameinfoResult)
    };
  });

  const name = infoResult.name.text;
  delete infoResult.name;

  return {
    id: rawResult.id,
    geo: rawResult.geo,
    name,
    infos: Object.values(infoResult),
    games
  };
}

export default gameCenterApi;
