import express from "express";
import gameCenterApi from "./apis/gameCenter";
import geoInfoApi from "./apis/geoInfo";

import { dbConnect } from "./utils/mongo"
require("dotenv").config();

const db = dbConnect();
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.APP_URL);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

gameCenterApi(app);
geoInfoApi(app);

const port = process.env.PORT;
// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

