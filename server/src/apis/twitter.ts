import express from "express";
import OAuth from "oauth";
import jwt from "jsonwebtoken";

import {
  createTempToken,
  createAccessToken,
  createRefreshToken,
} from "../utils/token";
import UserModel from "../models/user";

const OAuthTokenMap = new Map<string, string>();

const {
  TWITTER_CONSUMER_API_KEY,
  TWITTER_CONSUMER_API_SECRET_KEY,
} = process.env;

const oauth = new OAuth.OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  TWITTER_CONSUMER_API_KEY,
  TWITTER_CONSUMER_API_SECRET_KEY,
  "1.0A",
  null,
  "HMAC-SHA1"
);

const TwitterApi = (app: express.Express) => {
  app.post("/twitter/request_token", (req, res) => {
    oauth.getOAuthRequestToken(function (error, oAuthToken, oAuthTokenSecret) {
      if (error) console.error(error);
      OAuthTokenMap.set(oAuthToken, oAuthTokenSecret);
      res.json({ token: oAuthToken });
    });
  });

  app.get("/twitter/login", (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;
    if (typeof oauth_token !== "string" || typeof oauth_verifier !== "string")
      return;

    const oAuthTokenSecret = OAuthTokenMap.get(oauth_token);
    OAuthTokenMap.delete(oauth_token);
    oauth.getOAuthAccessToken(
      oauth_token,
      oAuthTokenSecret,
      oauth_verifier,
      (error, token, token_secret) => {
        oauth.get(
          "https://api.twitter.com/1.1/account/verify_credentials.json",
          token,
          token_secret,
          async (err, response) => {
            const jsonRes = JSON.parse(response.toString());
            const twitterId = jsonRes.id_str;
            const twitterName = jsonRes.name;
            const userQuery = await UserModel.find({ twitterId });
            if (userQuery.length > 0) {
              const user = userQuery[0];
              const accessToken = createAccessToken(user._id);
              const refreshToken = createRefreshToken(user._id);
              user.refreshToken = refreshToken;
              await user.save();

              res
                .cookie("accessToken", accessToken)
                .cookie("refreshToken", refreshToken)
                .redirect(`${process.env.APP_URL}/map`);
            } else {
              const tempToken = createTempToken(twitterId);

              res
                .cookie("tempToken", tempToken)
                .redirect(
                  `${process.env.APP_URL}/signin?type=twitter&twitterName=${twitterName}`
                );
            }
          }
        );
      }
    );
  });

  app.post("/twitter/signin", async (req, res) => {
    const { tempToken } = req.cookies;
    const { email, name } = req.body;
    const decodedToken = jwt.verify(tempToken, process.env.SECRET);
    // @ts-ignore jwt.verify needs to have a better type
    const { twitterId } = decodedToken;

    const findQuery = await UserModel.find({ twitterId });
    if (findQuery.length > 0) {
      // TODO send some error message to web
      return;
    }

    const newUserQuery = new UserModel({ email, name, twitterId });
    const newUser = await newUserQuery.save();

    const accessToken = createAccessToken(newUser.id);
    const refreshToken = createRefreshToken(newUser.id);
    newUser.refreshToken = refreshToken;
    await newUserQuery.save();

    res
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .redirect(`${process.env.APP_URL}/map`);
  });
};

export default TwitterApi;
