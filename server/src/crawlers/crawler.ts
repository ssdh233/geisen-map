import fetch from "node-fetch";
import mongoose from "mongoose";
import Encoding from "encoding-japanese";
import jsdom from "jsdom";

import gameCenterSchema from "../schemas/gameCenter";

interface RawInfo {
  infoType: string; // TODO enum
  text: string;
  sourceId?: String;
  url?: String;
  updateTime?: Date;
}

interface RawGameCenter {
  id: string;
  geo: { lat: number; lng: number };
  infos: RawInfo[];
  games: { name: string; infos: RawInfo[] }[]; // TODO name: enum
}

export default class Crawler {
  sourceId: string;
  updateTime: Date;
  urls: string[];

  getPaginatedUrls: (url: string) => string[] | Promise<string[]>;
  getList: (html: any) => any[];
  getItem: (item: any) => RawGameCenter | Promise<RawGameCenter> | null;

  constructor({
    sourceId,
    urls,
    getPaginatedUrls = url => [url],
    getList,
    getItem
  }: {
    sourceId: string;
    urls: string[];
    getPaginatedUrls?: (url: string) => string[] | Promise<string[]>;
    getList: (html: any) => any[];
    getItem: (item: any) => RawGameCenter | Promise<RawGameCenter>;
  }) {
    this.urls = urls;
    this.getPaginatedUrls = getPaginatedUrls;
    this.getList = getList;
    this.getItem = getItem;

    this.sourceId = sourceId;
    this.updateTime = new Date();
  }

  async crawlOnePage(url: string): Promise<RawGameCenter[]> {
    const addAdditionInfo = (item: RawInfo) => ({ ...item, url, sourceId: this.sourceId, updateTime: this.updateTime });
    const htmlBuffer = await fetch(url).then(res => res.arrayBuffer());
    const htmlUnit8Array = new Uint8Array(htmlBuffer);
    const unicodeArray = Encoding.convert(htmlUnit8Array, {
      to: "UNICODE",
      from: Encoding.detect(htmlUnit8Array)
    });
    // @ts-ignore
    const htmlText = Encoding.codeToString(unicodeArray);
    const { document } = new jsdom.JSDOM(htmlText).window;

    const items = await Promise.all(this.getList(document).map(this.getItem));

    console.log("crawling:", url, "results:", items.length);
    return items
      .filter(x => x)
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
    const that = this;
    const paginatedUrls = await Promise.all(this.urls.map(this.getPaginatedUrls));
    this.urls = [].concat(...paginatedUrls);

    const promises = [];
    for (let i = 0; i < this.urls.length; i++) {
      promises.push(this.crawlOnePage(this.urls[i]));
      await sleep(10);
    }
    const results = await Promise.all(promises);
    const flatResults = ([] as RawGameCenter[]).concat(...results);

    console.log(flatResults.length);

    // TODO move this logic to somewhere
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", async function() {
      // TODO clear this part
      const GameCenter = mongoose.model<RawGameCenter & mongoose.Document>("gameCenter", gameCenterSchema);

      // TODO remove all information from that source if there are results (how to check?)

      for (let i = 0; i < flatResults.length; i++) {
        const gameCenterItem = flatResults[i];
        let gameCenterEntity = await GameCenter.findOne({ id: gameCenterItem.id });
        if (!gameCenterEntity) {
          gameCenterEntity = new GameCenter({
            id: gameCenterItem.id,
            geo: gameCenterItem.geo,
            infos: [],
            games: []
          });
        }

        // TODO try to move this part to schema?
        // clear previous info from this source
        gameCenterEntity.infos = gameCenterEntity.infos.filter(info => info.sourceId !== that.sourceId);
        // add new info
        gameCenterEntity.infos = [...gameCenterEntity.infos, ...gameCenterItem.infos];
        gameCenterItem.games.forEach(gameItem => {
          let currentGame;
          let index = gameCenterEntity.games.findIndex(x => x.name === gameItem.name);
          if (index >= 0) {
            const currentGameInfos = gameCenterEntity.games[index].infos;
            gameCenterEntity.games[index].infos = gameCenterEntity.games[index].infos.filter(
              info => info.sourceId !== that.sourceId
            );
            gameCenterEntity.games[index].infos = [...currentGameInfos, ...gameItem.infos];
          } else {
            currentGame = { name: gameItem.name, infos: gameItem.infos };
            gameCenterEntity.games.push(currentGame);
          }
        });

        await gameCenterEntity.save();
        console.log(`Saved ${i} Items`);
      }
      db.close();
    });
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
