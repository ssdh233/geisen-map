import fetch from "node-fetch";
import jsdom from "jsdom";
import mongoose from "mongoose";

import gameCenterSchema from "../schemas/gameCenter";

interface RawInfo {
  infoType: string; // TODO enum
  text: string;
  sourceId: String;
  url: String;
  updateTime: Date;
}

interface RawGameCenter {
  id: string;
  geo: { lat: string; long: string };
  infos: RawInfo[];
  games: { name: string; infos: RawInfo[] }[]; // TODO name: enum
}

export default class Crawler {
  sourceId: string;
  updateTime: Date;
  urls: string[];

  getPaginatedUrlS: (urls: string[]) => string[];
  getList: (document: Document) => any[];
  getItem: (item: any) => RawGameCenter;

  constructor({
    sourceId,
    urls,
    getPaginatedUrlS = urls => urls,
    getList,
    getItem
  }: {
    sourceId: string;
    urls: string[];
    getPaginatedUrlS?: (urls: string[]) => string[];
    getList: (document: Document) => any[];
    getItem: (item: any) => any;
  }) {
    this.urls = urls;
    this.getPaginatedUrlS = getPaginatedUrlS;
    this.getList = getList;
    this.getItem = getItem;

    this.sourceId = sourceId;
    this.updateTime = new Date();
  }

  async crawlOnePage(url: string): Promise<RawGameCenter[]> {
    const addAdditionInfo = (item: RawInfo) => ({ ...item, url, sourceId: this.sourceId, updateTime: this.updateTime });
    const html = await fetch(url).then(res => res.text());
    const { document } = new jsdom.JSDOM(html).window;
    return this.getList(document)
      .map(this.getItem)
      .map(gameCenterItem => ({
        ...gameCenterItem,
        infos: gameCenterItem.infos.map(addAdditionInfo),
        games: gameCenterItem.games.map(gameItem => ({
          ...gameItem,
          infos: gameItem.infos.map(addAdditionInfo)
        }))
      }));
  }

  async start() {
    this.urls = this.getPaginatedUrlS(this.urls);
    const promises = this.urls.map(async url => await this.crawlOnePage(url));
    const results = await Promise.all(promises);
    const flatResults = ([] as RawGameCenter[]).concat(...results);

    // TODO move this logic to somewhere
    mongoose.connect("mongodb://localhost/geisenmap", { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function() {
      // TODO clear this part
      const GameCenter = mongoose.model<RawGameCenter & mongoose.Document>("gameCenter", gameCenterSchema);

      // TODO remove all information from that source if there are results (how to check?)

      let count = 0;
      flatResults.forEach(async gameCenterItem => {
        let gameCenterEntity = await GameCenter.findOne({ id: gameCenterItem.id });
        if (!gameCenterEntity) {
          gameCenterEntity = new GameCenter({
            id: gameCenterItem.id,
            geo: gameCenterItem.geo,
            infos: [],
            games: []
          });
        }

        gameCenterEntity.infos = gameCenterEntity.infos.concat(gameCenterItem.infos);
        gameCenterItem.games.forEach(gameItem => {
          let currentGame;
          let index = gameCenterEntity.games.findIndex(x => x.name === gameItem.name);
          if (index >= 0) {
            currentGame = gameCenterEntity.games[index];
          } else {
            currentGame = { name: gameItem.name, infos: [] };
            gameCenterEntity.games.push(currentGame);
          }

          currentGame.infos = currentGame.infos.concat(gameItem.infos);
        });

        await gameCenterEntity.save();
        console.log(`Saved ${++count} Items`);
        if (count >= flatResults.length) {
          db.close();
        }
      });
    });
  }
}
