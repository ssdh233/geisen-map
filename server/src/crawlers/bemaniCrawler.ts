import fetch from "node-fetch";
import cheerio from "cheerio";

import Crawler from "./crawler";
// import { getGeoFromText } from "../utils/googleMapApi";
require("dotenv").config();

const bemaniCrawler = (gameKeyword: string, gameName: string) =>
  new Crawler({
    sourceId: "bemani_official",

    fetchHeaders: {
      cookie: "facility_dspcount=50"
    },
    urls: Array(47) // max 47
      .fill(0)
      .map((_, i) => {
        let id = "" + (i + 1);
        while (id.length < 2) id = "0" + id;
        return `https://p.eagate.573.jp/game/facility/search/p/list.html?gkey=${gameKeyword}&paselif=false&pref=JP-${id}&finder=area`;
      }),
    getPaginatedUrls: async url => {
      const html = await fetch(url).then(res => res.text());
      const $ = cheerio.load(html);
      const count = parseInt($("div.cl_search_result").text());
      console.log("gamecenter count:", count, url);

      if (count) {
        return Array(Math.ceil(count / 50))
          .fill(0)
          .map((_, i) => `${url}&page=${i + 1}`);
      } else {
        return [];
      }
    },
    getList: ($: CheerioStatic) => Array.from($("div.cl_shop_bloc")),
    getItem: async raw => {
      const name = raw.attr("data-name");
      const address = raw.attr("data-address");
      const access = raw.attr("data-access");
      const telno = raw.attr("data-telno");
      const operationTime = raw.attr("data-operationtime");
      const holiday = raw.attr("data-holiday");
      let lat = raw.attr("data-latitude");
      let lng = raw.attr("data-longitude");
      const paseri = raw.find("div.cl_shop_paseli") ? "パセリ使用可" : "";

      if (!lat || !lng) {
        // need to get from google map api
        // const geo = await getGeoFromText(address);
        // lat = geo.lat;
        // lng = geo.lng;
        lat = 0;
        lng = 0;
      } else {
        lat = parseFloat(lat);
        lng = parseFloat(lng);
      }

      const id = lat.toFixed(4) + "," + lng.toFixed(4);
      return {
        id,
        geo: { lat, lng },
        infos: [
          name && { infoType: "name", text: name },
          address && { infoType: "address", text: address },
          access && { infoType: "access", text: access },
          operationTime && { infoType: "businessHour", text: operationTime },
          holiday && { infoType: "closedDay", text: "定休日 " + holiday },
          telno && { infoType: "tel", text: telno }
        ].filter(x => x),
        games: [
          {
            name: gameName,
            infos: [{ infoType: "main", text: "" }, paseri && { infoType: "paseri", text: paseri }].filter(x => x)
          }
        ]
      };
    },
    useCheerio: true
  });

async function start() {
  let BEMANI_INFO = [
    ["IIDX", "iidx"],
    ["DDR", "ddr"],
    ["DDR20TH", "ddr20"],
    ["JUBEAT", "jubeat"],
    ["DAN", "dan"],
    ["GITADORADM", "dm"],
    ["GITADORAGF", "gf"],
    ["NOSTALGIA", "nostalgia"],
    ["SDVX", "sdvx"],
    ["REFLECC", "rb"],
    ["MUSECA", "museca"],
    ["DANEVOAC", "danevo"]
  ];

  for (let i = 0; i < BEMANI_INFO.length; i++) {
    const [keyword, name] = BEMANI_INFO[i];
    await bemaniCrawler(keyword, name).start();
  }
}
start();
