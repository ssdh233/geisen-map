import cheerio from "cheerio";

import Crawler from "./crawler";
import { sleepRandom } from "../utils/sleep";
import timeout from "../utils/timeout";
require("dotenv").config();

const segaCrawler = (gameId: string, gameName: string) =>
  new Crawler({
    sourceId: "allnet",
    urls: Array(1) // max 47
      .fill(0)
      .map((_, i) => {
        let id = "" + (i + 1);
        while (id.length < 2) id = "0" + id;
        return `https://location.am-all.net/alm/location?gm=${gameId}&ct=1000&at=${i}`;
      }),
    getList: $ => Array.from($(".store_list > li")),
    getItem: async (_, raw) => {
      const onclickScript = raw.find(".bt_details").attr("onclick");
      let [, tenpoUrl] = onclickScript.match(/location\.href='(.*?)';/);
      tenpoUrl = "https://location.am-all.net/alm/" + tenpoUrl;
      await sleepRandom(20000);
      let html;
      try {
        html = await timeout(10000, Crawler.fetchPage(tenpoUrl));
      } catch (error) {
        console.log(error);
        return null;
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
        infos: [businessHour && { infoType: "businessHour", text: businessHour }].filter(x => x),
        games: [{ name: gameName, infos: [{ infoType: "main", text: "" }] }]
      };
    }
  });

async function start() {
  let SEGA_INFO = [["96", "maimai"], ["93", "wacca"], ["88", "ongeki"], ["58", "chuni"], ["34", "diva"]];

  for (let i = 0; i < SEGA_INFO.length; i++) {
    const [key, name] = SEGA_INFO[i];
    await segaCrawler(key, name).start();
  }
}

start().then(() => {
  process.exit(0);
});
