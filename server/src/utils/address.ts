import fetch from "node-fetch";
import { NormalizedAddress } from "../models/gameCenter";

const ADDRESS_NORMALIZE_API_URL = "https://api.loctouch.com/v1/geo/address_normalize?address=";

export default async function normalizeAddress(rawAddress: string): Promise<NormalizedAddress> {
  // remove space
  let address = rawAddress.replace(/\s|　/g, "");

  const url = ADDRESS_NORMALIZE_API_URL + encodeURIComponent(address);
  const resJson = await fetch(url).then(res => res.json());
  return {
    regionId: resJson.result.region_id,
    fullAddress: rawAddress,
    ...resJson.result.normalize
  };
}
