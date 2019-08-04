import fetch from "node-fetch";
import jsdom from "jsdom";

import Crawler from "./crawler";
import { getGeoFromText } from "../utils/googleMapApi";
require("dotenv").config();

const popnCrawler = new Crawler({
  sourceId: "popn_official",
  urls: Array(47) // max 47
    .fill(0)
    .map((_, i) => `https://p.eagate.573.jp/game/popn/peace/p/tenpo/list.html?pref=${i + 1}&search_word=&pcb_type=2`),
  getPaginatedUrls: async url => {
    const html = await fetch(url).then(res => res.text());
    const { document } = new jsdom.JSDOM(html).window;
    const pages = document.querySelectorAll("div.Rcont_inner > div[style='text-align:center'] > a").length;
    if (pages === 0) {
      return [url];
    } else {
      return Array(pages)
        .fill(0)
        .map((_, i) => `${url}&page=${i}`);
    }
  },
  getList: (document: Document) => {
    return Array.from(document.querySelectorAll("div.Rcont_info > div > div.tenpo_data"));
  },
  getItem: async raw => {
    try {
      const name = raw.children[0].textContent;
      const address = raw.children[1].children[1].textContent;
      const access = raw.children[3].children[1].textContent;
      const businessHour = raw.children[5].children[1].textContent;
      const closedDay = raw.children[7].children[1].textContent;
      const tel = raw.children[9].children[1].textContent;

      let cabType = "";
      if (raw.children[11].children[0].children[0] && raw.children[11].children[0].children[0].className === "wide") {
        cabType += `新筐体 ${raw.children[11].children[0].children[0].textContent} `;
      }
      if (
        raw.children[11].children[1].children[0] &&
        raw.children[11].children[1].children[0].className === "standard"
      ) {
        cabType += `旧筐体 ${raw.children[11].children[1].children[0].textContent} `;
      }

      const popnCardImageSrc =
        (raw.children[11].children[2].children[0] && raw.children[11].children[2].children[0].src) || "";
      const popnCard = popnCardImageSrc.includes("card_ok.gif")
        ? "ポップンカードあり"
        : popnCardImageSrc.includes("card_ng.gif")
        ? "ポップンカード準備中..."
        : "";

      const paseriImageSrc =
        (raw.children[11].children[3].children[0] && raw.children[11].children[3].children[0].src) || "";
      const paseri = paseriImageSrc.includes("paseli.jpg") ? "パセリ利用可" : "";

      const geo = await getGeoFromText(address);
      const id = geo.lat.toFixed(4) + "," + geo.lng.toFixed(4);

      const result = {
        id,
        geo,
        infos: [
          name && { infoType: "name", text: name },
          address && { infoType: "address", text: address },
          access && { infoType: "access", text: access },
          businessHour && { infoType: "businessHour", text: businessHour },
          closedDay && { infoType: "closedDay", text: "定休日 " + closedDay },
          tel && { infoType: "tel", text: tel }
        ].filter(x => x),
        games: [
          {
            name: "popn",
            infos: [
              { infoType: "main", text: "" },
              cabType && { infoType: "cabType", text: cabType },
              popnCard && { infoType: "popnCard", text: popnCard },
              paseri && { infoType: "paseri", text: paseri }
            ].filter(x => x)
          }
        ]
      };

      console.log("getting info:", name);

      return result;
    } catch (error) {
      console.error(raw.outerHTML, error);
      return null;
    }
  }
});

popnCrawler.start();
