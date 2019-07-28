import express from "express";
import mongoose from "mongoose";
import GameCenterSchema from "../schemas/gameCenter";

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

    const GameCenter = mongoose.model("gameCenter", GameCenterSchema);
    const rawResult = await GameCenter.findOne({ id });

    if (rawResult) {
      const result = processRawResult(rawResult);
      res.json(result);
    } else {
      res.status(204);
      res.json();
    }
  });

  app.get("/gamecenters", async (req, res) => {
    const GameCenter = mongoose.model("gameCenter", GameCenterSchema);
    const result = await GameCenter.aggregate([
      { $match: {} },
      {
        $project: {
          _id: 0,
          id: 1,
          geo: 1,
          infos: { $filter: { input: "$infos", as: "info", cond: { $eq: ["$$info.infoType", "name"] } } }
        }
      },
      { $project: { id: 1, geo: 1, "infos.infoType": 1, "infos.text": 1 } }
    ]);
    res.json(result);
  });
};

// XXX: mutating rawResult
function processRawResult(rawResult: any) {
  // TODO
  const infoResult = {} as any;
  rawResult.infos.forEach((info: any) => {
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

  const games = rawResult.games.map((game: any) => {
    const gameinfoResult = {} as any;
    game.infos.forEach((gameInfo: any) => {
      if (gameInfo.infoType === "main") return;
      if (!gameinfoResult[gameInfo.infoType]) {
        gameinfoResult[gameInfo.infoType] = gameInfo;
      } else {
        const currentGameInfo = gameinfoResult[gameInfo.infoType];
        // @ts-ignore
        if (SOURCE_RANK[gameInfo.sourceId] > SOURCE_RANK[currentGameInfo.sourceId]) {
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
