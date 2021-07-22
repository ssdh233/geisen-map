import fetch from "node-fetch";
import cheerio from "cheerio";

import Runner from "./runner";
import Crawler from "./crawler";

const popnCrawler = new Crawler({
  sourceId: "popn_official",
  urls: Array(47) // max 47
    .fill(0)
    .map(
      (_, i) =>
        `https://p.eagate.573.jp/game/popn/peace/p/tenpo/list.html?pref=${
          i + 1
        }&search_word=&pcb_type=2`
    ),
  getPaginatedUrls: async (url) => {
    const html = await fetch(url).then((res) => res.text());
    const $ = cheerio.load(html);
    const pages = $("div.Rcont_inner > div[style='text-align:center'] > a")
      .length;
    if (pages === 0) {
      return [url];
    } else {
      return Array(pages)
        .fill(0)
        .map((_, i) => `${url}&page=${i}`);
    }
  },
  getList: ($) => Array.from($("div.Rcont_info > div > div.tenpo_data")),
  getItem: async (_, raw) => {
    try {
      const name = raw.children().eq(0).text();
      const address = raw.children().eq(1).children().eq(1).text();
      const access = raw.children().eq(3).children().eq(1).text();
      const businessHour = raw.children().eq(5).children().eq(1).text();
      const closedDay = raw.children().eq(7).children().eq(1).text();
      const tel = raw.children().eq(9).children().eq(1).text();

      let cabType = "";
      if (raw.find(".wide") && raw.find(".wide").text().includes("×")) {
        cabType += `新筐体 ${raw.find(".wide").text()} `;
      }
      if (raw.find(".standard") && raw.find(".standard").text().includes("×")) {
        cabType += `旧筐体 ${raw.find(".standard").text()} `;
      }

      const popnCardImageSrc = raw
        .children()
        .eq(11)
        .children()
        .eq(2)
        .find("img")
        .attr("src");
      const popnCard =
        popnCardImageSrc &&
        (popnCardImageSrc.includes("card_ok.gif")
          ? "ポップンカードあり"
          : popnCardImageSrc.includes("card_ng.gif")
          ? "ポップンカード準備中..."
          : "");

      const paseriImageSrc = raw
        .children()
        .eq(11)
        .children()
        .eq(3)
        .find("img")
        .attr("src");
      const paseri =
        paseriImageSrc && paseriImageSrc.includes("paseli.jpg")
          ? "パセリ利用可"
          : "";

      const result = {
        name,
        rawAddress: address,
        infos: [
          access && { infoType: "access", text: access },
          businessHour && { infoType: "businessHour", text: businessHour },
          closedDay && { infoType: "closedDay", text: "定休日 " + closedDay },
          tel && { infoType: "tel", text: tel },
        ].filter((x) => x),
        games: [
          {
            name: "popn",
            infos: [
              { infoType: "main", text: "" },
              cabType && { infoType: "cabType", text: cabType },
              popnCard && { infoType: "popnCard", text: popnCard },
              paseri && { infoType: "paseri", text: paseri },
            ].filter((x) => x),
          },
        ],
      };

      return result;
    } catch (error) {
      console.error(raw.html());
      console.error(error);
      return null;
    }
  },
});

new Runner("popnCrawler").start(() => popnCrawler.start());
