import { NormalizedAddress } from "../models/gameCenter";
import imi from "imi-enrichment-address";

function toHalfWidth(str: string) {
  return str
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    })
    .replace("−", "-");
}

export default async function normalizeAddress(
  rawAddress: string
): Promise<NormalizedAddress> {
  // remove space
  let address = rawAddress.replace(/\s|　/g, "");
  address = toHalfWidth(address);

  const result = await imi(address);

  const {
    住所: { 都道府県: prefecture, 市区町村: city, 区: ward },
  } = result;

  console.log(address, result)

  let addr;
  if (ward) {
    addr = address.split(ward)[1];
  } else if (city) {
    addr = address.split(city)[1];
  }

  const [, number] = addr?.match(/([0-9]+(?:-[0-9]+)*)/) || [];
  const [town, build] = addr?.split(number) || [];

  return {
    fullAddress: address,
    prefecture,
    city,
    ward,
    town,
    number,
    build,
  };
}
