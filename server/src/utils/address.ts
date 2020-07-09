import imi from "imi-enrichment-address";
import { NormalizedAddress } from "../models/gameCenter";

export default async function normalizeAddress(
  rawAddress: string
): Promise<NormalizedAddress> {
  // remove space
  let address = rawAddress.replace(/\s|　/g, "");

  return { fullAddress: address };
}
