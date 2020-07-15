import fetch from "node-fetch";
import sleep from "./sleep";
import { NormalizedAddress } from "../models/gameCenter";

const ADDRESS_NORMALIZE_API_URL = "https://api.loctouch.com/v1/geo/address_normalize?address=";
const RETRY_LIMIT = 10;

export default async function normalizeAddress(rawAddress: string): Promise<NormalizedAddress> {
  // remove space
  let address = rawAddress.replace(/\s|　/g, "");

  return

  // const url = ADDRESS_NORMALIZE_API_URL + encodeURIComponent(address);
  // let resJson;
  // let count = 0;

  // while (!resJson && count < RETRY_LIMIT) {
  //   try {
  //     count++;
  //     resJson = await fetch(url).then(res => res.json());

  //     return {
  //       regionId: resJson.result.region_id,
  //       fullAddress: rawAddress,
  //       ...resJson.result.normalize
  //     };
  //   } catch (error) {
  //     // console.log(error);
  //     await sleep(1000);
  //     console.log("Got error. Try to refetch...", url, rawAddress, resJson);
  //   }
  // }

  // return null;
}
