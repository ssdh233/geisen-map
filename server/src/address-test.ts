console.log("address test");
require("dotenv").config();

import normalizeAddress from "./utils/address";
import { dbConnect } from "./utils/mongo";

import GameCenterModel from "./models/gameCenter";

async function start() {
  let db = dbConnect();

  const gamecenters = await GameCenterModel.find({}).limit(100);

  // for (let i = 0; i < gamecenters.length; i++) {
  //   let gamecenter = gamecenters[i];
  //   const address = gamecenter.address.fullAddress;

  //   // TODO we need to extract number & building's name from this
  //   console.log(address, await normalizeAddress(address));
  // }

  gamecenters.forEach(async (gamecenter) => {
    const address = gamecenter.address.fullAddress;

    // TODO we need to extract number & building's name from this
    console.log(address, await normalizeAddress(address));
  });

  db.close();
}

start();
