import express from "express";
import gameCenterApi from "./apis/gameCenter";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/geisenmap", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const port = 4000; // default port to listen

gameCenterApi(app);

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
