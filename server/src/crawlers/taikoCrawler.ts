import vm from "vm";

import Crawler from "./crawler";
require("dotenv").config();

const taikoCrawler = new Crawler({
  sourceId: "taiko_official",
  urls: Array(47) // max 47
    .fill(0)
    .map((_, i) => {
      let id = "" + (i + 1);
      while (id.length < 2) id = "0" + id;
      return `https://taiko.namco-ch.net/taiko/location/list?area=JP-${id}`;
    }),
  getList: (document: Document) => {
    const scriptContent = document.querySelector("body > script:nth-child(2)").textContent;

    const startIndex = scriptContent.indexOf("var locations =");
    const endIndex = scriptContent.indexOf("];", startIndex);

    const locationDefinitionCode = scriptContent.substring(startIndex, endIndex + 2);
    const sandbox: { locations: any[] } = { locations: [] };
    vm.createContext(sandbox);
    vm.runInContext(locationDefinitionCode, sandbox);

    return sandbox.locations;
  },
  getItem: raw => {
    const id = raw.latitude.toFixed(4) + "," + raw.longitude.toFixed(4);
    return {
      id,
      geo: { lat: raw.latitude, lng: raw.longitude },
      infos: [{ infoType: "name", text: raw.name }, { infoType: "address", text: raw.address }],
      games: [{ name: "taiko", infos: [{ infoType: "main", text: "" }] }]
    };
  }
});

taikoCrawler.start();