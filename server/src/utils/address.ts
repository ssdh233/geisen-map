import imi from "imi-enrichment-address";
import { NormalizedAddress } from "../models/gameCenter";

const ADDRESS_NORMALIZE_API_URL =
  "https://api.loctouch.com/v1/geo/address_normalize?address=";
const RETRY_LIMIT = 10;

export default async function normalizeAddress(
  rawAddress: string
): Promise<NormalizedAddress> {
  // remove space
  let address = rawAddress.replace(/\s|　/g, "");

  let result = await imi(address);

  const {
    住所: { 都道府県: prefecture, 市区町村: city, 町名: ward },
  } = result;


  return {
    prefecture,
    city,
    ward
  };
}
