import mongoose from "mongoose";
import stringSimilarity from "string-similarity";
import normalizeGameCenterName from "../utils/gameCenterName";

export type Info = {
  infoType: string; // Enum? ['main', 'access', 'businessHour", "cloasedDay", "tel", "paseri", "cabType"]
  text: string;
  sourceId?: string;
  url?: string;
  updateTime?: Date;
};

export type NormalizedAddress = {
  prefecture: string;
  city: string;
  ward: string;
  town: string;
  number: string;
  build: string;
  fullAddress: string;
};

export type GameCenter = {
  _id?: string;
  geo: { lat: number; lng: number };
  name: string;
  address: NormalizedAddress;
  infos: Info[];
  games: {
    name: string; // Enum?
    infos: Info[];
  }[];
};

type GameCenterDocument = GameCenter & mongoose.Document;
type GameCenterModel = mongoose.Model<GameCenterDocument> & {
  findSameGameCenter: (
    gameCenter: GameCenter
  ) => Promise<GameCenterDocument | null>;
};

const Info = {
  infoType: String, // Enum?
  text: String,
  sourceId: String,
  url: String,
  updateTime: Date,
};

const GameCenterSchema = new mongoose.Schema({
  geo: { lat: Number, lng: Number },
  name: String,
  address: {
    regionId: String,
    fullAddress: String,
    build: String,
    number: String,
    region: String,
    town: String,
  },
  infos: [Info],
  games: [
    {
      name: String, // Enum?
      infos: [Info],
    },
  ],
});

const SEARCH_RANGE = 0.01;
GameCenterSchema.statics.findSameGameCenter = async function (
  gameCenter: GameCenter
): Promise<GameCenter | null> {
  // console.log(
  //   "================================================================================"
  // );
  // console.log("findSameGameCenter:", gameCenter.name);
  // console.log("search condition", gameCenter.geo.lat, gameCenter.geo.lng);
  const results = await this.find({
    "geo.lat": {
      $gt: gameCenter.geo.lat - SEARCH_RANGE,
      $lt: gameCenter.geo.lat + SEARCH_RANGE,
    },
    "geo.lng": {
      $gt: gameCenter.geo.lng - SEARCH_RANGE,
      $lt: gameCenter.geo.lng + SEARCH_RANGE,
    },
  });
  // console.log("results.length", results.length);

  if (!results) return null;

  for (let i = 0; i < results.length; i++) {
    const isSame = isSameGameCenter(gameCenter, results[i]);
    // console.log("========================================");
    // console.log(gameCenter);

    // console.log("==========");
    // console.log(results[i]);

    // console.log("==========");
    // console.log({ isSame, A: gameCenter.name, B: results[i].name });
    // console.log("========================================");

    if (isSame) {
      // console.log("found:", gameCenter.name, results[i].name);
      return results[i];
    }
  }
  // console.log("fail to find:", gameCenter.name);
  return null;
};

function isSameGameCenter(
  gameCenterA: GameCenter,
  gameCenterB: GameCenter
): boolean {
  const normalizeNameA = normalizeGameCenterName(
    gameCenterA.name,
    gameCenterA.address
  );
  const normalizeNameB = normalizeGameCenterName(
    gameCenterB.name,
    gameCenterB.address
  );

  // console.log(normalizeNameA, normalizeNameB);
  const nameSimilarity = stringSimilarity.compareTwoStrings(
    normalizeNameA,
    normalizeNameB
  );
  // console.log({ nameSimilarity });

  // console.log(gameCenterA.address.fullAddress, gameCenterB.address.fullAddress);
  // const addressSimilarity = stringSimilarity.compareTwoStrings(
  //   gameCenterA.address.region +
  //     gameCenterA.address.town +
  //     gameCenterA.address.number,
  //   gameCenterB.address.region +
  //     gameCenterB.address.town +
  //     gameCenterB.address.number
  // );
  const addressSimilarity = stringSimilarity.compareTwoStrings(
    gameCenterA.address.fullAddress,
    gameCenterB.address.fullAddress
  );

  // console.log({ addressSimilarity });

  // exactly same address with almost same name
  if (addressSimilarity > 0.8 && nameSimilarity > 0.5) {
    return true;
  }

  // almost same address with exactly same name
  if (addressSimilarity > 0.7 && nameSimilarity > 0.8) {
    return true;
  }

  return false;
}

const GameCenterModel = mongoose.model<GameCenterDocument, GameCenterModel>(
  "gameCenter",
  GameCenterSchema
);
export default GameCenterModel;
