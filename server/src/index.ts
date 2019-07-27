import express from "express";
import mongoose from "mongoose";
import gameCenterSchema from "./schemas/gameCenter";

mongoose.connect("mongodb://localhost/geisenmap", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  const GameCenter = mongoose.model("gameCenter", gameCenterSchema);

  // const gcData = {
  //   id: "123, 456",
  //   geo: { lat: 123, long: 456 },
  //   name: "テスト用ゲーセン",
  //   infos: [
  //     { text: "営業時間 10:00~24:00", infoType: "BusinessHour", sourceId: "1", url: "", lastUpdated: Date.now() },
  //     { text: "定休日 日曜日", infoType: "Closed", sourceId: 1, url: "", lastUpdated: Date.now() }
  //   ],
  //   games: [
  //     {
  //       name: "ポップンミュージック",
  //       infos: [{ text: "新筐体 3台", infoType: "NewKit", sourceId: "1", url: "", lastUpdated: Date.now() }]
  //     }
  //   ]
  // };
  // const tempGC = new GameCenter(gcData);
  // const saveOP = tempGC.save();
});

const app = express();
const port = 4000; // default port to listen

// define a route handler for the default home page
app.get("/test", (req, res) => {
  // render the index template
  res.json({ test: "hahaha" });
});

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
