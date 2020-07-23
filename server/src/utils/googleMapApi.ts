import fetch from "node-fetch";
import sleep from "./sleep";

type Geo = {
  lat: number;
  lng: number;
};

const RETRY_LIMIT = 3;
const RETRY_INTERVAL = 5000;

async function getGeoFromText(text: string): Promise<Geo> {
  let succeeded = false;
  let geocodingApiRes;
  let count = 0;

  while (!succeeded && count < RETRY_LIMIT) {
    count++;
    try {
      geocodingApiRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          text
        )}&key=${process.env.GOOGLE_MAP_API_KEY}`
      ).then((res) => res.json());

      console.log(
        "calling google map api: ",
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          text
        )}&key=${process.env.GOOGLE_MAP_API_KEY}`,
        "count:",
        count
      );
      succeeded = true;
    } catch (e) {
      succeeded = false;
      await sleep(RETRY_INTERVAL);
    }
  }

  const geo =
    geocodingApiRes.results[0] && geocodingApiRes.results[0].geometry.location;
  return geo;
}

export { getGeoFromText };
