require("dotenv").config();

import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import gameCenterApi from "./apis/gameCenter";
import geoInfoApi from "./apis/geoInfo";
import TwitterApi from "./apis/twitter";
import UserApi from "./apis/user";

import { dbConnect } from "./utils/mongo";

const db = dbConnect();
const app = express();

app.use(bodyParser());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.APP_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

gameCenterApi(app);
geoInfoApi(app);
TwitterApi(app);
UserApi(app);

const port = process.env.PORT;
// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
