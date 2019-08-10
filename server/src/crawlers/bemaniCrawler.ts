import fetch from "node-fetch";
import cheerio from "cheerio";

import Crawler, { GameCenterWithRawAddress } from "./crawler";
// import { getGeoFromText } from "../utils/googleMapApi";
require("dotenv").config();

const bemaniCrawler = (gameKeyword: string, gameName: string) =>
  new Crawler({
    sourceId: "bemani_official",

    fetchHeaders: {
      cookie: "facility_dspcount=50"
    },
    urls: Array(1) // max 47
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
    getList: $ => Array.from($("div.cl_shop_bloc")),
    getItem: async (_, raw) => {
      const name = raw.attr("data-name");
      const address = raw.attr("data-address");
      const access = raw.attr("data-access");
      const telno = raw.attr("data-telno");
      const operationTime = raw.attr("data-operationtime");
      const holiday = raw.attr("data-holiday");
      const paseri = raw.find("div.cl_shop_paseli") ? "パセリ使用可" : "";

      const item: GameCenterWithRawAddress = {
        name,
        rawAddress: address,
        infos: [
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

      let lat = parseFloat(raw.attr("data-latitude"));
      let lng = parseFloat(raw.attr("data-longitude"));

      if (lat && lng) {
        item.geo = { lat, lng };
      }

      return item;
    }
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
