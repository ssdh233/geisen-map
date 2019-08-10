import express from "express";
import GameCenterModel, { GameCenter, Info } from "../models/gameCenter";

// TODO get this info from mongodb
const SOURCE_RANK = {
  taiko_official: 1,
  popn_official: 1
};

export const NAME_MAP = {
  taiko: "太鼓の達人",
  popn: "ポップンミュージック",
  iidx: "beatmania iidx",
  ddr: "Dance Dance Revolution",
  ddr20: "Dance Dance Revolution A20",
  jubeat: "jubeat",
  dan: "DANCERUSH STARDOM",
  dm: "GITADORA DrumMania",
  gf: "GITADORA GuitarFreaks",
  nostalgia: "ノスタルジア",
  sdvx: "SOUND VOLTEX",
  rb: "REFLEC BEAT",
  museca: "MUSECA",
  danevo: "DanceEvolution",
  maimai: "maimai",
  wacca: "WACCA",
  ongeki: "オンゲキ",
  chuni: "チューニズム",
  diva: "初音ミク Project DIVA Arcade Future Tone"
};

const gameCenterApi = (app: express.Express) => {
  app.get("/gamecenter/:id", async (req, res) => {
    const { id } = req.params;

    const rawResult = await GameCenterModel.findOne({ _id: id });

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
          _id: 1,
          geo: 1,
          name: 1,
          games: { $map: { input: "$games", as: "game", in: "$$game.name" } }
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

  return {
    geo: rawResult.geo,
    name: rawResult.name,
    address: rawResult.address,
    infos: Object.values(infoResult),
    games
  };
}

export default gameCenterApi;
