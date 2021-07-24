import cheerio from "cheerio";

import Runner from "./runner";
import Crawler from "./crawler";
import { sleepRandom } from "../utils/sleep";
import timeout from "../utils/timeout";

const segaCrawler = (gameId: string, gameName: string) =>
  new Crawler({
    runOnParallel: false,
    sourceId: "allnet",
    urls: Array(47) // max 47
      .fill(0)
      .map((_, i) => {
        let id = "" + (i + 1);
        while (id.length < 2) id = "0" + id;
        return `https://location.am-all.net/alm/location?gm=${gameId}&ct=1000&at=${i}`;
      }),
    getList: ($) => Array.from($(".store_list > li")),
    getItem: async (_, raw) => {
      const onclickScript = raw.find(".bt_details").attr("onclick");
      let [, tenpoUrl] = onclickScript.match(/location\.href='(.*?)';/);
      tenpoUrl = "https://location.am-all.net/alm/" + tenpoUrl;
      let html;
      let retry = 0;
      while (!html) {
        try {
          await sleepRandom(1000);
          if (retry) console.log(`(${retry}) retrying to fetch`, tenpoUrl);
          html = await timeout(10000, Crawler.fetchPage(tenpoUrl));
          retry++;
        } catch (error) {
          console.log(error);
        }
      }
      const $ = cheerio.load(html);
      const name = $("h3").text();

      let address = "";
      let businessHour = "";
      $(".info_list > li").each((_, el) => {
        const text = $(el).text();
        if (text.includes("〒")) {
          address = text.replace(/\s\s+/g, " ").trim();
          address = address.replace(/〒[0-9]*-[0-9]*/, "");
        } else if (text.includes("営業時間")) {
          businessHour = text;
        }
      });
      const [, latText, lngText] = $("img.access_map")
        .attr("src")
        .match(/center=(.*?),(.*?)&/);

      let lat = Number(latText);
      let lng = Number(lngText);

      return {
        geo: { lat, lng },
        name: name,
        rawAddress: address,
        infos: [
          businessHour && { infoType: "businessHour", text: businessHour },
        ].filter((x) => x),
        games: [{ name: gameName, infos: [{ infoType: "main", text: "" }] }],
      };
    },
  });

new Runner("segaCrawler").start(async (option) => {
  let SEGA_INFO = [
    ["96", "maimai"],
    ["93", "wacca"],
    ["88", "ongeki"],
    ["58", "chuni"],
    ["34", "diva"],
  ];

  if (option.game && option.game !== "all") {
    SEGA_INFO = SEGA_INFO.filter((x) => x[1] === option.game);
    console.log("Running segaCrawler for", option.game);

    if (SEGA_INFO.length === 0) {
      throw new Error(`No matching game found by "${option.game}"`);
    }
  } else {
    console.log("Running segaCrawler for all games");
  }

  for (let i = 0; i < SEGA_INFO.length; i++) {
    const [key, name] = SEGA_INFO[i];
    console.log(`========= crawler for ${name} =========`);
    await segaCrawler(key, name).start();
  }
});
