import csv from "csvtojson";
import { dbConnect } from "../utils/mongo";
import GeoInfo from "../models/geoInfo";
require("dotenv").config();

async function start() {
  const db = dbConnect();
  const stations = await csv().fromFile("./data/station20190405free.csv");
  const lines = await csv().fromFile("./data/line20190405free.csv");

  const lineDictionary = {} as { [id: string]: string };
  lines.forEach(line => {
    lineDictionary[line.line_cd] = line.line_name;
  });

  let count = 0;
  for (let i = 0; i < stations.length; i++) {
    let station = stations[i];
    const stationGeoInfo = new GeoInfo({
      geo: { lat: station.lat, lng: station.lon, zoom: 15 },
      text: station.station_name,
      description: lineDictionary[station.line_cd],
      type: "station"
    });

    await stationGeoInfo.save();
    count++;
    if (count % 100 === 0) {
      console.log("finished", count);
    }
  }
  db.close();
}

start();
