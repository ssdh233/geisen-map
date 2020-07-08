import vm from "vm";

import Crawler from "./crawler";
require("dotenv").config();

const taikoCrawler = new Crawler({
  sourceId: "taiko_official",
  urls: Array(5) // max 47
    .fill(0)
    .map((_, i) => {
      let id = "" + (i + 1);
      while (id.length < 2) id = "0" + id;
      return `https://taiko.namco-ch.net/taiko/location/list?area=JP-${id}`;
    }),
  getList: $ => {
    // console.log($("body > script:nth-child(2)").html());
    const scriptContent = $("body > script").html();

    const startIndex = scriptContent.indexOf("var locations =");
    const endIndex = scriptContent.indexOf("];", startIndex);

    const locationDefinitionCode = scriptContent.substring(startIndex, endIndex + 2);
    const sandbox: { locations: any[] } = { locations: [] };

    vm.createContext(sandbox);
    vm.runInContext(locationDefinitionCode, sandbox);

    return sandbox.locations;
  },
  getItem: raw => ({
    geo: { lat: raw.latitude, lng: raw.longitude },
    name: raw.name,
    rawAddress: raw.address,
    infos: [],
    games: [{ name: "taiko", infos: [{ infoType: "main", text: "" }] }]
  })
});

taikoCrawler.start();
